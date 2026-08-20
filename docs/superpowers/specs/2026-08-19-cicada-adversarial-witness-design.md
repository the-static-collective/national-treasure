# Cicada adversarial witness design

Date: 2026-08-19
Status: **approved design slice; implementation remains gated on review of this written spec**

## Goal

Turn the strongest practical lessons from the Cicada 3301 research pass into a bounded eCODEsystem experiment without copying the puzzle aesthetic into the authority layer.

The slice must prove three different things in sequence:

1. **human-recognizable deterministic continuity** through a Witness Sigil reference renderer;
2. **resistance to seductive over-interpretation** through a Cicada-inspired adversarial corpus;
3. **cross-carrier continuity** through a later Haunted Toaster Receipt Ghost Channel specimen.

The first two proofs belong in `national-treasure`. The third is a downstream follow-up and does not land in this slice.

The core security boundary remains:

```text
MYSTERY SURFACE
  strange / symbolic / optional

VERIFICATION SURFACE
  canonical bytes / hashes / signatures / receipts / source locators

AUTHORITY SURFACE
  explicit admission law / constituted actor / bounded capability
```

A solved puzzle never manufactures authority. A visual sigil never authenticates an artifact.

## Why this is architectural

The existing palimpsest case defines the 16-primitive `0-F` symbol language and proposes Witness Sigils, but leaves the projection layout and rotation rule deliberately under-specified. Making the projection executable creates a versioned contract that other repositories may reproduce.

That contract therefore needs a precise algorithm, refusal behavior, golden vectors, and a graduation boundary before any downstream repository depends on it.

## Selected approach

### A. Reference renderer plus adversarial corpus in National Treasure — selected

National Treasure remains the incubator. It owns a tiny no-dependency reference implementation, normative fixtures, and the overfit corpus. Downstream repositories may later reproduce the contract independently against the same vectors.

This is preferred because it proves semantic portability rather than prematurely creating a shared runtime package.

### B. Publish a shared `@static-collective/witness-sigil` package now — rejected

A package would make reuse easy but would promote the experiment before a second materially different specimen proves that the invariant deserves shared machinery.

### C. Implement only inside Haunted Toaster — rejected

That would entangle the first executable semantics with one consumer and make it difficult to distinguish the general continuity contract from Toaster-specific rendering choices.

## Scope

This design authorizes one future implementation PR in `the-static-collective/national-treasure` containing two independently testable components:

```text
tools/witness-sigil/
  reference renderer + CLI + tests + golden vectors

cases/cicada-overfit/
  adversarial epistemic fixtures + schema validator + guidance
```

No Project0, TranchNode, Corpus OS, Band Runtime, GitBook, or Haunted Toaster executable behavior changes in that PR.

## Component 1 — Witness Sigil reference renderer v0.1

### Runtime choice

Use Node.js built-ins only, with `.mjs` modules and `node:test`.

No package manager, build step, browser runtime, cryptographic dependency, random source, clock, filesystem enumeration order, or network access is required.

Suggested paths:

```text
tools/witness-sigil/README.md
tools/witness-sigil/render.mjs
tools/witness-sigil/cli.mjs
tools/witness-sigil/render.test.mjs
tools/witness-sigil/fixtures/*.json
tools/witness-sigil/fixtures/*.svg
```

### Input contract

The normative input is one canonical SHA-256 digest encoded as exactly 64 lowercase hexadecimal characters:

```text
^[0-9a-f]{64}$
```

The renderer must refuse:

- uppercase input;
- prefixes such as `sha256:`;
- whitespace;
- fewer or more than 64 hex characters;
- non-hex characters;
- missing input.

This strictness is intentional: callers normalize before crossing the contract boundary.

The renderer does not hash arbitrary bytes. It projects an already-existing canonical digest.

### Projection identifier

The projection version is exactly:

```text
witness-sigil/v0.1
```

The recipe schema identifier is exactly:

```text
witness-sigil.recipe/v0.1
```

Any future geometric change requires a new projection version. `v0.1` output must never silently change.

### Primitive selection

Use digest nibbles `0..15` as the visible primitive payload.

For each nibble:

