# Attributable Transformation Registry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `cases/` the self-indexing landed-case registry, mechanically prevent case PRs from colliding on the root README, and preserve the attributable-transformation convergence with Cicada as an adversarial control.

**Architecture:** The filesystem is the constituted registry: first-level directories under `cases/` are discovered deterministically and each must contain a local `README.md`. A dependency-free Node checker exposes pure functions for tests and a CLI for local/CI use; GitHub Actions supplies changed paths so the checker can reject any PR that changes both `cases/**` and root `README.md`. Cross-case synthesis lives under `clues/`, while GitBook receives only a downstream incubator projection after the National Treasure source lands.

**Tech Stack:** Node.js built-ins only (`fs`, `path`, `process`, `node:test`, `assert`), GitHub Actions, Markdown.

**Spec:** `docs/superpowers/specs/2026-08-20-attributable-transformation-registry-design.md`

## Global Constraints

- A PR touching `cases/**` may not touch root `README.md`; legitimate README maintenance is a separate PR.
- `cases/` is the constituted landed-case registry; branch-only cases are not landed.
- The registry checker is read-only and dependency-free.
- The root README is stable orientation, not a hand-maintained active-case list.
- Cross-case clues may synthesize but may not upgrade underlying evidence by aggregation.
- Cicada is an adversarial control: resemblance may suggest a road; only attributable transmission evidence may establish ancestry.
- GitBook remains a non-authoritative projection; National Treasure owns the research evidence.
- The attributable-transformation compression remains incubating and must not be promoted directly into shared `patterns/` law.

---

### Task 1: Registry checker and TDD contract

**Files:**
- Create: `tools/case-registry/check.mjs`
- Create: `tools/case-registry/check.test.mjs`

**Interfaces:**
- Produces: `discoverCases(repoRoot: string): string[]`
- Produces: `findMissingCaseReadmes(repoRoot: string, cases: string[]): string[]`
- Produces: `hasLegacyActiveCasesBlock(readmeText: string): boolean`
- Produces: `hasCaseReadmeCollision(changedFiles: string[]): boolean`
- CLI: `node tools/case-registry/check.mjs`
- CLI: `printf '%s\n' <paths...> | node tools/case-registry/check.mjs --changed-files-stdin`

- [ ] **Step 1: Write failing tests for deterministic case discovery and missing README detection**

```js
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  discoverCases,
  findMissingCaseReadmes,
  hasLegacyActiveCasesBlock,
  hasCaseReadmeCollision,
} from './check.mjs';

test('discoverCases returns sorted first-level case directories only', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'nt-registry-'));
  await mkdir(path.join(root, 'cases', 'zeta'), { recursive: true });
  await mkdir(path.join(root, 'cases', 'alpha'), { recursive: true });
  await writeFile(path.join(root, 'cases', 'note.txt'), 'not a case');
  assert.deepEqual(await discoverCases(root), ['alpha', 'zeta']);
});

test('findMissingCaseReadmes reports only landed cases without README.md', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'nt-registry-'));
  await mkdir(path.join(root, 'cases', 'alpha'), { recursive: true });
  await mkdir(path.join(root, 'cases', 'beta'), { recursive: true });
  await writeFile(path.join(root, 'cases', 'alpha', 'README.md'), '# Alpha\n');
  assert.deepEqual(await findMissingCaseReadmes(root, ['alpha', 'beta']), ['beta']);
});
```

- [ ] **Step 2: Add failing tests for the legacy index and collision policy**

```js
test('legacy Active cases heading is rejected', () => {
  assert.equal(hasLegacyActiveCasesBlock('# Repo\n\n## Active cases\n- x\n'), true);
  assert.equal(hasLegacyActiveCasesBlock('# Repo\n\n## Repository shape\n'), false);
});

test('case changes and root README changes cannot share a PR', () => {
  assert.equal(hasCaseReadmeCollision(['cases/new-case/README.md', 'README.md']), true);
  assert.equal(hasCaseReadmeCollision(['cases/new-case/README.md', 'METHOD.md']), false);
  assert.equal(hasCaseReadmeCollision(['README.md', 'clues/new-clue.md']), false);
});
```

