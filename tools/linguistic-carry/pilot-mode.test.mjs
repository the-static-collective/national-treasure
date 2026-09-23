import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadReceiverStudy } from "./receiver-cli.mjs";
import {
  buildTrialPacket,compileAssignment,resolveTrialMaterial,scoreResponse,
  studyReceipt,summarizeReceipts
} from "./receiver-study.mjs";
import { buildPilotFeedback } from "./survey/common.mjs";
import {
  FREEZE_PATH,PILOT_SCHEMA,reviewPilotFeedback,validatePilotFeedback,verifyPilotFreeze
} from "./pilot-mode.mjs";

const root=path.dirname(fileURLToPath(import.meta.url));

async function specimen() {
  const study=await loadReceiverStudy();
  const assignment=compileAssignment(study,"pilot-protocol-fixture");
  const trial=assignment.trials[0];
  const resolution=resolveTrialMaterial(study,assignment.participant,trial.trial_token);
  const packet=buildTrialPacket(study,assignment,resolution,"Fixture-only passage; not a copyrighted witness.");
  const feedback=await buildPilotFeedback(packet,{
    acknowledged:true,instructions_clear:"yes",question_clear:"no",layout_usable:"yes",
    issues:["question_ambiguous"],notes:"The question is ambiguous."
  });
  const manifest=JSON.parse(await fs.readFile(FREEZE_PATH,"utf8"));
  return {study,assignment,packet,feedback,freeze:{...manifest,study_receipt:studyReceipt(study)}};
}

test("pilot manifest pins the exact study bytes, and refuses a changed study",async()=>{
  const frozen=await verifyPilotFreeze();
  assert.equal(frozen.passed,true,frozen.errors.join("\n"));
  assert.match(frozen.study_git_blob_sha1,/^[a-f0-9]{40}$/);
  const original=await fs.readFile(path.join(root,"studies","living-bible-receiver-study-001.json"),"utf8");
  const folder=await fs.mkdtemp(path.join(root,".pilot-freeze-fixture-"));
  try {
    const file=path.join(folder,"changed-study.json");
    await fs.writeFile(file,original+" ");
    const changed=await verifyPilotFreeze({studyPath:file});
    assert.equal(changed.passed,false);
    assert.ok(changed.errors.some(error=>error.includes("pinned study blob changed")));
  } finally {
    await fs.rm(folder,{recursive:true,force:true});
  }
});

test("pilot feedback contains no answer, source text, preference or participant identity",async()=>{
  const {feedback,freeze}=await specimen();
  assert.equal(feedback.schema,PILOT_SCHEMA);
  assert.equal(feedback.mode,"pilot_only");
  assert.equal(feedback.analytical_admission,false);
  assert.equal(validatePilotFeedback(feedback,freeze).passed,true);
  for(const key of ["answer_index","correct","arm","passage_text","options","participant","preference_1_5","item_id"]) {
    assert.equal(Object.hasOwn(feedback,key),false,key);
  }
});

test("pilot feedback is gated by explicit acknowledgement",async()=>{
  const {packet}=await specimen();
  await assert.rejects(
    ()=>buildPilotFeedback(packet,{acknowledged:false,issues:[]}),
    /acknowledge/
  );
});

test("feedback receipt tampering is refused, even if reported usability values still look valid",async()=>{
  const {feedback,freeze}=await specimen();
  const changed={...feedback,question_clear:"yes"};
  const result=validatePilotFeedback(changed,freeze);
  assert.equal(result.passed,false);
  assert.ok(result.errors.some(error=>error.includes("feedback receipt mismatch")));
});

test("pilot review reports only usability and refuses duplicate packet feedback",async()=>{
  const {feedback,freeze}=await specimen();
  const review=reviewPilotFeedback([feedback],freeze);
  assert.equal(review.mode,"pilot_only");
  assert.equal(review.analytical_admission,false);
  assert.equal(review.n,1);
  assert.equal(review.issue_counts.question_ambiguous,1);
  assert.equal(review.usability_counts.question.no,1);
  assert.equal("comprehension_rate" in review,false);
  assert.throws(()=>reviewPilotFeedback([feedback,feedback],freeze),/duplicate packet feedback/);
});

test("pilot receipt cannot enter scorer or main study aggregator",async()=>{
  const {study,assignment,feedback}=await specimen();
  assert.throws(()=>scoreResponse(study,assignment,feedback),/pilot-only feedback is excluded/);
  assert.throws(()=>summarizeReceipts(study,[assignment],[feedback]),/pilot-only feedback is excluded/);
});

test("pilot page shows voluntary information and never invokes analytical response builder",async()=>{
  const html=await fs.readFile(path.join(root,"survey","index.html"),"utf8");
  const js=await fs.readFile(path.join(root,"survey","participant.mjs"),"utf8");
  assert.match(html,/voluntary/i);
  assert.match(html,/no comprehension answer is collected/i);
  assert.match(html,/pilot-ack/);
  assert.match(js,/buildPilotFeedback/);
  assert.doesNotMatch(js,/buildResponse/);
  assert.doesNotMatch(html,/name="answer_index"/);
});
