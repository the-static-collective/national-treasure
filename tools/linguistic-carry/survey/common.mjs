const FORBIDDEN_KEYS=new Set([
  "arm","url","item_id","passage_id","relation_id","expected_class",
  "correct_index","hypothesis","materials","version","translation"
]);

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value==="object") {
    return Object.fromEntries(Object.keys(value).sort().map((key)=>[key,canonical(value[key])]));
  }
  return value;
}

export function canonicalString(value) {
  return JSON.stringify(canonical(value));
}

export async function sha256Hex(value) {
  const bytes=new TextEncoder().encode(value);
  const digest=await crypto.subtle.digest("SHA-256",bytes);
  return Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,"0")).join("");
}

export function findForbiddenKeys(value,path="$",found=[]) {
  if (Array.isArray(value)) {
    value.forEach((item,index)=>findForbiddenKeys(item,`${path}[${index}]`,found));
  } else if (value && typeof value==="object") {
    for (const [key,item] of Object.entries(value)) {
      if (FORBIDDEN_KEYS.has(key)) found.push(`${path}.${key}`);
      findForbiddenKeys(item,`${path}.${key}`,found);
    }
  }
  return found;
}

export async function buildParticipantPacket(assignment,resolution,passageText) {
  if (!assignment?.study_id || !assignment?.study_receipt || !assignment?.participant) {
    throw new Error("assignment is incomplete");
  }
  const trial=assignment.trials?.find((candidate)=>candidate.trial_token===resolution?.trial_token);
  if (!trial) throw new Error("resolution trial is not in assignment");
  if (trial.material_token!==resolution.material_token) throw new Error("material token mismatch");
  if (!resolution.prompt || !Array.isArray(resolution.options)) throw new Error("resolution lacks frozen probe");
  if (typeof passageText!=="string" || !passageText.trim()) throw new Error("passage text is required");

  const packet={
    schema:"national-treasure.linguistic-carry.participant-packet.v1",
    study_id:assignment.study_id,
    study_receipt:assignment.study_receipt,
    participant:assignment.participant,
    trial_index:trial.trial_index,
    trial_token:trial.trial_token,
    material_token:trial.material_token,
    passage_text:passageText.trim(),
    prompt:resolution.prompt,
    options:resolution.options,
    response_fields:resolution.response_fields ?? [
      "answer_index","clarity_1_5","preference_1_5","perceived_fidelity_1_5","theological_agreement_1_5"
    ],
    created_at:new Date().toISOString()
  };
  const forbidden=findForbiddenKeys(packet);
  if (forbidden.length) throw new Error(`participant packet leaks forbidden keys: ${forbidden.join(", ")}`);
  const packet_receipt=await sha256Hex(canonicalString(packet));
  return {...packet,packet_receipt};
}

export async function validateParticipantPacket(packet) {
  const errors=[];
  if (packet?.schema!=="national-treasure.linguistic-carry.participant-packet.v1") errors.push("unexpected packet schema");
  if (!packet?.study_id || !packet?.study_receipt || !packet?.participant) errors.push("missing packet identity");
  if (!packet?.trial_token || !packet?.material_token) errors.push("missing opaque trial tokens");
  if (!packet?.passage_text || !packet?.prompt || !Array.isArray(packet?.options) || packet.options.length<2) {
    errors.push("packet content incomplete");
  }
  const forbidden=findForbiddenKeys(packet);
  if (forbidden.length) errors.push(`participant packet leaks forbidden keys: ${forbidden.join(", ")}`);
  if (!packet?.packet_receipt) {
    errors.push("missing packet receipt");
  } else {
    const {packet_receipt,...base}=packet;
    const expected=await sha256Hex(canonicalString(base));
    if (expected!==packet_receipt) errors.push("packet receipt mismatch");
  }
  return {passed:errors.length===0,errors};
}

export function buildResponse(packet,values) {
  const answer=Number(values.answer_index);
  if (!Number.isInteger(answer) || answer<0 || answer>=packet.options.length) throw new Error("choose one answer");
  const response={
    study_id:packet.study_id,
    study_receipt:packet.study_receipt,
    participant:packet.participant,
    trial_token:packet.trial_token,
    material_token:packet.material_token,
    packet_receipt:packet.packet_receipt,
    answer_index:answer,
    recorded_at:new Date().toISOString()
  };
  for (const field of ["clarity_1_5","preference_1_5","perceived_fidelity_1_5","theological_agreement_1_5"]) {
    const raw=values[field];
    if (raw!==undefined && raw!==null && raw!=="") {
      const value=Number(raw);
      if (!Number.isInteger(value) || value<1 || value>5) throw new Error(`${field} must be 1-5`);
      response[field]=value;
    }
  }
  return response;
}

export function downloadJson(filename,value) {
  const blob=new Blob([JSON.stringify(value,null,2)+"\n"],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");
  link.href=url;
  link.download=filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function readJsonFile(file) {
  return JSON.parse(await file.text());
}

export const PILOT_MANIFEST_ID="LC-005C-PILOT-FREEZE-001";
export const PILOT_ISSUES=new Set([
  "passage_visibility","question_ambiguous","choices_ambiguous",
  "device_layout","version_recognized","other"
]);

export async function buildPilotFeedback(packet,values) {
  const validation=await validateParticipantPacket(packet);
  if (!validation.passed) throw new Error(validation.errors.join("; "));
  if (values.acknowledged!==true) throw new Error("Read and acknowledge the pilot information first");
  const issues=Array.isArray(values.issues) ? values.issues : [];
  if (issues.some(issue=>!PILOT_ISSUES.has(issue)) || new Set(issues).size!==issues.length) {
    throw new Error("invalid or repeated issue code");
  }
  const response={
    schema:"national-treasure.linguistic-carry.pilot-feedback.v1",
    mode:"pilot_only",
    analytical_admission:false,
    manifest_id:PILOT_MANIFEST_ID,
    study_receipt:packet.study_receipt,
    packet_receipt:packet.packet_receipt,
    trial_token:packet.trial_token,
    consent_version:"lc005c-pilot-v1",
    instructions_clear:values.instructions_clear,
    question_clear:values.question_clear,
    layout_usable:values.layout_usable,
    issues,
    notes:String(values.notes??"").trim(),
    recorded_at:new Date().toISOString()
  };
  for(const field of ["instructions_clear","question_clear","layout_usable"]) {
    if (!["yes","no","unsure"].includes(response[field])) throw new Error("Select a response for "+field);
  }
  if (response.notes.length>500) throw new Error("Notes must be 500 characters or fewer");
  return {...response,feedback_receipt:await sha256Hex(canonicalString(response))};
}
