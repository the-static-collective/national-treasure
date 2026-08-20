# National Treasure agent instructions

These instructions apply to the entire repository.

## Case isolation rule

`cases/` is the constituted landed-case registry.

If a change touches any path under `cases/**`, that same pull request **must not** change the root `README.md`.

There is no same-PR exception. If root orientation genuinely needs maintenance, make it a separate pull request after the case work lands.

Before publishing or completing any PR that touches `cases/**`, run:

```text
node --test tools/case-registry/check.test.mjs
node tools/case-registry/check.mjs
```

When changed paths are available, also run them through:

```text
node tools/case-registry/check.mjs --changed-files-stdin
```

If the checker reports:

```text
case work and root README.md maintenance must travel in separate PRs
```

split the work. Do not weaken or bypass the check to make the PR pass.

## Authority boundary

- A first-level directory under `cases/` present on `main` is landed case state.
- Root `README.md` is orientation, not the authority that makes a case exist.
- `clues/` may synthesize across cases but may not upgrade source evidence by aggregation.
- Resemblance, recurrence, or aesthetic fit never establishes ancestry without an attributable transmission road.
- Preserve failed, refused, unsupported, and unresolved edges rather than repairing them for narrative neatness.

## Research PR shape

Prefer case-local changes. A new investigation should normally own its own directory and evidence files. Avoid shared-file edits unless the shared file is itself the explicit subject of the PR.

This rule exists because parallel research branches already demonstrated that a shared root index becomes a synchronization bottleneck.
