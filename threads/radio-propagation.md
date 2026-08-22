# Radio propagation — conditional paths / reception chain

Status: **grounded mechanism thread / evidence-first; no architectural promotion**

## Why this stays on the map

Two supplied radio research bundles converge on a useful family of ordinary, testable mechanisms: ground wave, ionospheric skywave/skip, line-of-sight propagation, tropospheric ducting, sporadic E, meteor scatter, and auroral propagation.

The important feature is not that radio supplies a ready-made metaphor for another system. It is that radio gives us a mature physical domain in which **sending, propagation, arrival, detection, decoding, and attribution are not the same event**.

This thread preserves that domain first.

It does **not** yet claim that TranchNode, Project0, eCODE, or any other Collective architecture should imitate radio.

## The smallest grounded residue

A useful radio-native decomposition is:

```text
emission
    ↓
propagation path(s)
    ↓
field present at a receiving location
    ↓
antenna / receiver coupling
    ↓
detection
    ↓
demodulation / decoding
    ↓
attribution / interpretation
```

These stages can succeed or fail independently enough that collapsing them produces bad descriptions.

A transmitter may radiate while no useful path reaches a receiver. A path may exist while the received field is below detection threshold. Energy may be detected without successful demodulation or decoding. Decoded content may still lack trustworthy attribution.

That separation is the live treasure here.

## Grounded propagation family

| Mode | Grounded mechanism | What changes reachability | Evidence posture |
|---|---|---|---|
| **Ground wave** | Energy travels close to the Earth's surface; field strength depends strongly on frequency, power, terrain, and ground conductivity. | frequency; conductivity; terrain; power | **Primary source / Established** — FCC treatment of AM groundwave |
| **Skywave / ionospheric** | Energy travels upward into ionized upper-atmosphere regions and can return to Earth far beyond ordinary groundwave range. | frequency; time of day; season; solar/geomagnetic state; ionospheric structure | **Primary source / Established** — FCC + NOAA/NCEI |
| **Line of sight / space wave** | At VHF/UHF and above, useful terrestrial coverage is commonly horizon- and obstruction-limited unless another propagation mode intervenes. | geometry; antenna height; terrain/obstruction; refraction | **Inference / Established neighborhood** — supplied research bundles; preserve exact range numbers as approximate |
| **Tropospheric ducting** | Temperature/moisture stratification can create a refractive layer that guides RF energy as a waveguide over unexpectedly long paths. | vertical refractivity gradient; weather layering; frequency; geometry | **Primary technical source / Established** — NTIA/ITS |
| **Sporadic E** | Transient localized patches of enhanced electron density form in the E region and materially alter radiowave propagation. | time; latitude; ionization state; frequency; geometry | **Primary institutional source / Established** — NOAA/NCEI + SWPC |
| **Meteor scatter** | Brief ionized meteor trails can furnish transient VHF propagation paths. | meteor trail formation/lifetime; geometry; frequency; timing | **Observed operational category / Probable mechanism here** — supplied bundles + ARRL records; stronger primary mechanism source still wanted |
| **Auroral propagation** | Auroral ionization / irregularities can scatter VHF signals, often with distortion or Doppler spread. | geomagnetic activity; latitude; geometry; frequency | **Observed operational category / Probable mechanism here** — supplied bundles + ARRL records; stronger primary mechanism source still wanted |

The table deliberately avoids treating one approximate frequency or distance range as a constitutional boundary. The supplied bundles contain useful ranges, but several are presented as broad engineering rules of thumb and their underlying citation objects are not fully carried in the files.

## Claim records

### NT-RADIO-001 — groundwave and skywave are distinct paths

```yaml
claim_id: NT-RADIO-001
claim: "A single transmitter can produce materially different groundwave and skywave service paths; the existence and useful range of one does not imply the other."
provenance_class: primary source
support_confidence: established
source_family: "Federal Communications Commission"
source_locator: "FCC-58-891A1, discussion of groundwave and skywave propagation"
chronology: "FCC report, 1958"
reasoning: "The FCC explicitly distinguishes energy traveling near the surface from energy returning from the ionosphere, with different stability and range characteristics."
counterevidence: "None known that collapses the modes into one path; practical propagation can combine multiple modes."
open_questions: "How should mixed-path reception be represented without forcing one dominant path?"
downstream_relevance: "Preserves path plurality before any cross-domain analogy is attempted."
```

