# Architectural extraction — entrusted systems

Status: **proposed architectural vocabulary; not adopted cross-project law**

## The primitive beneath the metaphor

The strongest reusable idea from trust archaeology is not a role called `trustee`.

It is the separation of a durable subject from the temporary humans or processes exercising powers around it.

A compact model:

```text
Constituted Corpus
    |
    +-- Purpose
    |
    +-- Entrustment
    |     +-- actor / capacity
    |     +-- granted powers
    |     +-- withheld powers
    |     +-- duties / constraints
    |     +-- delegation law
    |     +-- review / challenge path
    |     +-- expiry / exhaustion
    |     +-- succession conditions
    |
    +-- Admitted Acts
    |     +-- consequence request
    |     +-- warrant / authority evidence
    |     +-- execution
    |     +-- terminal receipt
    |
    +-- Beneficial Outcomes
    |
    +-- Succession
          +-- incapacity / departure / replacement
          +-- corpus continuity
          +-- purpose continuity
          +-- authority reconstitution
```

## Entrusted authority

Generic access control usually answers:

> Can this identity perform this operation?

Entrusted authority asks a richer question:

> Under what originating authority may this actor exercise this power over this corpus, for what purpose, with what limits, and what must remain afterward to prove what happened?

A future neutral representation might need fields conceptually equivalent to:

```text
entrustment_id
subject_ref
source_authority_ref
actor_ref
capacity
purpose_ref
powers_granted[]
powers_withheld[]
duties[]
delegation_policy
review_authority_ref
valid_from
expires_or_exhausts
succession_policy_ref
evidence_policy_ref
```

These are conceptual responsibilities, not a proposed schema. Existing Project0/TranchNode/Corpus OS primitives must outrank this note where they already encode stronger invariants.

## Law/form and purpose/equity as two questions

Many systems answer only the mechanical question:

```text
Is action X admitted by the declared rule set?
```

Long-duration entrusted systems may also need a distinct, auditable purpose question:

```text
Would exercising admitted power X contradict the purpose under which the power was entrusted?
```

Do **not** collapse these into an opaque AI “ethics” oracle.

A safer architecture keeps them explicit:

```text
FORM / ADMISSION
  deterministic policy surface
  -> admitted / refused

PURPOSE / FIDELITY
  declared purpose + bounded evidence
  -> compatible / challenged / unresolved
```

A challenged or unresolved purpose question should not be silently rewritten as legal invalidity. Depending on the eventual system, it may trigger review, require stronger authority, preserve a refusal, or remain advisory.

## Accounting as state transition witness

Entrusted power without durable accounting becomes indistinguishable from possession.

The accounting invariant is therefore broader than logs:

```text
received authority
  -> proposed exercise
  -> admission / refusal
  -> attempted consequence
  -> terminal outcome
  -> durable evidence
```

This closely resembles the Collective's existing conservation-of-authority and receipt work. The research value is that the architecture may be rediscovering a very old institutional pressure: power over a corpus becomes safer when its origin, scope, exercise, and aftermath are separately witnessable.

That resemblance is an inference. It is not yet a historical lineage claim.

## Succession is a first-class failure mode

Most software identity models are optimized for a living account owner and a functioning vendor.

A purpose-bearing corpus should instead force explicit questions:

- What survives the founder?
- What survives the current maintainer?
- What survives the hosting provider?
- What happens if the steward disappears, becomes incapable, acts outside purpose, or cannot produce required evidence?
- Can a successor be constituted without pretending they were always the prior actor?
- Can the corpus remain itself while its representation, repository host, signing keys, or administrative surface changes?

This suggests a **succession-capable stewardship membrane** around durable projects.

The membrane is not the corpus. The current steward is not the corpus. The current repository is not necessarily the corpus.

## Repository is not sovereign object

For a long-lived project, GitHub may be one entrusted container of a broader continuing corpus.

A stronger identity model would allow statements like:

```text
this repository is a current authoritative projection of corpus C
```

instead of:

```text
corpus C is whatever currently exists in this repository account
```

That distinction creates room for lawful migration, disaster recovery, succession, archival continuity, and multiple bounded projections without giving every copy equal authority.

## Design pressure on forks

Git treats lineage well at the commit graph level, but project continuity can involve more than ancestry.

A future entrusted-corpus model could distinguish:

- genealogical fork — derived bytes/history;
- authorized projection — a representation currently empowered to speak for the corpus;
- successor projection — a newly constituted authoritative representation after a lawful succession event;
- archival witness — preserved evidence with no current operational authority;
- foreign fork — valid derivative work that does not claim corpus authority.

This is only an architectural possibility. It must not be used to erase open-source licensing rights or to imply ownership powers that do not exist.

## Anti-patterns

Reject these shortcuts:

1. **Rename RBAC roles to trustee/beneficiary.** Vocabulary without changed invariants adds confusion.
2. **Make purpose an editable description field.** If purpose constrains authority, changing purpose itself needs authority and receipts.
3. **Let possession prove authority.** Holding bytes, credentials, or a repo admin role is evidence of control, not necessarily evidence of constituted authority.
4. **Let a copied warrant remain live.** Representation of authority must not automatically duplicate authority.
5. **Treat succession as account recovery.** Recovery restores access; succession may constitute a new actor/capacity while preserving corpus continuity.
6. **Let historical resemblance become legal authority.** National Treasure preserves clues; jurisdiction-specific law decides legal effect.

## Testable architectural questions

A downstream prototype earns attention only if it can answer concrete cases better than ordinary ACLs:

- A maintainer has technical admin permission but lacks authority for one class of act. Can the system refuse before consequence?
- A properly admitted act fails at the host boundary. Can the system preserve both spent authority and failed consequence?
- A steward disappears. Can a successor be constituted without rewriting prior history?
- GitHub becomes unavailable. Can the corpus be reprojected elsewhere with continuity evidence?
- A copy of an authority-bearing object is made. Does the copy remain non-authoritative?
- A mechanically allowed act conflicts with declared purpose. Can the system preserve the challenge without fabricating a legal conclusion?

## Architectural verdict

The likely durable primitive is not “Trust OS.”

It is:

> **A constituted corpus can outlive any particular custodian when authority around it is purpose-bound, bounded, consumable where appropriate, receipt-bearing, reviewable, and succession-capable.**

Keep that statement in the incubator until materially different systems prove it.