import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadReceiverStudy } from "./receiver-cli.mjs";
import {
  compileAssignment,
  resolveTrialMaterial,
  scoreResponse,
  validateTrialPacket
} from "./receiver-study.mjs";
import {
  buildParticipantPacket,
  buildResponse,
  findForbiddenKeys,
  validateParticipantPacket
} from "./survey/common.mjs";

const root=path.dirname(fileURLToPath(import.meta.url));

test("browser-built packet validates in Node receiver kernel", async () => {
  const study=await loadReceiverStudy();
  const assignment=compileAssignment(study,"browser-interop");
  const trial=assignment.trials[0];
  const resolution=resolveTrialMaterial(study,assignment.participant,trial.trial_token);
  const packet=await buildParticipantPacket(assignment,resolution,"Locally supplied passage text.");

  const browserValidation=await validateParticipantPacket(packet);
  assert.equal(browserValidation.passed,true,browserValidation.errors.join("\n"));

  const nodeValidation=validateTrialPacket(study,assignment,packet);
  assert.equal(nodeValidation.passed,true,nodeValidation.errors.join("\n"));
  assert.deepEqual(findForbiddenKeys(packet),[]);
});

test("browser response scores against frozen study only when packet receipt matches", async () => {
  const study=await loadReceiverStudy();
  const assignment=compileAssignment(study,"browser-score");
  const trial=assignment.trials[0];
  const resolution=resolveTrialMaterial(study,assignment.participant,trial.trial_token);
  const item=study.items.find((candidate)=>candidate.id===resolution.item_id);
  const packet=await buildParticipantPacket(assignment,resolution,"Locally supplied passage text.");
  const response=buildResponse(packet,{
    answer_index:String(item.correct_index),
    clarity_1_5:"5",
    preference_1_5:"2",
    perceived_fidelity_1_5:"3",
    theological_agreement_1_5:"1"
  });

  const receipt=scoreResponse(study,assignment,response,packet);
  assert.equal(receipt.correct,true);
  assert.equal(receipt.packet_receipt,packet.packet_receipt);

  assert.throws(
    ()=>scoreResponse(study,assignment,{...response,packet_receipt:"0".repeat(64)},packet),
    /packet receipt mismatch/
  );
});

test("participant static surface contains no named study arm or source URL", async () => {
  const participantFiles=await Promise.all([
    fs.readFile(path.join(root,"survey","index.html"),"utf8"),
    fs.readFile(path.join(root,"survey","participant.mjs"),"utf8")
  ]);
  const surface=participantFiles.join("\n");
  for (const leak of ["version=ASV","version=TLB","BibleGateway","presenter.mjs","correct_index","expected_class","relation_id"]) {
    assert.equal(surface.includes(leak),false,leak);
  }
});

test("participant page and presenter page are distinct entrypoints", async () => {
  const participant=await fs.readFile(path.join(root,"survey","index.html"),"utf8");
  const presenter=await fs.readFile(path.join(root,"survey","presenter.html"),"utf8");
  assert.match(participant,/participant\.mjs/);
  assert.doesNotMatch(participant,/presenter\.mjs/);
  assert.match(presenter,/presenter\.mjs/);
  assert.match(presenter,/operator surface/i);
});
