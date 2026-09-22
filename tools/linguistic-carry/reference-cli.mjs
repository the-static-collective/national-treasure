#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadCorpus } from "./corpus-cli.mjs";
import {
  empiricalValueNull,
  loadReferenceCorpus,
  referenceProfile,
  stressTarget,
  validateReferenceCorpus
} from "./reference-corpus.mjs";

export async function runReferenceCommand(args = process.argv.slice(2)) {
  const [mode = "check", ...rest] = args;
  const { manifest, records, recordsText } = await loadReferenceCorpus();
  const witnesses = await loadCorpus();
  const check = validateReferenceCorpus(manifest, records, recordsText, witnesses);
  if (!check.passed) throw new Error(`reference corpus invalid: ${check.errors.join("; ")}`);

  if (mode === "check") return check;
  if (mode === "profile") return referenceProfile(records, { stratum: rest[0] ?? "all" });
  if (mode === "score") {
    const [target, stratum = "all", empiricalMode = "word"] = rest;
    if (!target) throw new Error("score requires <Greek target> [all|gospel|non-gospel] [word|window]");
    return empiricalValueNull(records, target, { stratum, mode: empiricalMode });
  }
  if (mode === "stress") {
    const [target] = rest;
    if (!target) throw new Error("stress requires <Greek target>");
    return stressTarget(records, target);
  }
  throw new Error("usage: reference-cli.mjs check | profile [stratum] | score <Greek target> [stratum] [word|window] | stress <Greek target>");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runReferenceCommand()
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}

