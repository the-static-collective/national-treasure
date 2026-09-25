# Optical recursion → computational terrain

Status: **grounded mechanism thread / bounded extrapolation; no architectural promotion**

## Initial question

Can a structured optical field be created, transformed by the world, and later re-form into another structured field closely enough related to the first that the sequence can be treated as a physical lineage rather than a set of unrelated images?

The initiating intuition was:

```text
coordinated emitters
      ↓
structured light field / momentary frame
      ↓
propagation + reflection + refraction + scattering
      ↓
returned / reconstructed / transformed field
      ↓
next frame
      ↓
repeat
```

A second question followed from it:

> If matter, optics, sensors, computation, and communication are increasingly embedded into buildings and infrastructure, could a future city behave as a distributed computational terrain in which buildings, roads, sidewalks, bridges, vehicles, and public surfaces participate as local sensing / routing / computing bodies?

The first question has strong physical neighbors. The second is a bounded systems extrapolation. They must not be collapsed.

## Grounded physical mechanisms

### 1. Structured light is physically engineerable

Modern structured-light systems explicitly control spatial amplitude, phase, polarization, wavevector, and related field properties. Structured laser modes can be produced through cavity geometry, pump shaping, diffractive elements, liquid crystals, metasurfaces, and other optical structures.

**Evidence posture:** **scholarship / Established**.

### 2. Optical self-imaging is real

The Talbot effect is a near-field diffraction phenomenon in which periodic optical field distributions reproduce themselves at specific propagation distances. Fractional and generalized Talbot effects produce shifted, multiplied, or transformed relatives rather than only exact copies. Temporal Talbot systems extend the same family into pulse trains and frequency-comb signal processing.

This is the cleanest direct counterexample to the claim that a structured field must simply disperse into unrelated light after propagation.

**Evidence posture:** **scholarship / Established**.

### 3. Cavity round trips can support recurrent and self-similar light

Laser resonators are designed around fields that survive repeated round trips as stable modes. Unstable resonators provide a stranger case: repeated imaging plus diffraction can generate statistically self-similar fractal light patterns at a self-conjugate plane. The literature explicitly compares this feedback behavior to video feedback while keeping diffraction as the physical scale limit.

The important residue is not "infinite optical recursion." Real systems are bounded by aperture, diffraction, loss, gain, noise, coherence, and material response. The grounded point is that repeated optical transformation can converge to recurrent or self-similar field structure.

**Evidence posture:** **scholarship / Established**.

### 4. Optical feedback can let a field organize around an environment

All-optical feedback has experimentally produced wavefronts that focus through strongly scattering media. In the Nixon et al. experiment, a multimode laser cavity self-organized many modes in phase and frequency to minimize losses and generate the complex wavefront needed to focus through a scattering sample without electronic wavefront feedback.

That matters because the environment is not merely an obstacle. Under feedback, it can become part of the field-selection process.

**Evidence posture:** **experiment / Established**.

### 5. Scattering media can be treated as optical transforms

Wavefront-shaping research models propagation through complex media using transmission relationships between incident optical channels and transmitted fields. Measured or learned transforms can then be used to focus, image, or otherwise control the outgoing field.

This gives a rigorous mathematical neighbor for the intuition:

```text
field_(n+1) = T(environment_n, field_n) + loss/noise
```

The equation is a modeling compression, not a claim that every environment is linear or time-invariant.

**Evidence posture:** **scholarship / Established**.

### 6. Optical fiber already turns civil infrastructure into distributed sensing surfaces

Optical-fiber sensing has been deployed for structural-health monitoring of buildings, bridges, tunnels, pipelines, rail infrastructure, geotechnical structures, and related civil works. Modern distributed fiber sensing can recover measurements continuously along long fiber runs rather than only at isolated sensor points.

Road engineering is now an explicit application domain. Reviews cover distributed optical fiber sensors embedded in or attached to pavement, and recent distributed acoustic sensing work demonstrates traffic-flow, speed, and vehicle-motion inference from traffic-induced vibration along fiber routes.

**Evidence posture:** **engineering literature / Established for sensing; implementation maturity varies by use case**.

### 7. Light can carry local data as well as illumination

Optical wireless communication / LiFi research demonstrates that lighting and optical emitters can serve as communication channels. This does not imply that future cities should replace RF, fiber, or wired networks with visible light. It establishes only that illumination and communication functions can inhabit the same physical medium.

**Evidence posture:** **engineering literature / Established**.

## Claim records

### NT-OPT-001 — structured fields can recur after propagation

