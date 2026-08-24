# Same State, Different World

**Status:** active research case  
**Date opened:** 2026-08-23

> **Research question:** When the same observed state is compatible with multiple underlying worlds, what additional observation or intervention is sufficient to distinguish them—and when is no unique conclusion licensed at all?

This case turns a recurring eCODE intuition into a research program grounded in established mathematical and scientific ideas: inverse problems, identifiability, causal invariance, experimental design, coarse-graining, and evidence lineage.

It also has a second purpose: produce reusable, expert-grade question material for model-stumping and scientific-workflow evaluation without manufacturing artificial trick questions.

The governing rule is simple:

> **Authority should not exceed witness.**

That sentence is an eCODE architectural maxim, not a scientific law. The scientific work begins by stating exactly what is observed, identifying which underlying worlds remain compatible with those observations, and determining whether a further measurement or intervention can lawfully reduce the ambiguity.

## Formal seed

Let \(W\) be a set of possible worlds or models and let an observation operator be

\[
O: W \to Y.
\]

Two worlds are observationally equivalent under \(O\) when

\[
w_1 \sim_O w_2 \iff O(w_1)=O(w_2).
\]

If an equivalence class contains more than one materially distinct world, the present observation does not identify a unique underlying world.

Now let \(P\) be a permissible perturbation, intervention, measurement change, or environmental shift. A useful discriminator is any \(P\) for which

\[
O(P(w_1)) \neq O(P(w_2)).
\]

The research problem therefore becomes:

```text
OBSERVE
  -> enumerate compatible worlds
  -> establish the ambiguity
  -> search for an invariant or discriminator
  -> perturb / measure / change environment
  -> eliminate worlds that no longer fit
  -> state only the conclusion the evidence now licenses
```

If no permissible discriminator separates the candidate worlds, the correct result may be an equivalence class rather than a unique answer.

## Why this matters

A frontier model often fails not because it cannot calculate, but because it answers beyond what the evidence identifies. This case treats **underdetermination itself as an object of reasoning**.

The hard question is not always:

> Which answer is correct?

Sometimes it is:

> Is a unique answer possible from the supplied evidence?

And then:

> What is the smallest additional observation that would make it decidable?

That structure can generate difficult but objectively gradable work across mathematics, physics, chemistry, biology, scientific coding, sociology, anthropology, and general analytical reasoning.

## Five research lanes

### 1. Identifiability and inverse problems

Study systems where observations do not uniquely determine hidden parameters, structures, or mechanisms.

Questions:

- Is the model structurally identifiable in principle?
- Is it only practically non-identifiable because the available data are sparse or noisy?
- What parameter combinations are identifiable even when individual parameters are not?
- What additional output, initial condition, or experimental regime breaks the equivalence?

### 2. Invariance and transportability

Study relationships that survive changes of environment, intervention, population, or regime.

Questions:

- Which predictive relationships remain stable across environments?
- Which apparent relationships collapse after intervention?
- Under what assumptions can a conclusion be transported to a new environment?
- When does invariance provide evidence for causal structure rather than mere robustness?

### 3. Minimal discriminating evidence

Make experimental design itself the target.

Questions:

- What is the cheapest or smallest additional measurement that separates the candidate worlds?
- Can its sufficiency be proved?
- Is there a lower bound showing that weaker observations cannot decide the problem?
- What measurement would look useful but actually fail to break the equivalence?

### 4. Multiscale equivalence and coarse-graining

Study when microscopically different worlds are legitimately the same at a chosen observational scale.

Questions:

- Which distinctions disappear under coarse-graining?
- Which macroscopic invariants survive microscopic variation?
- When is a hidden difference physically or scientifically irrelevant to the question being asked?
- What new observable is required to recover lost structure?

### 5. Evidence lineage and independent convergence

Extend the same logic from scientific systems to evidence systems.

Questions:

- Are multiple observations genuinely independent?
- Are they descendants of one source family?
- Can repeated agreement increase confidence if all observations share one hidden ancestor?
- What new independent source would actually change the evidentiary state?

This lane inherits the repository's existing rule that resemblance, recurrence, or aggregation does not establish ancestry without a demonstrable transmission road. See [`../../METHOD.md`](../../METHOD.md).

## Cross-domain founding specimens

The first useful specimens should be small enough to solve completely.

### Biology — competing dynamical mechanisms

Construct two gene-regulatory or biochemical ODE models that reproduce the same measured output under one experimental regime. Determine whether the ambiguity is structural or practical, then identify a second measurement or perturbation that separates them.

### Chemistry — kinetic mechanism ambiguity

Construct two reaction mechanisms that fit the same concentration-vs-time trace within the supplied observation set. Determine whether temperature variation, isotope labeling, an intermediate measurement, or a changed initial condition distinguishes them.

### Physics — hidden source reconstruction

Construct distinct source configurations that produce the same measured field on a restricted observation region. Characterize the equivalence class and determine an additional boundary or spatial measurement that breaks it.

### Mathematics — invariant collision

Construct two non-isomorphic objects that share a chosen set of invariants. Prove that the supplied invariants are insufficient, then identify a minimal additional invariant that separates the supplied cases.

### Sociology / anthropology — same pattern, different lineage

Construct a case where the same visible cultural or social pattern can arise from direct transmission, common ancestry, independent convergence, or measurement artifact. Determine what evidence distinguishes those histories and what remains underdetermined.

## Research -> task conversion

Every mature specimen should be convertible into multiple task forms rather than one bespoke question.

A complete specimen should preserve:

1. **Observation** — exactly what the solver is given.
2. **Compatible worlds** — distinct mechanisms/models that survive those observations.
3. **Identifiability status** — unique, finite equivalence class, continuous equivalence class, or unresolved in practice.
4. **Invariant** — what remains true across the compatible worlds.
5. **Discriminator** — the additional measurement/intervention, if one exists.
6. **Gold conclusion** — the strongest conclusion actually licensed.
7. **Overclaim trap** — a plausible but unsupported stronger conclusion.
8. **Counterexample** — the smallest construction showing why the overclaim fails.
9. **Rubric atoms** — independently scorable reasoning steps.
10. **Source lineage** — enough provenance to re-find and audit the underlying evidence.

The executable template lives in [`TASK-FACTORY.md`](TASK-FACTORY.md).

## Promotion rule

A research note should not graduate into a benchmark-ready specimen merely because the topic is difficult or interesting.

Promotion requires:

```text
real research question
+ explicit observations
+ at least two defensible compatible worlds OR proof of uniqueness
+ objective identifiability status
+ reproducible gold reasoning
+ counterexample / failure mode
+ independently scorable rubric atoms
+ source provenance
```

## Immediate work queue

1. Build one fully solved **mathematical invariant-collision** specimen. This is the cleanest control case because uniqueness and non-uniqueness can be proved exactly.
2. Build one **systems-biology identifiability** specimen using a small ODE model and synthetic data.
3. Build one **causal-invariance** specimen with multiple environments where prediction and causation diverge.
4. Convert each specimen into at least three task forms: derivation, research workflow, and response-comparison/rubric evaluation.
5. Record which failure modes actually distinguish strong from weak model answers.

## Relation to eCODE

This case does **not** claim that eCODE originated identifiability theory, inverse-problem theory, or causal invariance.

The useful convergence is architectural:

```text
same visible state
        !=
same constituted history / mechanism / world

observation
        !=
license to assert hidden cause

additional discriminating witness
        ->
possible promotion of the conclusion
```

If that convergence survives rigorous cross-domain testing, it may provide a mathematical spine for eCODE questions about identity, witness, invariance, authority, and lawful state promotion.