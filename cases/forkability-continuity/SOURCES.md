# Sources — Forkability Continuity

Source families remain separate. Several entries describe analogous structures; analogy is not transmission.

## Git

### Git user manual — history, parents, reachability, divergence and reconvergence

- URL: https://git-scm.com/docs/user-manual
- Source class: primary technical documentation
- Relevant claim: Git history can diverge and reconverge; merge commits can have multiple parents.
- Limit: this documents Git mechanics, not a social or philosophical rule about human disagreement.

### `git merge` manual

- URL: https://git-scm.com/docs/git-merge
- Source class: primary technical documentation
- Relevant claim: merge is an explicit operation that joins two or more development histories after divergence; conflicts may stop automatic completion and require resolution.
- Limit: the availability of the operation does not itself create an obligation to invoke it.

## Local-first software

### Kleppmann, Wiggins, van Hardenberg, McGranaghan — *Local-first software: You own your data, in spite of the cloud* (2019)

- URL: https://www.inkandswitch.com/essay/local-first/
- Source class: primary research publication / project-authored technical essay
- Relevant claims: local-first software seeks collaboration plus user agency/ownership; the network may be optional; offline work and later synchronization are explicit goals; CRDTs are presented as a promising enabling technology.
- Limits named by the authors: the approach still has unresolved research and engineering questions; the work does not claim that every collaboration problem is solved by CRDTs.

## CRDT research

### Shapiro, Preguiça, Baquero, Zawirski — *Conflict-free Replicated Data Types* (2011), INRIA RR-7687

- HAL identifier: `inria-00609399`
- Archive URL: https://hal.science/inria-00609399
- Source class: primary research report
- Relevant claim: under the paper's formal strong-eventual-consistency model, specified state- and operation-based CRDT conditions are sufficient for replica convergence under asynchronous replication.
- Limit: the paper concerns replicated data types. It is not evidence that human interpretations, intentions, governance choices, or semantic claims automatically converge.

### Shapiro, Preguiça, Baquero, Zawirski — *A comprehensive study of Convergent and Commutative Replicated Data Types* (2011), INRIA RR-7506

- HAL identifier: `inria-00555588`
- Archive URL: https://hal.science/inria-00555588
- Source class: primary research report
- Relevant claim: formalizes asynchronous object replication and sufficient conditions for eventual consistency in convergent/commutative replicated data types.

## Manuscript genealogy / CBGM

### Institut für Neutestamentliche Textforschung — Coherence-Based Genealogical Method

- URL: https://www.uni-muenster.de/INTF/Genealogical_method.html
- Source class: primary institutional methodology documentation
- Relevant claim: genealogical coherence, potential ancestry, stemmatic coherence, and optimal substemmata are distinct concepts; potential ancestry does not automatically equal stemmatic ancestry.

### Gerd Mink / INTF — remarks on textual-flow diagrams and potential ancestors

- URL: https://ntvmr2.uni-muenster.de/web/guest/intfblog/-/blogs/remarks-on-carlson-a-bias-at-the-heart-of-the-cbgm-guest-post-by-gerd-mink-
- Source class: primary institutional methodological clarification
- Relevant claims: textual-flow diagrams must not be read as actual historical stemmata; potential ancestors are generally not actual historical ancestors; the diagrams are simplifying representations whose underlying data must be inspected.
- Limit: this case extracts a representation restraint. It does not claim that CBGM is a general theory of social or software continuity.

## Static Collective project evidence

### Upper Room PR #5 — continuity without captivity

- URL: https://github.com/the-static-collective/Upper-room/pull/5
- Status: landed
- Source class: observed project-owned design evidence
- Relevant claim: Upper Room preserves attributable shared-encounter continuity while allowing branching, disagreement, absence, return, translation change, and revised understanding without forced synchronization or maximal recording.

### Project0 PR #53 — reticulate continuity attack

- URL: https://github.com/the-static-collective/project0/pull/53
- Status: landed
- Source class: observed project-owned executable evidence
- Relevant claim: the existing multi-root/multi-parent Typed Continuity Braid represented mixed descent while refusing omitted known ancestry without requiring a new genealogy primitive.

### Project0 PR #55 — mergeability / merge-obligation pressure test

- URL: https://github.com/the-static-collective/project0/pull/55
- Status: landed 2026-08-20; squash commit `b92d83d97baa95528ff4c24a54f68ff24236f23f`
- Source class: observed project-owned executable evidence
- Result: `NO_GAP`; the existing Typed Continuity Braid represented merge proposal, coexistence, and refusal as separately addressable continuations without production-code changes.
- Relevant claim: a merge proposal can remain representable without acquiring authority, replacing either parent, or making reconciliation obligatory.
- Limit: synthetic conformance evidence does not establish that every domain should expose those exact dispositions or that branching inherently preserves continuity.
