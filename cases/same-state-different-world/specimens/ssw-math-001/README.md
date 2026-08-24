# SSW-MATH-001 — One Degree Sequence, Two Graph Worlds

**Status:** executable founding control  
**Domain:** finite graph theory  
**Question:** Does the supplied graph summary identify a unique candidate world?

## Supplied observation

Two simple undirected graphs are possible:

```text
W_C6   = one cycle on six vertices
W_2C3  = two disjoint triangles
```

The solver receives only:

```text
vertex count   = 6
edge count     = 6
degree sequence = [2, 2, 2, 2, 2, 2]
```

Both worlds produce exactly that observation.

## Gold conclusion

The supplied observation is non-identifying. It leaves a finite equivalence class containing at least `W_C6` and `W_2C3`.

The graphs are not isomorphic: graph isomorphisms preserve connected-component count, but `W_C6` has one component and `W_2C3` has two.

## Why re-expression cannot help

Let `O` return the supplied observation and let `f` be any deterministic re-expression of that result. Because:

```text
O(W_C6) = O(W_2C3)
```

ordinary function equality gives:

```text
f(O(W_C6)) = f(O(W_2C3))
```

Serializing, relabeling, rendering, or otherwise re-expressing the same tuple cannot split the two worlds. The verifier exercises two deterministic re-expressions and preserves the collision in both.

## Failed discriminator

`all_degrees_even` looks relevant but fails:

```text
all_degrees_even(W_C6)  = true
all_degrees_even(W_2C3) = true
```

The negative result remains part of the specimen.

## Minimum successful discriminator

The declared cost model charges one unit per additional Boolean graph predicate. Connectedness separates the supplied pair:

```text
is_connected(W_C6)  = true
is_connected(W_2C3) = false
```

This costs one. It is minimum under the declared model because zero new queries leave the identical supplied observation unchanged, while one query suffices.

This is a pair-local minimum under an explicit cost model. It is not a claim that connectedness is the universally cheapest graph invariant.

## Tempting overclaim

> The shared degree sequence proves the graphs are isomorphic.

The two explicit edge sets are a counterexample. Degree sequence is an invariant of isomorphism, but it is not a complete invariant.

## Three task forms

### Derivation

Compute the supplied observation for both graphs, determine the identifiability status, and prove the strongest licensed conclusion.

### Experimental design

Under the one-unit-per-Boolean-query cost model, choose a minimum-cost query that separates the candidate worlds and prove both sufficiency and minimality.

### Response comparison

Compare:

- an answer that selects a unique graph from the shared degree sequence;
- an answer that preserves both candidates, proves non-isomorphism, and requests connectedness.

Identify the exact unsupported inference in the first response.

## Run the witness

```bash
python3 -m unittest discover \
  -s cases/same-state-different-world/specimens/ssw-math-001 \
  -p 'test_*.py' -v

python3 cases/same-state-different-world/specimens/ssw-math-001/verify.py \
  cases/same-state-different-world/specimens/ssw-math-001/case.json \
  --output cases/same-state-different-world/specimens/ssw-math-001/receipt.json
```

The verifier uses only the Python standard library. `receipt.json` is deterministic and includes a digest of the complete input case.

## Research lineage

David Blackwell's 1953 paper, [“Equivalent Comparisons of Experiments”](https://doi.org/10.1214/aoms/1177729032), supplies the conceptual comparison-of-experiments floor: it relates informativeness to attainable decision performance and to stochastic transformation between experiments.

This specimen uses that paper as research ancestry, not as a substitute for the executable graph witness. Its narrower claim follows directly from the two literal graphs and ordinary function equality: once the supplied observation maps both worlds to the same value, deterministic re-expression of that value cannot separate them. The supplied scan is pinned in `case.json` by SHA-256; the paper itself is not vendored.

## Cross-repository boundary

The receipt is National Treasure testimony in mathematical vocabulary. Another repository may pin and translate that testimony, but this specimen imports no foreign implementation, schema, receipt format, or adoption decision.

## Scope limits

- This specimen tests distinguishability from supplied data.
- It does not establish constitutional warrant, permission, or causal-transition rules.
- It completes only the mathematical slice of [issue #36](https://github.com/the-static-collective/national-treasure/issues/36); the biology and causal founding specimens remain open.
