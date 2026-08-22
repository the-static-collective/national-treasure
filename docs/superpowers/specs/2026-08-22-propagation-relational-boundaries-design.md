# National Treasure — Propagation and Relational Boundaries Design

**Status:** Approved architectural research slice
**Date:** 2026-08-22

## Purpose

Preserve the radio / long-distance acoustic / relational-boundary insight as a disciplined cross-repo design without collapsing physical propagation, social consent, or TranchNode semantics into one another.

The governing compression is:

> **A relationship may exist across a presently closed channel.**

And the governing decomposition is:

> **Transmission is not reception. Reception is not intelligibility. Intelligibility is not recognition. Recognition is not adoption.**

This design authorizes research and fixture work. It does **not** canonize a new TranchNode node kind, protocol, transport, or social ontology.

## Source and evidence boundary

Three families must remain independent.

### 1. Radio propagation

The supplied radio research bundles document a family of mechanisms in which reachability depends on more than endpoint existence: frequency, medium, geometry, time, noise, and environmental state can alter whether a signal propagates or can be detected. Relevant examples include ground wave, ionospheric skywave / skip, tropospheric ducting, sporadic-E, meteor scatter, auroral propagation, weak-signal reception, and software-defined radio.

For National Treasure purposes, the supplied reports are **research bundles**, not automatically primary sources. Implementation of the research thread must retain their cited source road or independently re-source material claims.

### 2. Ocean acoustic waveguides

NOAA and Woods Hole independently document the SOFAR / deep sound channel as a naturally occurring ocean waveguide in which low-frequency sound can travel hundreds or thousands of miles because temperature, pressure, salinity, depth, and refraction shape the propagation path. NOAA also documents low-frequency baleen-whale vocalization and long-range acoustic communication.

This is an independent convergence family, not evidence that radio and whale communication are physically the same mechanism.

### 3. Human relational boundaries

The motivating social case is intentionally not presented as a physical-law analogy:

- two people may have a real relationship history while one or both present communication channels are closed;
- a person may locally decline reception without declaring the other person nonexistent;
- reopening a channel need not erase the historical closure;
- a boundary declaration is self-authoritative about the declaring node's own future participation, not final ontology about the other person's essence.

This family is a design use case, not empirical evidence for radio propagation.

## Candidate cross-family inference

Allowed candidate inference:

> **Reachability is a relation among endpoints, carrier or medium, environmental conditions, time, and policy; it should not be reduced to endpoint existence alone.**

Stronger architectural candidate:

> **Channel state is not relationship state. A closed channel changes future affordance without rewriting prior encounter.**

Rejected forms:

- `unreachable => nonexistent`
- `blocked => relationship erased`
- `heard => understood`
- `decoded => attributable`
- `attributable => trusted`
- `trusted => authorized`
- `recognized => adopted`
- `physical propagation law => social law`

## Layer A — National Treasure research slice

The first durable landing should remain in National Treasure because the cross-domain compression is still being tested.

Planned artifacts:

- `threads/radio-propagation.md`
  - grounded propagation mechanisms;
  - changing path conditions;
  - weak-signal and partial-reception states;
  - source-family boundaries;
  - explicit counterexamples and limits.

- `clues/conditional-reachability.md`
  - candidate clue: reachability belongs partly to relation and environment, not merely endpoints;
  - preserve transient openings and closures without treating them as identity changes;
  - distinguish detectability, decodability, attribution, and admissibility.

- `clues/transmission-is-not-encounter.md`
  - staged sequence from emission through propagation and detection into possible encounter;
  - explicitly preserve non-arrival, partial arrival, damaged arrival, unknown attribution, and policy-refused arrival as distinct states.

No full `cases/**` investigation is required initially. If later research grows into a constituted case, it must follow the repository's case-isolation rule and travel separately from root README maintenance.

## Layer B — portable GitBook doctrine

After the research slice is reviewed, a concise portable doctrine may be proposed to GitBook.

Candidate formulations:

> **The channel is not the relationship.**

> **A boundary changes future affordance; it does not rewrite prior encounter.**

> **Absence of reception is not evidence of absence of sender.**

GitBook should preserve these as portable field doctrine or design heuristics unless and until executable fixtures justify stronger constitutional status.

## Layer C — TranchNode pressure

TranchNode already distinguishes witness, testimony, recognition, adoption, residue, living memory, and authority. The new pressure lies primarily **before** testimony becomes Field for another node.

Candidate transport/encounter staging:

```text
emission
  -> propagation
  -> detection
  -> decoding
  -> attribution
  -> local policy gate
  -> attention
  -> encounter
  -> residue
```

The stages are intentionally non-collapsible.

### Conditional reachability

