import crypto from "node:crypto";

const VALID_CLASSES = new Set(["CARRY","REVEAL","PROJECTION","LOSS","HOLD"]);
const VALID_ARMS = new Set(["asv","tlb"]);
const RESPONSE_FIELDS = Object.freeze([
  "answer_index",
  "clarity_1_5",
  "preference_1_5",
  "perceived_fidelity_1_5",
  "theological_agreement_1_5"
]);

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

export function armFor(study, participantPseudo, itemId) {
  return assignmentBit(study.blinding.seed,participantPseudo,itemId)===0 ? "asv" : "tlb";
}

export function trialToken(study, participantPseudo, itemId) {
  return sha256(`${study.study_id}\0${study.blinding.seed}\0${participantPseudo}\0${itemId}\0trial`).slice(0,32);
}

export function materialToken(study, participantPseudo, itemId) {
  return sha256(`${study.study_id}\0${study.blinding.seed}\0${participantPseudo}\0${itemId}\0material`).slice(0,32);
}

function itemForTrialToken(study, participantPseudo, token) {
  return study.items.find((item)=>trialToken(study,participantPseudo,item.id)===token) ?? null;
}

export function resolveTrialMaterial(study, participantPseudo, token) {
  const item=itemForTrialToken(study,participantPseudo,token);
  if (!item) throw new Error("unknown trial token");
  const arm=armFor(study,participantPseudo,item.id);
  return {
    trial_token:token,
    material_token:materialToken(study,participantPseudo,item.id),
    item_id:item.id,
    passage_id:item.passage_id,
    relation_id:item.relation_id,
    expected_class:item.expected_class,
    arm,
    url:item.materials[arm].url,
    prompt:item.prompt,
    options:item.options,
    response_fields:[...RESPONSE_FIELDS],
    presenter_boundary:"Presenter-side resolution only. Do not expose item identity, answer key, hypothesis, version metadata, URL query parameters, or arm identity to the participant."
  };
}

export function compileAssignment(study, participantKey) {
  const validation=validateReceiverStudy(study);
  if (!validation.passed) throw new Error(validation.errors.join("; "));
  const participant=participantPseudonym(study,participantKey);
  const study_receipt=studyReceipt(study);
  const ordered=[...study.items].sort((a,b)=>
    sha256(`${study.blinding.seed}\0${participant}\0order\0${a.id}`)
      .localeCompare(sha256(`${study.blinding.seed}\0${participant}\0order\0${b.id}`))
  );
  const trials=ordered.map((item,index)=>({
    trial_index:index,
    trial_token:trialToken(study,participant,item.id),
    material_token:materialToken(study,participant,item.id)
  }));
  return {
    study_id:study.study_id,
    study_receipt,
    participant,
    trials,
    privacy:"Opaque allocation receipt only. Interpretive and source metadata remain outside this artifact."
  };
}

export function packetReceipt(packetWithoutReceipt) {
  return sha256(JSON.stringify(canonical(packetWithoutReceipt)));
}

const PARTICIPANT_FORBIDDEN_KEYS = new Set([
  "arm","url","item_id","passage_id","relation_id","expected_class",
  "correct_index","hypothesis","materials","version","translation"
]);

function findForbiddenKeys(value, path="$", found=[]) {
  if (Array.isArray(value)) {
    value.forEach((item,index)=>findForbiddenKeys(item,`${path}[${index}]`,found));
  } else if (value && typeof value==="object") {
    for (const [key,item] of Object.entries(value)) {
      if (PARTICIPANT_FORBIDDEN_KEYS.has(key)) found.push(`${path}.${key}`);
      findForbiddenKeys(item,`${path}.${key}`,found);
    }
  }
  return found;
}

export function buildTrialPacket(study, assignment, resolution, passageText) {
  if (assignment.study_id!==study.study_id || assignment.study_receipt!==studyReceipt(study)) {
    throw new Error("assignment does not match current study");
  }
  const trial=assignment.trials.find((candidate)=>candidate.trial_token===resolution.trial_token);
  if (!trial) throw new Error("resolution is not part of assignment");
  if (trial.material_token!==resolution.material_token) throw new Error("material token mismatch");
  if (typeof passageText!=="string" || !passageText.trim()) throw new Error("passage text is required");

  const packet={
    schema:"national-treasure.linguistic-carry.participant-packet.v1",
    study_id:study.study_id,
    study_receipt:assignment.study_receipt,
    participant:assignment.participant,
    trial_index:trial.trial_index,
    trial_token:trial.trial_token,
    material_token:trial.material_token,
    passage_text:passageText.trim(),
    prompt:resolution.prompt,
    options:resolution.options,
    response_fields:[...RESPONSE_FIELDS],
    created_at:new Date().toISOString()
  };
  const forbidden=findForbiddenKeys(packet);
  if (forbidden.length) throw new Error(`participant packet leaks forbidden keys: ${forbidden.join(", ")}`);
  return {...packet,packet_receipt:packetReceipt(packet)};
}

