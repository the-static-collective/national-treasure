# Sigil Algebra v0 — Typed Mathematics Beneath the Geometry

Date: 2026-08-22
Status: **approved design slice; downstream executable adoption remains gated**

## Goal

Give the emerging sigil language a small exact mathematics without pretending that every visual operator is already mathematical law.

The core design is:

> **Put a typed algebra underneath the sigils, then let geometry be one native notation/dialect of that algebra.**

This is deliberately narrower than claiming “the sigils are math.” The existing sigil grammar remains historical syntax with project-local meaning. Sigil Algebra v0 adds exact evaluable fragments, explicit theorem sets, mathematical equivalence receipts, and a numeric dialect while preserving expression history.

## Design ancestry

This slice descends from:

- `cases/palimpsest-stack/SIGIL-GRAMMAR.md` — P0..PF roots, ordered morphology, typed semantics, witness/free channel separation;
- the frozen `witness-sigil/v0.1` projection and its authority boundary;
- Haunted Toaster `haunted-toaster/sigil-topology-expression/v0` — a project-owned executable grammar whose operation order and expression hash preserve historical syntax;
- Haunted Toaster PR #211 / merge `899a920b17019a54dadfb0c6bb321cc6e4cf860b` — the generation-only grammar proof.

This document does **not** modify those contracts. It defines a sibling layer that downstream projects may independently implement.

## Why a sibling layer

The current Toaster expression contract is already a typed symbolic term system:

- translation arguments are integer vectors;
- rotation is quarter-turn indexed;
- reflection has a finite axis domain;
- scale is an exact positive rational pair;
- topology operations are ordered and typed;
- expression identity is canonical-hash based.

But its compiler currently derives structural/topology pressure rather than evaluating transform semantics, proving equality, or normalizing mathematically equivalent expressions.

That distinction should remain visible:

```text
sigil grammar expression
    = what was uttered / historical syntax

sigil algebra value
    = what a declared mathematical fragment denotes
```

## Selected architecture: typed algebra + geometric dialects

```text
                    SIGIL ALGEBRA v0
                           |
        +------------------+------------------+
        |                  |                  |
   Transform           Number             Topology
     dialect            dialect             dialect
        |                  |                  |
 ROTATE / SCALE       P0..PF digits      CUT / NEST / OPEN
 TRANSLATE /          Nibble Helix       BRANCH / MERGE
 REFLECT
        |                  |                  |
        +------------------+------------------+
                           |
                   geometric notation
                           |
                  project-local dialect
```

The Transform and Number fragments receive exact v0 semantics. Topology remains typed syntax unless and until specific algebraic laws are earned.

## Constitutional sorts

The portable conceptual sorts are:

```text
SigilTerm
Number
Integer
Rational
Vector2
Transform2
Topology
Relation
Proof
```

A downstream implementation may encode these differently, but it must not erase the sort distinction.

Illustrative signatures:

```text
ROTATE    : Z4 x Transform2 -> Transform2
TRANSLATE : Z^2 x Transform2 -> Transform2
REFLECT   : Axis x Transform2 -> Transform2
SCALE     : Q+ x Transform2 -> Transform2
NUMBER    : HexDigits -> Number
```

`CUT`, `OPEN`, `CLOSE`, `NEST`, `BRANCH`, `MERGE`, `OVERLAP`, `LIGATE`, and `PROJECT` do not acquire algebraic identities merely because their names resemble mathematical operations.

## Minimal theorem kernel

Let `e` be identity, `r` a 90-degree rotation, `s` a chosen square reflection, `T(v)` a translation, and `S(q)` a positive exact scale.

Sigil Algebra v0 may prove only the declared fragment laws:

```text
r^4 = e
s^2 = e
s r s = r^-1
T(a) o T(b) = T(a + b)
S(a) o S(b) = S(ab)
e o X = X
X o e = X
```

The first three are the square-symmetry / D4 relations. Translation is exact addition over `Z^2`. Positive scale composition is exact multiplication over `Q+`.

No commutativity between arbitrary transforms is implied.

## Checked evaluators before rewrite engines

v0 should not begin with a universal symbolic rewrite engine.

Use small closed evaluators first:

```text
Z4 evaluator
D4 evaluator
Z^2 translation evaluator
Q+ scaling evaluator
NUMBER encode/decode evaluator
Nibble Helix encode/decode evaluator
```

