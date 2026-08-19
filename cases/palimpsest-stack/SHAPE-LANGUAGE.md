# Shape language — primitive catalogue and Witness Sigils

Status: **[DESIGN] eCODE-native symbolic experiment; none of these meanings are claimed to be ancient**

This file deliberately gets weird under a hard boundary:

> We may invent with geometry. We may not counterfeit genealogy.

Historical scripts and sacred figures are research specimens. The symbols below are **new conventions** grown from simple geometric primitives and existing eCODEsystem invariants.

## Why shapes are interesting here

A written character is simultaneously several different things:

- a visible shape;
- a member of a writing system;
- a sound/value under some orthography;
- a historically changing artifact;
- a carrier that may preserve or lose distinctions during copying;
- sometimes a symbol with later interpretive layers.

The palimpsest case therefore suggests a useful split:

```text
shape
  != glyph identity
  != linguistic value
  != historical ancestry
  != symbolic interpretation
```

That separation lets the eCODEsystem compare shape systems without hallucinating language history.

## Primitive geometry alphabet v0.1

These meanings are Static Collective design assignments.

| ID | Mark | Primitive | eCODE-native meaning |
|---|---|---|---|
| `P0` | `•` | point | particularity / specimen |
| `P1` | `—` | segment | relation / carried connection |
| `P2` | `○` | circle | environment / bounded context |
| `P3` | `◯` with gap | open ring | unresolved boundary / permeable context |
| `P4` | `△` | oriented triangle | attractor / directed proposal |
| `P5` | `□` | square | constituted body / current stage |
| `P6` | `×` | crossing | transformation / crossing of trajectories |
| `P7` | `∥` | parallel pair | invariant / distinction maintained across movement |
| `P8` | `⊙` | point in circle | witnessed specimen / observation in context |
| `P9` | broken segment | cut | refusal / severed reachability |
| `PA` | `↻` | recursive turn | iteration / mutation / return-with-difference |
| `PB` | hexagonal neighborhood | sixfold adjacency | lawful local neighborhood / candidate ecology |
| `PC` | nested rings | containment | representation inside representation / palimpsest layer |
| `PD` | mirror axis | reflection | reversible representation transform |
| `PE` | junction | branch | divergence / sibling lineage |
| `PF` | converging junction | merge | convergence with named inputs |

The first sixteen IDs are intentionally nibble-addressable (`0`–`F`). That makes them useful as a visual projection alphabet for binary material without pretending the projection is the underlying evidence.

## Shape morphology operators

A shape catalogue becomes more useful when it records operations rather than only nouns.

```text
TRANSLATE    move without changing internal geometry
ROTATE       rotate by declared angle
REFLECT      mirror across declared axis
SCALE        resize under declared ratio
REPEAT       instantiate under a lattice / sequence rule
OVERLAP      superpose specimens without erasing their identities
LIGATE       join components into one glyph body
CUT          remove a declared segment / region
OPEN         break a closed boundary
CLOSE        close an open boundary
NEST         place one bounded form inside another
BRANCH       duplicate ancestry into siblings
MERGE        combine named inputs into a new representation
PROJECT      map a higher-dimensional / richer object into a reduced carrier
```

Every operation should name what it preserves and what it loses.

That turns geometry into a continuity laboratory.

## Cross-script shape atlas

A future research instrument may ingest dated glyph specimens from Paleo-Hebrew, Phoenician, Greek, Latin, manuscript English, Dee/Kelley tables, or any other corpus and describe them using purely formal features:

```yaml
specimen: "..."
source_image: "..."
date_range: "..."
script_or_system: "..."
formal_features:
  strokes: 3
  closed_regions: 0
  crossings: 1
  junctions: 1
  approximate_symmetry: none
  dominant_angles: [60, 120]
  curvature: low
  topology: "open connected graph"
transforms_to_other_specimen:
  - rotate
  - reflect
relation_kind: FORMAL_RESEMBLANCE
historical_ancestry: UNKNOWN
```

