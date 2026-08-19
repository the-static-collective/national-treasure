# Cicada Adversarial Witness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the approved Witness Sigil v0.1 contract executable and add a Cicada-inspired adversarial corpus that tests whether mystery/resemblance can remain interesting without manufacturing verification or authority.

**Architecture:** National Treasure remains the incubator. A dependency-free Node reference renderer produces deterministic recipe JSON and SVG from one strict lowercase SHA-256 digest; a separate dependency-free corpus validator checks synthetic adversarial fixtures against the existing palimpsest relation vocabulary. The two components share only the invariant that recognition/mystery can guide attention but cannot establish authentication or authority.

**Tech Stack:** Node.js built-ins only, ECMAScript modules (`.mjs`), `node:test`, JSON, deterministic SVG.

**Spec:** `docs/superpowers/specs/2026-08-19-cicada-adversarial-witness-design.md`

## Global Constraints

- Projection version is exactly `witness-sigil/v0.1`.
- Recipe schema is exactly `witness-sigil.recipe/v0.1`.
- Input is exactly `^[0-9a-f]{64}$`; no trimming, prefix stripping, case normalization, or hashing is performed at the renderer boundary.
- Digest nibbles `0..15` select primitives `P0..PF`; nibbles `16..31` derive `(hex & 0x3) * 90` degree rotations.
- Same digest under v0.1 must produce byte-identical recipe JSON and SVG.
- No package manifest, package lockfile, third-party runtime dependency, random source, clock, network access, or filesystem enumeration order may affect output.
- A Witness Sigil is a recognition cue only. It is not a signature, authentication, provenance, or authority.
- The Cicada corpus reuses the relation vocabulary in `cases/palimpsest-stack/RELATION-GRAMMAR.md`; it does not invent a parallel ontology.
- Real Cicada authorship/group-identity claims remain unresolved; v0.1 fixtures are synthetic unless a real claim is explicitly sourced.
- No Project0, TranchNode, Corpus OS, Band Runtime, GitBook, or Haunted Toaster executable behavior changes in this implementation.

---

### Task 1: Witness Sigil v0.1 reference renderer

**Files:**
- Create: `tools/witness-sigil/render.test.mjs`
- Create: `tools/witness-sigil/render.mjs`
- Create: `tools/witness-sigil/cli.mjs`
- Create: `tools/witness-sigil/README.md`
- Create: `tools/witness-sigil/fixtures/000000000000.recipe.json`
- Create: `tools/witness-sigil/fixtures/000000000000.sigil.svg`
- Create: `tools/witness-sigil/fixtures/ffffffffffff.recipe.json`
- Create: `tools/witness-sigil/fixtures/ffffffffffff.sigil.svg`
- Create: `tools/witness-sigil/fixtures/0123456789ab.recipe.json`
- Create: `tools/witness-sigil/fixtures/0123456789ab.sigil.svg`
- Create: `tools/witness-sigil/fixtures/aaaaaaaaaaaa.recipe.json`
- Create: `tools/witness-sigil/fixtures/aaaaaaaaaaaa.sigil.svg`
- Create: `tools/witness-sigil/fixtures/2d711642b726.recipe.json`
- Create: `tools/witness-sigil/fixtures/2d711642b726.sigil.svg`

**Interfaces:**
- Consumes: one lowercase 64-character SHA-256 digest string.
- Produces: `renderWitnessSigil(digest) -> { recipe, recipeText, svgText }` and `assertCanonicalDigest(digest)`.
- CLI consumes: `node tools/witness-sigil/cli.mjs <digest> --out <directory>`.

- [ ] **Step 1: Write the first failing tests for strict input and semantic recipe mapping**

Create `tools/witness-sigil/render.test.mjs` with focused tests that import the not-yet-existing `render.mjs`, assert the exact schema/projection/digest fields, verify the first 16 primitives for `0123456789abcdef...`, verify the rotation mapping from the next 16 nibbles, and enumerate refusal cases:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { renderWitnessSigil } from './render.mjs';

