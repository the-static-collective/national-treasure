# Entrusted Corpus design

Date: 2026-08-19
Status: **design approved in conversation; implementation not yet authorized by this spec**

## Problem

The Static Collective increasingly has durable project objects whose identity, purpose, authority, and memory matter beyond one account holder, repository host, or execution session.

Existing primitives already separate parts of this problem:

- adopted roots and lawful reachability;
- Trust admission and Action Warrants;
- capability execution;
- terminal receipts;
- immutable/projection-oriented artifact identity;
- refusal topology and constituted reality.

Trust archaeology suggests that these are not isolated software concerns. Long-lived human institutions have repeatedly needed to separate possession, authority, benefit, purpose, accounting, and succession.

The risk is overfitting history into code or prematurely turning an architectural analogy into a legal claim.

## Decision

Create a bounded **Entrusted Corpus** research/design layer in `national-treasure` with five responsibilities:

1. preserve historical and comparative trust research with explicit provenance/confidence;
2. extract architectural hypotheses without claiming genealogy prematurely;
3. map promising downstream doors without changing downstream code;
4. keep legal adoption explicitly out of scope;
5. establish graduation gates for any future shared primitive.

National Treasure is the archaeology authority for this thread. Project-owned repositories remain canonical for executable behavior. GitBook may publish an incubating constellation that points to the research and existing project evidence without becoming canonical implementation authority.

## Core design

### Constituted corpus

A durable subject whose identity is not reduced to its current custodian, repository, projection, or operator.

### Purpose

A declared constraint explaining why entrusted powers exist. Purpose may inform challenge/review, but this design does not create an automated legal or moral oracle.

### Entrustment

A relationship binding actor/capacity, subject, source authority, granted/withheld powers, duties, evidence requirements, delegation limits, and succession conditions.

### Admitted act

A proposed consequence that has crossed the relevant authority boundary. Existing project-specific warrant semantics remain authoritative where already implemented.

### Accounting / receipt

Durable evidence connecting authority, attempted exercise, refusal/failure/completion, and terminal state.

### Succession

A constitution event that can change the acting steward or authoritative projection without silently rewriting corpus history or pretending continuity where none was proved.

## Architectural invariant

```text
custody != corpus identity
control != authority
authority != purpose
purpose != benefit
copying evidence != copying authority
succession != retroactive identity
repository ancestry != project authority
```

## Alternatives considered

### A. Rename existing Corpus OS trust objects and make them the universal model

Rejected for now. Corpus OS is valuable executable evidence, but its current Trust Runtime and Action Warrant semantics are one implementation context. Promoting them directly would risk making a local model universal before a second materially different specimen exists.

### B. Treat trust history as inspirational documentation only

Rejected. The convergence is strong enough to justify structured research and explicit testable questions. Leaving it as prose would lose falsifiability, source families, failure records, and downstream boundaries.

### C. Build a new shared Entrusted Authority package immediately

Rejected. This is architecture astronautics until two systems demonstrate the same invariant and a succession/migration specimen proves the shared residue.

### D. Preserve archaeology first, expose bounded downstream doors

Accepted. It is reversible, evidence-friendly, and does not weaken existing authority boundaries.

## Data / evidence flow

```text
historical or project source
    -> claim record
    -> provenance class
    -> confidence
    -> counterevidence / residual fog
    -> architectural extraction
    -> downstream door
    -> local project specimen (future)
    -> comparison across specimens
    -> possible pattern graduation
```

No arrow permits a historical claim to become executable authority merely by being documented.

## Failure handling

- Contradicted historical claims move to **Failed** or **Unsupported**; they are not silently deleted.
- Unavailable source material remains unresolved.
- Architectural analogies that fail executable testing remain preserved as failed hypotheses.
- If a downstream implementation would require a second identity law, it must stop and reconcile with Project0 rather than fork constitutional semantics.
- If legal validity becomes material, the software design stops at the evidence boundary and defers the legal conclusion to qualified humans.

## Validation for this slice

This documentation slice is valid when:

- the repository has a method defining provenance and confidence separately;
- the trust-archaeology case clearly distinguishes history, architecture, and legal application;
- the architectural extraction names testable cases rather than only metaphors;
- downstream projects are mapped as doors, not silently modified;
- the README exposes the new case;
- a GitBook incubator note points to existing executable evidence while keeping canonical authority in project repos;
- follow-up implementation work is represented by bounded issues, not hidden inside documentation commits.

## Non-goals

This design does not:

- create or select a legal trust;
- transfer any asset;
- alter GitHub organization/repository ownership;
- modify Corpus OS, Project0, or TranchNode code;
- define tax, estate, fiduciary, licensing, or jurisdictional conclusions;
- establish a universal shared package;
- claim a single continuous historical genealogy of the modern trust.

## Graduation gates

A shared entrusted-systems primitive is not warranted until:

1. at least two materially different executable systems demonstrate the same invariant;
2. one real succession, migration, or re-projection specimen exists;
3. failure/refusal behavior is demonstrated, not only happy-path handoff;
4. copied representation demonstrably cannot manufacture authority;
5. the shared abstraction reduces complexity rather than creating terminology overhead;
6. legal vocabulary is either semantically accurate or replaced with neutral system vocabulary.

## Review note

This spec deliberately ends before implementation planning. Per the design workflow, downstream code work should begin only after review of this written spec and a separately scoped implementation plan.