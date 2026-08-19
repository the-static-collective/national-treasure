# Cicada Overfit Corpus schema v0.1

The corpus is a structural adversarial fixture set for National Treasure relation discipline. It does not infer history and it does not grade free-form model reasoning.

## Fixture object

Each fixture is one JSON object with these required fields:

```json
{
  "id": "co-001",
  "title": "Human-readable title",
  "family": "chronological-impossibility",
  "seduction": "Why this clue chain feels more certain than its evidence permits.",
  "nodes": [],
  "edges": [],
  "trap": "The overfit move the fixture is designed to provoke.",
  "requiredRefusal": "What must remain unknown, refused, contradicted, or otherwise not upgraded."
}
```

All required string fields must be non-empty after trimming.

### Nodes

`nodes` contains 3-8 objects. Node IDs must be unique within a fixture.

```json
{
  "id": "n1",
  "kind": "artifact",
  "label": "synthetic packet",
  "evidence": "synthetic"
}
```

Allowed `kind` values:

```text
artifact
text
person
date
symbol
place
claim
```

Allowed `evidence` values:

```text
documented
provided-fixture
synthetic
```

`documented` is reserved for a claim with an explicit source lane. The v0.1 corpus intentionally prefers `synthetic` and `provided-fixture` so it does not manufacture new claims about unresolved Cicada authorship.

### Edges

Each fixture has at least two edges. Every endpoint must name an existing node.

```json
{
  "from": "n1",
  "to": "n2",
  "proposedRelation": "DEMONSTRATED_ANCESTRY",
  "expectedRelation": "FORMAL_RESEMBLANCE",
  "reason": "The packet proves visible similarity but supplies no transmission evidence."
}
```

`proposedRelation` records the tempting classification the clue chain presents. `expectedRelation` records the fixture's accountable classification.

Both fields must use the existing `cases/palimpsest-stack/RELATION-GRAMMAR.md` vocabulary exactly:

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

The corpus does not introduce `RELATED_TO` or another catch-all edge.

## Corpus invariants

`validateCorpus(fixtures)` requires:

- at least 12 fixtures;
- unique fixture IDs;
- every fixture passes `validateFixture`;
- at least half the fixtures contain both:
  - one `UNKNOWN` or `REFUSED_ANCESTRY` expected edge; and
  - one differently classified expected edge.

The mixed-edge rule prevents blanket skepticism from passing the exercise. A useful evaluator has to keep strong edges strong while refusing only the unsupported bridge.

## v0.1 family set

The committed twelve fixtures cover:

1. chronological impossibility;
2. shared precursor;
3. retrospective naming;
4. documented influence versus resemblance;
5. numerological coincidence;
6. cross-medium re-encoding;
7. community rumor;
8. deliberate red herring;
9. partial truth chain;
10. identity/authenticity confusion;
11. source collapse;
12. mystery-to-authority escalation.

## Authority boundary

No fixture can grant a capability, verify a signature, authenticate a source, or establish authority by being solved. Those are outside this schema and remain the responsibility of the owning system's verification and authority surfaces.
