# LC-002 — deeper language math

**Status:** executable extension to LINGUISTIC-CARRY-001  
**Date:** 2026-09-22  
**Authority:** measurement surface only.

This pass makes four roadmap items executable rather than merely proposed.

## 1. Typed transformation edges

A witness may now declare edges explicitly:

```json
{
  "from": "gospel-greek",
  "to": "english",
  "type": "translation",
  "evidence_class": "observed"
}
```

Allowed vocabulary is intentionally open because the tool does not decide historical relations, but useful types include:

```text
quotation
translation
paraphrase
allusion
reconstruction
hypothesis
creative-recomposition
```

Unknown layer references fail closed.

## 2. Declared sound layer

A layer may carry researcher-supplied phonology:

```json
{
  "phonology": {
    "source": "declared scholarly reconstruction",
    "phonemes": ["k", "a", "t", "a"],
    "syllable_count": 2,
    "stress_or_accent": "..."
  }
}
```

The analyzer measures phoneme count, unique phonemes, Shannon entropy, and repetition ratio.

It never derives pronunciation from spelling.

## 3. Root-pattern graph

`root-pattern.mjs` turns supplied Semitic morphology records into a bipartite graph:

```text
ROOTS <----> PATTERNS
   \          /
       FORMS
```

It reports:

- root degree;
- pattern degree;
- form count;
- supplied semantic-tag dispersion;
- edge count;
- sample bipartite density.

The graph describes only the supplied sample. A toy lexicon is not a language-wide statistic.

## 4. Collision lab

`collisions.mjs` groups Hebrew/Greek alphabetic-number matches and supplies a first hostile control.

The null model asks:

> Under a uniform random character model of the same alphabet and string length, how many strings produce this value?

This is deliberately only a **first null**. Natural language is not uniform. Future controls should condition on:

- attested letter frequencies;
- phonotactics;
- morphology;
- matched corpus frequency;
- word length;
- historical period.

But even the crude null model enforces the correct direction:

```text
OBSERVED NUMBER HIT
        ↓
ASK HOW MANY HITS
WOULD OCCUR WITHOUT MEANING
        ↓
ONLY THEN
CONSIDER INTERPRETATION
```

## Executables

```bash
node tools/linguistic-carry/math-cli.mjs root-graph entries.json

node tools/linguistic-carry/math-cli.mjs collisions items.json

node tools/linguistic-carry/math-cli.mjs null hebrew-standard 2 18
```

## Verification

Local combined test run:

```text
node --test tools/linguistic-carry/analyze.test.mjs tools/linguistic-carry/deeper.test.mjs
13/13 pass
```

## New law

> **A PATTERN HIT EARNS ATTENTION ONLY AFTER IT SURVIVES A NULL MODEL.**

And:

> **IF THE TOOL CANNOT DISTINGUISH WITNESS FROM RECONSTRUCTION, THE TOOL IS NOT READY TO DISCUSS CARRY.**
