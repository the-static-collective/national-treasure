import test from "node:test";
import assert from "node:assert/strict";
import { loadCorpus, validateCorpus } from "./corpus-cli.mjs";
import { profileFromLayers, weightedValueProbability, heldOutTarget } from "./frequency-null.mjs";
import { analyzeWitness } from "./analyze.mjs";

test("eight attested Greek/KJV pairs have source locators and token-anchored morphology",async()=>{
 const corpus=await loadCorpus();
 const r=validateCorpus(corpus);
 assert.equal(r.passed,true,r.errors.join("\n"));
 assert.equal(r.witness_count,8);
 for(const w of corpus) {
   const result=analyzeWitness(w);
   assert.equal(result.edges.length,1);
   assert.equal(result.edges[0].edge.type,"translation-comparison");
 }
});

test("frequency profile explicitly excludes the target witness",()=>{
 const p=profileFromLayers([{id:"target",text:"ααα"},{id:"reference",text:"ββ"}],"greek-milesian",{excludeIds:["target"]});
 assert.equal(p.frequencies.α,0);
 assert.equal(p.frequencies.β,2);
 assert.deepEqual(p.source_layer_ids,["reference"]);
 assert.deepEqual(p.excluded_layer_ids,["target"]);
});

test("frequency profile normalizes Greek accents and final sigma",()=>{
 const p=profileFromLayers([{id:"x",text:"Σήμερον ς"}],"greek-milesian");
 assert.equal(p.frequencies.σ,2);
 assert.equal(p.frequencies.η,1);
});

test("weighted exact null gives 1/2 on two equally likely letters for value 3",()=>{
 const result=weightedValueProbability("greek-milesian",2,3,{α:1,β:1});
 assert.equal(result.matching_weight,"2");
 assert.equal(result.total_weight,"4");
 assert.equal(result.probability,.5);
});

test("weighted null rejects missing/noninteger profile and unreasonable length",()=>{
 assert.throws(()=>weightedValueProbability("greek-milesian",2,3,{}),/empty/);
 assert.throws(()=>weightedValueProbability("greek-milesian",2,3,{α:0.3}),/safe integers/);
 assert.throws(()=>weightedValueProbability("greek-milesian",99,3,{α:1}),/between 0 and 32/);
});

test("held-out Greek target does not train on itself",async()=>{
 const corpus=await loadCorpus();
 const w=corpus.find(w=>w.verse==="Luke 4:21");
 const result=heldOutTarget(corpus,w.witness_id,"Σήμερον","greek-milesian");
 assert.ok(result.profile.observed_letter_count>0);
 assert.ok(!result.profile.source_layer_ids.includes(w.witness_id));
 assert.ok(result.null.probability>=0 && result.null.probability<=1);
});

test("no Aramaic original is invented in the attested corpus",async()=>{
 const corpus=await loadCorpus();
 for(const w of corpus) {
   assert.ok(w.layers.every(l=>l.language!=="arc"));
   assert.ok(w.nonclaims.some(s=>s.includes("Aramaic")));
 }
});

test("negative control preserves the Greek/KJV immediately distinction",async()=>{
 const corpus=await loadCorpus();
 const w=corpus.find(w=>w.verse==="Luke 19:40");
 assert.equal(w.variants.length,1);
 assert.ok(!w.layers[0].text.includes("εὐθύς"));
 assert.match(w.layers[1].text,/immediately/);
 assert.match(w.layers[0].annotations.provenance_note,/no standalone adverb/i);
});
