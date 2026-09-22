import { numericOverlay } from "./analyze.mjs";

const HEBREW_CANONICAL = [..."אבגדהוזחטיכלמנסעפצקרשת"];
const GREEK_CANONICAL = [..."αβγδεζηθικλμνξοπρστυφχψω"];

function alphabet(system) {
  if (system === "hebrew-standard") return HEBREW_CANONICAL;
  if (system === "greek-milesian") return GREEK_CANONICAL;
  throw new Error(`unsupported numeric system: ${system}`);
}

export function collisionGroups(items = []) {
  const groups = new Map();
  for (const item of items) {
    const overlay = numericOverlay(item.text ?? "", item.system);
    if (!overlay) throw new Error(`unsupported numeric system: ${item.system}`);
    const key = overlay.total;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({
      id: item.id ?? null,
      text: item.text ?? "",
      system: item.system,
      total: overlay.total
    });
  }
  return [...groups.entries()]
    .filter(([, values]) => values.length > 1)
    .map(([total, values]) => ({ total, items: values }))
    .sort((a, b) => a.total - b.total);
}

export function uniformValueDistribution(system, length) {
  if (!Number.isInteger(length) || length < 0) {
    throw new Error("length must be a non-negative integer");
  }
  const letters = alphabet(system);
  const values = letters.map((letter) => numericOverlay(letter, system).total);
  let dist = new Map([[0, 1n]]);
  for (let i = 0; i < length; i += 1) {
    const next = new Map();
    for (const [sum, count] of dist) {
      for (const value of values) {
        next.set(sum + value, (next.get(sum + value) ?? 0n) + count);
      }
    }
    dist = next;
  }
  return {
    system,
    length,
    alphabet_size: letters.length,
    total_strings: BigInt(letters.length) ** BigInt(length),
    counts: dist
  };
}

export function uniformValueProbability(system, length, total) {
  const distribution = uniformValueDistribution(system, length);
  const count = distribution.counts.get(total) ?? 0n;
  return {
    system,
    length,
    total,
    matching_strings: count,
    total_strings: distribution.total_strings,
    probability: Number(count) / Number(distribution.total_strings),
    nonclaim:
      "This is a uniform-character null model, not a natural-language model. Real letter frequencies and phonotactics are non-uniform."
  };
}
