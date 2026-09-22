import test from "node:test";
import assert from "node:assert/strict";
import {
  analyzeLayer,
  compareLayers,
  jaccard,
  mirrorScore,
  numericOverlay,
  shannonEntropy,
  tokenize
} from "./analyze.mjs";

test("tokenize preserves Greek and Hebrew words", () => {
  assert.deepEqual(tokenize("Σήμερον γραφὴ"), ["Σήμερον", "γραφὴ"]);
  assert.deepEqual(tokenize("שמע ישראל"), ["שמע", "ישראל"]);
});

test("Shannon entropy is exact for a balanced binary sample", () => {
  assert.equal(shannonEntropy(["a", "a", "b", "b"]), 1);
});

test("mirror score detects exact lexical inversion symmetry", () => {
  assert.equal(mirrorScore(["first", "last", "last", "first"]), 1);
  assert.equal(mirrorScore(["first", "last", "first", "last"]), 0);
});

test("Jaccard handles declared invariant tags", () => {
  assert.equal(jaccard(["parallelism", "inversion"], ["inversion", "deixis"]), 1 / 3);
  assert.equal(jaccard([], []), null);
});

test("Hebrew and Greek numeric overlays calculate without assigning meaning", () => {
  const hebrew = numericOverlay("חי", "hebrew-standard");
  const greek = numericOverlay("ιη", "greek-milesian");
  assert.equal(hebrew.total, 18);
  assert.equal(greek.total, 18);
  assert.match(hebrew.evidence_warning, /does not establish/i);
});

test("layer analysis does not invent annotations", () => {
  const layer = analyzeLayer({
    id: "x",
    language: "grc",
    text: "πρὶν Ἀβραὰμ γενέσθαι ἐγὼ εἰμί"
  });
  assert.deepEqual(layer.annotations.structure_tags, []);
  assert.equal(layer.annotations.morphology, null);
  assert.equal(layer.metrics.token_count, 5);
});

test("cross-layer comparison uses only declared tags for invariant scores", () => {
  const comparison = compareLayers(
    {
      id: "a",
      text: "first last last first",
      annotations: {
        structure_tags: ["inversion", "parallelism"],
        semantic_tags: ["rank-reversal"]
      }
    },
    {
      id: "b",
      text: "last first first last",
      annotations: {
        structure_tags: ["inversion", "parallelism"],
        semantic_tags: ["rank-reversal"]
      }
    }
  );
  assert.equal(comparison.declared_invariants.structure_tag_jaccard, 1);
  assert.equal(comparison.declared_invariants.semantic_tag_jaccard, 1);
});