### NT-RADIO-002 — the ionosphere is a conditional propagation medium

```yaml
claim_id: NT-RADIO-002
claim: "Ionospheric structure changes radio propagation; different regions can absorb, refract, or support long-distance HF paths."
provenance_class: primary source
support_confidence: established
source_family: "NOAA / NCEI"
source_locator: "Definition of the Ionospheric Regions; Ionospheric Radio Wave Propagation handbook"
chronology: "institutional reference material; handbook edition preserved below"
reasoning: "NOAA describes D, E, and F regions with different radio effects; the F region is of primary interest to radio communication."
counterevidence: "Ionospheric propagation is variable and does not guarantee a usable circuit."
open_questions: "Which state variables matter enough to preserve in a minimal propagation receipt?"
downstream_relevance: "Reachability is conditional on medium state, not merely transmitter intent."
```

### NT-RADIO-003 — ducting can create unexpected long paths

```yaml
claim_id: NT-RADIO-003
claim: "Tropospheric stratification can guide radio energy well beyond an ordinary line-of-sight service area."
provenance_class: primary source
support_confidence: established
source_family: "NTIA / Institute for Telecommunication Sciences"
source_locator: "tropospheric ducting technical material preserved below"
chronology: "documented across historical ITS reports and modern interference analysis"
reasoning: "Temperature and moisture structure can create refractive ducts that act as waveguides and carry interference hundreds of kilometers."
counterevidence: "Ducts are conditional and intermittent; their existence does not imply reliable continuous reachability."
open_questions: "How should an intermittent path be distinguished from a stable service path?"
downstream_relevance: "A physically real path can be conditional, temporary, and unintended."
```

### NT-RADIO-004 — sporadic E can both enable and disrupt paths

```yaml
claim_id: NT-RADIO-004
claim: "Sporadic E is a transient E-region ionization structure that can materially alter propagation and may enable some paths while interfering with others."
provenance_class: primary source
support_confidence: established
source_family: "NOAA / NCEI / SWPC"
source_locator: "Space Weather Glossary; Ionospheric Radio Wave Propagation handbook, Sporadic E section"
chronology: "institutional reference material"
reasoning: "NOAA identifies sporadic E as transient high-electron-density patches affecting radiowave propagation; the handbook notes strong Es can provide a useful mode while also screening the F layer."
counterevidence: "No guarantee of occurrence, persistence, or usefulness for a given circuit."
open_questions: "Can one bounded observation distinguish enabling Es from Es that blocks the intended higher-layer path?"
downstream_relevance: "The same medium event can increase one reachability relation while reducing another."
```

### NT-RADIO-005 — meteor and auroral paths are operationally distinct categories

```yaml
claim_id: NT-RADIO-005
claim: "Meteor scatter and auroral propagation are treated as distinct operational VHF/UHF propagation categories rather than ordinary line-of-sight reception."
provenance_class: observed
support_confidence: probable
source_family: "ARRL operational records + supplied research bundles"
source_locator: "ARRL VHF/UHF/SHF Distance Records propagation-mode categories"
chronology: "current operational record taxonomy; mechanism descriptions in supplied bundles"
reasoning: "ARRL records separately classify Meteors, Aurora, Auroral E, Sporadic E, and tropospheric modes."
counterevidence: "The ARRL record page is operational evidence, not by itself a full physical derivation of each mechanism."
open_questions: "Add stronger primary technical sources for meteor-trail and auroral scattering before promoting detailed mechanism claims."
downstream_relevance: "Prevents a single generic 'radio reaches far' bucket from erasing materially different paths."
```

## Counterexamples that matter

Radio is especially useful here because it defeats several lazy equivalences:

- **Emission is not propagation.** A transmitter can radiate while geometry, absorption, frequency, or medium state prevents a useful path to a particular receiver.
- **Propagation is not reliable reception.** Multipath, fading, attenuation, interference, and threshold effects can leave a physically present field unusable.
- **Detection is not decoding.** A receiver or spectrum display can show energy without recovering the message.
- **Decoding is not attribution.** Recovering symbols or audio does not by itself prove who originated them.
- **More propagation is not always better.** Tropospheric ducting can create harmful interference outside an intended service area.
- **A new path can suppress an old one.** Strong sporadic E may create a useful Es path while screening the higher F-layer route.

These are not metaphors. They are constraints on any later metaphor.

