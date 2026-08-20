# national-treasure

> and THAT... will lead to another clue...

A research repository for high-weirdness investigations handled with disciplined provenance.

The aim is **not** to flatten mystery into premature certainty, and **not** to let speculation masquerade as fact.

This repo exists to hold a different kind of inquiry:

- wild hypotheses are welcome;
- provenance is mandatory;
- convergence must be earned;
- failure cases are part of the treasure map.

## Core posture

We distinguish clearly between:

- **Observed** — directly witnessed artifact, image, text, measurement, or documented feature.
- **Primary source** — a firsthand text, image, record, or artifact produced by the relevant person/institution.
- **Inference** — a reasoned conclusion drawn from observed/primary material.
- **Speculation** — a hypothesis not yet sufficiently grounded.
- **Failed** — a hypothesis, count, mapping, or alignment that did not survive testing.

For cases where source quality and claim confidence need to be separated, [`METHOD.md`](./METHOD.md) adds a second axis: **Established / Probable / Possible / Unsupported**.

This lets the repo pursue strange leads without collapsing into either cynicism or fantasy.

## Current cases

The constituted landed-case registry is the [`cases/`](./cases/) directory itself.

A first-level case directory present on `main` is landed repository state. Branch-only cases, proposed cases, and references elsewhere in the repository are not made active merely by being named.

To inspect the current registry mechanically:

```text
node tools/case-registry/check.mjs
```

Case PRs do **not** add themselves to this README. Root README maintenance travels separately so independent cases do not collide on one synchronization point.

## Live side threads

- [`threads/grebennikov.md`](./threads/grebennikov.md) — Viktor Grebennikov's cavity-structure / insect-flight claims preserved beside grounded insect resonance and elasticity research as a falsifiable side thread, not established antigravity physics.

## Repository shape

- [`METHOD.md`](./METHOD.md) — research method and two-axis evidence grammar.
- [`cases/`](./cases/) — constituted landed-case registry; one folder per investigation.
- [`threads/`](./threads/) — smaller live leads worth preserving without promoting them into full cases.
- [`clues/`](./clues/) — cross-case syntheses that preserve source authority and remain falsifiable.
- [`tools/case-registry/`](./tools/case-registry/) — read-only discovery and collision checks derived from the landed tree.
- [`docs/superpowers/specs/`](./docs/superpowers/specs/) — approved design slices that preserve implementation boundaries before downstream code work begins.
- [`docs/superpowers/plans/`](./docs/superpowers/plans/) — implementation plans for approved multi-step slices.

### Discovery follows constituted state

The repository does not require every independently growing case branch to co-author one central index.

```text
case directory lands on main
        ↓
case exists in constituted repository state
        ↓
registry checker discovers it
```

The root README is orientation, not the authority that makes a case exist. This keeps navigation useful without turning discovery text into a merge lock.

## Current large clues

### Entrusted corpus

The trust-archaeology case is testing a potentially portable systems proposition:

> **A durable corpus can outlive any particular custodian when authority around it is purpose-bound, bounded, receipt-bearing, reviewable, and succession-capable.**

That proposition is currently an architectural hypothesis, not shared law and not a legal trust instrument.

### Palimpsest continuity

The palimpsest case is testing a second proposition:

> **Forms can survive while meanings change; meanings can survive while forms change; names can move independently of both. Continuity lives in the witnessed transformations between them.**

That proposition is also incubating here. Resemblance does not establish ancestry, and a compelling projection does not become authority merely because it is useful.

### Attributable transformation

Independent cases are now pressuring a broader candidate compression:

> **continuity ≠ preserved state; continuity = inspectable relation through change.**

See [`clues/attributable-transformation.md`](./clues/attributable-transformation.md). The clue remains incubating; Cicada's independent-recurrence fixture is a standing anti-overfit control against manufacturing ancestry from resemblance.

## Rule of the house

> **Wild hypotheses are welcome. Convergence must be earned.**

A clue becomes stronger when independently sourced structures converge on it.
A clue becomes weaker when the procedure used to find it could have manufactured it.
