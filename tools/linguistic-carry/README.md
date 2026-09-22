# Linguistic Carry

A bounded measurement tool for asking what survives when a saying crosses language carriers.

It is designed for layered witnesses such as:

```text
earlier scriptural language
    ↓
possible spoken language
    ↓
Gospel Greek
    ↓
later translation
```

It does **not** reconstruct missing source languages, infer authorial intent, or decide whether two texts are historically dependent.

## What it measures

For each supplied text layer:

- token count and unique-token count;
- lexical repetition ratio;
- Shannon entropy over the observed token distribution;
- letter count;
- a deliberately simple lexical mirror score;
- optional declared structure/semantic tags;
- optional Hebrew standard or Greek Milesian alphabetic-number totals.

Across adjacent layers it compares:

- deltas in token count, letter count, entropy, and mirror score;
- Jaccard overlap of **human-declared** structural tags;
- Jaccard overlap of **human-declared** semantic tags.

The analyzer refuses to infer morphology or semantics from raw strings. Those belong in annotations with provenance.

## Run

```bash
node tools/linguistic-carry/cli.mjs tools/linguistic-carry/fixtures/luke-4-21.json
```

or:

```bash
cat witness.json | node tools/linguistic-carry/cli.mjs
```

Tests:

```bash
node --test tools/linguistic-carry/analyze.test.mjs
```

## Witness shape

```json
{
  "witness_id": "example",
  "title": "Example",
  "layers": [
    {
      "id": "greek",
      "language": "grc",
      "script": "Greek",
      "witness_class": "primary-text witness",
      "text": "…",
      "numeric_system": "greek-milesian",
      "annotations": {
        "structure_tags": ["parallelism", "inversion"],
        "semantic_tags": ["rank-reversal"],
        "morphology": {
          "token": "human-supplied analysis"
        },
        "provenance_note": "…"
      }
    }
  ]
}
```

Supported optional numeric systems:

- `hebrew-standard`
- `greek-milesian`

## Numeric overlay boundary

Alphabetic-number systems are historically real measurement systems. Numeric equality between two strings is **not** evidence by itself of semantic relation, ancestry, intentional encoding, prophecy, or theological significance.

The executable therefore emits the warning alongside every numeric total.

## Why this exists

The working hypothesis is that a saying may retain high-impact structure even when its carrier changes:

```text
wording changes
sound changes
morphology changes

but perhaps:

parallelism survives
inversion survives
deixis survives
semantic contrast survives
receiver structure survives
```

The tool measures the easy parts and keeps the hard parts declared rather than hallucinated.

> The words may mutate. The relation may carry.


## Deeper math commands

The LC-002 extension adds typed transformation edges, declared phonology, root/pattern graph metrics, and a first numeric-collision null model.

```bash
node tools/linguistic-carry/math-cli.mjs root-graph entries.json
node tools/linguistic-carry/math-cli.mjs collisions items.json
node tools/linguistic-carry/math-cli.mjs null hebrew-standard 2 18
```

See `threads/linguistic-carry/LC-002-deeper-math.md` for the evidence boundary and null-model limits.

## LC-003 — attested paired corpus and held-out frequency null

Eight attested Greek/KJV direct-speech comparisons are under `corpus/`, each with specific URLs, typed comparison edge, researcher-supplied morphology and tags, editorial scope, and nonclaims.

```bash
node --test tools/linguistic-carry/*.test.mjs
node tools/linguistic-carry/corpus-cli.mjs check
node tools/linguistic-carry/corpus-cli.mjs report
node tools/linguistic-carry/corpus-cli.mjs holdout luke-4-21 Σήμερον
```

The held-out probability is an **independent-character model estimated from a tiny, nonrepresentative sample**, not a meaningful probability of hidden intent. Morphology and structural tags are supplied by researchers, not discovered by this tool. Distinguish an attested Greek or Syriac textual witness from a hypothetical oral-language retroversion.

See `threads/linguistic-carry/LC-003-attested-corpus.md`.

## LC-004 — independently sampled Greek control deck

The reference corpus under `reference/` contains 512 deterministically sampled verses from the public-domain Robinson-Pierpont 2018 Byzantine Textform: 256 Gospel verses and 256 non-Gospel New Testament verses. The upstream repository is pinned to an exact commit; every source TEI file and the generated JSONL artifact carry SHA-256 receipts. All eight Red Letter targets are excluded by locator before selection.

```bash
node tools/linguistic-carry/reference-cli.mjs check
node tools/linguistic-carry/reference-cli.mjs profile gospel
node tools/linguistic-carry/reference-cli.mjs score Σήμερον all word
node tools/linguistic-carry/reference-cli.mjs stress Σήμερον
```

`stress` compares three distinct null surfaces:

- the LC-003 independent-character model, now trained on the 512-verse control deck;
- actual same-length Greek words;
- same-length character windows that never cross a verse boundary.

It also keeps Gospel and non-Gospel strata separate so genre sensitivity remains visible. A low or high collision rate is still not evidence of intention, ancestry, semantics, or theology.

Rebuild only from the pinned upstream checkout:

```bash
node tools/linguistic-carry/scripts/build-rp2018-reference.mjs \
  /path/to/byzantine-majority-text \
  27a45ff1b7be6c17ccbfeac414f3f55732ae8e28
```

See `threads/linguistic-carry/LC-004-independent-reference.md`.