```yaml
claim_id: NT-OPT-001
claim: "Under bounded optical conditions, structured light fields can reproduce or recur at predictable planes or times after propagation rather than becoming only unrelated diffuse patterns."
provenance_class: inference
support_confidence: established
source_family: "Talbot self-imaging literature"
source_locator: "Darmaev et al. 2023; Romero Cortés et al. 2019; Zhang et al. 2024"
reasoning: "Spatial and temporal Talbot systems demonstrate field self-imaging and controlled recurrence through interference, diffraction, or dispersion."
counterevidence: "The effect requires specific structure and propagation conditions; arbitrary fields do not automatically revive."
open_questions: "Which recurrence classes are most useful for deterministic simulation: exact, shifted, fractional, self-similar, or attractor-like?"
downstream_relevance: "Provides a real physical neighbor for transformation-with-return."
```

### NT-OPT-002 — feedback can make environment part of field formation

```yaml
claim_id: NT-OPT-002
claim: "In some optical systems, feedback through a complex environment can participate in selecting or organizing a later wavefront."
provenance_class: inference
support_confidence: established
source_family: "all-optical feedback / wavefront shaping"
source_locator: "Nixon et al. 2013; Park et al. 2019"
reasoning: "Experiments and reviews show that scattering transforms can be compensated or exploited and that cavity feedback can self-organize a field around a scattering environment."
counterevidence: "This does not mean arbitrary environments compute useful outputs without engineered coupling, feedback, gain, sensing, or optimization."
open_questions: "How much environment state must be measured to make a descendant field attributable rather than merely similar?"
downstream_relevance: "Pressure for treating environment as an active transition operator rather than passive backdrop."
```

### NT-OPT-003 — infrastructure can carry distributed optical sensing

```yaml
claim_id: NT-OPT-003
claim: "Civil infrastructure can physically host distributed optical sensing along buildings, bridges, tunnels, railways, and roads."
provenance_class: inference
support_confidence: established
source_family: "fiber-optic civil infrastructure monitoring"
source_locator: "Ye et al. 2014; Li et al. 2023; Zhao et al. 2025; current DAS traffic literature"
reasoning: "Reviews and field systems document optical fiber as both embedded and surface-mounted sensing infrastructure, including road and traffic applications."
counterevidence: "Sensing coverage, spatial resolution, durability, interrogation hardware, cost, and data interpretation remain application-specific."
open_questions: "Which infrastructure observations can be made locally and purpose-bounded without turning public space into generalized surveillance?"
downstream_relevance: "Provides a physical substrate for future computational-terrain experiments without claiming a city is already one computer."
```

## Bounded inference — transformed light-field ancestry

Status: **Inference / Possible**.

The strongest useful abstraction is not "a hologram that endlessly copies itself." It is:

> **return under transformation**

A field may recur exactly, recur fractionally, converge to a cavity mode, organize around a scattering environment, or become self-similar across round trips. A later pattern can therefore carry an attributable physical relationship to an earlier field without being identical to it.

Candidate record:

```text
ancestor field
    +
known / measured optical transform
    +
environment state
    ↓
descendant field
    +
loss / noise / unresolved degrees of freedom
```

The interesting question for later architecture is not "does it look similar?" but:

> **Can the transformation road be measured well enough that difference itself becomes evidence of continuity?**

That question is architectural. The optics are only the grounded pressure.

## Bounded inference — computational terrain

Status: **Speculation / Possible**.

The evidence above supports separate pieces of the following future picture:

- structures can contain embedded distributed sensors;
- fibers can both transport signals and serve as sensing media;
- local optical fields can be shaped, reconstructed, and fed back;
- lighting can participate in data communication;
- roads and pavements can be sensed as extended physical surfaces;
- computation can be placed near the physical process rather than only in a remote data center.

It does **not** establish the stronger statement:

> "All future buildings, sidewalks, and roads will be supercomputers that talk to each other."

Preserve that as a future-design coordinate instead:

> **The built world may become a federated computational ecology: buildings as powerful local bodies; roads and sidewalks as sensing/routing surfaces; fiber and free-space light as nervous tissue; and inter-node communication as negotiated encounter rather than one central machine owning the city.**

This is intentionally stronger than today's "smart building" vocabulary and intentionally weaker than claiming literal universal adoption.

## Dynamic route topology

A useful architectural descendant of the optics is the "moving staircase" problem.

A building does not need to move all of its matter in order to change its experienced topology. It can change:

- which route is illuminated;
- which door is legible;
- which surface reveals a marker under a wavelength or polarization state;
- which corridor is recommended, reserved, refused, or degraded;
- which local node is reachable from another node;
- which path is visible to a person without turning physical egress into software permission.

The resulting graph can change while the masonry remains mostly fixed.

This is a systems inference, not an optics claim.

## Kill conditions

Drop or revise the computational-terrain inference if it requires any of these moves:

