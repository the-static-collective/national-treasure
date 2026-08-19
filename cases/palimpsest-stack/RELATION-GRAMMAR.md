# Relation grammar — do not collapse the clue

Status: **design extraction from the palimpsest case; proposed vocabulary, not adopted cross-project law**

A generic knowledge-graph edge such as `RELATED_TO` is too lossy for this research.

The whole point of the case is that two things can be strongly related in one sense and completely unrelated in another.

## Minimum relation set

```text
DEMONSTRATED_ANCESTRY
CLAIMED_ANCESTRY
SHARED_PRECURSOR
DOCUMENTED_INFLUENCE
TRANSLATION
TRANSLITERATION
REENCODING
REINTERPRETATION
FORMAL_RESEMBLANCE
STRUCTURAL_ISOMORPHISM
CONTEXTUAL_ASSOCIATION
RETROSPECTIVE_NAMING
CONTRADICTION
REFUSED_ANCESTRY
UNKNOWN
```

## Semantics

### `DEMONSTRATED_ANCESTRY`

A historically supported transmission/development edge.

Requires chronology plus an evidentiary bridge stronger than resemblance.

Example:

```text
Phoenician alphabet
  -> Greek alphabet
kind: DEMONSTRATED_ANCESTRY
```

### `CLAIMED_ANCESTRY`

Someone asserts lineage, but the repository has not established it.

Example:

```text
ancient Metatron tradition
  -> modern "Metatron's Cube"
kind: CLAIMED_ANCESTRY
```

This is a claim object, not a weak version of demonstrated ancestry.

### `SHARED_PRECURSOR`

Two later forms inherit from an earlier family without one being the parent of the other.

This is crucial for script history and prevents a misleading single ladder.

### `DOCUMENTED_INFLUENCE`

The receiving actor demonstrably encountered or studied the source.

Example:

```text
Alhambra ornament
  -> Escher tessellation practice
kind: DOCUMENTED_INFLUENCE
```

### `TRANSLATION`

Meaning is intentionally moved between languages while representation changes.

### `TRANSLITERATION`

Writing-system representation changes while the target is primarily form/sound correspondence, not semantic translation.

### `REENCODING`

The same or intentionally preserved information is represented under a different code.

Bacon's biliteral cipher is a clean historical specimen: alphabetic symbols can be re-encoded as sequences of two distinguishable classes.

### `REINTERPRETATION`

An existing object survives but receives a new explanatory frame.

### `FORMAL_RESEMBLANCE`

Two objects have measurable visual/geometric similarity.

This edge is intentionally agnostic about history.

### `STRUCTURAL_ISOMORPHISM`

Two systems share a transformation/relationship structure that can be mapped without asserting common origin.

This is the preferred edge for architectural composting.

### `CONTEXTUAL_ASSOCIATION`

Objects appear in the same intellectual, social, ritual, artistic, or historical environment.

Association is not influence.

### `RETROSPECTIVE_NAMING`

A later name is applied backward to an older specimen.

This edge should be highly visible because it is one of the most common engines of accidental mythology.

### `CONTRADICTION`

Evidence directly pressures another claim or interpretation.

### `REFUSED_ANCESTRY`

A proposed ancestry edge has been evaluated and presently fails its evidence gate.

Do not delete it. The refusal is durable negative knowledge.

### `UNKNOWN`

The relationship has not been responsibly classified.

`UNKNOWN` is preferable to a guessed edge.

## Relation record

```yaml
relation_id: NT-R-...
left_ref: "..."
right_ref: "..."
kind: FORMAL_RESEMBLANCE
claim_provenance: inference
support_confidence: probable
evidence_refs:
  - "..."
chronology: "..."
transmission_mechanism: null
invariants_observed:
  - "..."
differences_observed:
  - "..."
falsifier: "..."
notes: "..."
```

## Multi-edge rule

The same two objects may carry multiple simultaneous edges.

For example:

```text
older overlapping-circle specimen
  -- FORMAL_RESEMBLANCE --> modern Flower-of-Life diagram
  -- RETROSPECTIVE_NAMING --> modern Flower-of-Life label
  -/ REFUSED_ANCESTRY --> full modern sacred-geometry doctrine
```

This is not indecision. It is higher-resolution knowledge.

## Architectural invariant

> **A compelling projection must not silently upgrade its edge type.**

A visual match remains `FORMAL_RESEMBLANCE` until evidence earns something stronger.
A useful analogy remains `STRUCTURAL_ISOMORPHISM` until history earns ancestry.
A name remains a name until continuity is witnessed.
