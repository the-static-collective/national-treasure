# Witness Sigil reference renderer v0.1

This directory is the National Treasure reference implementation of `witness-sigil/v0.1`.

A Witness Sigil is a deterministic geometric projection of an **already-existing canonical SHA-256 digest**. Its only job is to give humans a compact recognition surface while the full digest and the owning system's provenance/authority rules remain canonical.

## Hard boundary

A matching sigil is a recognition cue only.

A matching digest is evidence that two digest strings are equal. It is not provenance by itself.

This renderer:

- does **not** hash arbitrary bytes;
- does **not** verify signatures;
- does **not** authenticate a publisher or artifact;
- does **not** establish authority or capability;
- does **not** let solving or recognizing a visual surface manufacture authority.

Downstream systems must retain the full canonical digest and their own provenance, admission, signature, and authority rules.

## Input

The library and CLI accept exactly one lowercase 64-character hexadecimal digest:

```text
^[0-9a-f]{64}$
```

No trimming, prefix stripping, case normalization, or best-effort repair occurs at this boundary.

## Projection

- schema: `witness-sigil.recipe/v0.1`
- projection: `witness-sigil/v0.1`
- digest nibbles `0..15`: primitive payload (`P0..PF`)
- digest nibbles `16..31`: rotation payload (`0`, `90`, `180`, `270` degrees via `(hex & 0x3) * 90`)
- digest nibbles `32..63`: not encoded into visible geometry
- full 64-character digest: retained in the recipe sidecar
- visible text: projection version plus 12-character digest prefix

The primitive semantics come from `cases/palimpsest-stack/SHAPE-LANGUAGE.md`. This renderer freezes one visual projection; it does not promote the symbol language into shared cross-project law.

## Library

```js
import { renderWitnessSigil } from './render.mjs';

const { recipe, recipeText, svgText } = renderWitnessSigil(digest);
```

For the same canonical digest under `witness-sigil/v0.1`, `recipeText` and `svgText` are byte-stable.

## CLI

```text
node tools/witness-sigil/cli.mjs <digest> --out <directory>
```

It writes exactly:

```text
<first-12-hex>.recipe.json
<first-12-hex>.sigil.svg
```

Re-running against identical bytes is idempotent. If either target path already contains different bytes, the CLI refuses to overwrite it.

## Golden vectors

`fixtures/` contains five committed vectors:

1. all zeroes;
2. all `f`;
3. repeating `0123456789abcdef`;
4. repeated `a` primitive payload with varied rotation payload;
5. SHA-256 of UTF-8 `x`: `2d711642b726b04401627ca9fbac32f5c8530fb1903cc4db02258717921a4881`.

Tests compare fresh output to the committed recipe JSON and SVG byte-for-byte. Any intentional geometric change requires a new projection version rather than silently changing v0.1.

## Verification

```text
node --test tools/witness-sigil/render.test.mjs
```