1. **Infinite-loss denial.** It assumes optical recursion continues indefinitely without gain, loss, decoherence, noise, diffraction, aperture, or material limits.
2. **Image = object.** It treats a reconstructed optical field as the physical object or occurrence it represents.
3. **Similarity = ancestry.** It declares two fields related merely because they look alike without a transformation road.
4. **Sensing = authority.** It treats the ability of a surface to sense, infer, or communicate as permission to identify, command, exclude, or decide for a person.
5. **City = sovereign computer.** It collapses local buildings and infrastructure into one hidden authority rather than preserving local, purpose-bounded consequence.
6. **Safety by software magic.** It allows dynamic route logic to defeat ordinary physical safety, emergency egress, accessibility, or graceful degradation.
7. **Optics monoculture.** It assumes every useful channel must be optical when RF, copper, acoustic, mechanical, or other media are better for a specific function.

## Source bundle

### Structured light / optical recurrence

1. Andrew Forbes, **"Structured Light from Lasers"**, *Laser & Photonics Reviews* 13 (2019). DOI: `10.1002/lpor.201900140`.
   - Supports engineered amplitude/phase/polarization structure, cavity mode shaping, and the review's discussion of fractal light from unstable cavities.

2. E. C. Darmaev et al., **"Optical Texture Super-Lattices Produced by Talbot Effect at Superimposed Gratings"**, *Annalen der Physik* 535 (2023). DOI: `10.1002/andp.202200543`.
   - Supports repeated spatial self-images and Talbot carpets from structured periodic fields.

3. L. Romero Cortés et al., **"Arbitrary Energy-Preserving Control of Optical Pulse Trains and Frequency Combs through Generalized Talbot Effects"**, *Laser & Photonics Reviews* 13 (2019). DOI: `10.1002/lpor.201900176`.
   - Supports temporal/spectral Talbot self-imaging, recurrence, and controlled transformation of periodic optical waveforms.

4. Heze Zhang et al., **"The dissipative Talbot soliton fiber laser"**, *Science Advances* 10 (2024), eadl2125. DOI: `10.1126/sciadv.adl2125`.
   - Demonstrates stable and breathing Talbot soliton states inside a fiber laser under cavity/self-imaging conditions.

### Feedback / scattering / environment-shaped fields

5. Micha Nixon et al., **"Real-time wavefront shaping through scattering media by all-optical feedback"**, *Nature Photonics* 7 (2013), 919–924. DOI: `10.1038/nphoton.2013.248`.
   - Demonstrates field self-organization inside a multimode laser cavity to focus through scattering media.

6. J. Park et al., **"Disordered Optics: Exploiting Multiple Light Scattering and Wavefront Shaping for Nonconventional Optical Elements"**, *Advanced Materials* 32 (2020 issue; first published 2019). DOI: `10.1002/adma.201903457`.
   - Reviews transmission through disordered media and active wavefront shaping.

7. P. del Hougne et al., **"Experimental Realization of Optimal Energy Storage in Resonators Embedded in Scattering Media"**, *Laser & Photonics Reviews* 15 (2021). DOI: `10.1002/lpor.202000335`.
   - Supports coherent wavefront control for coupling into resonant structures hidden in complex scattering environments.

### Fiber / built infrastructure

8. X. W. Ye, Y. H. Su, and J. P. Han, **"Structural Health Monitoring of Civil Infrastructure Using Optical Fiber Sensing Technology: A Comprehensive Review"**, *The Scientific World Journal* (2014). DOI: `10.1155/2014/652329`.
   - Reviews optical-fiber sensing in buildings, bridges, tunnels, pipelines, rail infrastructure, and other civil structures.

9. **"Optical fiber sensors in infrastructure monitoring: a comprehensive review"**, *Intelligent Transportation Infrastructure* 2 (2023), liad018. DOI: `10.1093/iti/liad018`.
   - Reviews distributed and multiplexed optical sensing in infrastructure.

10. Jingnan Zhao, Tianju Ma, and Fujie Zhang, **"Distributed optical fiber sensors for pavement Engineering: A-State-of-Art review"**, *Measurement* 246 (2025), 116732. DOI: `10.1016/j.measurement.2025.116732`.
    - Specifically surveys distributed fiber sensing in pavement and road engineering.

11. **"Distributed acoustic sensing enables real-time traffic monitoring and vehicle motion-state prediction"** (2026). DOI: `10.1016/j.iopt.2026.100034`.
    - Recent example of using traffic-induced vibration along fiber routes for traffic observation and motion-state prediction.

### Optical communication

12. H. Elgala, R. Mesleh, and H. Haas, **"Indoor Optical Wireless Communication: Potential and State-of-the-Art"**, *IEEE Communications Magazine* 49(9) (2011), 56–62. DOI: `10.1109/MCOM.2011.6011734`.
    - Establishes optical wireless communication as a practical communication family coexisting with lighting infrastructure.

## Residual question

The live treasure is now larger than the original hologram image:

> **What happens when the environment stops being merely the place where computation runs and becomes part of the computation's physical transition law?**

Optics gives us one unusually literal place to test that question.