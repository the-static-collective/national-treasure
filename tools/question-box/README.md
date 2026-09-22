# National Treasure Question Box v0.1

> A Da Vinci-code-shaped research toy whose prize is a better question.

This tool turns the repository's existing method into a small executable interaction. It does **not** search the web, call an LLM, infer hidden truth, or produce a verdict.

Its terminal artifact is a deterministic `national-treasure.question-receipt/v0`.

## Run it

Interactive:

```text
node tools/question-box/treasure.mjs
```

One-shot:

```text
node tools/question-box/treasure.mjs --clue "the same phrase appears in two manuscripts" --source "archive A, folio 12"
```

Machine-readable:

```text
node tools/question-box/treasure.mjs --clue "..." --json
```

Persist the receipt:

```text
node tools/question-box/treasure.mjs --clue "..." --receipt receipts/question-001.json
```

## The box

The box rotates through apertures in a deliberately conservative order:

1. **source object** — can the clue be independently recovered?
2. **chronology** — are we importing a later meaning backward?
3. **counterevidence** — what would make the pattern ordinary or unrelated?
4. **falsifier** — what would count against the strongest reading?
5. **rival models** — are there genuinely different explanations?
6. **independent convergence** — are the witnesses independent families?
7. **minimum discriminator** — what cheapest observation separates the live models?
8. **relation** — what is actually witnessed versus projected?

The first unresolved aperture becomes the returned question frontier.

## Hard invariant

There is no `answer` or `conclusion` field in the receipt schema.

A successful run can end with:

- a better question;
- a missing source;
- a contradiction;
- a failed alignment;
- a demand for chronology;
- a request for a discriminator.

Those are all treasure.

## Evidence discipline

The box preserves, but never upgrades, the repository's two axes:

- provenance: observed / primary / inference / speculation / failed
- support: established / probable / possible / unsupported

The output also carries explicit non-claims so downstream tools cannot mistake a pretty question for established fact.

## Test

```text
node tools/question-box/test.mjs
```

The tests check that missing provenance wins early, chronology follows recoverability, labels are not promoted, a saturated record asks for a discriminator, and the terminal object contains no answer field.
