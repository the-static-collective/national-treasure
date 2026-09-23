# LC-005 — Living Bible receiver-aware carry ledger

**Status:** executable research specimen; no canon promotion  
**Date:** 2026-09-23  
**Parent:** LINGUISTIC-CARRY-001, LC-002, LC-003, LC-004

## Question

What changes when an attested saying crosses into a deliberately expansive modern-English paraphrase?

LC-005 does not treat "different wording" as one undifferentiated event. It types a researcher-declared relation as one of:

```text
CARRY       source relation survives the target carrier
REVEAL      source relation survives and is declared more available to a named receiver
PROJECTION  target makes explicit a relation the declared source status leaves absent or ambiguous
LOSS        tracked source relation is absent from the target surface
HOLD        evidence is insufficient or unresolved
```

The classifier does not discover these states from raw text. Human research supplies the observations and source status; the executable only checks the declaration and produces a reproducible receipt.

## Why The Living Bible is useful here

The Living Bible is an unusually sharp pressure specimen because it is openly paraphrastic and reader-facing. Its transformations are often large enough to make the translation act visible.

That lets one passage contain more than one transformation class at once.

For example, the current seed declares John 8:58 as:

- **CARRY** for the prior-existence relation;
- **LOSS** for the Greek becoming / present-being tense contrast.

Matthew 24:34 is separately typed as:

- **LOSS** for the explicit generation referent;
- **PROJECTION** for making one age-closure interpretation explicit.

Neither classification is a doctrinal verdict. PROJECTION does not mean false. LOSS does not mean bad. They name what happened to a tracked relation under a declared comparison.

## Receiver constitution

REVEAL cannot exist without a receiver.

LC-005 therefore requires an explicit receiver declaration. The first study uses:

```text
modern-general-english-reader-v1
```

This is an analytic receiver hypothesis, not a measured population. A declaration such as `receiver_access_delta: gain` means "the researcher expects this relation to become more available to this named receiver." It must not be promoted into a comprehension result without reader evidence.

This is the 3rdi boundary:

```text
carrier != decoder != projection
availability != truth
projection != source authority
```

## Provenance / LOADOUT boundary

The study preserves three different objects:

```text
attested Gospel Greek witness
          ↓
public-domain ASV witness
          ↓
copyrighted TLB paraphrase
```

They are not collapsed into one source.

The target TLB text is deliberately **not vendored**. The repository stores external passage locators and non-substitutive transformation observations. This protects both provenance and copyright while keeping the analysis replayable.

No silent overwrite applies: a paraphrase does not replace the witness it interprets.

## ALEX boundary

LC-005 treats interpretation as a descendant layer:

```text
historical textual witness
!= translation
!= paraphrase
!= analyst observation
!= classification receipt
```

Passing validation means only that the receipt conforms to the declared schema.

It does not promote the analyst observation into source fact.

## Seed deck

The first executable deck contains twelve Red Letter passages:

- Luke 4:21
- Matthew 10:27
- Mark 2:27
- Luke 9:60
- Matthew 20:16
- Matthew 23:24
- Luke 19:40
- John 8:58
- Matthew 24:34
- Matthew 5:44
- Matthew 6:34
- John 14:6

Twenty relation declarations exercise all four substantive classes.

The existing LC-003 corpus witness IDs are linked where available. The remaining four passages are source-located but are not silently promoted into the LC-003 Greek/KJV corpus.

## Run

```bash
node --test tools/linguistic-carry/*.test.mjs
node tools/linguistic-carry/transform-cli.mjs check
node tools/linguistic-carry/transform-cli.mjs report
node tools/linguistic-carry/transform-cli.mjs passage john-8-58
```

## First hostile controls

1. Change `receiver_access_delta` while leaving source/target declarations fixed. Only CARRY/REVEAL may change; source evidence must not.
2. Mark a source relation unresolved. The classifier must HOLD rather than guess.
3. Remove the target locator. Validation must fail.
4. Attempt to vendor TLB text into the study object. Validation must fail.
5. Split one passage into two tracked relations and verify that one can CARRY while another is LOST.
6. Replace an analyst observation without replacing the source locator; the receipt changes while the source ancestry does not.

## Next gate

The most useful next experiment is empirical rather than lexical:

- show paired renderings to blinded readers;
- ask narrowly specified comprehension questions tied to declared relations;
- record whether the proposed REVEAL cases actually improve receiver availability;
- keep preference, comprehension, fidelity, and theological agreement as separate measures.

That would turn `receiver_access_delta` from an analyst hypothesis into a measured receiver-local observation without giving the receiver authority over the source.

> **A PARAPHRASE CAN MAKE A RELATION EASIER TO RECEIVE BY SPENDING FORM. THE RECEIPT MUST SHOW WHAT IT SPENT.**
