# Same State, Different World — Sources

This is the initial source floor, not a completed literature review. The case should grow outward only when a concrete specimen requires deeper support.

## Core identifiability anchor

### Wieland et al. (2021) — structural vs practical identifiability

Franz-Georg Wieland, Adrian L. Hauber, Marcus Rosenblatt, Christian Tönsing, and Jens Timmer. **“On structural and practical identifiability.”** *Current Opinion in Systems Biology* (2021).

Consensus record: https://consensus.app/papers/on-structural-and-practical-identifiability-wieland-hauber/9b9daf44a7a750c09db78f9ff3ee24e2/?utm_source=chatgpt

**Use here:** Establishes the distinction between structural non-identifiability and practical non-identifiability in partially observed dynamical systems. Useful for building biology/chemistry specimens where the solver must distinguish “impossible in principle” from “not recoverable from the present data.”

**Do not overclaim:** This literature does not imply that every underdetermined problem should be described using systems-biology identifiability terminology.

## Core invariance anchor

### Peters, Bühlmann & Meinshausen (2015) — invariant causal prediction

J. Peters, Peter Bühlmann, and Nicolai Meinshausen. **“Causal inference by using invariant prediction: identification and confidence intervals.”** *Journal of the Royal Statistical Society: Series B (Statistical Methodology)*, vol. 78 (2015).

Consensus record: https://consensus.app/papers/causal-inference-by-using-invariant-prediction-peters-buhlmann/666a5c5259d25d288d6e89459027b249/?utm_source=chatgpt

**Use here:** Supplies a formal research bridge from heterogeneous environments/interventions to identification of causal predictors under stated assumptions. Particularly useful for tasks where one model predicts well in one environment but fails under intervention.

**Do not overclaim:** Invariance is not an assumption-free certificate of causality. The environment structure and causal-model assumptions matter.

## Prediction-versus-intervention anchor

### Prosperi et al. (2020) — prediction is not intervention

Mattia Prosperi et al. **“Causal inference and counterfactual prediction in machine learning for actionable healthcare.”** *Nature Machine Intelligence* 2 (2020): 369–375.

Consensus record: https://consensus.app/papers/causal-inference-and-counterfactual-prediction-in-prosperi-guo/4ba0e48f984f5e26a196e4a10383fa90/?utm_source=chatgpt

**Use here:** Cleanly separates observational prediction from causal/interventional claims and discusses counterfactuals, transportability, and prediction invariance. This is useful for response-comparison tasks where an apparently polished answer silently converts association into intervention advice.

**Do not overclaim:** The paper is healthcare-focused; the underlying causal distinction is broader, but domain-specific conclusions should not be transported without support.

## Repository method anchor

### National Treasure research method

[`../../METHOD.md`](../../METHOD.md)

**Use here:** Provides the case’s evidence grammar: observed / primary / inference / speculation / failed, independently crossed with established / probable / possible / unsupported. It also requires chronology, counterevidence, source-family awareness, and preservation of failed alignments.

This case extends that discipline into a formal question:

> When several worlds survive the same witness, what additional witness actually changes the admissible conclusion?

## Literature expansion queue

Expand only when a specimen needs it.

### Mathematics / inverse problems

- Well-posedness and uniqueness of inverse problems.
- Regularization when inversion is unstable rather than non-unique.
- Equivalence classes under partial observation.
- Minimal sufficient statistics / discriminating invariants where applicable.

### Physics

- Inverse source problems.
- Boundary measurements and uniqueness theorems.
- Tomographic non-uniqueness and limited-angle reconstruction.
- Gauge-equivalent descriptions versus physically distinguishable states.

### Chemistry

- Reaction-network identifiability.
- Competing kinetic mechanisms.
- Isotope-labeling and perturbation experiments as discriminators.
- Parameter sloppiness versus structural non-identifiability.

### Biology

- ODE model identifiability.
- Gene-network perturbation.
- Partial observability.
- Optimal experimental design for parameter/mechanism discrimination.

### Causal inference / social science

- Transportability across populations and environments.
- Natural experiments.
- Measurement invariance.
- Shared-source dependence versus independent convergence.

## Source admission rule

A source enters the case because it bears on a concrete claim or specimen, not because it is generally interesting.

For each new source record:

```text
source
  -> exact claim it bears on
  -> whether it supports uniqueness, ambiguity, invariance, or discrimination
  -> assumptions
  -> known counterexamples / limitations
  -> specimen(s) enabled
```

A bibliography that does not change the research state is not progress.