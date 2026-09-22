import test from "node:test";
import assert from "node:assert/strict";
import { loadCorpus } from "./corpus-cli.mjs";
import {
  canonicalGreekLetters,
  empiricalValueNull,
  loadReferenceCorpus,
  referenceProfile,
  sha256,
  stressTarget,
  validateReferenceCorpus
} from "./reference-corpus.mjs";

test("LC-004 reference corpus has a pinned source and two 256-verse strata", async () => {
  const { manifest, records, recordsText } = await loadReferenceCorpus();
  const witnesses = await loadCorpus();
  const result = validateReferenceCorpus(manifest, records, recordsText, witnesses);
  assert.equal(result.passed, true, result.errors.join("\n"));
  assert.equal(result.record_count, 512);
  assert.deepEqual(result.stratum_counts, { gospel: 256, "non-gospel": 256 });
  assert.match(manifest.source.commit, /^[0-9a-f]{40}$/);
  assert.equal(manifest.artifact.sha256, sha256(recordsText));
  assert.equal(manifest.selection.algorithm, "sha256-rank-v1");
});

test("all eight target locators remain outside the reference sample", async () => {
  const { manifest, records } = await loadReferenceCorpus();
  const locators = new Set(records.map((record) => record.locator));
  assert.equal(manifest.selection.excluded_targets.length, 8);
  for (const target of manifest.selection.excluded_targets) {
    assert.equal(locators.has(target.locator), false, target.locator);
    assert.equal(sha256(target.normalized_text), target.normalized_text_sha256);
  }
});

test("reference validation detects artifact tampering and target contamination", async () => {
  const { manifest, records, recordsText } = await loadReferenceCorpus();
  const witnesses = await loadCorpus();
  const tamperedText = recordsText.replace(records[0].text, `${records[0].text} α`);
  const tampered = validateReferenceCorpus(manifest, records, tamperedText, witnesses);
  assert.equal(tampered.passed, false);
  assert.ok(tampered.errors.some((error) => error.includes("artifact SHA-256")));

  const firstTarget = manifest.selection.excluded_targets[0];
  const contaminatedRecords = records.concat({
    ...records[0],
    id: "contaminated-target",
    locator: firstTarget.locator,
    text: firstTarget.normalized_text
  });
  const contaminated = validateReferenceCorpus(
    { ...manifest, artifact: { ...manifest.artifact, record_count: contaminatedRecords.length } },
    contaminatedRecords
  );
  assert.equal(contaminated.passed, false);
  assert.ok(contaminated.errors.some((error) => error.includes("excluded target locator")));
  assert.ok(contaminated.errors.some((error) => error.includes("excluded target text")));
});

test("empirical word null counts actual same-length collisions", () => {
  const records = [
    { id: "one", locator: "one", stratum: "gospel", verse: "X 1:1", text: "αβ βα αα", source_url: "https://example.test/one" },
    { id: "two", locator: "two", stratum: "non-gospel", verse: "Y 1:1", text: "ββ γ", source_url: "https://example.test/two" }
  ];
  const result = empiricalValueNull(records, "αβ", { mode: "word" });
  assert.equal(result.target_length, 2);
  assert.equal(result.candidate_count, 4);
  assert.equal(result.matching_count, 2);
  assert.equal(result.probability, 0.5);
});

test("word and window nulls keep their candidate universes distinct", async () => {
  const { records } = await loadReferenceCorpus();
  const word = empiricalValueNull(records, "Σήμερον", { mode: "word" });
  const window = empiricalValueNull(records, "Σήμερον", { mode: "window" });
  assert.equal(word.target_value, 473);
  assert.ok(word.candidate_count > 500);
  assert.ok(window.candidate_count > word.candidate_count);
  assert.ok(word.examples.some((example) => example.text === "σημερον"));
});

test("stress report exposes genre sensitivity rather than hiding it", async () => {
  const { records } = await loadReferenceCorpus();
  const result = stressTarget(records, "Σήμερον");
  assert.equal(result.empirical.gospel.word.reference_record_count, 256);
  assert.equal(result.empirical["non-gospel"].word.reference_record_count, 256);
  assert.equal(result.empirical.all.word.reference_record_count, 512);
  assert.notEqual(
    result.empirical.gospel.word.probability,
    result.empirical["non-gospel"].word.probability
  );
  assert.match(result.pressure, /model sensitivity/);
});

test("reference profile is larger than the eight-witness proof corpus", async () => {
  const { records } = await loadReferenceCorpus();
  const profile = referenceProfile(records);
  assert.equal(profile.record_count, 512);
  assert.ok(profile.observed_letter_count > 30_000);
  assert.equal(canonicalGreekLetters("Σήμερον ς"), "σημερονσ");
});