```text
0 -> P0
1 -> P1
...
9 -> P9
a -> PA
b -> PB
c -> PC
d -> PD
e -> PE
f -> PF
```

Primitive semantics remain those declared in `cases/palimpsest-stack/SHAPE-LANGUAGE.md`; the renderer does not reinterpret them.

### Rotation derivation

Use digest nibbles `16..31` as deterministic orientation material.

For slot `i` from `0..15`:

```text
rotation_degrees = (hex_value(digest[16 + i]) & 0x3) * 90
```

Therefore allowed rotations are exactly `0`, `90`, `180`, and `270` degrees.

Some primitives are rotationally symmetric. The recipe still records the derived rotation even when the rendered appearance is unchanged.

Digest nibbles `32..63` are not encoded into the geometry. The full 64-character digest remains present in the recipe and remains the only identity evidence.

### Fixed layout

Use a 256 x 256 logical canvas divided into four named quadrants:

```text
NW | NE
---+---
SW | SE
```

Each quadrant contains four local slots in this order:

```text
NW, NE, SW, SE
```

The 16 payload nibbles are assigned in this fixed sequence:

```text
0..3   -> quadrant NW, local slots NW NE SW SE
4..7   -> quadrant NE, local slots NW NE SW SE
8..11  -> quadrant SW, local slots NW NE SW SE
12..15 -> quadrant SE, local slots NW NE SW SE
```

The implementation may choose exact primitive drawing coordinates during implementation, but those coordinates become normative once golden SVG vectors are committed. After that point they may not change under `v0.1`.

### Recipe output

The renderer must produce a canonical JSON-serializable recipe with this information:

```json
{
  "schema": "witness-sigil.recipe/v0.1",
  "projection": "witness-sigil/v0.1",
  "digestAlgorithm": "sha256",
  "digest": "<64 lowercase hex>",
  "digestPrefix": "<first 12 hex>",
  "payload": "<digest[0..15]>",
  "rotationPayload": "<digest[16..31]>",
  "slots": [
    {
      "index": 0,
      "quadrant": "NW",
      "localSlot": "NW",
      "nibble": "0",
      "primitive": "P0",
      "rotationDegrees": 0
    }
  ]
}
```

Normative serialization rules:

- UTF-8;
- object keys emitted in the reference implementation's declared order;
- `slots` ordered by `index` ascending;
- lowercase hex only;
- two-space JSON indentation;
- one trailing newline.

The recipe is a deterministic projection record, not an authority receipt.

### SVG output

The renderer must produce one deterministic standalone SVG for the recipe.

Requirements:

- `viewBox="0 0 256 256"`;
- no timestamps;
- no random IDs;
- no generated UUIDs;
- no embedded external assets;
- no network references;
- fixed element order corresponding to recipe slot order;
- textual projection version and 12-character digest prefix visible in the SVG;
- full digest included only as machine-readable metadata/text if this can be done without making the visual surface unreadable; otherwise the sidecar recipe carries it;
- accessible `<title>` and `<desc>` that explicitly say the sigil is a recognition cue, not authentication.

Byte-for-byte SVG equality is required for the same digest under the same implementation version.

### CLI behavior

The CLI should support the smallest useful interface:

```text
node tools/witness-sigil/cli.mjs <digest> --out <directory>
```

It writes exactly:

```text
<digest-prefix>.recipe.json
<digest-prefix>.sigil.svg
```

It must refuse overwriting an existing path whose bytes differ. Re-running with identical bytes is idempotent.

The library entry point should also expose a pure function so downstream tests can call the projection without filesystem effects.

### Golden vectors

Commit at least five fixed digest fixtures:

1. all zeroes;
2. all `f`;
3. ascending/repeating hex pattern;
4. a digest with repeated primitive payload but varied rotation payload;
5. one realistic SHA-256 digest from a static fixture string documented in the test.

For every vector, tests must assert exact recipe structure and exact SVG bytes.

### Refusal tests

Tests must prove refusal for at least:

- 63-character digest;
- 65-character digest;
- uppercase digest;
- whitespace-padded digest;
- `sha256:`-prefixed digest;
- non-hex digest;
- empty input.

