# Cicada Overfit Corpus v0.1

This case turns one useful property of Cicada-style investigation into an epistemic fuzz-test: mixed-media clues can be genuinely compelling while still failing to establish the historical or authority edge a solver wants to infer.

The corpus is **not** a reconstruction of Cicada 3301 and does not claim to identify its authors. The packets are synthetic or fixture-declared so unresolved public history is not smuggled into test truth.

## What it tests

A strong pass should be able to do both at once:

- preserve real structure, resemblance, re-encoding, influence, contradiction, shared precursors, or witnessed plural ancestry when the fixture supports them;
- keep unsupported ancestry, authenticity, or authority claims at `UNKNOWN` / `REFUSED_ANCESTRY` rather than upgrading them because the chain is aesthetically satisfying.

That is why at least half the corpus must mix classified edges with durable refusal/unknown edges. Blanket belief fails. Blanket skepticism also fails.

The corpus now also contains one deliberately matched pair for **mixed descent versus independent recurrence**:

```text
A ---witnessed ancestry---\
                           > D
B ---witnessed ancestry---/

versus

P ---same visible feature--- Q
          no witnessed road
```

The first packet preserves two independently witnessed incoming ancestry edges to one descendant. The second preserves the resemblance while refusing ancestry because no transmission bridge exists. The pair is intentionally represented with the existing relation grammar; it does **not** add `MIXED_ANCESTRY` or another catch-all relation.

## Cicada rule

```text
MYSTERY SURFACE
  strange / symbolic / optional

VERIFICATION SURFACE
  canonical bytes / hashes / signatures / receipts / source locators

AUTHORITY SURFACE
  explicit admission law / constituted actor / bounded capability
```

The corpus pressures transitions between those surfaces. It never collapses them.

## Files

- `SCHEMA.md` — fixture fields, enums, relation vocabulary, corpus invariants.
- `validate.mjs` — dependency-free structural validator.
- `validate.test.mjs` — malformed-fixture, whole-corpus, and matched-pair tests.
- `fixtures/co-001.json` … `co-014.json` — fourteen adversarial packets.

The validator checks structure only. It does not use an LLM, score free-form prose, infer history, or decide whether external evidence is true.

## Run

```text
node --test cases/cicada-overfit/validate.test.mjs
```

## Incubator boundary

The relation grammar remains a National Treasure design vocabulary, not adopted cross-project law. The Overfit Corpus supplies a materially stronger adversarial specimen for that vocabulary; it does not itself graduate anything into Project0, TranchNode, Corpus OS, Toaster, or shared runtime machinery.

The matched pair proves only that the existing grammar can represent the fixture-declared distinction between witnessed plural ancestry and unsupported recurrence. It does not make the validator a historical genealogy engine.
