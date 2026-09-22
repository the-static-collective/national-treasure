const HEBREW_VALUES = new Map(Object.entries({
  א:1, ב:2, ג:3, ד:4, ה:5, ו:6, ז:7, ח:8, ט:9,
  י:10, כ:20, ך:20, ל:30, מ:40, ם:40, נ:50, ן:50,
  ס:60, ע:70, פ:80, ף:80, צ:90, ץ:90,
  ק:100, ר:200, ש:300, ת:400
}));

const GREEK_VALUES = new Map(Object.entries({
  α:1, β:2, γ:3, δ:4, ε:5, ϛ:6, ϝ:6, ζ:7, η:8, θ:9,
  ι:10, κ:20, λ:30, μ:40, ν:50, ξ:60, ο:70, π:80, ϟ:90,
  ρ:100, σ:200, ς:200, τ:300, υ:400, φ:500, χ:600, ψ:700,
  ω:800, ϡ:900
}));

export function tokenize(text = "") {
  return String(text).normalize("NFC").match(/[\p{L}\p{M}\p{N}]+/gu) ?? [];
}

export function stripMarks(text = "") {
  return String(text).normalize("NFD").replace(/\p{M}+/gu, "").normalize("NFC");
}

export function shannonEntropy(items = []) {
  if (!items.length) return 0;
  const counts = new Map();
  for (const item of items) counts.set(item, (counts.get(item) ?? 0) + 1);
  let h = 0;
  for (const count of counts.values()) {
    const p = count / items.length;
    h -= p * Math.log2(p);
  }
  return h;
}

export function mirrorScore(tokens = []) {
  if (tokens.length < 2) return tokens.length === 1 ? 1 : 0;
  let matched = 0;
  let compared = 0;
  for (let i = 0; i < Math.floor(tokens.length / 2); i += 1) {
    compared += 1;
    if (tokens[i].toLocaleLowerCase() === tokens[tokens.length - 1 - i].toLocaleLowerCase()) {
      matched += 1;
    }
  }
  return compared ? matched / compared : 0;
}

export function jaccard(left = [], right = []) {
  const a = new Set(left);
  const b = new Set(right);
  if (!a.size && !b.size) return null;
  const intersection = [...a].filter((item) => b.has(item)).length;
  const union = new Set([...a, ...b]).size;
  return union ? intersection / union : null;
}

function numericMap(system) {
  if (system === "hebrew-standard") return HEBREW_VALUES;
  if (system === "greek-milesian") return GREEK_VALUES;
  return null;
}

export function numericOverlay(text, system) {
  const values = numericMap(system);
  if (!values) return null;

  const normalized = stripMarks(String(text)).toLocaleLowerCase();
  let total = 0;
  let countedLetters = 0;
  const ignoredLetters = [];

  for (const ch of normalized) {
    if (!/\p{L}/u.test(ch)) continue;
    if (values.has(ch)) {
      total += values.get(ch);
      countedLetters += 1;
    } else {
      ignoredLetters.push(ch);
    }
  }

  return {
    system,
    total,
    counted_letters: countedLetters,
    ignored_letters: [...new Set(ignoredLetters)],
    evidence_warning:
      "Alphabetic-number equality is a measurement only. A collision does not establish semantic relation, ancestry, intention, or theological significance."
  };
}

export function analyzeLayer(layer = {}) {
  const tokens = tokenize(layer.text);
  const lowered = tokens.map((token) => token.toLocaleLowerCase());
  const unique = new Set(lowered);
  const entropy = shannonEntropy(lowered);
  const maxEntropy = unique.size > 1 ? Math.log2(unique.size) : 0;
  const letters = [...stripMarks(layer.text ?? "")].filter((ch) => /\p{L}/u.test(ch));

  return {
    id: layer.id ?? null,
    language: layer.language ?? null,
    script: layer.script ?? null,
    witness_class: layer.witness_class ?? "unspecified",
    text: layer.text ?? "",
    annotations: {
      structure_tags: layer.annotations?.structure_tags ?? [],
      semantic_tags: layer.annotations?.semantic_tags ?? [],
      morphology: layer.annotations?.morphology ?? null,
      provenance_note: layer.annotations?.provenance_note ?? null
    },
    metrics: {
      token_count: lowered.length,
      unique_token_count: unique.size,
      lexical_repetition_ratio:
        lowered.length ? (lowered.length - unique.size) / lowered.length : 0,
      token_entropy_bits: entropy,
      normalized_token_entropy:
        maxEntropy > 0 ? entropy / maxEntropy : lowered.length ? 0 : null,
      letter_count: letters.length,
      mirror_score: mirrorScore(lowered)
    },
    numeric_overlay: layer.numeric_system
      ? numericOverlay(layer.text ?? "", layer.numeric_system)
      : null
  };
}

export function compareLayers(left, right) {
  const a = analyzeLayer(left);
  const b = analyzeLayer(right);
  return {
    from: a.id,
    to: b.id,
    measured: {
      token_count_delta: b.metrics.token_count - a.metrics.token_count,
      letter_count_delta: b.metrics.letter_count - a.metrics.letter_count,
      token_entropy_delta:
        b.metrics.token_entropy_bits - a.metrics.token_entropy_bits,
      mirror_score_delta: b.metrics.mirror_score - a.metrics.mirror_score
    },
    declared_invariants: {
      structure_tag_jaccard: jaccard(
        a.annotations.structure_tags,
        b.annotations.structure_tags
      ),
      semantic_tag_jaccard: jaccard(
        a.annotations.semantic_tags,
        b.annotations.semantic_tags
      )
    },
    nonclaim:
      "Shared metrics or tags do not establish historical dependence, translation ancestry, authorial intent, or semantic equivalence."
  };
}

export function analyzeWitness(input = {}) {
  const layers = input.layers ?? [];
  return {
    witness_id: input.witness_id ?? null,
    title: input.title ?? null,
    authority: input.authority ?? "measurement only",
    layers: layers.map(analyzeLayer),
    adjacent_comparisons: layers.slice(0, -1).map((layer, index) =>
      compareLayers(layer, layers[index + 1])
    ),
    nonclaims: [
      "The analyzer does not infer historical source language.",
      "The analyzer does not reconstruct Aramaic or Hebrew originals.",
      "The analyzer does not infer morphology or semantics from raw text.",
      "Numeric overlays are optional measurements and never evidence of meaning by themselves."
    ]
  };
}
