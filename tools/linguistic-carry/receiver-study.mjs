import crypto from "node:crypto";

const VALID_CLASSES = new Set(["CARRY","REVEAL","PROJECTION","LOSS","HOLD"]);
const VALID_ARMS = new Set(["asv","tlb"]);

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  }
  return value;
}

export function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function studyReceipt(study) {
  return sha256(JSON.stringify(canonical(study)));
}

export function validateReceiverStudy(study) {
  const errors=[];
  if (study?.schema !== "national-treasure.linguistic-carry.receiver-study.v1") errors.push("unexpected study schema");
  if (!study?.study_id) errors.push("missing study_id");
  if (!study?.receiver?.id) errors.push("missing receiver constitution");
  if (!study?.blinding?.seed) errors.push("missing deterministic blinding seed");
  if (study?.materials?.text_policy !== "external-reference-only") errors.push("materials must be external-reference-only");
  if (!Array.isArray(study?.items) || !study.items.length) errors.push("study needs items");

  const ids=new Set();
  for (const item of study?.items ?? []) {
    if (!item.id || ids.has(item.id)) errors.push(`duplicate/missing item id: ${item.id}`);
    ids.add(item.id);
    if (!item.passage_id || !item.relation_id) errors.push(`missing relation locator: ${item.id}`);
    if (!VALID_CLASSES.has(item.expected_class)) errors.push(`invalid expected class: ${item.id}`);
    if (!item.prompt || !Array.isArray(item.options) || item.options.length < 2) errors.push(`bad probe: ${item.id}`);
    if (!Number.isInteger(item.correct_index) || item.correct_index < 0 || item.correct_index >= (item.options?.length ?? 0)) {
      errors.push(`bad correct_index: ${item.id}`);
    }
    if (!item.materials || !VALID_ARMS.has(item.materials.asv?.arm) || !VALID_ARMS.has(item.materials.tlb?.arm)) {
      errors.push(`missing ASV/TLB material descriptors: ${item.id}`);
    }
    for (const descriptor of Object.values(item.materials ?? {})) {
      if (!/^https:\/\//.test(descriptor.url ?? "")) errors.push(`invalid material URL: ${item.id}`);
      if ("text" in descriptor) errors.push(`copyrighted/material text must not be vendored: ${item.id}`);
    }
  }
  return {passed:errors.length===0,errors,item_count:study?.items?.length ?? 0};
}

export function participantPseudonym(study, participantKey) {
  if (!participantKey) throw new Error("participant key is required");
  return sha256(`${study.study_id}\0${participantKey}`).slice(0,24);
}

function assignmentBit(seed, participantPseudo, itemId) {
  const digest=sha256(`${seed}\0${participantPseudo}\0${itemId}`);
  return parseInt(digest.slice(0,2),16) % 2;
}

export function compileAssignment(study, participantKey) {
  const validation=validateReceiverStudy(study);
  if (!validation.passed) throw new Error(validation.errors.join("; "));
  const participant=participantPseudonym(study,participantKey);
  const study_receipt=studyReceipt(study);
  const trials=study.items.map((item,index)=>{
    const arm=assignmentBit(study.blinding.seed,participant,item.id)===0 ? "asv" : "tlb";
    const blind_label=arm==="asv" ? "X" : "Y";
    return {
      trial_index:index,
      item_id:item.id,
      passage_id:item.passage_id,
      relation_id:item.relation_id,
      expected_class:item.expected_class,
      blind_label,
      material_url:item.materials[arm].url,
      prompt:item.prompt,
      options:item.options,
      response_fields:["answer_index","clarity_1_5","preference_1_5","theological_agreement_1_5"],
      nonclaim:"Blind label is presentation-only. It carries no truth, fidelity, or authority status."
    };
  });
  return {
    study_id:study.study_id,
    study_receipt,
    participant,
    trials,
    privacy:"participant key is not stored; only the study-scoped pseudonym belongs in response receipts"
  };
}

export function scoreResponse(study, assignment, response) {
  if (assignment.study_id !== study.study_id || assignment.study_receipt !== studyReceipt(study)) {
    throw new Error("assignment does not match current study receipt");
  }
  const item=study.items.find((candidate)=>candidate.id===response.item_id);
  const trial=assignment.trials.find((candidate)=>candidate.item_id===response.item_id);
  if (!item || !trial) throw new Error("unknown response item");
  if (!Number.isInteger(response.answer_index)) throw new Error("answer_index must be an integer");

  const ratingFields=["clarity_1_5","preference_1_5","theological_agreement_1_5"];
  for (const field of ratingFields) {
    if (response[field] !== undefined && (!Number.isInteger(response[field]) || response[field] < 1 || response[field] > 5)) {
      throw new Error(`${field} must be an integer from 1 to 5`);
    }
  }

  return {
    study_id:study.study_id,
    study_receipt:assignment.study_receipt,
    participant:assignment.participant,
    item_id:item.id,
    passage_id:item.passage_id,
    relation_id:item.relation_id,
    expected_class:item.expected_class,
    blind_label:trial.blind_label,
    correct:response.answer_index===item.correct_index,
    answer_index:response.answer_index,
    clarity_1_5:response.clarity_1_5 ?? null,
    preference_1_5:response.preference_1_5 ?? null,
    theological_agreement_1_5:response.theological_agreement_1_5 ?? null,
    recorded_at:response.recorded_at ?? null,
    nonclaims:[
      "Correctness measures only the declared comprehension probe.",
      "Preference is not fidelity.",
      "Theological agreement is not comprehension.",
      "A reader response does not alter source-text evidence."
    ]
  };
}

function mean(values) {
  if (!values.length) return null;
  return values.reduce((sum,value)=>sum+value,0)/values.length;
}

export function summarizeReceipts(study, assignmentMap, receipts, {minimum_cell=5}={}) {
  const armByParticipantItem=new Map();
  for (const assignment of assignmentMap) {
    for (const trial of assignment.trials) {
      armByParticipantItem.set(`${assignment.participant}\0${trial.item_id}`,trial.blind_label==="X" ? "asv" : "tlb");
    }
  }

  const groups=new Map();
  for (const receipt of receipts) {
    if (receipt.study_receipt !== studyReceipt(study)) throw new Error("mixed study receipts");
    const arm=armByParticipantItem.get(`${receipt.participant}\0${receipt.item_id}`);
    if (!arm) throw new Error("receipt lacks matching assignment");
    const key=`${receipt.item_id}\0${arm}`;
    if (!groups.has(key)) groups.set(key,[]);
    groups.get(key).push(receipt);
  }

  const items=study.items.map((item)=>{
    const arms={};
    for (const arm of ["asv","tlb"]) {
      const rows=groups.get(`${item.id}\0${arm}`) ?? [];
      const correctness=rows.map((row)=>row.correct?1:0);
      arms[arm]={
        n:rows.length,
        comprehension_rate:mean(correctness),
        clarity_mean:mean(rows.map((row)=>row.clarity_1_5).filter((value)=>value!==null)),
        preference_mean:mean(rows.map((row)=>row.preference_1_5).filter((value)=>value!==null)),
        theological_agreement_mean:mean(rows.map((row)=>row.theological_agreement_1_5).filter((value)=>value!==null)),
        cell_ready:rows.length>=minimum_cell
      };
    }
    const ready=arms.asv.cell_ready && arms.tlb.cell_ready;
    const delta=ready && arms.asv.comprehension_rate!==null && arms.tlb.comprehension_rate!==null
      ? arms.tlb.comprehension_rate-arms.asv.comprehension_rate
      : null;
    return {
      item_id:item.id,
      expected_class:item.expected_class,
      asv:arms.asv,
      tlb:arms.tlb,
      tlb_minus_asv_comprehension_delta:delta,
      interpretation:ready
        ? "descriptive receiver-local difference; no causal, fidelity, or population-level claim"
        : `HOLD: minimum ${minimum_cell} receipts per arm not reached`
    };
  });

  return {
    study_id:study.study_id,
    study_receipt:studyReceipt(study),
    minimum_cell,
    items,
    global_nonclaim:
      "This report separates comprehension, clarity, preference, and theological agreement. It does not rank Bible translations or establish fidelity to source languages."
  };
}