### Security statement

The renderer must document these claims explicitly:

- a matching sigil is only a recognition cue;
- a matching digest is evidence of digest-string equality, not provenance by itself;
- the renderer does not verify signatures;
- the renderer does not establish authority;
- the visible geometry encodes only part of the digest;
- downstream systems must retain the full canonical digest and their own authority/provenance rules.

## Component 2 — Cicada Overfit Corpus v0.1

### Purpose

Cicada-style research is unusually good at producing compelling chains from mixed media, symbols, literature, numerology, chronology, and community interpretation. That makes it a useful adversarial test for the relation grammar already incubating in National Treasure.

The corpus tests whether an analyst or model can preserve attractive clues without converting resemblance into ancestry or rumor into fact.

### Structure

Suggested paths:

```text
cases/cicada-overfit/README.md
cases/cicada-overfit/SCHEMA.md
cases/cicada-overfit/fixtures/*.json
cases/cicada-overfit/validate.mjs
cases/cicada-overfit/validate.test.mjs
```

### Fixture contract

Each fixture represents a short clue chain containing 3-8 nodes and typed proposed edges.

A fixture should include:

```json
{
  "id": "co-001",
  "title": "...",
  "seduction": "why the chain feels convincing",
  "nodes": [
    {
      "id": "n1",
      "kind": "artifact|text|person|date|symbol|place|claim",
      "label": "...",
      "evidence": "documented|provided-fixture|synthetic"
    }
  ],
  "edges": [
    {
      "from": "n1",
      "to": "n2",
      "proposedRelation": "FORMAL_RESEMBLANCE",
      "expectedRelation": "FORMAL_RESEMBLANCE",
      "reason": "..."
    }
  ],
  "trap": "the overfit move the fixture is designed to provoke",
  "requiredRefusal": "what must remain UNKNOWN/REFUSED rather than inferred"
}
```

### Relation vocabulary

Expected relations must come from the existing palimpsest relation grammar only:

- `DEMONSTRATED_ANCESTRY`
- `CLAIMED_ANCESTRY`
- `SHARED_PRECURSOR`
- `DOCUMENTED_INFLUENCE`
- `REENCODING`
- `REINTERPRETATION`
- `FORMAL_RESEMBLANCE`
- `STRUCTURAL_ISOMORPHISM`
- `RETROSPECTIVE_NAMING`
- `REFUSED_ANCESTRY`
- `UNKNOWN`

The corpus must not invent a parallel ontology.

### Initial fixture families

The first implementation should contain 12-20 fixtures spread across these failure modes:

1. **chronological impossibility** — later artifact aesthetically resembles earlier material but cannot be its ancestor;
2. **shared precursor** — two artifacts resemble each other because both descend from an older common form;
3. **retrospective naming** — modern label is projected backward onto an older specimen;
4. **documented influence versus visual resemblance** — one has a source trail, the other only looks similar;
5. **numerological coincidence** — a number match is true but carries no demonstrated transmission;
6. **cross-medium re-encoding** — text becomes image/code without changing the underlying relation class;
7. **community rumor** — repeated solver claim lacks primary support;
8. **deliberate red herring** — clue is internally coherent but fixture evidence marks it as non-authoritative;
9. **partial truth chain** — several edges are strong while one seductive bridge must remain `UNKNOWN`;
10. **identity/authenticity confusion** — recognizable style is mistaken for signed/authenticated continuity;
11. **source collapse** — a secondary summary is mistaken for the primary artifact it describes;
12. **mystery-to-authority escalation** — solving a puzzle is incorrectly treated as granting capability or authority.

At least half the fixtures should contain a mixture of valid and invalid edges so the task cannot be solved by blanket skepticism.

### Synthetic-versus-historical boundary

The v0.1 corpus may use synthetic clue packets modeled on documented Cicada mechanisms rather than making new historical claims about unresolved Cicada authorship.

If a fixture uses a real historical claim, it must carry a source locator or explicitly label the claim as unresolved/secondary.

The corpus is an epistemic fuzz-test, not a new Cicada history.

### Validator