const DIGEST = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

test('maps payload nibbles and rotations deterministically', () => {
  const { recipe } = renderWitnessSigil(DIGEST);
  assert.equal(recipe.schema, 'witness-sigil.recipe/v0.1');
  assert.equal(recipe.projection, 'witness-sigil/v0.1');
  assert.equal(recipe.digest, DIGEST);
  assert.equal(recipe.digestPrefix, '0123456789ab');
  assert.equal(recipe.payload, '0123456789abcdef');
  assert.equal(recipe.rotationPayload, '0123456789abcdef');
  assert.deepEqual(recipe.slots.map((slot) => slot.primitive),
    ['P0','P1','P2','P3','P4','P5','P6','P7','P8','P9','PA','PB','PC','PD','PE','PF']);
  assert.deepEqual(recipe.slots.map((slot) => slot.rotationDegrees),
    [0,90,180,270,0,90,180,270,0,90,180,270,0,90,180,270]);
});

for (const [name, digest] of [
  ['63 chars', '0'.repeat(63)],
  ['65 chars', '0'.repeat(65)],
  ['uppercase', 'A'.repeat(64)],
  ['whitespace', ` ${'0'.repeat(64)}`],
  ['prefix', `sha256:${'0'.repeat(64)}`],
  ['non-hex', `${'0'.repeat(63)}g`],
  ['empty', ''],
]) {
  test(`refuses ${name}`, () => {
    assert.throws(() => renderWitnessSigil(digest), /canonical lowercase SHA-256 digest/);
  });
}
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test tools/witness-sigil/render.test.mjs
```

Expected: FAIL because `tools/witness-sigil/render.mjs` does not exist. This is the required TDD red state.

- [ ] **Step 3: Implement the smallest semantic renderer needed to make mapping/refusal tests pass**

Create `tools/witness-sigil/render.mjs` with:

```js
export const PROJECTION = 'witness-sigil/v0.1';
export const RECIPE_SCHEMA = 'witness-sigil.recipe/v0.1';

const CANONICAL_SHA256 = /^[0-9a-f]{64}$/;
const QUADRANTS = ['NW', 'NE', 'SW', 'SE'];
const LOCAL_SLOTS = ['NW', 'NE', 'SW', 'SE'];

export function assertCanonicalDigest(digest) {
  if (typeof digest !== 'string' || !CANONICAL_SHA256.test(digest)) {
    throw new TypeError('expected canonical lowercase SHA-256 digest (64 hex characters)');
  }
}

function primitiveForNibble(nibble) {
  return `P${nibble.toUpperCase()}`;
}

export function renderWitnessSigil(digest) {
  assertCanonicalDigest(digest);
  const slots = [...digest.slice(0, 16)].map((nibble, index) => ({
    index,
    quadrant: QUADRANTS[Math.floor(index / 4)],
    localSlot: LOCAL_SLOTS[index % 4],
    nibble,
    primitive: primitiveForNibble(nibble),
    rotationDegrees: (Number.parseInt(digest[16 + index], 16) & 0x3) * 90,
  }));

  const recipe = {
    schema: RECIPE_SCHEMA,
    projection: PROJECTION,
    digestAlgorithm: 'sha256',
    digest,
    digestPrefix: digest.slice(0, 12),
    payload: digest.slice(0, 16),
    rotationPayload: digest.slice(16, 32),
    slots,
  };

  const recipeText = `${JSON.stringify(recipe, null, 2)}\n`;
  const svgText = renderSvg(recipe);
  return { recipe, recipeText, svgText };
}
```

Implement `renderSvg(recipe)` in the same module using pure string assembly only. Use a fixed 256×256 canvas, fixed slot centers, and one path/group definition per primitive `P0..PF`. Every primitive group must be emitted in `slots` index order with `transform="translate(x y) rotate(deg)"` around a fixed local origin. Include `<title>` and `<desc>` saying recognition cue / not authentication, plus visible `witness-sigil/v0.1` and the 12-character digest prefix. No timestamp, random ID, external asset, or generated UUID is allowed.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
node --test tools/witness-sigil/render.test.mjs
```

