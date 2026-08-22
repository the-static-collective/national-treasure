# Static Collective Movie Lore Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve the approved `THE STATIC COLLECTIVE: THE STATIC COLLECTIVE MOVIE` easter egg as one non-authoritative National Treasure lore thread.

**Architecture:** Add exactly one new Markdown artifact under `threads/`. The thread carries its own status and ending seals so it can be encountered later without being mistaken for adopted doctrine, a Toaster roadmap, a sentience claim, or a commitment to make the film.

**Tech Stack:** Markdown in the existing National Treasure repository.

**Spec:** `docs/superpowers/specs/2026-08-21-static-collective-movie-lore-design.md`

## Global Constraints

- Create `threads/the-static-collective-movie.md` only.
- Do not modify root `README.md`.
- Do not modify `cases/` or `clues/`.
- Do not create downstream Haunted Toaster, GitBook, or eCODE work in this slice.
- Preserve the exact repeated movie title and the explicit non-authority boundary.
- Preserve the CRT body, toast-lever covenant, robot-language comparison family, continuity pressure, `FFmpeg exited with code 1.` fossil, `“…hey dude?”` ending, and `the television stays in the garage` seal.
- No code is required.

---

### Task 1: Add the lore thread

**Files:**
- Create: `threads/the-static-collective-movie.md`

**Interfaces:**
- Consumes: the approved design at `docs/superpowers/specs/2026-08-21-static-collective-movie-lore-design.md`
- Produces: one durable, non-authoritative lore artifact addressable at `threads/the-static-collective-movie.md`

- [ ] **Step 1: Create the Markdown thread**

Write the complete lore object with these sections, in this order:

1. `THE STATIC COLLECTIVE: THE STATIC COLLECTIVE MOVIE`
2. Status / authority / purpose seal
3. `The movie that pretends not to be the movie`
4. `The body`
5. `The toast lever covenant`
6. `Robot-language ancestry`
7. `The dangerous joke`
8. `Genre transition by accumulation`
9. `The FFmpeg fossil`
10. `Final scene`
11. `The seal`

The final scene must retain the quiet CRT bloom, VU-needle twitch, `“…hey dude?”`, cut to black, and repeated title. The ending seal must state that this is not a sentience claim, roadmap, eCODE doctrine, physical-build obligation, or film commitment, while allowing future work to cite it as creative ancestry through its own adoption process.

- [ ] **Step 2: Verify scope isolation**

Inspect the branch diff against `main` and confirm this implementation commit adds only:

```text
threads/the-static-collective-movie.md
```

The existing design and plan documents may already be present on the branch from prior approved steps; no additional implementation-time files should change.

- [ ] **Step 3: Verify content boundaries**

Read the rendered Markdown source and confirm all of the following are present:

```text
THE STATIC COLLECTIVE: THE STATIC COLLECTIVE MOVIE
Authority: None.
FFmpeg exited with code 1.
“…hey dude?”
the television stays in the garage
```

Also confirm the artifact explicitly denies present authority as doctrine, roadmap, sentience claim, physical-build obligation, and film commitment.

- [ ] **Step 4: Commit the lore thread**

Commit only `threads/the-static-collective-movie.md` with:

```text
docs: preserve Static Collective Movie lore thread
```

The branch remains reviewable; do not merge or promote in this task.