## Supplied research bundles

The two uploaded files are preserved here as the immediate research ancestry for this thread:

1. **`radio2).md`** — broad synthesis covering ground wave, skywave, tropospheric ducting, sporadic E, meteor scatter, auroral propagation, whistlers, Schumann resonances, SDR/instrumentation, and related radio topics.
   - **Provenance posture:** user-supplied research synthesis.
   - **Residual fog:** the file states that it is richly cited but does not carry resolvable citation locators or URLs in the supplied Markdown. Use it as a topical map, not final citation authority.

2. **`Radio Waves_ A Comprehensive Deep Dive.md`** — broad synthesis with a dedicated propagation section and opaque line-style citation markers such as `【43†L154-L187】`.
   - **Provenance posture:** user-supplied research synthesis with internal citation markers.
   - **Residual fog:** the underlying source objects for those numeric markers are not bundled with the Markdown available here. Treat the markers as unresolved source-road hints until their bibliography can be reconstructed.

The repository thread therefore promotes only claims independently re-anchored below or clearly labeled as provisional.

## Re-findable source road

**Groundwave / skywave**

- Federal Communications Commission, *Federal Communications Commission Reports*, discussion of AM groundwave and skywave propagation: https://docs.fcc.gov/public/attachments/FCC-58-891A1.pdf

**Ionospheric structure / skywave / sporadic E**

- NOAA/NCEI, “Definition of the Ionospheric Regions (Structures)”: https://www.ngdc.noaa.gov/stp/IONO/ionostru.html
- NOAA/NWS Space Weather Prediction Center, “Space Weather Glossary” (`sporadic E`): https://swpc-drupal.woc.noaa.gov/content/space-weather-glossary
- NOAA-hosted radio-propagation handbook, Chapter 10, “Ionospheric Radio Wave Propagation”: https://www.ngdc.noaa.gov/stp/space-weather/online-publications/miscellaneous/afrl_publications/handbook_1985/Chptr10.pdf

**Tropospheric ducting**

- NTIA, Spectrum-NET material, “Tropospheric Ducting Interference Demystified”: https://www.ntia.gov/sites/default/files/publications/spectrum_effect.pdf
- Harold T. Dougherty and Evan J. Dutton, *The Role of Elevated Ducting for Radio Service and Interference Fields*, NTIA TR-81-69 (1981), DOI landing page: https://its.ntia.gov/publications/details?pub=2055

**Operational mode taxonomy**

- ARRL, “VHF/UHF/SHF Distance Records,” which separately records Tropo, Aurora, Auroral E, Sporadic E, Meteors, and related propagation modes: https://www.arrl.org/distance-records

## What remains foggy

- The underlying bibliography behind the numeric citation markers in `Radio Waves_ A Comprehensive Deep Dive.md` has not yet been reconstructed.
- The exact frequency/range tables in both bundles are useful orientation but should remain approximate until each row has a re-findable technical source.
- Meteor scatter and auroral propagation deserve stronger primary technical sources before detailed mechanism claims are promoted beyond **Probable** here.
- Tropospheric scatter and tropospheric ducting must remain distinct; both can extend VHF/UHF reach but by different mechanisms.
- SDR and weak-signal methods belong mostly to **detection and measurement**, not to propagation itself. They may deserve a later instrumentation thread rather than being folded into this one.

## Boundary with other Collective work

This file documents what radio actually does.

It does **not** establish:

- that a network node is a transmitter;
- that a software boundary is an ionosphere;
- that TranchNode should implement radio-style routing;
- that Project0 reachability semantics are validated by radio physics;
- or that any later clue becomes true because the analogy is attractive.

If later files such as `clues/conditional-reachability.md` or `clues/transmission-is-not-encounter.md` cite this thread, they must identify their cross-domain step as **inference**, preserve the radio counterexamples above, and remain falsifiable independently of the radio source material.

## Useful next clues

Only after this mechanism thread is stable:

1. test whether **conditional reachability** survives comparison with non-radio domains;
2. test whether **transmission is not encounter** remains useful once detection, decoding, and attribution are separated;
3. look specifically for counterexamples where the proposed software distinction fails even though the radio distinction remains true;
4. keep architectural adoption downstream of independent evidence rather than letting analogy become ancestry.

## House posture

**Radio may illuminate the map. It does not get to redraw the architecture by analogy alone.**
