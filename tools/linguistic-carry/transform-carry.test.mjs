import test from "node:test";
import assert from "node:assert/strict";
import { classifyRelation, analyzeStudy, validateStudy, CLASSIFICATIONS } from "./transform-carry.mjs";
import { loadTransformStudy } from "./transform-cli.mjs";

test("classifier distinguishes carry reveal projection loss and hold", () => {
  assert.equal(classifyRelation({source_support:"explicit",target_expression:"explicit",receiver_access_delta:"stable"}).classification, CLASSIFICATIONS.CARRY);
  assert.equal(classifyRelation({source_support:"licensed",target_expression:"explicit",receiver_access_delta:"gain"}).classification, CLASSIFICATIONS.REVEAL);
  assert.equal(classifyRelation({source_support:"ambiguous",target_expression:"explicit",receiver_access_delta:"gain"}).classification, CLASSIFICATIONS.PROJECTION);
  assert.equal(classifyRelation({source_support:"explicit",target_expression:"absent",receiver_access_delta:"loss"}).classification, CLASSIFICATIONS.LOSS);
  assert.equal(classifyRelation({source_support:"unresolved",target_expression:"explicit",receiver_access_delta:"unknown"}).classification, CLASSIFICATIONS.HOLD);
});

test("Living Bible study is twelve passages and never vendors target text", async () => {
  const study = await loadTransformStudy();
  const result = validateStudy(study);
  assert.equal(result.passed, true, result.errors.join("\n"));
  assert.equal(result.passage_count, 12);
  assert.equal(result.relation_count, 20);
  assert.equal(study.target.text_policy, "external-reference-only");
  for (const passage of study.passages) {
    assert.equal("text" in passage, false);
    assert.ok(passage.sources.some((source) => source.role.includes("TLB")));
    assert.ok(passage.sources.every((source) => !("text" in source)));
  }
});

test("seed study exercises all four substantive transformation classes", async () => {
  const report = analyzeStudy(await loadTransformStudy());
  assert.equal(report.counts.CARRY, 9);
  assert.equal(report.counts.REVEAL, 4);
  assert.equal(report.counts.PROJECTION, 3);
  assert.equal(report.counts.LOSS, 4);
  assert.equal(report.counts.HOLD, 0);
});

test("John 8:58 can carry prior-existence while losing the tense contrast", async () => {
  const report = analyzeStudy(await loadTransformStudy());
  const passage = report.passages.find((item) => item.id === "john-8-58");
  const byId = Object.fromEntries(passage.relations.map((relation) => [relation.id, relation]));
  assert.equal(byId["prior-existence"].classification, "CARRY");
  assert.equal(byId["become-i-am-tense-contrast"].classification, "LOSS");
});

test("Matthew 24:34 keeps loss distinct from interpretive projection", async () => {
  const report = analyzeStudy(await loadTransformStudy());
  const passage = report.passages.find((item) => item.id === "matthew-24-34");
  const byId = Object.fromEntries(passage.relations.map((relation) => [relation.id, relation]));
  assert.equal(byId["generation-referent"].classification, "LOSS");
  assert.equal(byId["age-closure-reading"].classification, "PROJECTION");
});

test("projection is not encoded as falsehood and reveal remains receiver-relative", async () => {
  const study = await loadTransformStudy();
  assert.ok(study.nonclaims.some((line) => line.includes("does not mean the interpretation is false")));
  assert.ok(study.nonclaims.some((line) => line.includes("receiver-relative")));
  const report = analyzeStudy(study);
  assert.match(report.authority_boundary, /do not become source-text facts/);
});

test("invalid declaration is refused instead of silently normalized", () => {
  assert.throws(
    () => classifyRelation({source_support:"certain",target_expression:"explicit",receiver_access_delta:"stable"}),
    /invalid source_support/
  );
});
