# National Treasure research method

This repository is allowed to follow strange leads. It is not allowed to erase the difference between evidence and story.

## Two-axis evidence grammar

Every material claim should carry two independent labels when the distinction matters.

### Provenance class

- **Observed** — directly witnessed artifact, image, text, measurement, or documented feature.
- **Primary source** — firsthand text, image, record, instrument, law, case, or artifact produced by a relevant actor or institution.
- **Inference** — a reasoned conclusion drawn from observed or primary material.
- **Speculation** — a hypothesis not yet sufficiently grounded.
- **Failed** — a hypothesis, count, mapping, alignment, or interpretation that did not survive testing.

### Support confidence

- **Established** — supported by strong primary evidence and/or durable independent scholarship; material contradiction is not presently known.
- **Probable** — best-supported reading, but some evidentiary or interpretive uncertainty remains.
- **Possible** — coherent enough to preserve and test, but not sufficiently supported to rely on.
- **Unsupported** — presently lacks adequate evidence, conflicts with stronger evidence, or depends on a chain that has not survived checking.

The axes must not be collapsed. A primary source can support an unsupported claim. An inference can be established if the underlying evidence and reasoning are unusually strong.

## Procedure

1. **State the claim before searching for confirmation.** A falsifiable claim is easier to test than a mood.
2. **Preserve the source object.** Record enough information to re-find the document, artifact, page, image, case, statute, archive, or dataset.
3. **Separate quotation from interpretation.** Do not make a source say more than it says.
4. **Track chronology.** Similarity across centuries is not lineage unless transmission or development can be shown.
5. **Prefer independent convergence.** Multiple sources copying one ancestor are one evidentiary family, not many.
6. **Record counterevidence and failed alignments.** Negative space is part of the map.
7. **Do not promote architectural usefulness into historical truth.** A pattern can inspire software even if its claimed genealogy later fails.
8. **Do not promote historical resemblance into legal validity.** This repository is research, not a legal instrument or substitute for professional advice.

## Claim record

A useful minimum record:

```yaml
claim_id: NT-...
claim: "..."
provenance_class: observed | primary | inference | speculation | failed
support_confidence: established | probable | possible | unsupported
source_family: "..."
source_locator: "..."
chronology: "..."
reasoning: "..."
counterevidence: "..."
open_questions: "..."
downstream_relevance: "..."
```

## House rule

> Wild hypotheses are welcome. Convergence must be earned.

The point is not to make the mystery disappear. The point is to know which parts of the mystery are carrying weight.