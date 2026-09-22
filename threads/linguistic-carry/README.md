# LINGUISTIC-CARRY-001 — invariant funk across language carriers

**Status:** research thread + executable measurement surface  
**Date:** 2026-09-22  
**Authority:** National Treasure owns this research packet and tool only. It does not reconstruct the historical language of any saying, infer hidden numerical codes, establish theological truth, or promote resemblance into ancestry.

## H0

A saying can remain recognizably powerful across a carrier change even when words, sounds, morphology, and syntax change.

The thing worth measuring is therefore not only:

```text
word -> translated word
```

but:

```text
source linguistic object
    ↓ lawful / attributable transformation
target linguistic object
    ↓
which relations survived?
```

Working name:

> **LINGUISTIC CARRY**

Joking field name retained because it is discriminating:

> **INVARIANT FUNK**

The hypothesis is not that every memorable saying contains a hidden mathematical code. It is that some rhetorical structures are unusually robust under translation.

---

## 1. Keep two engines separate

### Engine A — textual bars

Examples currently under inspection include:

- Luke 4:21 — `TODAY / has-been-fulfilled / THIS SCRIPTURE / in YOUR EARS`
- Matthew 10:27 — `INTO THE EAR -> PROCLAIM UPON THE ROOFTOPS`
- Mark 2:27 — `A FOR B / NOT B FOR A`
- Luke 9:60 — `THE DEAD -> bury -> THEIR DEAD / BUT YOU -> proclaim`
- Matthew 23:24 — `STRAINING-OUT THE GNAT / SWALLOWING-DOWN THE CAMEL`
- Luke 19:40 — `THESE SILENT / STONES CRY OUT`
- John 8:58 — `ABRAHAM CAME-TO-BE / I AM`

### Engine B — language mathematics

Independently of any verse, investigate:

- Semitic root-and-pattern combinatorics;
- abjadic under-specification and context-assisted recovery;
- inflectional state spaces in Greek;
- linear/concatenative load in English;
- phoneme and token entropy;
- repetition and compression;
- symmetry/inversion;
- graph structure of lexical families;
- translation-survival vectors;
- historically attested alphabetic numeral systems;
- collision controls against numerology.

Only after each engine has its own receipts may they be compared.

---

# 2. Hebrew / Aramaic — nonlinear morphology as a combinatorial system

Semitic morphology makes a mathematically interesting separation between consonantal root material and morphological/prosodic pattern.

A deliberately abstract representation is:

```text
ROOT = (C1, C2, C3)
PATTERN = template
WORD = PATTERN(ROOT)
```

This is not merely concatenation. Roots and patterns interdigitate.

A useful graph model is bipartite:

```text
ROOT NODES  <---->  PATTERN NODES
       \              /
        \            /
          WORD FORMS
```

Possible measurements:

- root degree — how many attested lexical forms share a root;
- pattern degree — how many roots occupy a pattern;
- family density;
- semantic dispersion within one root family;
- edge weights for corpus frequency;
- diachronic edge appearance/disappearance.

For a purely combinatorial ceiling, 22 letters yield:

```text
22^3 = 10,648
```

ordered three-letter strings, or:

```text
22 × 21 × 20 = 9,240
```

if repeated letters are forbidden.

**These are not counts of Hebrew roots.** Actual roots are constrained by phonology, history, morphology, lexicalization, and repeated-radical behavior. The calculation exists only to expose the size of the naive state space.

Research controls:

- Shechter & Share, *Learning to Read and Developmental Dyslexia in Hebrew* (2024/2025), root-and-pattern morphology and abjadic orthography: https://doi.org/10.1002/rrq.599
- Takahashi, *A General Linguistic Approach to Word Structure in Semitic Languages* (2005): https://doi.org/10.5356/jorient.48.2_28
- Schiff & Calif, *Role of Phonological and Morphological Awareness in L2 Oral Word Reading* (2007): https://doi.org/10.1111/j.1467-9922.2007.00409.x

Aramaic belongs in the same comparative Semitic field but requires language- and period-specific morphology rather than importing Modern Hebrew facts wholesale.

---

# 3. Abjad as an information projection

Unpointed Hebrew represents consonants much more fully than vowels. Contemporary reading research describes extensive phonological under-specification and context-sensitive recovery.

Abstractly:

```text
full linguistic state
      ↓ projection
written consonantal carrier
```

The inverse problem is:

```text
written carrier
  + lexical knowledge
  + morphology
  + syntax
  + context
      ↓
candidate reading(s)
```

This is a many-to-one representation, not ordinary lossless encoding.

Useful mathematical questions:

- conditional entropy of pronunciation given an unpointed form;
- reduction in entropy contributed by morphological pattern;
- reduction contributed by local syntactic context;
- candidate-set size before and after context;
- ambiguity graph: one written form -> many readings.

