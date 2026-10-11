# National Treasure Question Box × MEMENTO UNDERSTORY 002

**Status:** opt-in, local read-only adapter, stacked on Question Box [PR #70](https://github.com/the-static-collective/national-treasure/pull/70). No source claim, answer, public submission, chronology rewrite, or MEMENTO gate action.

## The actual question

MEMENTO HJJ 404 Crazy Slots intentionally chooses a later arrangement of existing addressed carriers. A reLATTE receiving world may sign a valid `RECEIVED` and `R3_HOLD` receipt. The reader may independently witness the HOLD and record a MEMENTO UNDERSTORY contact plus unresolved association.

**None of those facts establish an original historical relation between the two source artifacts.**

This adapter accepts only a precisely redacted `memento.held-question-seed/v0` produced from that witnessed HOLD. It passes only a generic clue to the existing `buildQuestionFrontier()` engine. The first aperture must remain `source-object`, because the source material is private and the reLATTE crossing is evidence of *receipt*, not independently available underlying source objects.

```text
signed HOLD != evidence of source ancestry
UNDERSTORY contact != canon
candidate adjacency != historical relation
portable question != an answer
question receipt != admission
```

## Local CLI

```sh
node tools/question-box/memento-question.mjs --input /your/local/question-seed.json
# or, explicitly create a new local output, refusing overwrite:
node tools/question-box/memento-question.mjs --input /your/local/question-seed.json --output /your/local/question-frontier.json
```

The adapter rejects extra fields, source paths or private prose, changed evidence classes, false original-source recoverability, purported historical admission, unknown signature coordinates, mismatched relation classification, or weakened explicit non-claims.

The output contains a **native** `national-treasure.question-receipt/v0` inside a `national-treasure.memento-question-handoff/v0` wrapper. The wrapper makes explicit that **National Treasure has not independently cryptographically verified** the upstream signed receipts. Their verification belongs to MEMENTO's owner-local adapter using reLATTE's actual verifier. This tool itself never calls reLATTE, the network, or a private repository.

The question-box receipt retains `provenance_class=speculation`, `support_confidence=unsupported`, and no `answer` or `conclusion` field.

## Test

```sh
node tools/question-box/test.mjs
node tools/question-box/memento.test.mjs
```

A separate MEMENTO-private integration test, using synthetic source material, connects its verified reLATTE HOLD → UNDERSTORY witness → this exact National Treasure question engine, with a pinned checkout and native assertion of the `source-object` aperture.

The output may suggest what to investigate. It does **not** create a National Treasure case directory, a claim of independent convergent evidence, or a source-address membership.
