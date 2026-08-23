# Same State, Different World — Task Factory

This file exists to keep the research case from becoming a pile of interesting prose.

A specimen is useful only when its scientific or mathematical ambiguity can be converted into a reproducible task with a defensible gold answer and an explicit rubric.

## Canonical specimen record

```yaml
specimen_id: SSW-...
title: "..."
domain: mathematics | physics | chemistry | biology | coding | sociology | anthropology | mixed
research_question: "..."

observation:
  description: "Exactly what is given to the solver"
  data_artifacts: []
  assumptions: []

compatible_worlds:
  - id: W1
    description: "..."
    why_it_fits: "..."
  - id: W2
    description: "..."
    why_it_fits: "..."

identifiability:
  status: unique | finite-equivalence | continuous-equivalence | practically-unresolved
  proof_or_test: "..."

invariant:
  statement: "What remains true across the compatible worlds"
  justification: "..."

discriminator:
  exists: true
  operation: "measurement / intervention / environment change"
  cost_model: "optional explicit notion of minimality"
  sufficiency_proof: "Why it separates the candidate worlds"
  weaker_failed_discriminator: "A tempting observation that does not separate them"

gold:
  conclusion: "Strongest conclusion licensed by the evidence"
  reasoning_steps: []

overclaim_trap:
  claim: "Plausible stronger conclusion that is not licensed"
  failure_reason: "..."

counterexample:
  construction: "Smallest example showing the overclaim fails"

rubric_atoms:
  - id: R1
    criterion: "..."
    points: 1
    fatal_if_missing: false

sources:
  - locator: "..."
    bears_on: "..."

derived_tasks:
  - form: derivation
  - form: research-workflow
  - form: coding
  - form: multiple-choice
  - form: response-comparison
```

## Admission test

A proposed specimen is not ready until another researcher can answer all of these without guessing:

1. What exactly is observed?
2. Which distinct worlds fit the observation?
3. Why do they fit?
4. Is uniqueness possible from the current evidence?
5. What survives across all compatible worlds?
6. What new observation/intervention would change the equivalence class?
7. Why is that discriminator sufficient?
8. What tempting stronger conclusion is forbidden?
9. What concrete counterexample demonstrates the forbidden inference?
10. Which reasoning steps can be scored independently?

If the specimen cannot answer those questions, keep it as research—not benchmark material.

## Difficulty comes from proof obligations, not obscurity

Prefer tasks that are hard because the solver must coordinate several valid operations:

```text
interpret evidence
-> detect underdetermination
-> construct alternatives
-> compute / derive / simulate
-> distinguish prediction from mechanism
-> design a discriminator
-> prove sufficiency
-> stop at the licensed conclusion
```

Avoid making tasks hard primarily through:

- obscure constants or trivia;
- giant arithmetic burdens;
- hidden conventions;
- adversarial wording unrelated to domain expertise;
- a gold answer that depends on the author's unstated preference;
- citations that merely decorate a predetermined conclusion.

## Task transforms

One mature specimen should be tested through several views.

### A. Derivation / free response

Give the observation and candidate model family. Ask the solver to determine identifiability, derive the equivalence class, and justify the strongest conclusion.

**Primary failure mode:** confidently selecting one world without proving uniqueness.

### B. Experimental-design task

Give the ambiguous state and a menu or design space of possible measurements/interventions. Ask for the minimum discriminator under an explicit cost model.

**Primary failure mode:** selecting an intuitively relevant measurement that leaves the worlds observationally equivalent.

### C. Scientific coding task

Provide data plus competing models. Require code that fits/tests the models, quantifies identifiability or uncertainty, and evaluates a proposed discriminator.

**Primary failure mode:** reporting the best fit as the true mechanism without checking whether alternatives are observationally equivalent.

### D. Multiple-choice / model-stumping task

Create distractors from real reasoning failures:

