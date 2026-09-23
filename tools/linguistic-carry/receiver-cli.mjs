#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildTrialPacket, compileAssignment, resolveTrialMaterial, scoreResponse, summarizeReceipts, validateReceiverStudy } from "./receiver-study.mjs";

const root=path.dirname(fileURLToPath(import.meta.url));
const studyPath=path.join(root,"studies","living-bible-receiver-study-001.json");

export async function loadReceiverStudy() {
  return JSON.parse(await fs.readFile(studyPath,"utf8"));
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file,"utf8"));
}

async function main() {
  const [mode,...args]=process.argv.slice(2);
  const study=await loadReceiverStudy();

  if (!mode || mode==="check") {
    console.log(JSON.stringify(validateReceiverStudy(study),null,2));
    return;
  }
  if (mode==="assign") {
    const [participantKey]=args;
    console.log(JSON.stringify(compileAssignment(study,participantKey),null,2));
    return;
  }
  if (mode==="resolve") {
    const [participantPseudo,trialToken]=args;
    if (!participantPseudo || !trialToken) throw new Error("resolve requires participant-pseudonym trial-token");
    console.log(JSON.stringify(resolveTrialMaterial(study,participantPseudo,trialToken),null,2));
    return;
  }
  if (mode==="packet") {
    const [assignmentFile,resolutionFile,passageFile]=args;
    if (!assignmentFile || !resolutionFile || !passageFile) throw new Error("packet requires assignment.json resolution.json passage.txt");
    console.log(JSON.stringify(
      buildTrialPacket(study,await readJson(assignmentFile),await readJson(resolutionFile),await fs.readFile(passageFile,"utf8")),
      null,2
    ));
    return;
  }
  if (mode==="score") {
    const [assignmentFile,responseFile,packetFile]=args;
    if (!assignmentFile || !responseFile) throw new Error("score requires assignment.json response.json [packet.json]");
    const packet=packetFile ? await readJson(packetFile) : null;
    console.log(JSON.stringify(scoreResponse(study,await readJson(assignmentFile),await readJson(responseFile),packet),null,2));
    return;
  }
  if (mode==="summarize") {
    const [assignmentsFile,receiptsFile]=args;
    if (!assignmentsFile || !receiptsFile) throw new Error("summarize requires assignments.json receipts.json");
    console.log(JSON.stringify(
      summarizeReceipts(study,await readJson(assignmentsFile),await readJson(receiptsFile)),
      null,2
    ));
    return;
  }
  throw new Error("usage: receiver-cli.mjs check | assign <participant-key> | resolve <participant-pseudonym> <trial-token> | packet <assignment.json> <resolution.json> <passage.txt> | score <assignment.json> <response.json> [packet.json] | summarize <assignments.json> <receipts.json>");
}

if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  main().catch((error)=>{console.error(error.message);process.exitCode=1;});
}
