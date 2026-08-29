# ALCHEMATHOLOGY — Exact Mathals

This file keeps the exact mathematics separate from symbolic interpretation.

## 1. State / history / receipt

Let `N` map formation histories `f` to terminal state change:

\[
\Delta x=Nf.
\]

Hidden endpoint-invisible histories are:

\[
H=\ker N.
\]

Conservation covectors satisfy:

\[
c^T N=0,
\qquad c\in\ker N^T.
\]

Add a receipt map `R`. Remaining hidden history is:

\[
\ker N \cap \ker R
=
\ker\begin{pmatrix}N\\R\end{pmatrix}.
\]

Complete linear separation occurs iff:

\[
\boxed{\ker N\cap\ker R=\{0\}}.
\]

**Mathal:** `RECEIPT-RANK`.

## 2. State is a quotient of history

\[
\boxed{\mathcal H/\ker N\cong\operatorname{im}N}.
\]

**Mathal:** `QUOTIENT-STATE`.

Terminal state identifies histories that differ only by endpoint-invisible directions.

## 3. 4ONtheFLOOR — ordinary 4D grade ladder

For a 4D vector space `V`:

\[
\dim\Lambda^kV=\binom4k.
\]

Hence:

\[
\boxed{1,4,6,4,1}.
\]

The top-grade space is one-dimensional:

\[
e_1\wedge e_2\wedge e_3\wedge e_4
\in\Lambda^4V.
\]

**Mathals:** `GRADE-RETURN`, `4ONtheFLOOR`.

## 4. Four closes; five fills

A tetrahedral boundary has:

- 4 vertices,
- 6 edges,
- 4 triangular faces.

Its homology includes:

\[
H_2(\partial\Delta^3)\cong\mathbb Z.
\]

Attach the interior 3-cell `c`. The former 2-cycle `z` becomes:

\[
z=\partial_3 c,
\]

so:

\[
H_2(\Delta^3)=0.
\]

**Mathal:** `FIVE-KILLS-HOLE-CLASS`.

Scope: this is the boundary-plus-interior simplex specimen, not a universal numeral law.

## 5. Ternary four-coordinate world

\[
V=\mathbb F_3^4,
\qquad |V|=3^4=81.
\]

Every nonzero `v` pairs with `-v=2v`, so:

\[
\boxed{81=40+1+40=1+40\cdot2}.
\]

Projective direction count:

\[
\frac{3^4-1}{3-1}=40.
\]

**Mathals:** `TENET-81`, `ORIENTATION-DEBT`.

## 6. q-Pascal / subspace ladder

Gaussian-binomial counts of subspaces of `F_3^4` are:

\[
\boxed{1,40,130,40,1}.
\]

This is the finite-field analogue of `1,4,6,4,1`.

Relative to any projective hyperplane:

\[
\boxed{40=13_{\rm tangent}+27_{\rm transverse}}.
\]

**Mathals:** `Q-4ONtheFLOOR`, `GATE-TRANSVERSAL`.

## 7. Hidden nine

The 81-element field can be read as:

\[
\boxed{\mathbb F_{81}\cong \mathbb F_9^2}
\]

as a 2D vector space over `F_9`.

The relative Frobenius:

\[
x\mapsto x^9
\]

fixes exactly the subfield `F_9`.

The ten 1D `F_9`-subspaces each contain 9 elements and share zero:

\[
\boxed{81=10(9)-9}.
\]

Inside each 9-line:

\[
9=1+8=4+1+4.
\]

**Mathals:** `HIDDEN-9`, `NESTED-TENET`.

## 8. Phi / Frobenius gate

Let:

\[
\phi=\frac{1+\sqrt5}{2}.
\]

For odd `n`:

\[
\phi^n=L_n+\phi^{-n}.
\]

At `n=81`:

\[
\phi^{-81}\approx1.180323733260147\times10^{-17}.
\]

The residual is tiny but exact.

Now in `F_81`, let:

\[
\sigma(x)=x^3.
\]

Then:

\[
\sigma^4=I,
\]

so:

\[
\boxed{x^3=\sigma(x)}
\]

\[
\boxed{x^{27}=\sigma^{-1}(x)}
\]

\[
\boxed{x^{81}=x}
\]

\[
\boxed{x^{82}=x^2}.
\]

For a root `alpha` of:

\[
x^2-x-1=0
\]

over `F_3`, `alpha` lies in `F_9` and:

\[
\alpha^4=-1,
\qquad
\alpha^8=1.
\]

**Mathals:** `PHI-RECEIPT`, `FROBENIUS-TENET`, `RETURN-PLUS-ONE`.

## 9. Coherence hull

Let `C` be the configuration space of lawful coherent realizations of a carrier framework `G`. A realization is:

\[
q\in C,
\qquad
F(q)\subset\mathbb R^3.
\]

A history is a path:

\[
q:T\to C.
\]

A family of histories is:

\[
q_s:T\to C,
\qquad s\in S.
\]

The union of all lawful occupancies is:

\[
\boxed{
\Omega=
\bigcup_{s\in S}\bigcup_{t\in T}F(q_s(t)).
}
\]

**Mathals:** `COHERENCE-HULL`, `FORMATION-OF-FORMATION`.

A projection can retain a consequence while omitting the selector `s`; this motivates a research question about model completeness, not a claim of literal higher-dimensional physical agency.
