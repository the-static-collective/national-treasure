import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { numericOverlay, stripMarks, tokenize } from "./analyze.mjs";
import { profileFromLayers, weightedValueProbability } from "./frequency-null.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const defaultReferenceDir = path.join(root, "reference");
const STRATA = new Set(["gospel", "non-gospel"]);

export function sha256(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export function canonicalGreekLetters(text = "") {
  return [...stripMarks(String(text)).toLocaleLowerCase()]
    .map((letter) => (letter === "ς" ? "σ" : letter))
    .filter((letter) => /\p{Script=Greek}/u.test(letter))
    .join("");
}

export async function loadReferenceCorpus(referenceDir = defaultReferenceDir) {
  const manifestText = await fs.readFile(path.join(referenceDir, "manifest.json"), "utf8");
  const recordsText = await fs.readFile(path.join(referenceDir, "rp2018-sample.jsonl"), "utf8");
  const records = recordsText.trim().split("\n").filter(Boolean).map((line) => JSON.parse(line));
  return { manifest: JSON.parse(manifestText), records, recordsText };
}

export function validateReferenceCorpus(manifest, records, recordsText, targetWitnesses = []) {
  const errors = [];
  if (manifest?.schema !== "national-treasure.linguistic-carry.reference-corpus.v1") {
    errors.push("unknown reference manifest schema");
  }
  if (!/^[0-9a-f]{40}$/.test(manifest?.source?.commit ?? "")) {
    errors.push("source commit must be an exact 40-character SHA");
  }
  if (!/^https:\/\//.test(manifest?.source?.repository ?? "") ||
      !/^https:\/\//.test(manifest?.source?.license_url ?? "")) {
    errors.push("source repository and license locators are required");
  }
  if (manifest?.selection?.algorithm !== "sha256-rank-v1" || !manifest?.selection?.seed) {
    errors.push("selection algorithm and seed must be declared");
  }
  if (!Array.isArray(manifest?.source?.files) || !manifest.source.files.length ||
      manifest.source.files.some((file) => !file.path || !/^[0-9a-f]{64}$/.test(file.sha256 ?? ""))) {
    errors.push("every upstream source file needs a path and SHA-256 receipt");
  }
  if (manifest?.artifact?.record_count !== records.length) {
    errors.push("record count differs from manifest");
  }
  if (recordsText !== undefined && manifest?.artifact?.sha256 !== sha256(recordsText)) {
    errors.push("reference artifact SHA-256 differs from manifest");
  }

  const ids = new Set();
  const locators = new Set();
  const normalizedTexts = new Set();
  const stratumCounts = { gospel: 0, "non-gospel": 0 };
  for (const record of records) {
    if (!record.id || ids.has(record.id)) errors.push(`duplicate/missing record id: ${record.id}`);
    if (!record.locator || locators.has(record.locator)) errors.push(`duplicate/missing locator: ${record.locator}`);
    ids.add(record.id);
    locators.add(record.locator);
    if (!STRATA.has(record.stratum)) errors.push(`unknown stratum: ${record.stratum}`);
    else stratumCounts[record.stratum] += 1;
    const normalized = canonicalGreekLetters(record.text);
    if (!normalized) errors.push(`record has no Greek letters: ${record.id}`);
    normalizedTexts.add(normalized);
    if (!/^https:\/\//.test(record.source_url ?? "")) errors.push(`record lacks source URL: ${record.id}`);
  }

  for (const [stratum, expected] of Object.entries(manifest?.selection?.strata ?? {})) {
    if (stratumCounts[stratum] !== expected) {
      errors.push(`${stratum} count ${stratumCounts[stratum]} differs from declared ${expected}`);
    }
  }
  for (const target of manifest?.selection?.excluded_targets ?? []) {
    if (locators.has(target.locator)) errors.push(`excluded target locator leaked into reference: ${target.locator}`);
    if (normalizedTexts.has(target.normalized_text)) errors.push(`excluded target text leaked into reference: ${target.verse}`);
    if (sha256(target.normalized_text ?? "") !== target.normalized_text_sha256) {
      errors.push(`excluded target hash is inconsistent: ${target.verse}`);
    }
  }
  for (const witness of targetWitnesses) {
    const greek = witness.layers?.find((layer) => layer.language === "grc");
    const normalized = canonicalGreekLetters(greek?.text ?? "");
    if (normalized && normalizedTexts.has(normalized)) {
      errors.push(`target witness text contaminates reference: ${witness.witness_id}`);
    }
  }

  return {
    passed: errors.length === 0,
    errors,
    record_count: records.length,
    stratum_counts: stratumCounts,
    artifact_sha256: recordsText === undefined ? null : sha256(recordsText)
  };
}

function selectRecords(records, stratum) {
  if (!stratum || stratum === "all") return records;
  if (!STRATA.has(stratum)) throw new Error(`unknown reference stratum: ${stratum}`);
  return records.filter((record) => record.stratum === stratum);
}

export function referenceProfile(records, { stratum = "all" } = {}) {
  const selected = selectRecords(records, stratum);
  const profile = profileFromLayers(
    selected.map((record) => ({ id: record.id, text: record.text })),
    "greek-milesian"
  );
  return {
    ...profile,
    stratum,
    record_count: selected.length,
    nonclaim:
      "This profile describes a deterministic sample from one declared Greek edition. It is not a universal model of Koine Greek, Gospel speech, or historical pronunciation."
  };
}

function candidatesForRecord(record, targetLength, mode) {
  if (mode === "word") {
    return tokenize(record.text)
      .map(canonicalGreekLetters)
      .filter((token) => token.length === targetLength);
  }
  if (mode === "window") {
    const letters = canonicalGreekLetters(record.text);
    return Array.from(
      { length: Math.max(0, letters.length - targetLength + 1) },
      (_, index) => letters.slice(index, index + targetLength)
    );
  }
  throw new Error(`unknown empirical mode: ${mode}`);
}

export function empiricalValueNull(records, targetText, { stratum = "all", mode = "word" } = {}) {
  const normalizedTarget = canonicalGreekLetters(targetText);
  const target = numericOverlay(normalizedTarget, "greek-milesian");
  if (!normalizedTarget || !target || target.ignored_letters.length) {
    throw new Error("target must contain mappable Greek letters");
  }
  const selected = selectRecords(records, stratum);
  let candidateCount = 0;
  let matchingCount = 0;
  const examples = [];
  for (const record of selected) {
    for (const candidate of candidatesForRecord(record, normalizedTarget.length, mode)) {
      candidateCount += 1;
      if (numericOverlay(candidate, "greek-milesian").total === target.total) {
        matchingCount += 1;
        if (examples.length < 12) examples.push({ text: candidate, verse: record.verse, locator: record.locator });
      }
    }
  }
  if (!candidateCount) throw new Error(`no ${mode} candidates of length ${normalizedTarget.length} in ${stratum}`);
  return {
    model: mode === "word"
      ? "attested same-length word collision rate"
      : "attested same-length within-verse character-window collision rate",
    stratum,
    reference_record_count: selected.length,
    target_text: targetText,
    normalized_target: normalizedTarget,
    target_length: normalizedTarget.length,
    target_value: target.total,
    matching_count: matchingCount,
    candidate_count: candidateCount,
    probability: matchingCount / candidateCount,
    examples,
    nonclaim:
      "An empirical collision rate measures recurrence under this sample and candidate rule. It does not test authorial intent, semantic equivalence, theological significance, or a hidden-code hypothesis."
  };
}

export function stressTarget(records, targetText) {
  const strata = ["gospel", "non-gospel", "all"];
  const results = Object.fromEntries(strata.map((stratum) => [stratum, {
    word: empiricalValueNull(records, targetText, { stratum, mode: "word" }),
    window: empiricalValueNull(records, targetText, { stratum, mode: "window" })
  }]));
  const profile = referenceProfile(records);
  const target = numericOverlay(canonicalGreekLetters(targetText), "greek-milesian");
  return {
    target_text: targetText,
    target_value: target.total,
    target_length: target.counted_letters,
    empirical: results,
    iid_character: weightedValueProbability(
      "greek-milesian",
      target.counted_letters,
      target.total,
      profile.frequencies
    ),
    pressure:
      "Treat changes across genre strata and candidate rules as model sensitivity, not as noise to be averaged away."
  };
}

