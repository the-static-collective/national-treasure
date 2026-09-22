# LC-004 — The Greek Control Deck

**Status:** executable reference-corpus gate; research only  
**Date:** 2026-09-22  
**Parent:** `LC-003`  
**Artifact:** `tools/linguistic-carry/reference/manifest.json`

## The rocket step

LC-003 proved that the corpus and held-out machinery worked, but its eight sayings were too small and too selected to carry a serious language-frequency claim. LC-004 replaces that toy background with a reproducible control deck:

| Surface | Count | Selection |
|---|---:|---|
| Gospel Greek | 256 verses | SHA-256 rank over eligible RP2018 verse locators |
| Non-Gospel NT Greek | 256 verses | same algorithm and seed, separate stratum |
| Total | 512 verses | all eight Red Letter target locators excluded before ranking |

The source is the Robinson-Pierpont 2018 Byzantine Textform, public-domain Unicode TEI at exact upstream commit `27a45ff1b7be6c17ccbfeac414f3f55732ae8e28`. The manifest receipts every one of the 27 input files and the generated JSONL artifact with SHA-256.

This is deliberately **not** called a universal Koine corpus. It is one edition, one canon, two broad genre strata, and one deterministic pseudo-random selection rule.

## Three nulls instead of one

For a target Greek string of letter length \(n\) and Milesian value \(v\), LC-004 can now ask three different questions:

1. **IID character null** — under observed letter frequencies, how much length-\(n\) mass lands at \(v\)?
2. **Attested word null** — among actual sample words of length \(n\), what fraction has value \(v\)?
3. **Within-verse window null** — among contiguous length-\(n\) letter windows, without crossing verse boundaries, what fraction has value \(v\)?

These models do not answer the same question. Their disagreement is useful pressure, not a defect to average away.

For `Σήμερον` (normalized `σημερον`, length 7, value 473), the committed control deck currently reports:

| Null surface | Gospel | Non-Gospel | Combined |
|---|---:|---:|---:|
| same-length words | 3 / 325 | 2 / 380 | 5 / 705 |
| within-verse windows | 10 / 19,664 | 15 / 20,834 | 25 / 40,498 |

Four of the five word-level matches are the word `σημερον` itself; the fifth is `ασθενης`, an actual alphabetic-number collision. This is precisely why a number match is not an interpretation: identical totals can arise from unrelated words, while ordinary recurrence of the target word remains visible rather than being treated as magic.

The combined IID-character estimate is approximately `0.0008266049061706814`. The combined empirical word collision rate is approximately `0.0070921985815602835`; the window rate is approximately `0.0006173144352807546`. Model choice moves the apparent rarity by more than an order of magnitude.

## Gates now enforced

`reference-cli.mjs check` fails when:

- the upstream source is not pinned to an exact commit;
- source or artifact hashes are missing or wrong;
- the declared stratum counts do not match the artifact;
- a target locator or exact target text leaks into the reference sample;
- duplicate locators, non-Greek records, unknown strata, or missing source URLs appear.

The generator is committed so the sample can be independently rebuilt from the pinned upstream checkout. CI runs the gate and the `Σήμερον` stress report on every relevant change.

## What the result does and does not say

**Observed:** the target value recurs under all three declared control rules.  
**Inference, probable:** the eight-saying toy corpus was materially distorting any frequency story.  
**Inference, established within this artifact:** genre and candidate-unit choices change the measured collision rate.  
**Unsupported:** therefore a particular numerical correspondence was intended.  
**Unsupported:** therefore the selected Greek edition preserves the sound or exact wording of an oral utterance.

The control deck improves the question. It does not turn a probability into an interpretation.

## Next gate: Syriac without counterfeit Aramaic

The schema is now ready for a separately sourced Syriac witness pack, but no Syriac text is silently introduced here. The next pack must name:

- the Syriac edition and digital transcription;
- repository or archive version and license;
- exact passage scope and orthographic normalization;
- whether vocalization is present, absent, or editorial;
- word alignment method and who supplied it;
- the explicit nonclaim that an attested Peshitta reading is not a transcript of Jesus' original oral language.

Any Aramaic retroversion must live as a different node class: `reconstruction`, with author, method, source support, date, alternatives, and confidence. It must never be allowed to inherit the `attested-textual-witness` class merely because Syriac and Aramaic are related.

> **THE CONTROL DECK DOES NOT SOLVE THE MYSTERY. IT STOPS THE TARGET FROM GRADING ITS OWN TEST.**

