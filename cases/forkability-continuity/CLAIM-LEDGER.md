# Claim Ledger — Forkability Continuity

This ledger uses the repository's two-axis method. Provenance class and support confidence remain independent.

| ID | Claim | Provenance | Confidence | Source family | Counterevidence / limit | Downstream relevance |
|---|---|---|---|---|---|---|
| FC-001 | Git history can contain divergent development lines that later reconverge through an explicit merge whose commit has multiple parents. | Primary source | Established | Git documentation | Merge may conflict; Git mechanics do not establish a human-social norm. | Mechanical control specimen for preserved ancestry across divergence. |
| FC-002 | Local-first software explicitly treats offline local work and later collaboration/synchronization as compatible goals rather than making continuous server contact the condition of valid work. | Primary source | Established | Ink & Switch / Onward! 2019 | Local-first remains an engineering program with unresolved problems. | Supports the narrower proposition that absence need not sever continuity. |
| FC-003 | The 2011 CRDT literature formalizes sufficient conditions for convergence of specially designed replicated data types under asynchronous replication. | Primary source | Established | INRIA / Shapiro et al. | Applies to defined replicated data structures, not arbitrary semantic or social disagreement. | Mechanical example of later state convergence after independent local updates. |
| FC-004 | Data convergence does not by itself establish convergence of human interpretation, intention, governance, theology, or meaning. | Inference | Probable | CRDT scope + local-first limits | Some collaborative applications may encode particular semantic decisions mechanically, but that is additional domain policy rather than a generic CRDT result. | Prevents importing CRDT convergence as a universal reconciliation metaphor. |
| FC-005 | INTF/CBGM methodology distinguishes potential/genealogical ancestry from actual historical manuscript ancestry and warns that textual-flow diagrams are not historical stemmata. | Primary source | Established | INTF | CBGM still constructs constrained genealogical models; the warning is not a rejection of all ancestry inference. | Supports explicit uncertainty and refusal to invent missing transmission roads. |
| FC-006 | Upper Room has landed a project-local design that permits branching, disagreement, absence, and return while preserving attributable relation rather than forced synchronization. | Observed | Established | Upper Room PR #5 | Design evidence is not yet proof that every continuity class has an executable runtime witness. | Human-social specimen independent of the technical research families. |
| FC-007 | Project0's existing continuity braid can represent plural ancestry without a special mixed-ancestry primitive. | Observed | Established | Project0 PR #53 | Synthetic conformance evidence does not reconstruct real manuscript history. | Evidence against prematurely adding a new re-entry/genealogy primitive. |
| FC-008 | A system can preserve continuity across divergence when ancestry, transformations, surviving differences, and conditions of re-entry remain attributable. | Inference | Possible | Cross-family synthesis | Counterexamples include dead branches, duplicated work, access-control problems, permanent schism, and false ancestry. | Candidate architectural extraction; not shared law. |
| FC-009 | Branching inherently preserves continuity. | Failed | Unsupported | Cross-family overclaim | Git conflicts, abandoned branches, semantic non-convergence, and governance failure directly defeat the unconditional claim. | Keep as a named rejected formulation. |
| FC-010 | If two descendants are technically mergeable, a merged descendant is therefore constituted, authoritative, required, or preferable. | Failed | Unsupported | Git + Project0 pressure test | Merge is an explicit operation/admission; multiple other dispositions can remain possible. | Core anti-collapse edge: `MERGEABILITY != MERGE OBLIGATION`. |
| FC-011 | A future cross-domain re-entry grammar may be useful if multiple independent systems repeatedly require coexist / merge / refuse / return distinctions. | Speculation | Possible | Current cross-project pattern | Not yet demonstrated across enough executable domains; naming it now risks premature ontology. | Preserve as incubation only; no `Re-entry Topology` primitive yet. |

## Failure ledger

### F-001 — unconditional forkability law

**Rejected formulation:** `branching preserves continuity`.

Why it failed: the evidence only supports conditional preservation. A branch can be abandoned, sever provenance, duplicate work, become inaccessible, or produce incompatible descendants with no successful re-entry.

### F-002 — convergence laundering

**Rejected formulation:** `if replicas can converge, participants have reconciled`.

Why it failed: CRDT convergence describes state properties under a formal data model. Human interpretation and governance require additional semantics and may remain plural indefinitely.

### F-003 — graphical ancestry as historical ancestry

**Rejected formulation:** `a strong-looking textual flow or network edge is the historical copying road`.

Why it failed: INTF explicitly distinguishes analytical/potential relations from actual historical ancestry and warns against reading textual-flow diagrams as stemmata.

### F-004 — mergeability as authority

**Rejected formulation:** `a lawful merge candidate has authority because it can be constructed`.

Why it failed: construction/representation is not constitution, warrant, or admission. The current Project0 attack is specifically testing that boundary.
