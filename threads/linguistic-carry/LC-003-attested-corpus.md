# LC-003 — Attested Red Letter crate and frequency pressure

**Status:** executable corpus expansion; research only
**Date:** 2026-09-22
**Parent:** `LINGUISTIC-CARRY-001`, `LC-002`; earlier `TODAY-IN-YOUR-EARS-001`

## What landed

Eight paired direct-speech excerpts with attested Greek Gospel and public-domain KJV textual witnesses:

| Passage | Structural test | Particular boundary |
|---|---|---|
| Luke 4:21 | time/source/receiver deixis | Greek 'today' vs KJV 'this day'; not proof of historical spoken language |
| Matthew 10:27 | ear → rooftops transmission | preposition and imperative relations, not a reconstructed Aramaic quotation |
| Mark 2:27 | purpose inversion | Greek inflection and English order encode differently |
| Luke 9:60 | double 'dead'; explicit YOU | identical Greek lexeme can support distinct construed senses |
| Matthew 20:16 | first/last reversal | shorter Greek verse vs longer KJV/Byzantine clause explicitly retained |
| Matthew 23:24 | gnat/camel scale reversal | KJV 'strain AT' differs from Greek straining OUT |
| Luke 19:40 | humans silent / stones cry | two attested Greek verb-form traditions; KJV 'immediately' not separate adverb in selected Greek |
| John 8:58 | came-to-be / I AM | Greek contrast and English translation, not automatic proof of an Exodus 3 allusion |

Each record stores Greek and KJV source URLs, exact limited excerpt scope, researcher-supplied morphology annotations keyed to Greek words actually present, typed comparison edges, and nonclaims. The annotations are hypotheses/linguistic analyses attached to source text, not machine-discovered lexical truth.

## Independent mathematical extension

`frequency-null.mjs` adds an exact weighted character-value distribution to LC-002's uniform-character numeral model. It first constructs a *declared* empirical Greek/Hebrew letter profile from input texts and can hold a target witness out of the sample before scoring a target string.

The weighted model uses independent draws from the observed letter-frequency distribution:

```text
P(value = v | length = n, sample profile)
= sum of product weights of all length-n strings that yield v
  / (sum of all letter weights)^n
```

Counts are calculated with BigInt dynamic programming. The CLI serializes the exact numerator and denominator plus a convenience floating estimate.

**Important:** The eight short sayings are *not a representative Greek corpus*. The empirical profile is a proof that the process works, not a real significance test for gematria/isopsephy. The model still lacks phonotactics, lexical constraints, spelling chronology, sample selection, multiple-testing correction, and enough observations to estimate ordinary usage. An implausibly small toy-corpus probability does not elevate a number match.

## Re-run

```bash
node --test tools/linguistic-carry/*.test.mjs
node tools/linguistic-carry/corpus-cli.mjs check
node tools/linguistic-carry/corpus-cli.mjs report
node tools/linguistic-carry/corpus-cli.mjs holdout luke-4-21 Σήμερον
```

The new `.github/workflows/linguistic-carry.yml` runs all of these against pull requests and main changes affecting the tool.

## Sources and editorial rules

All eight records link directly to their Greek display text on greekbible.com and the public-domain KJV passage at Bible Gateway. Greek display text is an *edition-specific witness*, not an original manuscript, and KJV is a historically attested English translation, not a word-for-word reproduction of the selected Greek display edition. The corpus intentionally excerpts direct speech, recording when omitted narration or extra clauses affect scope.

No independently attested audio/transcript of Jesus' original spoken Aramaic is claimed. A Syriac Peshitta reading would be an **attested Syriac textual witness**, not the original Aramaic oral utterance. Any future retroversion should be represented as a separate hypothesis with named scholarly support.

## Hostile controls

- Remove human-declared tags and observe that automatic lexical metrics remain but semantic-similarity claims vanish.
- Replace a Greek line with a different documented textual variant, preserving the previous line as a separate witness rather than overwriting it.
- Run the target against a profile containing the same saying, then exclude it: record how the result changes.
- Increase the reference corpus or switch genres; ask whether the apparent significance survives.
- Require a word to have independent historical/semantic relevance *before* displaying its numerical value.

## Next gate

Replace the short-verse profile with a dated, openly licensed, independently sampled Greek corpus and explicit source-version manifest; add attestations from the Syriac Peshitta only with dated textual edition and lexical controls. Build a phonological layer only from declared reconstruction/reading conventions; do not pretend Greek script produces one universal historical sound. Keep failed comparisons visible.

> **A TEXTUAL WITNESS IS NOT THE VOICE IT CLAIMS TO RECORD. A NUMBER IS NOT AN INTERPRETATION. A TRANSLATION CAN CARRY RELATION WITHOUT CARRYING EVERY WORD.**