Do not model reachability initially as a simple node boolean.

Candidate conceptual shape:

```text
Reachability(sender, receiver, carrier, environment, time, policy)
```

This is a design relation, not yet a canonical interface.

### Propagation witness

Before adding any new node kind, test whether existing observation / witness / receipt primitives can express a bounded statement equivalent to:

> Under these declared carrier, environment, and time conditions, this observer detected this signal or pattern at this level of completeness and attribution.

A candidate non-canonical profile may distinguish:

- carrier only;
- recognizable pattern;
- candidate identity;
- verified identity;
- payload fragment;
- complete envelope;
- no decode / partial decode / complete decode;
- unknown / candidate / verified attribution.

The witness grants no crossing authority and no authority over the sender.

Canonical ontology expansion is permitted only if fixture-backed failures show that the current TranchNode / Project0 primitives cannot express the role without semantic aliasing.

## tranchNOSE candidate role

`tranchNOSE` should be investigated first as a **boundary-sensitive relational receiver**, not as a conventional synchronization client.

Its questions are staged:

1. Can I detect something?
2. Can I identify or attribute it?
3. May I receive this source or class of signal?
4. May this payload cross the declared boundary?
5. If admitted, what local encounter and residue result?

A candidate sensory pipeline is:

```text
field
  -> listen
  -> detect
  -> decode
  -> attribute
  -> policy gate
  -> candidate encounter
```

The receiver must be able to preserve lawful intermediate states such as:

- signal detected, source unknown;
- identity detected, payload unavailable;
- payload partial or damaged;
- sender verified, channel locally closed;
- payload intelligible, adoption zero;
- relationship known, present transport unavailable.

## Relational boundary grammar

The social use case pressures a family of **local channel declarations**. These names are provisional profiles, not canonical ontology:

- **mute** — transmission may arrive, but attention is not allocated by default;
- **deafen** — decline reception from a source or class;
- **do-not-transmit** — decline outbound testimony toward a source or class;
- **seal** — presently admit neither direction;
- **filter** — admit only declared classes of signal;
- **quarantine** — permit bounded receipt while preventing ordinary crossing into active memory or behavior without an additional gate;
- **reopen** — make a previously closed channel admissible again without erasing the closure history.

Every boundary declaration must remain locally scoped and self-authoritative. It may say, in effect:

> I observed these encounters and I no longer admit this channel under these conditions.

It may not silently elevate itself into:

> This other node is ontologically toxic, false, nonexistent, or globally forbidden.

## Residue decomposition

The research suggests a useful three-way distinction for later fixtures:

1. **message residue** — what survives or changes in the transmitted form;
2. **path residue** — evidence of what the carrier / medium / route did to the signal;
3. **receiver residue** — what the admitted encounter changes locally.

These must not be presumed identical and must not be canonized until existing TranchNode residue semantics are tested against concrete specimens.

## Failure tests

The downstream implementation should include fixtures that refuse at least these collapses:

1. **No-reception erasure** — a known peer becomes `nonexistent` merely because the current channel is closed.
2. **Block erasure** — a local boundary declaration deletes or rewrites prior encounter history.
3. **Detection promotion** — detecting a carrier becomes verified identity.
4. **Decode promotion** — decoding a payload becomes trust or authority.
5. **Recognition promotion** — understanding another testimony becomes adoption.
6. **Medium sovereignty** — the transport or receiver silently acquires authority to rewrite sender or receiver state.
7. **Remote essence judgment** — a local boundary declaration becomes a global property of the other node.
8. **Reopen amnesia** — reopening a channel rewrites the historical fact that it was previously closed.
9. **Partial-state collapse** — damaged, partial, unknown-attribution, or policy-refused receptions are flattened into generic success/failure.
10. **Analogy promotion** — physical resemblance is cited as proof that the social or software rule is historically or scientifically mandated.

## Acceptance boundary

This slice graduates from research design to implementation planning only when the written spec is reviewed and approved.

A later implementation plan may then authorize, in order:

1. National Treasure thread + clues with source-addressable claim records;
2. portable GitBook doctrine or field note;
3. TranchNode fixtures testing current primitives;
4. only after fixture-backed insufficiency, consideration of a new profile or primitive;
5. only after executable evidence, any broader transport experiment for `tranchNOSE`.

## Core invariant bundle

The entire bag compresses to five invariants:

1. **Channel state is not relationship state.**
2. **A boundary changes future affordance without rewriting prior encounter.**
3. **Reachability is conditional and relational, not an intrinsic boolean property of a peer.**
4. **Transmission, reception, intelligibility, recognition, and adoption remain distinct.**
5. **The receiver remains sovereign over what crosses locally; the medium carries relation but grants no authority.**
