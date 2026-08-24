# Same State, Different World — Claim Ledger

This ledger follows [`../../METHOD.md`](../../METHOD.md). Provenance class and support confidence are independent.

## SSW-001 — Observational equivalence can conceal materially different worlds

**Claim:** If an observation operator maps distinct underlying worlds to the same observed state, the observation alone cannot identify which world generated it.

- **Provenance class:** inference
- **Support confidence:** established
- **Source family:** mathematical definition / inverse-problem framing
- **Reasoning:** If `O(w1) = O(w2)` while `w1 != w2`, then the inverse image of the observation contains at least two candidate worlds. A unique inverse is therefore not licensed from that observation alone.
- **Counterevidence:** none expected at the definitional level; applicability depends on whether the chosen worlds and observation operator are specified coherently.
- **Open questions:** Which eCODE state descriptions admit useful formal observation operators? Which apparent distinctions are artifacts of representation rather than materially different worlds?
- **Downstream relevance:** foundational primitive for identifiability, lawful state promotion, model-stumping questions, and Free Graph ambiguity edges.

## SSW-002 — Structural and practical non-identifiability are different failure modes

**Claim:** In dynamical modeling, failure to identify parameters can arise because the model is non-identifiable in principle or because the available finite/noisy observations are insufficient in practice.

- **Provenance class:** primary source
- **Support confidence:** established
- **Source family:** systems-biology identifiability literature
- **Source locator:** Wieland et al. (2021), *On structural and practical identifiability*, Current Opinion in Systems Biology
- **Reasoning:** The literature explicitly distinguishes structural identifiability from practical identifiability and treats them with different diagnostic methods and remedies.
- **Counterevidence:** terminology and exact criteria vary across methods; practical identifiability remains method-dependent in important cases.
- **Open questions:** Which distinction maps cleanly onto eCODE's difference between impossible promotion and presently under-witnessed promotion?
- **Downstream relevance:** biology, chemistry, inverse problems, experimental design, rubric construction.

## SSW-003 — A discriminating intervention can resolve an observational equivalence

**Claim:** Two worlds that are indistinguishable under one observation regime may become distinguishable after a suitable intervention, perturbation, measurement change, or environmental shift.

- **Provenance class:** inference
- **Support confidence:** established
- **Source family:** experimental design / causal inference / identifiability
- **Reasoning:** If `O(w1) = O(w2)` but `O(P(w1)) != O(P(w2))`, then the perturbed observation separates the two candidates by construction.
- **Counterevidence:** some equivalence classes cannot be separated by the permissible intervention set; the existence of a discriminator must be shown, not assumed.
- **Open questions:** How should cost, risk, feasibility, and information gain be incorporated when more than one discriminator exists?
- **Downstream relevance:** minimal-discriminating-evidence tasks and active experimental design.

## SSW-004 — Cross-environment invariance can supply evidence about causal structure

**Claim:** Under stated assumptions, models whose predictive relation remains invariant across interventions or heterogeneous environments can help identify causal predictors and reject spurious associations.

- **Provenance class:** primary source
- **Support confidence:** established within model assumptions
- **Source family:** invariant causal prediction
- **Source locator:** Peters, Bühlmann & Meinshausen (2015), *Causal inference by using invariant prediction: identification and confidence intervals*
- **Reasoning:** Invariant Causal Prediction uses stability across experimental settings as a criterion for retaining candidate causal predictors and provides identifiability results under sufficient assumptions.
- **Counterevidence:** invariance alone is not unrestricted proof of causality; guarantees depend on the environment/intervention structure and causal-model assumptions.
- **Open questions:** Which kinds of eCODE invariance are merely representational and which correspond to scientifically useful environmental invariance?
- **Downstream relevance:** transportability, robustness, counterfactual reasoning, model-stumping tasks.

## SSW-005 — Prediction does not by itself license intervention claims

**Claim:** A model that predicts an outcome well from observational data does not thereby establish how that outcome would respond to intervention.

- **Provenance class:** primary source
- **Support confidence:** established
- **Source family:** causal inference / counterfactual prediction
- **Source locator:** Prosperi et al. (2020), *Causal inference and counterfactual prediction in machine learning for actionable healthcare*, Nature Machine Intelligence
- **Reasoning:** Predictive parameters and predictions need not have causal interpretation; intervention questions require causal assumptions and counterfactual reasoning.
- **Counterevidence:** prediction and causal estimation can coincide under stronger designs or assumptions, but the inference must be justified rather than presumed.
- **Open questions:** Can a generic benchmark rubric detect when a model silently crosses from prediction into unsupported causal assertion?
- **Downstream relevance:** response-comparison tasks, medical/scientific reasoning, overclaim detection.

## SSW-006 — Minimal discriminating evidence is a reusable benchmark primitive

**Claim:** Asking for the smallest additional observation or intervention that makes an underdetermined problem decidable can generate hard, objective, cross-domain reasoning tasks.

- **Provenance class:** speculation
- **Support confidence:** probable
- **Source family:** benchmark-design hypothesis derived from identifiability and experimental-design structure
- **Reasoning:** The task requires the solver to establish underdetermination, compare alternatives, propose a discriminator, and justify sufficiency. These are independently scorable reasoning steps rather than trivia.
- **Counterevidence:** some domains may not admit a unique notion of "smallest" without an explicit cost model; poorly designed cases could become subjective.
- **Open questions:** Which cost measures produce the cleanest tasks: number of measurements, dimensionality, experimental expense, intervention magnitude, entropy reduction, or proof length?
- **Downstream relevance:** Riga, Rainier, Sequoia, Geranium, Mojave-style task construction.

## SSW-007 — One research specimen can yield multiple evaluation forms

**Claim:** A single well-constituted research specimen can be transformed into derivation, coding, experimental-design, multiple-choice, and response-comparison tasks while preserving one underlying gold reasoning structure.

- **Provenance class:** speculation
- **Support confidence:** possible
- **Source family:** task-factory design hypothesis
- **Reasoning:** The same observation/world/discriminator structure can be exposed through different interfaces while retaining the same proof obligations and failure modes.
- **Counterevidence:** transformation may accidentally change task difficulty or introduce new ambiguities; each derived task still requires independent validation.
- **Open questions:** Which transformations preserve difficulty and which merely rephrase the same surface problem?
- **Downstream relevance:** reusable GitHub question quarry rather than one-off prompt archive.

## SSW-008 — "Authority should not exceed witness" is architectural, not scientific

**Claim:** The phrase is useful as an eCODE compression for a general research discipline: do not assert a more specific hidden mechanism than the observations and assumptions support.

- **Provenance class:** inference
- **Support confidence:** possible
- **Source family:** eCODE architectural analogy
- **Reasoning:** Identifiability and causal-inference failures repeatedly exhibit overclaim when a conclusion is more specific than the evidence licenses.
- **Counterevidence:** the phrase itself has no independent scientific status and should not be promoted into a theorem or empirical law.
- **Open questions:** Can this maxim be formalized as an information/order relation between evidence state and admissible conclusion?
- **Downstream relevance:** eCODE authority semantics, research rubrics, claim promotion rules.
