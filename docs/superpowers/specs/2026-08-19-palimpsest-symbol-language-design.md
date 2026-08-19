# Palimpsest + symbol language design

Date: 2026-08-19
Status: **approved research/design slice; downstream executable adoption remains gated**

## Goal

Turn the geometry/language/Enoch/Leonardo/Escher/Bacon research stack into a disciplined National Treasure case that produces practical eCODEsystem architecture without claiming a single hidden historical transmission.

A secondary goal is to test whether an explicitly invented geometric vocabulary can become useful as a visual continuity projection while preserving the authority boundary.

## Design choice

Use National Treasure as an **epistemic incubator** rather than immediately modifying Project0, TranchNode, Toaster, Corpus OS, or other executable repositories.

The case owns:

1. historical claim separation;
2. source/provenance map;
3. typed relation vocabulary;
4. a machine-readable symbol catalogue;
5. a visual catalogue;
6. architectural extraction and graduation gates.

Project-owned repositories remain authoritative for executable behavior.

## Alternatives considered

### A. One grand historical narrative

Rejected.

It would maximize aesthetic coherence while hiding the exact question the research needs to preserve: which connections are ancestry, resemblance, later naming, independent reinvention, or unknown.

### B. Immediately add shared relation/symbol primitives to Project0

Rejected for now.

The vocabulary is promising but has only one adversarial research domain. Shared law should wait for at least one materially different specimen.

### C. Incubate in National Treasure, then graduate only proven invariants

Selected.

This preserves high weirdness while keeping architectural claims reversible.

## Components

### `README.md`

Case orientation and current findings.

### `CLAIM-LEDGER.md`

Falsifiable claims with provenance/confidence and explicit unsupported ancestry edges.

### `SOURCES.md`

Starting provenance map. Source objects remain separable from interpretation.

### `RELATION-GRAMMAR.md`

Typed relation semantics. The key design is refusal to collapse all connections into `RELATED_TO`.

### `SHAPE-LANGUAGE.md`

Explicitly new eCODE-native shape vocabulary plus the Witness Sigil proposal.

### `symbol-catalogue.json`

Machine-readable catalogue. It is data for experimentation, not shared semantic law.

### `symbol-catalogue.svg`

Human-readable projection of the primitive catalogue.

### `ECODESYSTEM-EXTRACTION.md`

Practical architecture, owners, boundaries, and graduation gates.

## Data / authority flow

```text
historical specimen
  -> preserved source locator
  -> claim
  -> typed relation proposal
  -> confidence / counterevidence
  -> architectural analogy
  -> National Treasure design artifact
  -X-> no automatic downstream authority
```

For Witness Sigils:

```text
canonical digest / receipt
  -> deterministic versioned projection
  -> human-visible geometric sigil

canonical digest remains authority
sigil remains projection
```

## Failure behavior

- If an ancestry claim lacks transmission evidence, record `CLAIMED_ANCESTRY`, `REFUSED_ANCESTRY`, or `UNKNOWN`; do not delete the clue.
- If a modern name is discovered on an older-looking form, preserve the name and specimen as separate layers.
- If a shape match is computationally strong but historically unsupported, keep `FORMAL_RESEMBLANCE` only.
- If a Witness Sigil projection collides visually, the underlying digest decides identity; the sigil never adjudicates.
- If the symbol vocabulary causes ambiguity, it stays local to this case.

## Verification

This slice is docs/data only.

Verification requires:

1. every historical claim that carries architectural weight has a source lane or explicit open-source obligation;
2. unsupported claims are labeled as such;
3. `symbol-catalogue.json` parses as JSON;
4. `symbol-catalogue.svg` is well-formed XML/SVG;
5. the branch diff contains only the intended National Treasure case/spec/index paths;
6. the PR is stacked on the current evidence-method branch so it does not duplicate `METHOD.md`.

## Non-goals

This slice does not:

- prove a hidden universal language;
- prove ancient origin for modern sacred-geometry nomenclature;
- establish Baconian Shakespeare authorship;
- claim Dee's angelical language descends linguistically from ancient Enochic texts;
- change Project0, TranchNode, Toaster, Corpus OS, or any shared runtime;
- introduce a new cryptographic primitive;
- allow a visual sigil to create or prove authority.

## Graduation gates

A relation type or visual primitive may move toward shared eCODEsystem law only when:

1. a second materially different domain needs the same invariant;
2. the common semantics are clearer than local metaphors;
3. machine-readable fixtures can distinguish valid/invalid transitions;
4. authority/projection boundaries remain explicit;
5. at least one human witness confirms the abstraction improves re-entry or error detection.

## Design thesis

> Forms can survive while meanings change; meanings can survive while forms change; names can move independently of both. Continuity lives in the witnessed transformations between them.
