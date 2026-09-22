import { numericOverlay, stripMarks } from "./analyze.mjs";

const ALPHABETS = Object.freeze({
  "hebrew-standard": [..."אבגדהוזחטיכלמנסעפצקרשת"],
  "greek-milesian": [..."αβγδεζηθικλμνξοπρστυφχψω"]
});

function canonicalLetter(char, system) {
  const bare = stripMarks(char).toLocaleLowerCase();
  return system === "greek-milesian" && bare === "ς" ? "σ" : bare;
}

function validateSystem(system) {
  if (!Object.hasOwn(ALPHABETS, system)) throw new Error("unsupported numeric system: " + system);
  return ALPHABETS[system];
}

function assertProfile(profile, system) {
  const letters = validateSystem(system);
  if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
    throw new Error("profile must be a letter-count object");
  }
  const allowed = new Set(letters);
  const counts = new Map(letters.map(letter => [letter, 0n]));
  for (const [letter, value] of Object.entries(profile)) {
    if (!allowed.has(letter)) throw new Error("unexpected profile letter: " + letter);
    if (!Number.isSafeInteger(value) || value < 0) throw new Error("letter frequencies must be nonnegative safe integers");
    counts.set(letter, BigInt(value));
  }
  if (![...counts.values()].some(value => value > 0n)) throw new Error("profile is empty");
  return counts;
}

export function profileFromLayers(layers, system, {excludeIds=[]}={}) {
  const letters = validateSystem(system);
  const counts = Object.fromEntries(letters.map(letter => [letter, 0]));
  const excluded = new Set(excludeIds);
  const sourceIds = [];
  const ignored = new Set();
  for (const layer of layers) {
    if (excluded.has(layer.id)) continue;
    if (!layer.id || typeof layer.text !== "string") throw new Error("each source layer needs id and text");
    sourceIds.push(layer.id);
    for (const ch of layer.text) {
      if (!/\p{L}/u.test(ch)) continue;
      const letter = canonicalLetter(ch, system);
      if (Object.hasOwn(counts, letter)) counts[letter] += 1;
      else ignored.add(letter);
    }
  }
  return {
    system,
    frequencies: counts,
    observed_letter_count: Object.values(counts).reduce((a,b)=>a+b,0),
    source_layer_ids: sourceIds,
    excluded_layer_ids: [...excluded],
    ignored_letters: [...ignored],
    nonclaim: "This is an empirical character-frequency profile of ONLY the supplied sample. It is not a representative language, era, genre, or phonotactic model."
  };
}

export function weightedValueProbability(system, length, target, profile) {
  if (!Number.isInteger(length) || length < 0 || length > 32) {
    throw new Error("length must be an integer between 0 and 32");
  }
  if (!Number.isSafeInteger(target) || target < 0) throw new Error("target must be a nonnegative safe integer");
  const counts = assertProfile(profile, system);
  const weightedLetters = [...counts.entries()]
    .filter(([,weight]) => weight > 0n)
    .map(([letter,weight]) => [numericOverlay(letter,system).total,weight]);
  let dist = new Map([[0,1n]]);
  for (let i=0;i<length;i++) {
    const next=new Map();
    for (const [sum,mass] of dist) for (const [value,weight] of weightedLetters) {
      const result=sum+value;
      if (result<=target) next.set(result,(next.get(result)??0n)+mass*weight);
    }
    dist=next;
  }
  const totalWeight=[...counts.values()].reduce((a,b)=>a+b,0n);
  const numerator=dist.get(target)??0n;
  const denominator=totalWeight**BigInt(length);
  return {
    system,length,target,
    matching_weight:numerator.toString(),
    total_weight:denominator.toString(),
    probability:Number(numerator)/Number(denominator),
    model:"independent character draws with empirical frequency weights",
    nonclaim:"This is a small-corpus iid character null, NOT a language-level significance test; it ignores phonotactics, semantics, word selection, historical spelling, and multiple-comparison effects."
  };
}

export function heldOutTarget(witnesses, witnessId, text, system) {
  const target=numericOverlay(text,system);
  if (!target || target.ignored_letters.length || !target.counted_letters) {
    throw new Error("target must contain only valid mapped letters and at least one letter");
  }
  const layers=witnesses.flatMap(w=>(w.layers??[]).filter(l =>
    (system==="greek-milesian" ? l.language==="grc" : l.language==="he") &&
    l.id==="gospel-greek"
  ).map(l=>({...l,id:w.witness_id})));
  const profile=profileFromLayers(layers,system,{excludeIds:[witnessId]});
  if (!profile.observed_letter_count) throw new Error("no held-out reference data");
  return {
    witness_id:witnessId, target_text:text, value:target.total,profile,
    null:weightedValueProbability(system,target.counted_letters,target.total,profile.frequencies)
  };
}