export function validateTrialPacket(study, assignment, packet) {
  const errors=[];
  if (packet?.schema!=="national-treasure.linguistic-carry.participant-packet.v1") errors.push("unexpected packet schema");
  if (packet?.study_id!==study.study_id || packet?.study_receipt!==studyReceipt(study)) errors.push("packet study mismatch");
  if (packet?.participant!==assignment.participant) errors.push("packet participant mismatch");
  const trial=assignment.trials.find((candidate)=>candidate.trial_token===packet?.trial_token);
  if (!trial) errors.push("unknown packet trial token");
  if (trial && trial.material_token!==packet?.material_token) errors.push("packet material token mismatch");
  const item=trial ? itemForTrialToken(study,assignment.participant,trial.trial_token) : null;
  if (!item) errors.push("packet trial does not resolve to study item");
  if (!packet?.passage_text || !packet?.prompt || !Array.isArray(packet?.options)) errors.push("packet content incomplete");
  if (item && packet?.prompt!==item.prompt) errors.push("packet prompt differs from frozen study");
  if (item && JSON.stringify(packet?.options)!==JSON.stringify(item.options)) errors.push("packet options differ from frozen study");
  const forbidden=findForbiddenKeys(packet);
  if (forbidden.length) errors.push(`participant packet leaks forbidden keys: ${forbidden.join(", ")}`);
  if (packet?.packet_receipt) {
    const {packet_receipt,...base}=packet;
    if (packet_receipt!==packetReceipt(base)) errors.push("packet receipt mismatch");
  } else errors.push("missing packet receipt");
  return {passed:errors.length===0,errors};
}

export function scoreResponse(study, assignment, response, packet=null) {
  if (assignment.study_id !== study.study_id || assignment.study_receipt !== studyReceipt(study)) {
    throw new Error("assignment does not match current study receipt");
  }
  const trial=assignment.trials.find((candidate)=>candidate.trial_token===response.trial_token);
  if (!trial) throw new Error("unknown response trial");
  if (response.material_token!==trial.material_token) throw new Error("response material token mismatch");
  const item=itemForTrialToken(study,assignment.participant,response.trial_token);
  if (!item) throw new Error("trial token does not resolve to study item");
  if (!Number.isInteger(response.answer_index)) throw new Error("answer_index must be an integer");

  if (packet) {
    const validation=validateTrialPacket(study,assignment,packet);
    if (!validation.passed) throw new Error(validation.errors.join("; "));
    if (packet.trial_token!==response.trial_token || packet.material_token!==response.material_token) {
      throw new Error("response does not match packet");
    }
    if (response.packet_receipt!==packet.packet_receipt) throw new Error("response packet receipt mismatch");
  }

  for (const field of RESPONSE_FIELDS.slice(1)) {
    if (response[field] !== undefined && response[field] !== null &&
        (!Number.isInteger(response[field]) || response[field] < 1 || response[field] > 5)) {
      throw new Error(`${field} must be an integer from 1 to 5`);
    }
  }

  return {
    study_id:study.study_id,
    study_receipt:assignment.study_receipt,
    participant:assignment.participant,
    trial_token:trial.trial_token,
    material_token:trial.material_token,
    packet_receipt:response.packet_receipt ?? null,
    item_id:item.id,
    passage_id:item.passage_id,
    relation_id:item.relation_id,
    expected_class:item.expected_class,
    correct:response.answer_index===item.correct_index,
    answer_index:response.answer_index,
    clarity_1_5:response.clarity_1_5 ?? null,
    preference_1_5:response.preference_1_5 ?? null,
    perceived_fidelity_1_5:response.perceived_fidelity_1_5 ?? null,
    theological_agreement_1_5:response.theological_agreement_1_5 ?? null,
    recorded_at:response.recorded_at ?? null,
    nonclaims:[
      "Correctness measures only the declared comprehension probe.",
      "Preference is not fidelity.",
      "Perceived fidelity is a reader judgment, not source-language fidelity.",
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
  const assignmentKeys=new Set();
  for (const assignment of assignmentMap) {
    for (const trial of assignment.trials) {
      assignmentKeys.add(`${assignment.participant}\0${trial.trial_token}\0${trial.material_token}`);
    }
  }

  const groups=new Map();
  for (const receipt of receipts) {
    if (receipt.study_receipt !== studyReceipt(study)) throw new Error("mixed study receipts");
    const assignmentKey=`${receipt.participant}\0${receipt.trial_token}\0${receipt.material_token}`;
    if (!assignmentKeys.has(assignmentKey)) throw new Error("receipt lacks matching assignment");
    const item=study.items.find((candidate)=>candidate.id===receipt.item_id);
    if (!item) throw new Error("receipt item is not in study");
    const arm=armFor(study,receipt.participant,item.id);
    const key=`${item.id}\0${arm}`;
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
        perceived_fidelity_mean:mean(rows.map((row)=>row.perceived_fidelity_1_5).filter((value)=>value!==null)),
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
      "This report separates comprehension, clarity, preference, perceived fidelity, and theological agreement. Perceived fidelity is not source-language fidelity; the report does not rank Bible translations."
  };
}
