import {buildResponse,downloadJson,readJsonFile,validateParticipantPacket} from "./common.mjs";

const packetInput=document.querySelector("#packet-file");
const loadStatus=document.querySelector("#load-status");
const form=document.querySelector("#study-form");
const done=document.querySelector("#done");
const trialLabel=document.querySelector("#trial-label");
const passage=document.querySelector("#passage");
const prompt=document.querySelector("#prompt");
const options=document.querySelector("#options");
const formStatus=document.querySelector("#form-status");
const downloadAgain=document.querySelector("#download-again");

let packet=null;
let lastResponse=null;

function showStatus(node,message,isError=false) {
  node.textContent=message;
  node.classList.toggle("error",isError);
}

packetInput.addEventListener("change",async()=>{
  try {
    const file=packetInput.files?.[0];
    if (!file) return;
    const candidate=await readJsonFile(file);
    const validation=await validateParticipantPacket(candidate);
    if (!validation.passed) throw new Error(validation.errors.join("; "));
    packet=candidate;
    trialLabel.textContent=`#${packet.trial_index+1} · ${packet.packet_receipt.slice(0,12)}`;
    passage.textContent=packet.passage_text;
    prompt.textContent=packet.prompt;
    options.replaceChildren(...packet.options.map((option,index)=>{
      const label=document.createElement("label");
      label.className="choice";
      const input=document.createElement("input");
      input.type="radio";
      input.name="answer_index";
      input.value=String(index);
      label.append(input,document.createTextNode(option));
      return label;
    }));
    form.classList.remove("hidden");
    done.classList.add("hidden");
    showStatus(loadStatus,"Packet receipt verified.");
  } catch(error) {
    packet=null;
    form.classList.add("hidden");
    showStatus(loadStatus,error.message,true);
  }
});

form.addEventListener("submit",(event)=>{
  event.preventDefault();
  try {
    if (!packet) throw new Error("load a packet first");
    const data=new FormData(form);
    const response=buildResponse(packet,Object.fromEntries(data.entries()));
    lastResponse=response;
    downloadJson(`response-${packet.trial_index+1}-${packet.packet_receipt.slice(0,10)}.json`,response);
    done.classList.remove("hidden");
    showStatus(formStatus,"Response receipt created.");
  } catch(error) {
    showStatus(formStatus,error.message,true);
  }
});

downloadAgain.addEventListener("click",()=>{
  if (lastResponse && packet) {
    downloadJson(`response-${packet.trial_index+1}-${packet.packet_receipt.slice(0,10)}.json`,lastResponse);
  }
});
