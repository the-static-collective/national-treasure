# LC-005B — Receiver-local uptake experiment

**Status:** executable experimental scaffold; no participant data collected  
**Date:** 2026-09-23  
**Parent:** `NT-LC005-TLB-REDLETTER-001`

## Purpose

LC-005 classified declared transformations as CARRY, REVEAL, PROJECTION, LOSS, or HOLD.

LC-005B asks the next empirical question:

> When a relation is predicted to become more available to a named receiver, does a blinded reader actually recover it more often?

The experiment does not ask which Bible is "best." It measures narrow relation-specific uptake under a declared receiver constitution.

## Core design

Each item binds to one existing LC-005 passage/relation pair.

A participant receives:

- one rendering of the passage, with version identity hidden;
- one narrow comprehension probe tied to the tracked relation;
- separate optional ratings for clarity, preference, perceived fidelity, and theological agreement.

The same participant never needs to compare two named translations. Arm allocation is deterministic from a study-scoped pseudonym and SHA-256 seed, and item order is participant-specific.

```text
participant key
    ↓ one-way study-scoped pseudonym
opaque trial + material tokens
    ↓ presenter-only resolver
ASV or TLB rendering
    ↓
relation-specific question
    ↓
comprehension receipt
    +
clarity
preference
perceived fidelity
theological agreement
```

The participant-facing assignment contains only opaque trial/material tokens. It does not contain the question, passage/relation identifier, expected class, hypothesis, answer key, arm name, translation name, or source URL.

## Why the channels stay separate

A reader can:

- prefer a rendering while misunderstanding the tracked relation;
- dislike a rendering while correctly recovering it;
- report high perceived fidelity without source-language competence;
- agree theologically with a claim while failing the comprehension probe.

Therefore:

```text
comprehension != clarity
comprehension != preference
preference != fidelity
perceived fidelity != source-language fidelity
theological agreement != comprehension
```

No composite "good Bible score" exists in the executable.

## Initial 10 probes

The first deck deliberately spans different LC-005 classes.

### REVEAL hypotheses

- Luke 4:21 — present-time fulfillment
- Mark 2:27 — Sabbath-for-human purpose
- Matthew 6:34 — day-local sufficiency

### CARRY controls

- Matthew 20:16 — first/last reversal
- John 14:6 — exclusive Father-access relation
- John 8:58 — prior-existence relation

### LOSS controls

- John 8:58 — becoming / present-being grammatical contrast
- Matthew 24:34 — explicit generation referent

### PROJECTION controls

- Luke 9:60 — spiritual-death reading of the first "dead"
- Luke 19:40 — praise interpretation of the stones' cry

This matters because a useful receiver experiment must be able to fail in more than one direction.

## Prediction semantics

The transformation classes generate different empirical expectations without converting them into verdicts.

```text
REVEAL:
  possible TLB > ASV comprehension for the declared relation

CARRY:
  no necessary arm advantage; both should preserve recoverability

LOSS:
  possible TLB < ASV recovery of the tracked source relation

PROJECTION:
  possible TLB > ASV recovery of the explicit interpretation
  BUT that does not establish source fidelity or correctness
```

These are hypotheses, not baked-in scoring rules.

## Privacy / provenance

The participant key is never stored in a receipt.

The executable keeps only a study-scoped pseudonym. The pseudonym is used to replay allocation but is not source identity.

The TLB text remains external-reference-only. Presenter-side material resolution is intentionally separate from the public assignment so version metadata cannot leak through a URL.

## Reporting gate

By default, each arm must reach a declared minimum cell size before the executable emits a descriptive comprehension delta.

Before that:

```text
HOLD
```

After the threshold, the report may emit:

```text
TLB comprehension rate - ASV comprehension rate
```

with an explicit boundary:

> descriptive receiver-local difference; no causal, fidelity, or population-level claim

No p-value, significance badge, translation ranking, or theological conclusion is generated.

## Run

```bash
node --test tools/linguistic-carry/*.test.mjs

node tools/linguistic-carry/receiver-cli.mjs check

# Participant-side assignment
node tools/linguistic-carry/receiver-cli.mjs assign participant-local-key

# Presenter-side only
node tools/linguistic-carry/receiver-cli.mjs resolve <participant-pseudonym> <trial-token>

# Score one response and verify the participant packet
node tools/linguistic-carry/receiver-cli.mjs score assignment.json response.json packet.json

# Aggregate previously scored receipts
node tools/linguistic-carry/receiver-cli.mjs summarize assignments.json receipts.json
```

## Browser surface

A dependency-free local browser instrument now lives under `tools/linguistic-carry/survey/`.

It deliberately splits presenter and participant surfaces. The presenter may resolve an opaque trial into the assigned arm/source URL, paste only the scoped passage text, and mint a SHA-256 participant packet. The participant page verifies that packet before rendering it and exports a response bound to the packet receipt.

The browser packet hash is interoperable with the Node verifier. Source URL, arm identity, item/relation identity, expected class, hypothesis, and answer key never enter the participant packet.

See `tools/linguistic-carry/survey/README.md`.

## Next gate

Before substantive real-world collection:

1. freeze the study manifest and SHA-256 receipt;
2. add consent/privacy language appropriate to the actual deployment context;
3. declare data-retention/deletion rules;
4. pilot only for question ambiguity and interface failure;
5. freeze any revisions after the pilot and before substantive collection;
6. declare sample/recruitment rules before looking at comparative results;
7. determine whether any institutional review is applicable to the intended deployment.

The important architectural result already exists:

> **REVEAL is no longer allowed to mean "this wording feels clearer to us." It now has a path toward an attributable receiver-local measurement.**
