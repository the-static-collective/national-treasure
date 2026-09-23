import test from "node:test";
import assert from "node:assert/strict";
import { loadTransformStudy } from "./transform-cli.mjs";
import { loadReceiverStudy } from "./receiver-cli.mjs";
import {
  armFor,
  compileAssignment,
  participantPseudonym,
  resolveTrialMaterial,
  scoreResponse,
  studyReceipt,
  summarizeReceipts,
  validateReceiverStudy
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

test("public assignment is deterministic, participant-scoped, and arm blind", async () => {
  const study=await loadReceiverStudy();
  const one=compileAssignment(study,"participant-one");
  const again=compileAssignment(study,"participant-one");
  const two=compileAssignment(study,"participant-two");
  assert.deepEqual(one,again);
  assert.notEqual(one.participant,two.participant);
  assert.equal(one.study_receipt,studyReceipt(study));
  for (const trial of one.trials) {
    assert.ok(trial.material_token);
    assert.equal("material_url" in trial,false);
    assert.equal("arm" in trial,false);
    assert.equal("blind_label" in trial,false);
  }
});

test("presenter resolver is separate from participant assignment", async () => {
  const study=await loadReceiverStudy();
  const assignment=compileAssignment(study,"participant-one");
  const itemId=assignment.trials[0].item_id;
  const material=resolveTrialMaterial(study,assignment.participant,itemId);
  assert.ok(["asv","tlb"].includes(material.arm));
  assert.match(material.url,/version=(ASV|TLB)/);
  assert.equal(material.material_token,assignment.trials[0].material_token);
  assert.match(material.presenter_boundary,/Do not expose/);
});

test("participant-specific order is a permutation of all study items", async () => {
  const study=await loadReceiverStudy();
  const ids=new Set(study.items.map((item)=>item.id));
  const a=compileAssignment(study,"participant-a").trials.map((trial)=>trial.item_id);
  const b=compileAssignment(study,"participant-b").trials.map((trial)=>trial.item_id);
  assert.deepEqual(new Set(a),ids);
  assert.deepEqual(new Set(b),ids);
  assert.notDeepEqual(a,b);
});

test("scoring keeps comprehension and subjective ratings distinct", async () => {
  const study=await loadReceiverStudy();
  const assignment=compileAssignment(study,"participant-one");
  const trial=assignment.trials[0];
  const item=study.items.find((candidate)=>candidate.id===trial.item_id);
  const receipt=scoreResponse(study,assignment,{
    item_id:item.id,
    answer_index:item.correct_index,
    clarity_1_5:5,
    preference_1_5:2,
    perceived_fidelity_1_5:3,
    theological_agreement_1_5:1
  });
  assert.equal(receipt.correct,true);
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
  const item=study.items.find((candidate)=>candidate.id===trial.item_id);
  const receipt=scoreResponse(study,assignment,{item_id:item.id,answer_index:item.correct_index});
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
    const trial=assignment.trials.find((candidate)=>candidate.item_id===target.id);
    const arm=armFor(study,assignment.participant,target.id);
    receipts.push(scoreResponse(study,assignment,{
      item_id:target.id,
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