Equivalence is admitted only when both expressions evaluate in the same declared fragment under the same theorem-set version.

A later rewrite system may be added only after termination/confluence expectations are explicit enough to test.

## Dual identity: syntax survives mathematics

Mathematical simplification must never rewrite historical ancestry in place.

Every algebra-bearing expression therefore needs two distinct identities:

```text
expressionHash = what was actually uttered
normalFormHash = what the declared theorem set says it denotes
```

A minimum proof artifact is:

```text
EquivalenceReceipt {
  sourceExpressionHash
  theoremSetVersion
  evaluatorVersion
  rewriteSteps[]
  normalForm
  normalFormHash
}
```

The invariant is:

```text
A != B historically
A ≡ B mathematically
```

A normal form is a proof-bearing descendant/projection, not an edit to its ancestor.

## Flagship equivalence specimen

The minimum witness for crossing from grammar into mathematics is:

```text
A = ROTATE(1, ROTATE(3, P4))
B = P4

expressionHash(A) != expressionHash(B)
value(A)          = value(B)
normalFormHash(A) = normalFormHash(B)
lineage(A)        != lineage(B)
```

A valid implementation must be able to state all four facts without contradiction.

## NUMBER is a typed dialect

P0..PF already carry semantic root meanings in the sigil grammar. Therefore the algebra must **not** globally assert `P8 = 8`, `PA = 10`, etc.

Numeric use is explicitly typed:

```text
NUMBER[P8] = 8
NUMBER[PA] = 10
NUMBER[PF] = 15
```

Inside `NUMBER`, P0..PF form hexadecimal digits. Outside `NUMBER`, they remain sigil roots.

Thus:

```text
NUMBER[P3 PA]
```

may denote hexadecimal `0x3A`, while:

```text
SIGIL[P3 PA]
```

remains an ordered pair/composition of semantic roots.

Same visible alphabet, different type, no semantic collision.

## Exact number representation

Portable receipts and hashes must not depend on IEEE-754 rounding or JavaScript safe-integer limits.

The canonical portable numeric representation should therefore use exact tagged integers/rationals, for example:

```text
IntegerValue {
  sign: "+" | "-"
  digits: canonical decimal string
}

RationalValue {
  numerator: IntegerValue
  denominator: positive canonical decimal string
}
```

A downstream JavaScript implementation may use `BigInt` internally, but canonical JSON/receipt material must use a platform-neutral exact representation.

Canonicalization requirements:

- no leading zeros except canonical zero;
- zero has one representation;
- rational denominator is positive;
- numerator/denominator are reduced by gcd;
- `-0` is forbidden;
- floating-point inputs are rejected for exact algebra fragments.

## Nibble Helix: orders of magnitude as geometry

The preferred exponent notation is a **binary exponent organized into four-step hexadecimal/nibble bands**.

Let:

```text
q in {0,1,2,3}  // quarter turn
r in Z            // radial/ring coordinate
E = 4r + q
V = M x 2^E
```

Then:

```text
one quarter turn  -> exponent +1 -> x2
four quarter turns -> exponent +4 -> x16
one radial band    -> exponent +4 -> x16
```

The geometric decomposition is exact and unique for integer exponents when `q` is the Euclidean remainder in `0..3`:

```text
q = E mod 4
r = floor(E / 4)
```

This should be called **Nibble Helix** or **Radix-16 Band Helix**.

A literal base-16 quarter-turn exponent is rejected as the default because it would make each quarter turn `x16` and each full band `x65536`, which is too coarse for the intended compositional reading.

The helix is a lossless display encoding of exponent. It is not the numeric source of truth.

## Sign is not reflection

`REFLECT` has genuine geometric/D4 semantics. Arithmetic negation therefore remains an explicit numeric sign operation/value.

A rendering dialect may choose to depict a negative number by reflecting a glyph, but that is projection behavior:

```text
negative number
  -> optional reflected rendering
```

not a theorem:

```text
REFLECT == NEGATE   // forbidden as shared law
```

## Phi 3·27·81·82 Witness

The user-proposed stress specimen:

```text
phi^3, phi^27, phi^81, phi^82
```

is preserved as the first **algebraic-number admission gate**, not silently added to the minimal rational v0 kernel.

For `phi = (1 + sqrt(5))/2`, exact Fibonacci reduction gives:

