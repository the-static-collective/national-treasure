import test from "node:test";
import assert from "node:assert/strict";
import { analyzeLayer, analyzeWitness } from "./analyze.mjs";
import { buildRootPatternGraph, semanticNeighborhood } from "./root-pattern.mjs";
import { collisionGroups, uniformValueProbability } from "./collisions.mjs";

test("declared phonology is measured but never inferred", () => {
  const supplied = analyzeLayer({
    id: "p",
    text: "word",
    phonology: {
      phonemes: ["k", "a", "t", "a"],
      syllable_count: 2,
      source: "researcher-supplied"
    }
  });
  assert.equal(supplied.phonology.phoneme_count, 4);
  assert.equal(supplied.phonology.unique_phoneme_count, 3);
  assert.equal(supplied.phonology.syllable_count, 2);
  const absent = analyzeLayer({ id: "q", text: "word" });
  assert.equal(absent.phonology, null);
});

test("explicit witness edges are typed and compared", () => {
  const result = analyzeWitness({
    layers: [
      { id: "a", text: "first last", annotations: { structure_tags: ["contrast"] } },
      { id: "b", text: "last first", annotations: { structure_tags: ["contrast"] } }
    ],
    edges: [
      { from: "a", to: "b", type: "translation", evidence_class: "observed" }
    ]
  });
  assert.equal(result.edges[0].edge.type, "translation");
  assert.equal(result.edges[0].comparison.declared_invariants.structure_tag_jaccard, 1);
});

test("unknown edge endpoints fail closed", () => {
  assert.throws(() => analyzeWitness({
    layers: [{ id: "a", text: "x" }],
    edges: [{ from: "a", to: "missing", type: "hypothesis" }]
  }), /unknown layer/);
});

test("root-pattern graph reports bipartite degrees", () => {
  const entries = [
    { root: "KTB", pattern: "CaCaC", form: "katab", semantic_tags: ["writing"] },
    { root: "KTB", pattern: "miCCaC", form: "miktab", semantic_tags: ["writing", "artifact"] },
    { root: "GDR", pattern: "CaCaC", form: "gadar", semantic_tags: ["boundary"] }
  ];
  const graph = buildRootPatternGraph(entries);
  const ktb = graph.roots.find((r) => r.root === "KTB");
  assert.equal(graph.root_count, 2);
  assert.equal(graph.pattern_count, 2);
  assert.equal(graph.edge_count, 3);
  assert.equal(ktb.degree, 2);
  assert.equal(semanticNeighborhood(entries, "KTB").form_count, 2);
});

test("collision lab finds cross-system equality without assigning meaning", () => {
  const groups = collisionGroups([
    { id: "he", text: "חי", system: "hebrew-standard" },
    { id: "gr", text: "ιη", system: "greek-milesian" },
    { id: "other", text: "א", system: "hebrew-standard" }
  ]);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].total, 18);
  assert.equal(groups[0].items.length, 2);
});

test("uniform null model returns bounded probability", () => {
  const result = uniformValueProbability("hebrew-standard", 2, 18);
  assert.ok(result.matching_strings > 0n);
  assert.ok(result.probability > 0 && result.probability < 1);
});