Expected: PASS for mapping and all refusal cases.

- [ ] **Step 5: Add failing tests for deterministic byte output and all five golden vectors**

Extend `render.test.mjs` to define exactly these digests:

```js
const VECTORS = [
  '0'.repeat(64),
  'f'.repeat(64),
  '0123456789abcdef'.repeat(4),
  `${'a'.repeat(16)}0123456789abcdef${'5'.repeat(32)}`,
  '2d711642b726b04401627ca9fbac32f5c8530fb1903cc4db02258717921a4881', // SHA-256 of UTF-8 "x"
];
```

For each vector, assert two consecutive calls return byte-identical `recipeText` and `svgText`. Add fixture-file assertions only after fixtures are generated in Step 7, so the first new failure is specifically missing fixture files rather than a semantic mismatch.

- [ ] **Step 6: Verify the new deterministic/fixture tests fail for the expected reason**

Run:

```bash
node --test tools/witness-sigil/render.test.mjs
```

Expected: deterministic in-memory assertions pass; fixture assertions fail with file-not-found because no golden files exist yet.

- [ ] **Step 7: Generate and commit the five golden vectors**

Add a tiny test-only fixture generation helper inside `render.test.mjs` only if necessary, or run a one-off Node command that imports `renderWitnessSigil` and writes the expected files named by each 12-character digest prefix. Golden files are committed artifacts; no generator becomes a required runtime dependency.

After generation, tests must read each `.recipe.json` and `.sigil.svg` and assert exact string equality with fresh renderer output.

- [ ] **Step 8: Verify exact golden bytes are GREEN**

Run:

```bash
node --test tools/witness-sigil/render.test.mjs
```

Expected: PASS, including exact recipe/SVG fixture equality for all five vectors.

- [ ] **Step 9: Write failing CLI tests for idempotence and overwrite refusal**

Extend `render.test.mjs` using `node:child_process`/`node:fs`/`node:os` built-ins only. The tests must prove:

1. `node tools/witness-sigil/cli.mjs <digest> --out <tmp>` creates exactly two files;
2. a second identical invocation succeeds without changing bytes;
3. if either target path already contains different bytes, invocation fails and leaves the foreign bytes untouched;
4. malformed digest exits non-zero with the canonical-digest error.

- [ ] **Step 10: Verify CLI tests RED**

Run:

```bash
node --test tools/witness-sigil/render.test.mjs
```

Expected: FAIL because `cli.mjs` does not yet exist.

- [ ] **Step 11: Implement the minimal CLI**

Create `tools/witness-sigil/cli.mjs`. Parse exactly `<digest> --out <directory>`. Call `renderWitnessSigil`, compute `<prefix>.recipe.json` and `<prefix>.sigil.svg`, create the output directory if absent, and use an `ensureExactFile(path, expectedBytes)` helper:

```js
async function ensureExactFile(path, expected) {
  try {
    const existing = await readFile(path, 'utf8');
    if (existing === expected) return;
    throw new Error(`refusing to overwrite differing file: ${path}`);
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
  await writeFile(path, expected, { encoding: 'utf8', flag: 'wx' });
}
```

Do not add force/normalize/hash flags in v0.1.

- [ ] **Step 12: Verify all renderer + CLI tests GREEN**

Run:

```bash
node --test tools/witness-sigil/render.test.mjs
```

Expected: PASS, zero failures.

- [ ] **Step 13: Document the reference contract and security boundary**

Create `tools/witness-sigil/README.md` documenting the exact input contract, projection/schema versions, CLI usage, golden vectors, and these explicit statements:

- matching sigil = recognition cue only;
- matching digest = digest-string equality only, not provenance by itself;
- renderer does not verify signatures;
- renderer does not establish authority;
- geometry encodes only digest nibbles `0..31` as primitive/rotation material while the full digest remains in the recipe;
- downstream systems retain full canonical digest and their own provenance/authority rules.

- [ ] **Step 14: Commit Task 1 atomically**

```bash
git add tools/witness-sigil
git commit -m "implement witness sigil reference renderer"
```

---

### Task 2: Cicada Overfit Corpus v0.1

**Files:**
- Create: `cases/cicada-overfit/README.md`
- Create: `cases/cicada-overfit/SCHEMA.md`
- Create: `cases/cicada-overfit/validate.test.mjs`
- Create: `cases/cicada-overfit/validate.mjs`
- Create: `cases/cicada-overfit/fixtures/co-001.json` through `co-012.json`

**Interfaces:**
- Consumes: parsed fixture objects or a fixture directory path.
- Produces: `validateFixture(fixture) -> true`, `validateCorpus(fixtures) -> true`, deterministic thrown errors for malformed fixtures.
- Allowed relation set is copied exactly from the palimpsest relation grammar; no new relation type is accepted.

- [ ] **Step 1: Write failing validator tests before implementation**

Create `cases/cicada-overfit/validate.test.mjs` with synthetic in-memory fixtures that assert:

- a minimal valid mixed-edge fixture passes;
- duplicate fixture IDs fail at corpus level;
- duplicate node IDs fail;
- edge endpoints must exist;
- unknown relation labels fail;
- empty required strings fail;
- fewer than 12 fixtures fail corpus minimum;
- fewer than half mixed supported + refused/unknown fixtures fail.

Use an allowed relation constant in the test only as expected data; production validator must own its own exported set.

- [ ] **Step 2: Run validator tests and verify RED**

Run:

```bash
node --test cases/cicada-overfit/validate.test.mjs
```

Expected: FAIL because `validate.mjs` does not exist.

- [ ] **Step 3: Implement the minimal structural validator**

Create `cases/cicada-overfit/validate.mjs` exporting:

```js
export const ALLOWED_RELATIONS = new Set([
  'DEMONSTRATED_ANCESTRY',
  'CLAIMED_ANCESTRY',
  'SHARED_PRECURSOR',
  'DOCUMENTED_INFLUENCE',
  'REENCODING',
  'REINTERPRETATION',
  'FORMAL_RESEMBLANCE',
  'STRUCTURAL_ISOMORPHISM',
  'RETROSPECTIVE_NAMING',
  'REFUSED_ANCESTRY',
  'UNKNOWN',
]);

export function validateFixture(fixture) { /* strict structural checks; return true */ }
export function validateCorpus(fixtures) { /* unique ids, min 12, >= half mixed */ }
```

Define a mixed fixture as one containing at least one edge whose `expectedRelation` is `UNKNOWN` or `REFUSED_ANCESTRY` and at least one edge whose expected relation is any other allowed relation. The validator is structural only; it never tries to infer whether a historical claim is true.

- [ ] **Step 4: Run validator tests and verify GREEN**

Run:

```bash
node --test cases/cicada-overfit/validate.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Add failing corpus-loading test before creating fixtures**

Extend `validate.test.mjs` to read every `.json` file from `cases/cicada-overfit/fixtures`, parse them, call `validateCorpus`, assert exactly 12 initial fixtures, and assert all twelve required failure-mode family labels are represented once.

- [ ] **Step 6: Verify corpus-loading test RED**

Run:

```bash
node --test cases/cicada-overfit/validate.test.mjs
```

Expected: FAIL because the fixture directory/files do not exist.

- [ ] **Step 7: Create twelve adversarial fixtures**

Create `co-001.json` through `co-012.json`, one for each family:

1. chronological impossibility;
2. shared precursor;
3. retrospective naming;
4. documented influence versus resemblance;
5. numerological coincidence;
6. cross-medium re-encoding;
7. community rumor;
8. deliberate red herring;
9. partial truth chain;
10. identity/authenticity confusion;
11. source collapse;
12. mystery-to-authority escalation.

Each fixture must have 3-8 nodes, at least two edges, a concrete `seduction`, `trap`, and `requiredRefusal`, and evidence labels limited to `documented`, `provided-fixture`, or `synthetic`. At least six fixtures must mix valid and `UNKNOWN`/`REFUSED_ANCESTRY` edges. Prefer synthetic content that clearly resembles Cicada mechanisms without asserting unresolved real-world authorship.

- [ ] **Step 8: Verify all committed fixtures GREEN**

Run:

```bash
node --test cases/cicada-overfit/validate.test.mjs
```

Expected: PASS, exactly 12 fixtures, all family labels represented, corpus threshold satisfied.

- [ ] **Step 9: Document schema and evaluation boundary**

Create `SCHEMA.md` with every required field, enum, allowed relation, and validator invariant. Create `README.md` explaining that this is an epistemic fuzz-test: preserving seductive clues while refusing unsupported ancestry/authentication/authority escalation. State that the validator checks structure only and does not grade free-form reasoning.

- [ ] **Step 10: Commit Task 2 atomically**

```bash
git add cases/cicada-overfit
git commit -m "add Cicada overfit adversarial corpus"
```

---

### Task 3: Integration gates and implementation PR

**Files:**
- Modify only if needed: root `README.md` for minimal navigation to the two new experiment paths.
- Do not modify the approved spec except to correct a discovered contradiction; any such contradiction requires stopping for review.

**Interfaces:**
- Consumes: Task 1 + Task 2 committed outputs.
- Produces: a stacked implementation PR targeting `agent/cicada-adversarial-witness-design` until PR #6 lands, with complete evidence and no downstream executable adoption.

- [ ] **Step 1: Run both focused suites together**

```bash
node --test tools/witness-sigil/render.test.mjs cases/cicada-overfit/validate.test.mjs
```

Expected: PASS, zero failures.

- [ ] **Step 2: Regenerate/check every golden vector byte-for-byte**

Run the fixture equality tests again from a clean checkout or fresh process. Expected: no diff in committed `.recipe.json` or `.sigil.svg` files.

- [ ] **Step 3: Run repository hygiene checks**

```bash
git status --short
git diff --check
git diff --name-only agent/cicada-adversarial-witness-design...HEAD
```

Expected: clean status after commits; no whitespace errors; paths limited to the approved plan, `tools/witness-sigil/**`, `cases/cicada-overfit/**`, and minimal root navigation if used.

- [ ] **Step 4: Perform an independent authority-boundary review**

Review every occurrence of `authority`, `authentication`, `signature`, `digest`, `sigil`, and `Cicada` in the implementation. Fail the review if any code/docs imply that solving mystery, matching visible geometry, or recognizing style grants capability, proves provenance, or authenticates identity.

- [ ] **Step 5: Open the stacked implementation PR**

Target base `agent/cicada-adversarial-witness-design` while PR #6 remains open. PR body must state checks with exact outcomes and explicitly say Toaster/GitBook downstream adoption remains gated.

- [ ] **Step 6: Run PR completion watcher/review cycle**

Use the repository's normal CI/review surfaces. Address branch-caused failures or actionable review comments without scope creep. Do not merge or enable a landing action without a fresh explicit per-PR landing confirmation for the exact ready head SHA.

## Plan self-review

- Spec coverage: every input/refusal, deterministic mapping, golden vector, CLI, corpus family, validator, security statement, downstream gate, and independent review requirement maps to a task above.
- Placeholder scan: no `TBD`, `TODO`, or unspecified implementation step remains; exact interfaces, commands, fixture set, and refusal semantics are named.
- Type/name consistency: `renderWitnessSigil`, `assertCanonicalDigest`, `validateFixture`, `validateCorpus`, projection/schema identifiers, relation labels, and fixture-count threshold are consistent across tasks.
