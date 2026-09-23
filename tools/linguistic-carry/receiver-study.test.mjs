import test from "node:test";
import assert from "node:assert/strict";
import { loadTransformStudy } from "./transform-cli.mjs";
import { loadReceiverStudy } from "./receiver-cli.mjs";
import {
  armFor,
  buildTrialPacket,
  compileAssignment,
  participantPseudonym,
  resolveTrialMaterial,
  scoreResponse,
  studyReceipt,
  summarizeReceipts,
  trialToken,
  validateReceiverStudy,
  validateTrialPacket
} from "./receiver-study.mjs";

test("receiver study is valid and probes live LC-005 relations", async () => {
  const receiver=await loadReceiverStudy();
  const transform=await loadTransformStudy();
  const validation=validateReceiverStudy(receiver);
  assert.equal(validation.passed,true,validation.errors.join("\n"));
  assert.equal(validation.item_count,10);

  const live=new Set(transform.passages.flatMap((passage)=>
    passage.relations.map((relation)=>`${passage.id}/${relation.id}`)
  ));
  for (const item of receiver.items) {
    assert.ok(live.has(`${item.passage_id}/${item.relation_id}`),item.id);
  }
});

test("participant assignment is deterministic, participant-scoped, and semantically opaque", async () => {
  const study=await loadReceiverStudy();
  const one=compileAssignment(study,"participant-one");
  const again=compileAssignment(study,"participant-one");
  const two=compileAssignment(study,"participant-two");
  assert.deepEqual(one,again);
  assert.notEqual(one.participant,two.participant);
  assert.equal(one.study_receipt,studyReceipt(study));

  for (const trial of one.trials) {
    assert.deepEqual(Object.keys(trial).sort(),["material_token","trial_index","trial_token"]);
    assert.match(trial.trial_token,/^[0-9a-f]{32}$/);
    assert.match(trial.material_token,/^[0-9a-f]{32}$/);
  }

  const serialized=JSON.stringify(one);
  for (const leak of ["john-8-58","expected_class","relation_id","correct_index","hypothesis","version=ASV","version=TLB"]) {
    assert.equal(serialized.includes(leak),false,leak);
  }
});

test("presenter resolver reconstructs operator metadata from opaque trial token", async () => {
  const study=await loadReceiverStudy();
  const assignment=compileAssignment(study,"participant-one");
  const trial=assignment.trials[0];
  const material=resolveTrialMaterial(study,assignment.participant,trial.trial_token);
  assert.ok(["asv","tlb"].includes(material.arm));
  assert.match(material.url,/version=(ASV|TLB)/);
  assert.equal(material.material_token,trial.material_token);
  assert.ok(material.item_id);
  assert.ok(material.prompt);
  assert.ok(material.options.length>=2);
  assert.match(material.presenter_boundary,/Do not expose/);
});

test("participant-specific order is a permutation when resolved operator-side", async () => {
  const study=await loadReceiverStudy();
  const ids=new Set(study.items.map((item)=>item.id));
  function resolvedIds(key) {
    const assignment=compileAssignment(study,key);
    return assignment.trials.map((trial)=>
      resolveTrialMaterial(study,assignment.participant,trial.trial_token).item_id
    );
  }
  const a=resolvedIds("participant-a");
  const b=resolvedIds("participant-b");
  assert.deepEqual(new Set(a),ids);
  assert.deepEqual(new Set(b),ids);
  assert.notDeepEqual(a,b);
});

test("trial packet contains passage and probe but no arm, URL, answer key, or semantic class", async () => {
  const study=await loadReceiverStudy();
  const assignment=compileAssignment(study,"participant-one");
  const trial=assignment.trials[0];
  const resolution=resolveTrialMaterial(study,assignment.participant,trial.trial_token);
  const packet=buildTrialPacket(study,assignment,resolution,"A short locally supplied passage.");
  const validation=validateTrialPacket(study,assignment,packet);
  assert.equal(validation.passed,true,validation.errors.join("\n"));

  const serialized=JSON.stringify(packet);
  assert.equal(serialized.includes(resolution.url),false);
  assert.equal(serialized.includes(resolution.arm),false);
  assert.equal(serialized.includes(resolution.item_id),false);
  assert.equal(serialized.includes(resolution.expected_class),false);
  assert.equal("correct_index" in packet,false);
  assert.match(packet.packet_receipt,/^[0-9a-f]{64}$/);
});