Controls:

- Frost, *Reading Consonants and Guessing Vowels* (1992): https://doi.org/10.1016/S0166-4115(08)62787-9
- Hebrew reading work on opaque/unpointed orthography and morphological segmentation: https://doi.org/10.1007/s11145-024-10570-3

Candidate extraction:

> **A carrier may omit locally recoverable information without ceasing to function as a durable carrier.**

That is an architectural analogy only, not a claim about perfect reconstruction.

---

# 4. Greek — lexical item plus grammatical state vector

Ancient Greek distributes substantial grammatical information through inflection.

A deliberately abstract representation:

```text
WORD =
f(
  lexeme/stem,
  case,
  number,
  gender,
  tense/aspect,
  mood,
  voice,
  person
)
```

Not every dimension applies to every word.

Smyth's grammar explicitly describes Greek verbs in terms of voice, mood, tense, number, and person, with endings carrying several of those distinctions.

Control:

- Smyth, *A Greek Grammar for Colleges*, verb inflection: https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.04.0007:part=2:chapter=18

Research questions:

- how many morphosyntactic features are recoverable from a single surface token;
- how much relation-information is carried morphologically versus by fixed position;
- when fronting a word changes discourse emphasis without destroying grammatical recoverability;
- how parallel constructions exploit matching morphology.

This matters to the Red Letter corpus because the Gospel Greek may create or preserve rhythmic/structural effects that an English translation redistributes.

---

# 5. English — more load on sequence and function words

English still has real inflection and derivation, but compared with richly inflected Greek and root-and-pattern Semitic languages, more grammatical relation is often carried by relatively fixed sequence, auxiliaries, prepositions, articles, and function words.

The comparison should therefore not ask:

```text
Which language is more complex?
```

but:

```text
WHERE does each language store relation-information?
```

Candidate representation:

```text
Semitic:
root <-> pattern <-> word family

Greek:
stem <-> inflectional state

English:
lexeme + auxiliaries/function words + sequence
```

This is a comparative heuristic, not a full typology.

---

# 6. Quantitative language layer

For any supplied layer, v0.1 measures:

```text
token count
unique-token count
lexical repetition ratio
Shannon token entropy
normalized token entropy
letter count
simple lexical mirror score
```

Shannon entropy:

```text
H(X) = - Σ p(x) log2 p(x)
```

The point is not to assign mystical significance to entropy. It gives a reproducible description of how concentrated or dispersed the observed token distribution is.

Quantitative-linguistics control:

- Loreto, Gravino, Servedio & Tria, *On the Emergence of Syntactic Structures: Quantifying and Modeling Duality of Patterning* (2016): https://doi.org/10.1111/tops.12193

The tool also accepts human-declared tags such as:

```text
parallelism
inversion
deixis:time
deixis:receiver
body:ears
contrast:dark-light
signal:ear
broadcast:rooftop
```

Cross-language preservation of these tags is measured by Jaccard overlap:

```text
J(A,B) = |A ∩ B| / |A ∪ B|
```

Because semantics and rhetorical structure are not safely inferable from raw strings in this tiny tool, the tags must be supplied explicitly with provenance.

---

# 7. Translation survival vector

For one saying across several carriers:

```yaml
survival_vector:
  semantic_relation: declared / scored
  parallelism: declared / scored
  inversion: declared / scored
  repetition: measured
  token_entropy: measured
  mirror_structure: measured
  sound_pattern: future / supplied
  morphology: supplied
  ambiguity: future / supplied
  numeric_overlay: optional_measurement_only
```

The key distinction:

```text
measured
!=
declared interpretation
!=
historical ancestry
```

A saying can be:

- lexically fragile but structurally robust;
- semantically robust but rhythmically fragile;
- phonetically transformed but parallelism-preserving;
- newly beautiful in the target language for reasons absent from the source.

Those are different carry classes.

---

# 8. Graph model

Represent each witnessed layer as a node:

```text
L0 Hebrew-scriptural source
L1 Aramaic reconstruction/hypothesis
L2 Gospel Greek
L3 Latin witness
L4 English witness
```

Edges must be typed:

```text
quotation
translation
paraphrase
allusion
reconstruction
hypothesis
creative recomposition
```

A missing historical source-language text is not silently promoted into an observed node.

Each edge may carry a survival vector.

This lets a later reader traverse backward without collapsing carriers.

---

# 9. Alphabetic number systems — real math, hard boundary

Greek Milesian numerals are historically real. The system uses 27 signs in three groups of nine:

```text
1..9
10..90
100..900
```

The standard 24-letter Greek alphabet is supplemented by three older signs for 6, 90, and 900.