```text
phi^n = F_n phi + F_(n-1)

phi^3  = 2 phi + 1
phi^27 = 196418 phi + 121393
phi^81 = 37889062373143906 phi + 23416728348467685
phi^82 = 61305790721611591 phi + 37889062373143906
```

Required alternate derivations include:

```text
phi^81 = (phi^27)^3
phi^81 = (phi^3)^27
phi^82 = phi * phi^81
phi^82 = phi^81 + phi^80
```

This specimen proves why exact arbitrary-precision coefficients are required: the `phi^81` coefficients already exceed JavaScript's safe integer range.

The admission condition for a future algebraic-number extension is:

```text
same exact value
different derivation trees
different expression hashes
same normal-form hash
arbitrary-precision coefficients
recurrence proof
exponent-composition proof
```

No algebraic-number runtime is required for v0.

## Topology remains intentionally under-lawed

Topology operations are useful grammar now, but shared equations would be premature.

v0 therefore refuses claims such as:

```text
MERGE(A,B) = MERGE(B,A)
NEST(NEST(A,B),C) = NEST(A,NEST(B,C))
CUT(CUT(A)) = A
OPEN(CLOSE(A)) = A
```

unless a later project supplies an exact domain, semantics, counterexample set, and testable law.

The absence of a theorem is preserved as information, not repaired by aesthetic intuition.

## Haunted Toaster as executable specimen

Haunted Toaster is the preferred first implementation because it already has:

- `sigil-topology-expression/v0`;
- exact integer/rational-shaped operation arguments;
- canonical hashing;
- lineage;
- deterministic six-utterance families;
- replay/fail-closed validation;
- strict `witness-locked` vs `free-sigil` separation.

The Toaster implementation must be a sibling algebra module. It must not destructively change `sigil-topology-expression/v0` or couple mathematical equivalence to rendering, admission, identity, or authority.

A useful future six-up can deliberately generate:

- visually different derivations with one algebraic invariant;
- one minimal mutation that changes equivalence class;
- several expressions sharing a normal form but retaining distinct ancestry.

## Authority boundary

Sigil Algebra v0 does not create authority.

```text
mathematical equality
  != identity proof
  != witness identity
  != ancestry proof
  != authentication
  != capability
  != admission
```

A valid equivalence receipt proves only equivalence under its declared evaluator/theorem set.

Witness Sigils remain recognition projections only.

## Versioning

A downstream implementation must version at least:

```text
algebra schema
theorem set
evaluator
normal-form schema
receipt schema
NUMBER dialect
Nibble Helix dialect
```

Changing a theorem set is not a transparent implementation detail. It can change equivalence classes and therefore requires a new version/domain separator.

## v0 graduation gates

A project may claim a Sigil Algebra v0 executable proof only when all are true:

1. **Constitution gate** — sorts, numeric domains, theorem set, exact non-claims, and version identifiers are frozen.
2. **Transform gate** — Z4/D4, translation, and positive-rational scale evaluators pass exact golden tests.
3. **Equivalence gate** — distinct syntax can yield the same normal form while expression hashes and lineage remain distinct.
4. **Number gate** — `NUMBER[P0..PF]` round-trips exact hexadecimal values without converting semantic sigil roots into numbers globally.
5. **Helix gate** — every tested negative/zero/positive integer exponent round-trips exactly through `(ring, quarterTurn)`.
6. **Receipt gate** — equivalence receipts carry theorem/evaluator versions and cannot grant identity, ancestry, authority, or admission.
7. **Toaster witness gate** — at least one deterministic six-expression specimen demonstrates controlled mathematical sameness/difference without renderer coupling.
8. **Authority-language scan** — no new code/documentation promotes mathematical equivalence into authentication, admission, signature, identity, or authority.

The `Phi 3·27·81·82 Witness` is explicitly a later algebraic-number admission gate.

## Non-goals

This slice does not:

- claim P0..PF are inherently numbers;
- claim all geometry is mathematical semantics;
- replace sigil grammar history with normal forms;
- introduce floating-point geometry into canonical proof;
- assign algebraic laws to topology by analogy;
- make reflection arithmetic negation;
- add renderer, UI, VisualScore, ResolvedTimeline, Ghost Topology, candidate-policy, packaging, or release behavior;
- create a National Treasure runtime dependency;
- create authentication, identity, admission, ancestry, signature, or authority semantics;
- require algebraic numbers in v0.

## Compact law

> **The expression remembers what was said. The algebra can prove what it equals. Equality may compress value, but it may not erase history.**
