#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FREEZE_PATH, reviewPilotFeedback, verifyPilotFreeze } from "./pilot-mode.mjs";

async function main() {
  const [command="check",feedbackFile]=process.argv.slice(2);
  const frozen=await verifyPilotFreeze();
  if (!frozen.passed) throw new Error("pilot freeze invalid: "+frozen.errors.join("; "));
  if (command==="check") {
    console.log(JSON.stringify(frozen,null,2));
    return;
  }
  if (command==="review") {
    if (!feedbackFile) throw new Error("review requires an array of pilot feedback in a local JSON file");
    const manifest=JSON.parse(await fs.readFile(FREEZE_PATH,"utf8"));
    const records=JSON.parse(await fs.readFile(feedbackFile,"utf8"));
    console.log(JSON.stringify(reviewPilotFeedback(records,{...manifest,study_receipt:frozen.study_receipt}),null,2));
    return;
  }
  throw new Error("usage: pilot-cli.mjs check | review <pilot-feedback-array.json>");
}

if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  main().catch(error=>{console.error(error.message);process.exitCode=1;});
}