This creates a computationally interesting overlap layer without letting visual similarity impersonate palaeography.

If historical scholarship later establishes transmission, that becomes a **separate edge**.

## Witness Sigils

This is the most practical strange thing in the slice.

A Witness Sigil is a deterministic geometric **projection** of an already-authoritative receipt digest.

It is not a replacement for the digest.
It is not a signature.
It is not authentication.
It is not collision-resistant merely because it looks complicated.

Its job is human recognition.

### Proposed v0.1 mapping

Input:

```text
canonical receipt digest = SHA-256(...)
```

Projection:

1. Keep the full digest as canonical authority.
2. Take the first 16 hexadecimal nibbles for the visible sigil payload.
3. Map each nibble `0..F` to primitive `P0..PF`.
4. Place four primitives on each of four concentric or quadrant positions under a fixed layout.
5. Derive rotation only from declared bits; never randomize.
6. Print an 8–12 character textual digest prefix next to the sigil in serious contexts.
7. Version the projection: `witness-sigil/v0.1`.

A receipt might therefore produce something conceptually like:

```text
sha256: 8ac4...
visual: P8 → PA → PC → P4 → ...
```

Two matching sigils are a **recognition cue**.
Only matching canonical digests are evidence of digest equality.

### Why bother?

Humans are poor at noticing that two long hashes differ by one character.
Humans are unusually good at noticing that a geometric mark has changed.

A Witness Sigil could become a tiny ambient continuity surface on:

- Toaster renders and candidate-family receipts;
- Project0 canonical artifacts;
- TranchNode projections;
- Corpus OS constituted objects;
- GitBook state projections;
- physical archival labels;
- printed scores / tapes / discs / photographs;
- QR-adjacent human checks;
- National Treasure clue packets.

Again: **projection, never authority**.

## Relation sigils

The relation grammar can also have a restrained visual shorthand:

```text
solid arrow      DEMONSTRATED_ANCESTRY
open arrow       CLAIMED_ANCESTRY
double branch    SHARED_PRECURSOR
dotted bridge    FORMAL_RESEMBLANCE
parallel bridge  STRUCTURAL_ISOMORPHISM
loop             REINTERPRETATION
barred arrow     REFUSED_ANCESTRY
question mark    UNKNOWN
```

These should remain redundant with text labels. Accessibility and machine readability outrank occult coolness.

## Cicada rule

A puzzle can be mysterious while its verification is boring.

If the Collective ever emits clue trails, hidden layers, ritual interfaces, or puzzle-like artifacts, use this stack:

```text
MYSTERY SURFACE
  beautiful / strange / symbolic / optional

VERIFICATION SURFACE
  canonical bytes / hashes / signatures / receipts / source locators

AUTHORITY SURFACE
  explicit admission law / constituted actor / bounded capability
```

Never make the user solve the mystery surface to recover authority they legitimately need.
Never let a solved puzzle manufacture authority.

That is how to get Cicada energy without building a cultic security bug.

## Toaster / visual-system possibility

The same primitives can become mutation operators rather than meanings:

- circle neighborhoods define candidate adjacency;
- Escher-like local edge rules generate global topology;
- overlap and occlusion preserve multiple active influences;
- cuts encode refusal / missing inheritance;
- palimpsest layers let prior states haunt current composition without becoming current evidence;
- a Witness Sigil can mark the exact lineage/receipt driving one exported visual specimen.

This is a design lane, not a claim that historical sacred geometry anticipated the Toaster.

## Success condition

The shape language earns promotion only if it does at least one boring thing better:

- catches mistaken identity faster;
- makes lineage easier to inspect;
- compresses relation state without ambiguity;
- creates deterministic visual continuity across carriers;
- improves candidate navigation without adding hidden authority;
- preserves mystery while making provenance more explicit.

Otherwise it stays a beautiful National Treasure artifact.
