# SSW-MATH-001 Invariant Collision Design

## Status

Accepted on 2026-08-24 as the National Treasure half of the two-repository Promotion/Invariance Crucible.

## Purpose

Produce one mathematically exact Same State, Different World specimen in National Treasure's own language and harness. The specimen must show that re-expressing an observation cannot distinguish worlds already collapsed by that observation, while a genuinely new one-bit discriminator can.

This repository supplies mathematical testimony only. It does not adopt Free Graph vocabulary, code, receipt shape, authority semantics, or promotion decisions.

## Worlds

Use two simple undirected graphs on vertices `0..5`:

- `W_C6`: the six-cycle `C6`;
- `W_2C3`: two disjoint triangles `C3 + C3`.

The supplied observation is the tuple:

```text
(vertex_count=6, edge_count=6, degree_sequence=[2,2,2,2,2,2])
```

Both worlds produce that tuple, yet they are non-isomorphic because `W_C6` has one connected component and `W_2C3` has two.

## Exact epistemic lemma

Let `O` be the supplied observation and let `f` be any deterministic re-expression of `O`. If `O(W_C6) = O(W_2C3)`, then:

```text
f(O(W_C6)) = f(O(W_2C3))
```

Therefore re-expression alone cannot identify which graph generated the observation. A new observation is required.

## Minimum discriminator

The explicit cost model charges one unit for one additional Boolean graph predicate. The predicate `is_connected` separates the worlds:

```text
is_connected(W_C6)  = true
is_connected(W_2C3) = false
```

Its cost is minimal: zero additional queries leaves the identical supplied observation unchanged, while one query suffices.

The failed discriminator `all_degrees_even` is preserved because it returns `true` for both worlds.

## Native artifact boundary

The case directory will contain:

- `case.json`: immutable input, gold reasoning, cost model, rubric atoms, source lineage, and three task transforms;
- `verify.py`: dependency-free graph calculations and deterministic receipt emission;
- `test_verify.py`: behavior-first regression tests;
- `README.md`: human proof and task statement;
- `receipt.json`: generated native result pinned for cross-repository consumption.

The native receipt will use mathematical terms such as `observation_signature`, `compatible_worlds`, and `discriminator`. It will not use Free Graph's `projection`, `authority`, `constitutes`, `gate`, or five-verb grammar.

## Acceptance

The specimen is accepted only if the executable witness establishes all of the following:

1. both graph encodings are valid simple undirected graphs;
2. both produce the same supplied observation;
3. they are non-isomorphic;
4. deterministic re-expressions preserve the ambiguity;
5. `all_degrees_even` fails to distinguish them;
6. `is_connected` distinguishes them at minimum declared cost;
7. the receipt is deterministic;
8. the case registry gates remain green;
9. the root `README.md` remains untouched.

## Non-claims

- The specimen does not prove Free Graph's authority or consequence clauses.
- It does not claim that connectedness is globally the best graph invariant.
- It does not claim a universal cost model.
- It does not close National Treasure issue #36, whose biology and causal specimens remain open.

