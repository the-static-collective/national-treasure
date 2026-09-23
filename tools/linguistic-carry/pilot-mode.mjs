import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { studyReceipt, packetReceipt } from "./receiver-study.mjs";

const root=path.dirname(fileURLToPath(import.meta.url));
export const FREEZE_PATH=path.join(root,"studies","living-bible-pilot-freeze-001.json");
export const STUDY_PATH=path.join(root,"studies","living-bible-receiver-study-001.json");
export const PILOT_SCHEMA="national-treasure.linguistic-carry.pilot-feedback.v1";
export const ISSUE_CODES=new Set(["passage_visibility","question_ambiguous","choices_ambiguous","device_layout","version_recognized","other"]);

export async function verifyPilotFreeze({manifestPath=FREEZE_PATH,studyPath=STUDY_PATH}={}) {
  const manifest=JSON.parse(await fs.readFile(manifestPath,"utf8"));
  const raw=await fs.readFile(studyPath);
  const study=JSON.parse(raw.toString("utf8"));
  const gitBlob=crypto.createHash("sha1")
    .update(Buffer.from(`blob ${raw.length}\0`))
    .update(raw).digest("hex");
  const errors=[];
  if (manifest.schema!=="national-treasure.linguistic-carry.pilot-freeze.v1") errors.push("unexpected freeze schema");
  if (manifest.status!=="pilot_only" || manifest.analytical_admission!==false) errors.push("freeze must remain pilot-only, non-analytic");
  if (manifest.study_id!==study.study_id) errors.push("study ID changed");
  if (manifest.study_git_blob_sha1!==gitBlob) errors.push("pinned study blob changed; no silent question revisions");
  if (manifest.permitted_output!=="pilot usability feedback only; never comprehension scores") errors.push("pilot output policy changed");
  return {passed:errors.length===0,errors,manifest_id:manifest.id,study_receipt:studyReceipt(study),study_git_blob_sha1:gitBlob};
}

export function validatePilotFeedback(record,freeze) {
  const errors=[];
  if (record?.schema!==PILOT_SCHEMA) errors.push("unexpected pilot feedback schema");
  if (record?.mode!=="pilot_only" || record?.analytical_admission!==false) errors.push("pilot classification missing");
  if (record?.manifest_id!==freeze.id || record?.study_receipt!==freeze.study_receipt) errors.push("freeze/study mismatch");
  if (!/^[a-f0-9]{64}$/.test(record?.packet_receipt??"")) errors.push("missing packet receipt");
  if (!/^[a-f0-9]{32}$/.test(record?.trial_token??"")) errors.push("missing trial token");
  if (record?.consent_version!=="lc005c-pilot-v1") errors.push("missing pilot consent acknowledgement");
  if (record?.feedback_receipt) {
    const {feedback_receipt,...base}=record;
    if (feedback_receipt!==packetReceipt(base)) errors.push("pilot feedback receipt mismatch");
  } else errors.push("missing pilot feedback receipt");
  if (!Array.isArray(record?.issues) || record.issues.some(issue=>!ISSUE_CODES.has(issue))) errors.push("unknown issue code");
  if (new Set(record?.issues??[]).size!==(record?.issues??[]).length) errors.push("duplicate issue codes");
  if (!["yes","no","unsure"].includes(record?.instructions_clear)) errors.push("missing instruction clarity");
  if (!["yes","no","unsure"].includes(record?.question_clear)) errors.push("missing question clarity");
  if (!["yes","no","unsure"].includes(record?.layout_usable)) errors.push("missing layout usability");
  if (typeof record?.notes!=="string" || record.notes.length>500) errors.push("notes must be a string of at most 500 characters");
  for (const forbidden of ["answer_index","correct","comprehension_rate","arm","item_id","passage_text","prompt","options","source_url","participant","preference_1_5","theological_agreement_1_5"]) {
    if (Object.hasOwn(record??{},forbidden)) errors.push(`pilot must not store ${forbidden}`);
  }
  return {passed:errors.length===0,errors};
}

export function reviewPilotFeedback(records,freeze) {
  if (!Array.isArray(records)) throw new Error("expected an array of pilot feedback records");
  const counts=Object.fromEntries([...ISSUE_CODES].map(issue=>[issue,0]));
  const clarity={instructions:{yes:0,no:0,unsure:0},question:{yes:0,no:0,unsure:0},layout:{yes:0,no:0,unsure:0}};
  const unique=new Set();
  for (const record of records) {
    const v=validatePilotFeedback(record,freeze);
    if (!v.passed) throw new Error(v.errors.join("; "));
    const key=record.packet_receipt;
    if (unique.has(key)) throw new Error("duplicate packet feedback: "+key);
    unique.add(key);
    for(const issue of record.issues) counts[issue]+=1;
    clarity.instructions[record.instructions_clear]+=1;
    clarity.question[record.question_clear]+=1;
    clarity.layout[record.layout_usable]+=1;
  }
  return {
    schema:"national-treasure.linguistic-carry.pilot-usability-review.v1",
    mode:"pilot_only",
    analytical_admission:false,
    manifest_id:freeze.id,
    n:records.length,
    issue_counts:counts,
    usability_counts:clarity,
    next_gate:"Review ambiguities and revise the next study version if needed; do not import this pilot into comprehension analysis.",
    nonclaim:"Usability counts are not correctness, fidelity, preference, or comparative translation effects."
  };
}