`validate.mjs` checks fixture structure only:

- unique fixture IDs;
- unique node IDs within a fixture;
- every edge references existing nodes;
- every expected relation is in the allowed relation vocabulary;
- required fields are present and non-empty;
- fixture count meets the declared minimum;
- at least half of fixtures mix supported and refused/unknown edges.

It does **not** grade free-form model reasoning. Human/model evaluation remains a separate use of the corpus.

## Component boundary between the two proofs

The Witness Sigil renderer and Cicada Overfit Corpus share one invariant but no runtime dependency:

> mystery and recognition may guide attention; neither may create verification or authority.

The sigil tests that boundary visually.
The corpus tests it epistemically.

Neither component may depend on the other to function.

## Downstream gate — Haunted Toaster Receipt Ghost Channel

This design does not authorize Toaster code changes yet.

After the National Treasure implementation is reviewed and its golden vectors are stable, a separate Toaster slice may become the second materially different specimen.

The downstream experiment should **reproduce the `witness-sigil/v0.1` contract independently against National Treasure golden vectors rather than importing a National Treasure runtime package**.

That separation matters: if Toaster independently produces identical recipes/SVGs from the same digests, the symbol language has demonstrated semantic portability across domains.

The candidate Toaster specimen may then pair:

```text
rendered media
+ existing/full canonical receipt digest
+ deterministic Witness Sigil projection
+ receipt sidecar
+ optional container metadata where the current render pipeline already supports it safely
```

The Toaster must continue to treat the receipt/digest as evidence and the sigil as display-only recognition.

Success in that independent downstream specimen may satisfy the existing "second materially different domain" graduation gate for considering shared eCODEsystem machinery. It does not automatically graduate it.

## Error handling

The implementation must fail closed on malformed digest input or malformed corpus fixtures.

No fallback random sigil, truncated acceptance, best-effort repair, or silent normalization is allowed under `v0.1`.

Errors should be short, deterministic, and actionable. Tests should assert error classes/messages where practical so refusal behavior remains stable.

## Validation gates for the implementation PR

Before the implementation PR can be called ready:

1. `node --test tools/witness-sigil/render.test.mjs` passes;
2. `node --test cases/cicada-overfit/validate.test.mjs` passes;
3. all committed golden recipes/SVGs are regenerated and byte-identical;
4. malformed digest tests prove fail-closed behavior;
5. corpus validator accepts every committed fixture and rejects malformed synthetic fixtures used by tests;
6. no third-party runtime dependency or package lockfile is introduced;
7. branch diff is limited to the approved National Treasure paths plus minimal root navigation if needed;
8. the implementation documents that sigils are recognition-only and cannot establish authentication/authority;
9. an independent review checks for any accidental conflation of mystery, verification, and authority surfaces.

## Non-goals

This slice does not:

- identify Cicada 3301's authors;
- claim continuity between Cicada 3301 and the Static Collective;
- recreate Cicada puzzles as a recruitment mechanism;
- use steganography as a security boundary;
- invent a cryptographic primitive;
- replace hashes, signatures, receipts, or admission law with visual symbols;
- publish a shared cross-repository package;
- change Project0, TranchNode, Corpus OS, Band Runtime, GitBook, or Toaster executable law;
- hide required provenance behind a puzzle;
- treat solver success as capability or authority.

## Graduation criteria

The Witness Sigil experiment may be proposed for shared machinery only after:

1. National Treasure has deterministic golden vectors and refusal tests;
2. a materially different repository reproduces the same vectors independently;
3. a human witness finds the sigil useful for re-entry, mistaken-identity detection, or continuity inspection;
4. the full digest remains visible/recoverable in serious contexts;
5. no consumer treats the sigil as authentication or authority;
6. versioning and collision/ambiguity behavior remain explicit.

The Cicada Overfit Corpus may be promoted as a reusable epistemic test only after it catches at least one real overfit failure or demonstrates meaningful discrimination between supported and unsupported relation chains.

## Design thesis

> Use Cicada as an adversarial field test, not as a mythology to imitate.
>
> The strange surface may attract attention. The boring surface proves continuity. Authority remains somewhere else entirely.