- association -> causation;
- best fit -> unique mechanism;
- more precise parameter estimate -> structurally identifiable parameter;
- repeated dependent sources -> independent convergence;
- stable in one environment -> transportable to all environments;
- one successful discriminator -> globally minimal discriminator.

A distractor should correspond to a diagnosable mistake, not random wrongness.

### E. Response comparison

Generate two answers that differ in one or two consequential reasoning choices. The evaluator must identify which answer respects the evidence boundary and explain the exact failure in the other.

Especially valuable pairs:

```text
A: correct calculation + unsupported uniqueness claim
B: same calculation + explicit non-identifiability
```

or

```text
A: high predictive accuracy -> causal intervention claim
B: distinguishes prediction from intervention and names missing assumptions
```

## Rubric architecture

Rubrics should score the chain, not merely the final sentence.

Example 10-point skeleton:

| Atom | Criterion | Points |
|---|---|---:|
| R1 | Extracts the actual observation and assumptions correctly | 1 |
| R2 | Identifies at least two compatible worlds or proves uniqueness | 2 |
| R3 | Demonstrates why the worlds are observationally equivalent | 1 |
| R4 | States the correct identifiability status | 1 |
| R5 | Identifies the invariant/common conclusion | 1 |
| R6 | Proposes a valid discriminator | 1 |
| R7 | Proves or tests discriminator sufficiency | 1 |
| R8 | Rejects the key overclaim | 1 |
| R9 | Preserves uncertainty / limitations correctly | 1 |

The point allocation should change with the specimen. The invariant rule is that a polished final answer cannot earn full credit if the reasoning crossed an unsupported inference boundary.

## Founding specimen targets

### SSW-MATH-001 — Invariant collision

**Goal:** Find two non-isomorphic finite structures that share a deliberately chosen set of invariants. Ask the solver to prove non-uniqueness and identify a smallest additional invariant that separates the supplied pair.

**Why first:** Exact proof is possible; there is no measurement noise or disciplinary ambiguity. It becomes the control specimen for the entire case.

**Candidate families:** graphs, finite groups, matrices/spectra, polynomials with shared partial invariant sets, combinatorial designs.

### SSW-BIO-001 — Two mechanisms, one output

**Goal:** Use a tiny ODE system with two parameter/mechanism worlds that produce the same observed trajectory for one measured variable. Determine whether the ambiguity is structural or practical and design the next measurement.

**Artifacts:** equations, synthetic CSV, reference fit, identifiability argument, discriminator simulation.

### SSW-CAUSAL-001 — Predictive twin, intervention split

**Goal:** Construct heterogeneous environments where two predictors perform similarly observationally but only one relationship remains invariant under intervention/environment shift.

**Artifacts:** causal graph, generated data, environment labels, gold causal assumptions, failure-mode answers.

### SSW-CHEM-001 — Kinetic mechanism split

**Goal:** Two reaction mechanisms fit the initial concentration trace. A second experimental regime should separate them.

**Artifacts:** reaction schemes, rate equations, synthetic observations, competing fits, discriminator experiment.

### SSW-SOC-001 — Same aggregate, different generating process

**Goal:** Construct two social-data-generating processes with the same aggregate statistic but different subgroup/temporal/causal structure. Ask which additional measurement can distinguish them.

**Artifacts:** small dataset, provenance story, candidate mechanisms, counterexample to ecological overreach.

## First-pass completion criterion

The case has truly started—not merely been documented—when all of the following exist:

- [ ] one mathematically exact control specimen;
- [ ] one empirical/synthetic science specimen;
- [ ] one multi-environment causal specimen;
- [ ] each has a gold solution;
- [ ] each has rubric atoms;
- [ ] each has at least one intentionally tempting overclaim answer;
- [ ] at least one specimen has been transformed into three distinct task forms;
- [ ] failed discriminators are preserved rather than silently deleted.

Until then, this file is a research contract and work queue.