test("packet validation detects receipt tampering", async () => {
  const study=await loadReceiverStudy();
  const assignment=compileAssignment(study,"participant-one");
  const trial=assignment.trials[0];
  const resolution=resolveTrialMaterial(study,assignment.participant,trial.trial_token);
  const packet=buildTrialPacket(study,assignment,resolution,"A short locally supplied passage.");
  const tampered={...packet,passage_text:packet.passage_text+" changed"};
  const result=validateTrialPacket(study,assignment,tampered);
  assert.equal(result.passed,false);
  assert.ok(result.errors.some((error)=>error.includes("receipt mismatch")));
});

test("scoring keeps comprehension and subjective ratings distinct and binds packet receipt", async () => {
  const study=await loadReceiverStudy();
  const assignment=compileAssignment(study,"participant-one");
  const trial=assignment.trials[0];
  const resolution=resolveTrialMaterial(study,assignment.participant,trial.trial_token);
  const item=study.items.find((candidate)=>candidate.id===resolution.item_id);
  const packet=buildTrialPacket(study,assignment,resolution,"A short locally supplied passage.");
  const receipt=scoreResponse(study,assignment,{
    trial_token:trial.trial_token,
    material_token:trial.material_token,
    packet_receipt:packet.packet_receipt,
    answer_index:item.correct_index,
    clarity_1_5:5,
    preference_1_5:2,
    perceived_fidelity_1_5:3,
    theological_agreement_1_5:1
  },packet);
  assert.equal(receipt.correct,true);
  assert.equal(receipt.packet_receipt,packet.packet_receipt);
  assert.equal(receipt.clarity_1_5,5);
  assert.equal(receipt.preference_1_5,2);
  assert.equal(receipt.perceived_fidelity_1_5,3);
  assert.equal(receipt.theological_agreement_1_5,1);
  assert.ok(receipt.nonclaims.some((line)=>line.includes("Perceived fidelity")));
});

test("summary HOLDS until both arms reach the declared minimum", async () => {
  const study=await loadReceiverStudy();
  const assignment=compileAssignment(study,"lonely-participant");
  const trial=assignment.trials[0];
  const resolution=resolveTrialMaterial(study,assignment.participant,trial.trial_token);
  const item=study.items.find((candidate)=>candidate.id===resolution.item_id);
  const receipt=scoreResponse(study,assignment,{
    trial_token:trial.trial_token,
    material_token:trial.material_token,
    answer_index:item.correct_index
  });
  const summary=summarizeReceipts(study,[assignment],[receipt],{minimum_cell:2});
  const row=summary.items.find((candidate)=>candidate.item_id===item.id);
  assert.equal(row.tlb_minus_asv_comprehension_delta,null);
  assert.match(row.interpretation,/HOLD/);
});

test("descriptive delta is computed only after arm-local minimums are met", async () => {
  const study=await loadReceiverStudy();
  const target=study.items[0];
  const assignments=[];
  const receipts=[];

  for (let i=0;i<120;i++) {
    const assignment=compileAssignment(study,`synthetic-${i}`);
    assignments.push(assignment);
    const token=trialToken(study,assignment.participant,target.id);
    const trial=assignment.trials.find((candidate)=>candidate.trial_token===token);
    const arm=armFor(study,assignment.participant,target.id);
    receipts.push(scoreResponse(study,assignment,{
      trial_token:trial.trial_token,
      material_token:trial.material_token,
      answer_index:arm==="tlb" ? target.correct_index : (target.correct_index+1)%target.options.length,
      clarity_1_5:arm==="tlb" ? 5 : 3,
      preference_1_5:arm==="tlb" ? 4 : 2,
      perceived_fidelity_1_5:3,
      theological_agreement_1_5:3
    }));
  }

  const summary=summarizeReceipts(study,assignments,receipts,{minimum_cell:5});
  const row=summary.items.find((candidate)=>candidate.item_id===target.id);
  assert.ok(row.asv.n>=5);
  assert.ok(row.tlb.n>=5);
  assert.equal(row.asv.comprehension_rate,0);
  assert.equal(row.tlb.comprehension_rate,1);
  assert.equal(row.tlb_minus_asv_comprehension_delta,1);
  assert.match(row.interpretation,/descriptive receiver-local difference/);
  assert.match(summary.global_nonclaim,/does not rank/);
});

test("arm allocation varies across pseudonymous participants without storing participant keys", async () => {
  const study=await loadReceiverStudy();
  const item=study.items[0].id;
  const arms=new Set();
  for (let i=0;i<64;i++) {
    const pseudo=participantPseudonym(study,`balance-${i}`);
    arms.add(armFor(study,pseudo,item));
  }
  assert.deepEqual(arms,new Set(["asv","tlb"]));
});