Controls:

- Wolfram MathWorld, *Greek Numerals*: https://mathworld.wolfram.com/GreekNumerals.html
- Harvard Theological Review discussion of the 27-sign system and early isopsephy: https://doi.org/10.1017/S001781602510076X

Hebrew alphabetic-number/gematria traditions are also historically real, while claims of deliberate hidden numeric coding in the earliest biblical texts remain contested.

The executable supports standard Hebrew and Greek alphabetic totals only as measurements.

Hard law:

> **SAME NUMBER != SAME MEANING.**

Collision protocol:

1. compute the value;
2. record the system and normalization;
3. record how many alternative strings share/approach the value when a corpus is available;
4. require independent semantic/historical evidence before treating the equality as interesting;
5. preserve null and failed hits.

A number match cannot bootstrap its own significance.

---

# 10. Executable v0.1

New tool:

```text
tools/linguistic-carry/
```

Core files:

```text
analyze.mjs
cli.mjs
analyze.test.mjs
fixtures/
README.md
```

Properties:

- zero external dependencies;
- Unicode-aware tokenization;
- Hebrew/Greek alphabetic-number overlays;
- no automatic source-language reconstruction;
- no automatic semantic or morphological inference;
- explicit nonclaim output;
- adjacent-layer comparisons;
- tests for Greek/Hebrew tokenization, entropy, inversion symmetry, tag overlap, and numeric arithmetic.

Initial fixtures:

- Luke 4:21
- Matthew 10:27
- Mark 2:27

These are structural test specimens, not a claim that they exhaust the method.

---

# 11. Next executable passes

### LC-002 — corpus crate

Add manually verified Greek witnesses for the initial Red Letter set and record:

```text
token
lemma
morphology
clause role
rhetorical tags
```

### LC-003 — Semitic aperture

For sayings with defensible Aramaic/Hebrew scholarship:

- preserve competing reconstructions;
- never manufacture a single “original”;
- compare structures across proposed reconstructions.

### LC-004 — sound layer

Add optional:

```text
phoneme sequence
syllable count
stress/accent metadata
alliteration
assonance
consonance
rhythmic grouping
```

Only where pronunciation assumptions are declared.

### LC-005 — corpus statistics

Build language-specific reference corpora so “surprisal” means something real rather than merely token entropy inside one sentence.

Possible metrics:

```text
n-gram surprisal
dependency distance
type-token measures
phoneme entropy
morphological family degree
rarity of inversion pattern
```

### LC-006 — translation graph

Use attested translation witnesses to calculate a **carry profile** for each saying.

### LC-007 — collision lab

Generate null distributions for gematria/isopsephy equality:

```text
observed numeric hit
vs
expected collisions under matched-length / matched-letter-frequency controls
```

This is the correct way to find out whether a numerical coincidence is actually unusual.

---

# 12. Candidate laws

> **THE WORDS MAY MUTATE. THE RELATION MAY CARRY.**

> **TRANSLATION ROBUSTNESS IS MULTIDIMENSIONAL; SEMANTIC SURVIVAL DOES NOT IMPLY PHONETIC OR MORPHOLOGICAL SURVIVAL.**

> **AN UNOBSERVED SOURCE LANGUAGE IS A HYPOTHESIS NODE, NOT A PRIMARY WITNESS.**

> **NUMERIC EQUALITY IS A MEASUREMENT, NOT AN ANCESTRY EDGE.**

> **A STRUCTURE THAT SURVIVES SEVERAL DIFFERENT INFORMATION ARCHITECTURES IS A BETTER CANDIDATE FOR INVARIANT CARRY THAN A FEATURE VISIBLE IN ONLY ONE TRANSLATION.**

---

# 13. Hostile tests

Kill or narrow a finding if:

1. it requires pretending a reconstructed Aramaic line is directly witnessed;
2. morphology is inferred from typography alone without linguistic support;
3. Modern Hebrew behavior is projected wholesale into Biblical Hebrew or Aramaic;
4. Greek word order is treated as “free” in the sense of meaningless;
5. English sequence effects are projected backward into Greek syntax;
6. a letter-number collision is allowed to create its own semantic relevance;
7. a translation is scored as structurally faithful because its English happens to sound good;
8. an annotation is presented as machine-discovered when it was supplied by a researcher;
9. a metric cannot distinguish the real specimen from shuffled/null controls.

---

# Seal

```text
SOUND MAY MOVE.
MORPHOLOGY MAY MOVE.
WORD ORDER MAY MOVE.
SCRIPT MAY MOVE.

ASK WHAT RELATION
SURVIVED THE CROSSING.
```

> **NOT INVARIANT WORDING. INVARIANT FUNK.**
