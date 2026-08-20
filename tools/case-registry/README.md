# Case registry check

`check.mjs` derives landed case state from first-level directories under `cases/`.

Run:

```text
node --test tools/case-registry/check.test.mjs
node tools/case-registry/check.mjs
```

For pull-request collision checking, pipe newline-delimited changed paths:

```text
printf '%s\n' cases/example/README.md README.md | node tools/case-registry/check.mjs --changed-files-stdin
```

The rule is intentionally blunt: a PR that changes `cases/**` must not also change root `README.md`. Legitimate root README maintenance travels separately.

The checker is read-only. It reports the Git tree it observes; it does not create or promote cases.
