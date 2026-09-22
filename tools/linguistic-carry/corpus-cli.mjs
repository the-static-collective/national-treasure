#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeWitness, tokenize } from "./analyze.mjs";
import { heldOutTarget } from "./frequency-null.mjs";

const root=path.dirname(fileURLToPath(import.meta.url));
const corpusDir=path.join(root,"corpus");

export async function loadCorpus() {
  const names=(await fs.readdir(corpusDir)).filter(n=>n.endsWith(".json")).sort();
  return Promise.all(names.map(async name=>JSON.parse(await fs.readFile(path.join(corpusDir,name),"utf8"))));
}

export function validateCorpus(witnesses) {
  const errors=[];
  const ids=new Set();
  for (const w of witnesses) {
    if (ids.has(w.witness_id)) errors.push("duplicate witness_id: "+w.witness_id);
    ids.add(w.witness_id);
    if (!w.verse || !w.witness_id || (w.layers??[]).length!==2) {
      errors.push("bad witness metadata/layer count: "+w.witness_id);continue;
    }
    const greek=w.layers.find(l=>l.id==="gospel-greek");
    const english=w.layers.find(l=>l.id==="kjv-english");
    if (!greek || !english) {errors.push("missing paired witness: "+w.witness_id);continue;}
    if (greek.language!=="grc" || english.language!=="en" ||
        !greek.text || !english.text || !/\p{Script=Greek}/u.test(greek.text)) {
      errors.push("invalid Greek/KJV texts: "+w.witness_id);
    }
    const greekTokens=new Set(tokenize(greek.text));
    for (const token of Object.keys(greek.annotations?.morphology??{})) {
      if (!greekTokens.has(token)) errors.push("morphology token absent from Greek excerpt: "+w.witness_id+" "+token);
    }
    if ((w.sources??[]).length!==2 ||
        w.sources.some(s=>!/^https:\/\//.test(s.url)) ||
        !w.sources.some(s=>s.url.includes("greekbible.com")) ||
        !w.sources.some(s=>s.url.includes("version=KJV"))) {
      errors.push("missing source locator: "+w.witness_id);
    }
    if ((w.edges??[]).length!==1 ||
        w.edges[0].from!=="gospel-greek" || w.edges[0].to!=="kjv-english") {
      errors.push("missing explicit Greek-to-KJV edge: "+w.witness_id);
    }
    try {analyzeWitness(w);} catch(error) {errors.push(w.witness_id+": "+error.message);}
  }
  if (witnesses.length<8) errors.push("corpus must contain at least eight attested pairs");
  return {passed:errors.length===0,witness_count:witnesses.length,errors};
}

async function main() {
  const [mode,...args]=process.argv.slice(2);
  const witnesses=await loadCorpus();
  const check=validateCorpus(witnesses);
  if(!check.passed) throw new Error("corpus invalid: "+check.errors.join("; "));
  if (!mode || mode==="check") {
    console.log(JSON.stringify(check,null,2));
  } else if (mode==="report") {
    const output=witnesses.map(w=>{
      const a=analyzeWitness(w);
      return {
        witness_id:w.witness_id,verse:w.verse,
        greek_tokens:a.layers[0].metrics.token_count,
        english_tokens:a.layers[1].metrics.token_count,
        token_delta:a.edges[0].comparison.measured.token_count_delta,
        declared_structure_overlap:a.edges[0].comparison.declared_invariants.structure_tag_jaccard,
        caveat:"Structure overlap compares human annotations only; not independently detected translation fidelity."
      };
    });
    console.log(JSON.stringify(output,null,2));
  } else if (mode==="holdout") {
    const [id,target]=args;
    if(!id||!target) throw new Error("holdout requires witness ID suffix and target Greek string");
    const w=witnesses.find(w=>w.witness_id.endsWith(id.toUpperCase()));
    if(!w) throw new Error("unknown witness: "+id);
    console.log(JSON.stringify(heldOutTarget(witnesses,w.witness_id,target,"greek-milesian"),null,2));
  } else throw new Error("usage: corpus-cli.mjs check | report | holdout <id> <Greek target>");
}

if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  main().catch(error=>{console.error(error.message);process.exitCode=1;});
}
