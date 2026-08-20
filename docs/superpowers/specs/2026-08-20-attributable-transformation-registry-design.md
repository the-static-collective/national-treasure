# Attributable Transformation + Self-Indexing Registry — Design

Date: 2026-08-20
Status: approved design, implementation not yet authorized by this document
Repository: `the-static-collective/national-treasure`

## Purpose

National Treasure has now produced two linked findings:

1. several independent research cases converge on continuity as an attributable relation through change rather than preservation of identical state;
2. the repository itself exposed a coordination failure when parallel case branches all edited the root `README.md` index.

This slice preserves the conceptual convergence without prematurely promoting it into shared law, and removes the root README as a routine synchronization hotspot.

## Current constituted evidence

At design time, `main` contains these landed case directories:

- `cases/cicada-overfit/`
- `cases/forkability-continuity/`
- `cases/palimpsest-stack/`
- `cases/selador/`
- `cases/trust-archaeology/`

The root README currently omits `cicada-overfit` from its active-case list while listing Coral Castle even though its case directory has not landed. That mismatch demonstrates that a hand-maintained central case list can drift from constituted repository state.

The previously conflicting open research branches (#1 Grebennikov, #9 Genesis, #11 paired time specimens, #13 time-under-observation, #14 Hopi/Daughter DNA) now have branch diffs that no longer touch the root README and currently report mergeable. Preserve that deconfliction rather than reintroducing a common write surface.

## Conceptual convergence

The candidate compression is:

> **continuity ≠ preserved state; continuity = inspectable relation through change.**

A stronger but still incubating restatement is:

> **Difference is not necessarily damage to continuity. Properly witnessed difference may be evidence that continuity occurred at all.**

Five related clues remain distinct:

### 1. Attributable transformation

Forkability, palimpsest transmission, Genesis division/descendants, Daughter/mtDNA reconstruction, manuscript genealogy, and executable continuity fixtures all pressure the same distinction: state identity need not survive unchanged for continuity to remain reconstructible.

### 2. Residue as navigational information

Descendant differences can sometimes function as a return address. The useful invariant is not `difference proves ancestry`; it is narrower:

> **When ancestry is independently grounded, surviving differences may help reconstruct the path toward an ancestor or prior state.**

Cicada is an important adversarial control here. Its matched pair distinguishes witnessed plural ancestry from visually similar independent recurrence. Therefore residue can navigate only when a transmission road is evidenced; resemblance alone is insufficient.

### 3. Formative thresholds

Some boundaries merely relocate a thing. Other crossings participate in making descendants distinguishable. The candidate research question is:

> When does crossing a boundary preserve an already-formed identity, and when is the crossing itself part of the process that forms the descendant identity?

This remains a research question, not an architectural law.

### 4. Two arrows of naming

Names may act asymmetrically in time:

- forward: a name may lawfully attract later stories, usages, speakers, descendants, and worlds;
- backward: a later name has no automatic authority to manufacture ancient ancestry.

Palimpsest and Cicada provide the adversarial boundary; Selador provides the generative forward case.

### 5. Return is not restoration

A lawful return may revisit an attributable relation without deleting residue accumulated after departure. Recurrence, re-entry, branch encounter, and exact-return work should remain distinguishable from restoration of an earlier world.

## Cicada integration

The landed Cicada Overfit Corpus is not an incidental missing README entry. It is a high-value negative control for the new convergence.

Its relevant law is:

```text
MYSTERY SURFACE
  strange / symbolic / optional

VERIFICATION SURFACE
  canonical bytes / hashes / signatures / receipts / source locators

AUTHORITY SURFACE
  explicit admission law / constituted actor / bounded capability
```

The corpus contains a matched pair:

```text
A ---witnessed ancestry---\
                           > D
B ---witnessed ancestry---/

versus

P ---same visible feature--- Q
          no witnessed road
```

This supplies a direct falsification condition for `the descendant is a return address`:

- descendant difference or resemblance may suggest a path;
- only attributable transmission evidence may establish ancestry;
- aesthetic fit must never cross from mystery to verification or authority by itself.

The convergence clue should cite Cicada explicitly as the control that prevents `residue is navigational information` from collapsing into resemblance-based genealogy.

## Repository architecture

### Root README

The root README becomes stable orientation only:

- repository purpose;
- evidence grammar;
- house rules;
- directory semantics;
- how to inspect current constituted cases.

It must not remain the hand-maintained authoritative list of active cases.

### `cases/`

`cases/` is the constituted case registry.

A case directory present on `main` is landed repository state. A branch-only case is not landed merely because a README mentions it.

Each case owns its local README and supporting evidence files.

### `threads/`

`threads/` holds bounded leads that have not earned full-case status. Grebennikov is the current obvious specimen.

### `clues/`

Add a new synthesis surface:

`clues/attributable-transformation.md`

A clue may combine independently owned cases while preserving each source's epistemic status. It is not allowed to upgrade the underlying evidence by aggregation.

## Prevention hack

The workflow deliberately favors a small hard rule over a centralized service.

### Rule 1 — case PRs do not edit the root README

New or updated case PRs modify their owned case directory and local evidence files only.

A PR that changes any path under `cases/**` must not also change root `README.md`.

There is no in-PR escape hatch. If legitimate root README maintenance is needed, make it a separate PR. This keeps parallel case branches from contending for one shared file and makes the exception mechanically obvious instead of socially negotiated.

### Rule 2 — derive the registry from the filesystem

Add a dependency-free Node `.mjs` utility consistent with the repository's existing executable style.

Command:

```text
node tools/case-registry/check.mjs
```

It must:

- enumerate first-level directories under `cases/`;
- sort deterministically;
- verify every landed case contains a `README.md`;
- print a human-readable current-case list;
- fail if the stable root README contains the legacy `## Active cases` hand-maintained block;
- remain read-only and non-authoritative beyond reporting the Git tree it observes.

No external packages are required.

### Rule 3 — CI catches hotspot regression

Add `.github/workflows/case-registry.yml`.

The workflow must:

1. run the registry tests;
2. run `node tools/case-registry/check.mjs`;
3. on pull requests, compute changed paths against the PR base;
4. fail when both root `README.md` and any `cases/**` path are present in the same PR diff;
5. explain that README maintenance must be split from case work.

This rule has no label, title, commit-message, or content-based bypass.

### Rule 4 — post-merge reconciliation is derived, not hand-edited

If a human-readable registry artifact is desired later, generate it from `cases/` after merge. Do not make every case branch co-author the same registry file.

## Files expected in implementation

National Treasure:

- `README.md` — remove drifting active-case enumeration; explain self-indexing case state.
- `clues/README.md` — explain clue/synthesis authority boundary.
- `clues/attributable-transformation.md` — five-clue convergence + Cicada negative control.
- `tools/case-registry/check.mjs` — deterministic read-only registry/checker.
- `tools/case-registry/check.test.mjs` — focused tests for directory enumeration, missing README, deterministic ordering, and legacy-index refusal.
- `.github/workflows/case-registry.yml` — registry validation + root/case collision guard.

No existing case body should be rewritten merely to make the convergence cleaner.

## GitBook projection

The Static Collective GitBook should receive a bounded projection under the existing Continuity Witness / Primitive Incubator neighborhood.

Suggested title:

**Attributable Transformation — Difference as Continuity Evidence**

The projection should preserve:

- `continuity ≠ preserved state` as a candidate compression;
- descendant/residue as a possible return address;
- Cicada's witnessed-road requirement as the anti-overfit control;
- formative thresholds as an open research question;
- generative naming vs retrospective naming;
- return vs restoration;
- explicit statement that National Treasure owns the research evidence and GitBook is a cross-project projection.

Do not promote this directly into `patterns/` yet.

## Promotion criteria

The compression may graduate only when materially independent specimens continue to reproduce the invariant without erasing their local semantics.

Evidence should include both positive and adversarial cases. At minimum, future review should ask:

- Can the relation be reconstructed without final-state sameness?
- Are ancestry/transformation edges attributable rather than inferred from resemblance alone?
- Can a return preserve intervening residue?
- Can the model represent rupture, false ancestry, independent recurrence, and failed re-entry without forcing continuity?
- Does the compression remain useful outside genealogy/history metaphors?

Cicada's independent-recurrence fixture remains a standing falsification specimen.

## Non-goals

This slice does not:

- prove the Hopi Back Door tradition is a Beringian migration memory;
- treat `daughter` as intentionally encoded mtDNA knowledge;
- promote Genesis analogy into scientific encoding;
- infer historical transmission from resemblance;
- create a universal genealogy engine;
- centralize project authority in GitBook;
- create a daemon, database, or mandatory registry service;
- rewrite open research branches merely for conceptual uniformity;
- convert the convergence into shared constitutional law.

## Validation

Implementation is complete when:

1. current `main` case directories are discovered deterministically and Cicada is visible;
2. no manually maintained active-case list can silently disagree with `cases/`;
3. adding a synthetic case directory changes the derived registry without requiring a root README edit;
4. missing local case README is detected;
5. a PR that touches `cases/**` and root `README.md` fails the workflow;
6. parallel case branches can add separate case directories without contending for the same index file;
7. the convergence clue names Cicada as a negative control, not supporting evidence for ancestry;
8. GitBook projection preserves National Treasure as evidence authority and keeps the compression incubating.

## Design sentence

> **Let descendants own their differences, let the tree reveal what has actually landed, and require every claimed road backward to remain attributable.**