- [ ] **Step 3: Run tests and confirm RED**

Run:

```bash
node --test tools/case-registry/check.test.mjs
```

Expected: FAIL because `check.mjs` and its exports do not exist yet.

- [ ] **Step 4: Implement the minimal pure functions and CLI**

`check.mjs` must:

```js
export async function discoverCases(repoRoot) {
  const entries = await readdir(path.join(repoRoot, 'cases'), { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
}

export async function findMissingCaseReadmes(repoRoot, cases) {
  const missing = [];
  for (const name of cases) {
    try {
      await access(path.join(repoRoot, 'cases', name, 'README.md'));
    } catch {
      missing.push(name);
    }
  }
  return missing;
}

export function hasLegacyActiveCasesBlock(readmeText) {
  return /^## Active cases\s*$/m.test(readmeText);
}

export function hasCaseReadmeCollision(changedFiles) {
  const touchesCase = changedFiles.some((name) => name.startsWith('cases/'));
  const touchesRootReadme = changedFiles.includes('README.md');
  return touchesCase && touchesRootReadme;
}
```

The CLI must determine the repository root from `import.meta.url`, print the sorted landed case names, fail nonzero on missing case README files, fail nonzero while the root README still contains `## Active cases`, and when `--changed-files-stdin` is present read newline-delimited paths from stdin and fail on a case+README collision.

- [ ] **Step 5: Run focused tests and confirm GREEN**

Run:

```bash
node --test tools/case-registry/check.test.mjs
```

Expected: all tests PASS.

- [ ] **Step 6: Run the checker against the pre-migration branch and confirm it identifies the legacy root block**

Run:

```bash
node tools/case-registry/check.mjs
```

Expected before Task 2: nonzero exit identifying root `README.md` legacy `## Active cases` as the remaining migration failure while still printing the real case directories, including `cicada-overfit`.

- [ ] **Step 7: Commit Task 1**

```bash
git add -- tools/case-registry/check.mjs tools/case-registry/check.test.mjs
git commit -m "test: define self-indexing case registry"
```

---

### Task 2: Stable README and cross-case clue surface

**Files:**
- Modify: `README.md`
- Create: `clues/README.md`
- Create: `clues/attributable-transformation.md`

**Interfaces:**
- Consumes: Task 1 checker rule that root `README.md` must not contain `## Active cases`.
- Produces: stable orientation text pointing readers to `cases/` as constituted state.
- Produces: non-authoritative clue surface for cross-case synthesis.

- [ ] **Step 1: Replace the drifting active-case block with self-indexing orientation**

Replace `## Active cases` with:

```markdown
## Current cases

The constituted landed-case registry is the [`cases/`](./cases/) directory itself.

A first-level case directory present on `main` is landed repository state. Branch-only cases, proposed cases, and references elsewhere in the repository are not made active merely by being named.

To inspect the current registry mechanically:

```text
node tools/case-registry/check.mjs
```

Case PRs do not add themselves to this README. Root README maintenance travels separately so independent cases do not collide on one synchronization point.
```

Add `clues/` to `## Repository shape` as the synthesis surface.

- [ ] **Step 2: Create `clues/README.md` with the authority boundary**

Required content:

```markdown
# Clues

Cross-case syntheses live here when several independently owned investigations expose a potentially portable distinction.

A clue may point across cases. It may not upgrade those cases' evidence by aggregation.

The source case remains authoritative for its own historical, scientific, textual, or executable claims. A clue records the relation we are testing between them.
```

- [ ] **Step 3: Create `clues/attributable-transformation.md`**

The clue must preserve these exact conceptual boundaries:

```markdown
> **continuity ≠ preserved state; continuity = inspectable relation through change.**

> **Difference is not necessarily damage to continuity. Properly witnessed difference may be evidence that continuity occurred at all.**
```

It must separately document:

1. attributable transformation;
2. residue as navigational information;
3. formative thresholds;
4. generative naming vs retrospective naming;
5. return vs restoration.

It must name `cases/cicada-overfit/` as the adversarial control and include the bounded rule:

```markdown
Resemblance may suggest a road. Only attributable transmission evidence may establish ancestry.
```

It must explicitly say the compression remains an inference/incubator candidate, not shared law.

- [ ] **Step 4: Run the registry checker after README migration**

Run:

```bash
node tools/case-registry/check.mjs
```

Expected: PASS; output includes `cicada-overfit`, `forkability-continuity`, `palimpsest-stack`, `selador`, and `trust-archaeology`, plus any additional cases that have landed on the implementation base by execution time.

- [ ] **Step 5: Run Task 1 tests again**

Run:

```bash
node --test tools/case-registry/check.test.mjs
```

Expected: all PASS.

- [ ] **Step 6: Commit Task 2**

```bash
git add -- README.md clues/README.md clues/attributable-transformation.md
git commit -m "docs: make case state self-indexing"
```

---

### Task 3: CI collision guard

**Files:**
- Create: `.github/workflows/case-registry.yml`
- Modify: `tools/case-registry/check.test.mjs` only if a workflow-facing regression needs an additional pure-function case.

**Interfaces:**
- Consumes: `hasCaseReadmeCollision(changedFiles)` and the checker CLI from Task 1.
- Produces: pull-request gate that supplies exact changed paths to the checker.

- [ ] **Step 1: Add a regression test for nested case paths and root-only README matching**

```js
test('collision rule is narrow to cases/** plus the root README', () => {
  assert.equal(hasCaseReadmeCollision(['cases/a/fixtures/x.json', 'README.md']), true);
  assert.equal(hasCaseReadmeCollision(['cases/a/README.md', 'cases/a/NOTES.md']), false);
  assert.equal(hasCaseReadmeCollision(['cases/a/README.md', 'docs/README.md']), false);
});
```

- [ ] **Step 2: Run the focused test and confirm GREEN after any required minimal adjustment**

Run:

```bash
node --test tools/case-registry/check.test.mjs
```

Expected: all PASS.

- [ ] **Step 3: Create the GitHub Actions workflow**

`.github/workflows/case-registry.yml`:

```yaml
name: Case registry

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  registry:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - name: Registry tests
        run: node --test tools/case-registry/check.test.mjs
      - name: Registry state
        run: node tools/case-registry/check.mjs
      - name: Reject case plus root README collision
        if: github.event_name == 'pull_request'
        shell: bash
        run: |
          git diff --name-only "${{ github.event.pull_request.base.sha }}" "${{ github.event.pull_request.head.sha }}" \
            | node tools/case-registry/check.mjs --changed-files-stdin
```

- [ ] **Step 4: Simulate both sides of the policy locally**

Run:

```bash
printf '%s\n' cases/example/README.md METHOD.md | node tools/case-registry/check.mjs --changed-files-stdin
```

Expected: PASS.

Run:

```bash
printf '%s\n' cases/example/README.md README.md | node tools/case-registry/check.mjs --changed-files-stdin
```

Expected: nonzero exit with an explicit message that case work and root README maintenance must travel in separate PRs.

- [ ] **Step 5: Run the full local gate**

Run:

```bash
node --test tools/case-registry/check.test.mjs
node tools/case-registry/check.mjs
```

Expected: all PASS.

- [ ] **Step 6: Commit Task 3**

```bash
git add -- .github/workflows/case-registry.yml tools/case-registry/check.test.mjs
git commit -m "ci: prevent case index collisions"
```

---

### Task 4: PR review, landing, and independent research preservation

**Files:**
- No new implementation files unless review finds a valid in-scope defect.

