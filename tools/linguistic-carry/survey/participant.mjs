import {
  buildPilotFeedback,downloadJson,readJsonFile,validateParticipantPacket
} from "./common.mjs";

const acknowledgement=document.querySelector("#pilot-ack");
const packetInput=document.querySelector("#packet-file");
const loadStatus=document.querySelector("#load-status");
const form=document.querySelector("#pilot-form");
const done=document.querySelector("#done");
const trialLabel=document.querySelector("#trial-label");
const passage=document.querySelector("#passage");
const prompt=document.querySelector("#prompt");
const options=document.querySelector("#options");
const formStatus=document.querySelector("#form-status");
const downloadAgain=document.querySelector("#download-again");

let packet=null;
let lastFeedback=null;

function showStatus(node,message,isError=false) {
  node.textContent=message;
  node.classList.toggle("error",isError);
}

acknowledgement.addEventListener("change",()=>{
  packetInput.disabled=!acknowledgement.checked;
  if (!acknowledgement.checked) {
    packet=null;
    packetInput.value="";
    form.classList.add("hidden");
    done.classList.add("hidden");
    showStatus(loadStatus,"Pilot information acknowledgement is required before loading a packet.");
  } else {
    showStatus(loadStatus,"You may load the packet or stop here.");
  }
});

packetInput.addEventListener("change",async()=>{
  try {
    if (!acknowledgement.checked) throw new Error("Read and acknowledge the pilot information first");
    const file=packetInput.files?.[0];
    if (!file) return;
    const candidate=await readJsonFile(file);
    const validation=await validateParticipantPacket(candidate);
    if (!validation.passed) throw new Error(validation.errors.join("; "));
    packet=candidate;
    lastFeedback=null;
    trialLabel.textContent=`#${packet.trial_index+1} · ${packet.packet_receipt.slice(0,12)}`;
    passage.textContent=packet.passage_text;
    prompt.textContent=packet.prompt;
    options.replaceChildren(...packet.options.map((option,index)=>{
      const row=document.createElement("div");
      row.className="choice";
      row.textContent=`${index+1}. ${option}`;
      return row;
    }));
    form.reset();
    form.classList.remove("hidden");
    done.classList.add("hidden");
    showStatus(loadStatus,"Packet fingerprint verified; pilot feedback only.");
  } catch(error) {
    packet=null;
    form.classList.add("hidden");
    done.classList.add("hidden");
    showStatus(loadStatus,error.message,true);
  }
});

form.addEventListener("submit",async(event)=>{
  event.preventDefault();
  try {
    if (!acknowledgement.checked || !packet) throw new Error("Acknowledge the pilot information and load a packet");
    const data=new FormData(form);
    const feedback=await buildPilotFeedback(packet,{
      acknowledged:true,
      instructions_clear:data.get("instructions_clear"),
      question_clear:data.get("question_clear"),
      layout_usable:data.get("layout_usable"),
      issues:data.getAll("issues"),
      notes:data.get("notes")
    });
    lastFeedback=feedback;
    downloadJson(`pilot-feedback-${packet.packet_receipt.slice(0,10)}.json`,feedback);
    form.classList.add("hidden");
    done.classList.remove("hidden");
    showStatus(formStatus,"Pilot-only feedback created.");
  } catch(error) {
    showStatus(formStatus,error.message,true);
  }
});

downloadAgain.addEventListener("click",()=>{
  if (lastFeedback && packet && acknowledgement.checked) {
    downloadJson(`pilot-feedback-${packet.packet_receipt.slice(0,10)}.json`,lastFeedback);
  }
});
