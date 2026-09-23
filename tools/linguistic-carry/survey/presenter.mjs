import {buildParticipantPacket,downloadJson,readJsonFile} from "./common.mjs";

const assignmentInput=document.querySelector("#assignment-file");
const resolutionInput=document.querySelector("#resolution-file");
const trialSelect=document.querySelector("#trial-select");
const assignmentInfo=document.querySelector("#assignment-info");
const assignmentStatus=document.querySelector("#assignment-status");
const resolutionInfo=document.querySelector("#resolution-info");
const resolutionStatus=document.querySelector("#resolution-status");
const resolveCommand=document.querySelector("#resolve-command");
const copyCommand=document.querySelector("#copy-command");
const itemId=document.querySelector("#item-id");
const arm=document.querySelector("#arm");
const sourceLink=document.querySelector("#source-link");
const passageText=document.querySelector("#passage-text");
const buildPacket=document.querySelector("#build-packet");
const packetStatus=document.querySelector("#packet-status");

let assignment=null;
let resolution=null;

function status(node,message,isError=false) {
  node.textContent=message;
  node.classList.toggle("error",isError);
}

function selectedTrial() {
  if (!assignment) return null;
  return assignment.trials[Number(trialSelect.value)] ?? null;
}

function renderCommand() {
  const trial=selectedTrial();
  if (!assignment || !trial) return;
  resolveCommand.textContent=`node tools/linguistic-carry/receiver-cli.mjs resolve ${assignment.participant} ${trial.trial_token}`;
}

assignmentInput.addEventListener("change",async()=>{
  try {
    const file=assignmentInput.files?.[0];
    if (!file) return;
    const value=await readJsonFile(file);
    if (!value.study_id || !value.study_receipt || !value.participant || !Array.isArray(value.trials)) {
      throw new Error("invalid assignment");
    }
    for (const trial of value.trials) {
      if (Object.keys(trial).some((key)=>!["trial_index","trial_token","material_token"].includes(key))) {
        throw new Error("assignment is not opaque");
      }
    }
    assignment=value;
    resolution=null;
    resolutionInfo.classList.add("hidden");
    trialSelect.replaceChildren(...assignment.trials.map((trial,index)=>{
      const option=document.createElement("option");
      option.value=String(index);
      option.textContent=`Trial ${trial.trial_index+1} · ${trial.trial_token.slice(0,10)}`;
      return option;
    }));
    assignmentInfo.classList.remove("hidden");
    renderCommand();
    status(assignmentStatus,`${assignment.trials.length} opaque trials loaded.`);
  } catch(error) {
    assignment=null;
    assignmentInfo.classList.add("hidden");
    status(assignmentStatus,error.message,true);
  }
});

trialSelect.addEventListener("change",()=>{
  resolution=null;
  resolutionInfo.classList.add("hidden");
  renderCommand();
});

copyCommand.addEventListener("click",async()=>{
  await navigator.clipboard.writeText(resolveCommand.textContent);
  status(assignmentStatus,"Resolve command copied.");
});

resolutionInput.addEventListener("change",async()=>{
  try {
    if (!assignment) throw new Error("load assignment first");
    const file=resolutionInput.files?.[0];
    if (!file) return;
    const value=await readJsonFile(file);
    const trial=selectedTrial();
    if (value.trial_token!==trial.trial_token || value.material_token!==trial.material_token) {
      throw new Error("resolution does not match selected opaque trial");
    }
    if (!value.url || !value.arm || !value.prompt || !Array.isArray(value.options)) {
      throw new Error("resolution is incomplete");
    }
    resolution=value;
    itemId.textContent=value.item_id;
    arm.textContent=value.arm;
    sourceLink.href=value.url;
    sourceLink.textContent="Open source rendering ↗";
    resolutionInfo.classList.remove("hidden");
    status(resolutionStatus,"Presenter-only resolution matched.");
  } catch(error) {
    resolution=null;
    resolutionInfo.classList.add("hidden");
    status(resolutionStatus,error.message,true);
  }
});

buildPacket.addEventListener("click",async()=>{
  try {
    if (!assignment || !resolution) throw new Error("load matching assignment and resolution first");
    const packet=await buildParticipantPacket(assignment,resolution,passageText.value);
    downloadJson(`trial-${packet.trial_index+1}-${packet.packet_receipt.slice(0,10)}.json`,packet);
    status(packetStatus,`Participant packet sealed: ${packet.packet_receipt.slice(0,16)}…`);
  } catch(error) {
    status(packetStatus,error.message,true);
  }
});
