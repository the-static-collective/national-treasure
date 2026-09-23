# LC-005C — Pilot gate: usable without contaminating the study

**Status:** local-only usability pilot scaffold; NOT an experimental observation  
**Date:** 2026-09-23  
**Parent:** LC-005 / LC-005B

## Frozen specimen

`studies/living-bible-pilot-freeze-001.json` pins the existing ten-item receiver study by its Git blob SHA-1. The `pilot-cli.mjs check` command independently reconstructs that blob ID and the canonical study receipt, and refuses altered wording. This freezes an identifiable *pilot baseline*, **not** the final substantive experiment. A later substantive study must have its own declared protocol, question revisions, sample plan and consent/privacy review.

## Participant experience

The existing local `survey/index.html` is now **pilot only**:

1. Voluntary participant information is displayed before a packet can load. Explicit acknowledgement is required.
2. The participant sees the passage, the frozen question, and possible choices to assess readability and ambiguity.
3. The participant does **not** submit a comprehension answer.
4. Optional usability issues and a short, nonpersonal note may be recorded.
5. The only export is `pilot-feedback-*.json`, with a SHA-256 content fingerprint and `mode: pilot_only` / `analytical_admission: false`.

There is no background submission, telemetry, cookies, or localStorage in this scaffold. Static hosting serves the files; feedback is not posted to a server. A SHA-256 content fingerprint supports integrity checks but is not a digital signature, proof of authorship, or protection against someone intentionally creating a forged packet.

Masked version labels are not a guarantee of blindness: readers familiar with either rendering may recognize it. The pilot can record that recognition as an interface issue.

## Operator custody

The presenter page remains private. It resolves the source arm and accepts a locally copied, scoped passage. Only the locally created packet carries the verse text. **Do not commit the packet, the passage text, raw participant files, or notes to the repository.**

The participant may stop before download, and decides whether to share their feedback. The prototype does not automatically delete local downloads. The operator's default rule is to retain voluntarily shared pilot feedback for no more than seven days, then delete it manually. Any other retention/publication agreement requires separate participant information and a new protocol.

Do not ask for names, email addresses, religious affiliation, health information, or other personal details; use non-identifying, random participant keys.

## Run

```bash
node tools/linguistic-carry/pilot-cli.mjs check
python3 -m http.server 8765 -d tools/linguistic-carry/survey
```

The operator opens `http://localhost:8765/presenter.html`. The participant opens `http://localhost:8765/index.html` on a separate private screen. Generate the opaque assignment and resolve the trial as documented in `survey/README.md`.

If someone voluntarily shares one or more `pilot-feedback-*.json` files, keep them locally and put them in a JSON array for usability review:

```bash
node tools/linguistic-carry/pilot-cli.mjs review local-pilot-feedback-array.json
```

The review exposes only issue counts and usability counts, not participant notes, answer correctness, ASV/TLB arms, preference, or comparative effects.

## Enforced exclusion

Both `scoreResponse` and `summarizeReceipts` throw on `pilot_only` data. The pilot module rejects any feedback carrying `answer_index`, `correct`, `arm`, `passage_text`, `participant`, or other forbidden analytic/source fields. It rejects modified SHA-256 receipts, mixed study versions, duplicate feedback for one packet, and invalid issue codes.

The substantive study therefore cannot silently incorporate this pilot through its normal executable ingestion path.

## Next decision after a real pilot

After voluntary local interface testing, inspect only questions about readability, ambiguity, device layout and masking. Revise the question set if the interface or item wording fails. Each revision must create a new manifest and be evaluated separately; do not edit the pinned baseline or recycle pilot data into a later analysis.

Before substantive recruitment, resolve any institutional review needs, participant information/consent, retention and withdrawal handling, sample definition, outcome definitions, and prospective analysis plan. The pilot itself establishes none of these.
