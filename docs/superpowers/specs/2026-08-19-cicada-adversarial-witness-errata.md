# Cicada adversarial witness design errata

Date: 2026-08-19
Status: **normative correction to the approved design**

## Relation-vocabulary correction

The approved design says the Cicada Overfit Corpus must reuse the existing palimpsest relation grammar, but its illustrative relation list accidentally omitted four already-declared relation types.

The source of truth is `cases/palimpsest-stack/RELATION-GRAMMAR.md`, whose minimum relation set is:

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

Therefore:

- the Overfit Corpus validator MUST accept exactly the existing 15 relation types above;
- it MUST NOT narrow the grammar to the shorter illustrative list in the design or implementation plan;
- it MUST NOT invent additional relation types;
- the implementation should test the validator's exported set against this complete expected vocabulary.

This correction does not change the approved architecture, authority boundary, fixture families, or downstream gate. It makes the implementation conform to the design's stated intent: **reuse the existing grammar rather than create a parallel ontology**.
