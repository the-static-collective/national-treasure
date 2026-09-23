# LC-005B Browser Survey

A dependency-free local browser surface for the receiver-local uptake experiment.

## Boundary

There are two physically separate pages:

- `presenter.html` may know the internal item, assigned arm, and source URL;
- `index.html` is the participant surface and receives only a sealed participant packet.

The participant packet contains:

- opaque study/participant/trial/material receipts;
- the locally supplied passage text;
- the frozen comprehension question and options;
- no source URL;
- no arm or version identity;
- no passage/relation identifier;
- no expected transformation class;
- no hypothesis;
- no answer key.

The browser SHA-256 packet receipt uses the same canonical-object rule as the Node verifier.

## Serve locally

From the repository root:

```bash
python3 -m http.server 8765 -d tools/linguistic-carry/survey
```

Open:

```text
http://localhost:8765/presenter.html
```

The participant uses:

```text
http://localhost:8765/index.html
```

Do not put the presenter page on the participant's screen.

## Operator flow

Create an opaque assignment:

```bash
node tools/linguistic-carry/receiver-cli.mjs assign participant-local-key > assignment.json
```

Load `assignment.json` into `presenter.html`.

The page displays the exact presenter-side resolve command for the selected opaque trial. Run it and save the result:

```bash
node tools/linguistic-carry/receiver-cli.mjs resolve <participant-pseudonym> <trial-token> > resolution.json
```

Load `resolution.json` into the presenter page. Open the supplied source link, copy only the scoped passage wording, paste it into the presenter page, and mint the participant packet.

Give only that packet to the participant.

The participant page verifies its SHA-256 receipt before rendering. After the participant answers, it downloads a response JSON.

Score with the original assignment and participant packet:

```bash
node tools/linguistic-carry/receiver-cli.mjs score assignment.json response.json packet.json
```

## Copyright / custody

The repository does not store Living Bible verse text. Passage wording enters only when the operator pastes it into a local presenter session and is carried in the locally generated participant packet.

Whether locally generated packets or responses may be retained, shared, or published depends on the source text's applicable rights and the deployment context. This scaffold makes no publication-rights claim.

## Human-study gate

This is an instrument scaffold, not authorization to conduct formal human-subjects research.

Before substantive real-world collection, freeze:

- participant information / consent language appropriate to the context;
- recruitment and sampling rules;
- data-retention and deletion rules;
- whether any institutional review is applicable;
- pilot-vs-analysis separation;
- final study manifest and receipt.

The current surface is suitable for interface/protocol testing and carefully bounded informal pilots.