**Interfaces:**
- Consumes: Tasks 1–3 implementation branch.
- Produces: landed self-indexing registry and a clean base for independent research PRs.

- [ ] **Step 1: Open the implementation PR as draft**

PR body must name:

- the root-index collision failure mode;
- filesystem-as-registry design;
- exact CI prohibition;
- Cicada recovery as adversarial control;
- local validation commands and results;
- explicit non-goal: no research case is rewritten merely to fit the synthesis.

- [ ] **Step 2: Verify changed files stay inside the approved implementation surface**

Expected files:

```text
README.md
clues/README.md
clues/attributable-transformation.md
tools/case-registry/check.mjs
tools/case-registry/check.test.mjs
.github/workflows/case-registry.yml
```

No `cases/**` file should be changed by this implementation PR.

- [ ] **Step 3: Run/observe CI and automated review against the exact head**

Acceptance requires:

- registry tests green;
- registry state green;
- zero unresolved in-scope review threads;
- no unexpected files;
- head still matches the reviewed commit.

- [ ] **Step 4: Address only valid in-scope findings and rerun invalidated gates**

Do not expand into a generic repository framework, package manager, generated index, or external registry service.

- [ ] **Step 5: Squash-merge the implementation PR after the completion gate**

Preserve the branch unless repository policy or explicit user instruction says otherwise.

- [ ] **Step 6: Re-check open research PRs from the new `main`**

For #1, #9, #11, #13, and #14:

- confirm their changed-file lists still do not contain root `README.md`;
- confirm mergeability/current-base status;
- preserve each research history independently;
- do not edit them to force conceptual uniformity.

If a research PR is otherwise ready and authorized for landing, take it through its own review/completion gate rather than bundling several research bodies into the registry PR.

---

### Task 5: GitBook incubator projection

**Files (Git Sync source repository `the-static-collective/What-is-the-static-collective-`):**
- Create a page under the existing `frontier/primitive-incubator/continuity-witness-shared-questions-local-answers/` neighborhood, using that repository's current SUMMARY/navigation convention.
- Modify navigation/index files only as required by the existing GitBook sync structure.

**Interfaces:**
- Consumes: landed National Treasure `clues/attributable-transformation.md` and its exact landing commit.
- Produces: non-authoritative cross-project projection titled `Attributable Transformation — Difference as Continuity Evidence`.

- [ ] **Step 1: Read the landed National Treasure clue from the exact merge commit**

Do not project from an unmerged branch or from this plan/spec alone.

- [ ] **Step 2: Write the bounded GitBook page**

The projection must include:

```text
continuity ≠ preserved state
residue may be navigational when ancestry is independently grounded
Cicada: resemblance is not a witnessed road
thresholds may be formative
naming can generate descendants forward without manufacturing ancestors backward
return is not restoration
```

It must identify National Treasure and the exact landing commit as research authority, and label the GitBook page as an incubator projection.

- [ ] **Step 3: Preserve promotion fog**

Explicitly state that the candidate has not graduated into `patterns/` and that future positive and adversarial specimens remain required.

- [ ] **Step 4: Open/review/land the GitBook-source PR**

Run the repository's ordinary docs/navigation validation, complete review, then merge only after the source-authority link is exact and current.

---

## Final Verification

- [ ] `node --test tools/case-registry/check.test.mjs` passes on the final implementation head.
- [ ] `node tools/case-registry/check.mjs` passes and lists the actual `cases/` directories, including Cicada.
- [ ] A synthetic `cases/**` + root `README.md` changed-file stream fails.
- [ ] A synthetic `cases/**`-only changed-file stream passes.
- [ ] Root README contains no `## Active cases` hand-maintained block.
- [ ] Implementation PR changes no `cases/**` files.
- [ ] `clues/attributable-transformation.md` preserves Cicada as a negative/adversarial control rather than ancestry support.
- [ ] GitBook projection points to the exact landed National Treasure authority and remains in the incubator.
