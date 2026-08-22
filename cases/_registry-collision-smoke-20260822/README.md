# Hosted Case Registry Collision Smoke

Disposable negative-control specimen for issue #21.

This branch intentionally violates the repository case-isolation rule by changing both `cases/**` and the root `README.md` in one pull request.

Expected hosted result:

- registry tests: pass;
- registry state: pass;
- case + root README collision guard: fail;
- pull request remains unmerged and is closed after the receipt is observed.

This file is test evidence only and must never land on `main`.
