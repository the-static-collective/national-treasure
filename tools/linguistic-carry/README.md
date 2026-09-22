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
