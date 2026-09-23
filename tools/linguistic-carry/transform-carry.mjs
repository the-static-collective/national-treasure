export const CLASSIFICATIONS = Object.freeze({
  CARRY: "CARRY",
  REVEAL: "REVEAL",
  PROJECTION: "PROJECTION",
  LOSS: "LOSS",
  HOLD: "HOLD"
});

const SOURCE_SUPPORT = new Set(["explicit", "licensed", "ambiguous", "absent", "unresolved"]);
const TARGET_EXPRESSION = new Set(["explicit", "implicit", "absent", "unresolved"]);
const ACCESS_DELTA = new Set(["gain", "stable", "loss", "unknown"]);

function assertEnum(value, allowed, label) {
  if (!allowed.has(value)) throw new Error(`invalid ${label}: ${value}`);
}

export function classifyRelation(relation) {
  const {
    source_support,
    target_expression,
    receiver_access_delta = "unknown"
  } = relation;

  assertEnum(source_support, SOURCE_SUPPORT, "source_support");
  assertEnum(target_expression, TARGET_EXPRESSION, "target_expression");
  assertEnum(receiver_access_delta, ACCESS_DELTA, "receiver_access_delta");

  let classification = CLASSIFICATIONS.HOLD;
  let basis = "insufficient declared evidence";

  if (source_support === "unresolved" || target_expression === "unresolved") {
    classification = CLASSIFICATIONS.HOLD;
    basis = "source or target status remains unresolved";
  } else if (
    (source_support === "explicit" || source_support === "licensed") &&
    target_expression === "absent"
  ) {
    classification = CLASSIFICATIONS.LOSS;
    basis = "declared source relation is not expressed in the target surface";
  } else if (
    (source_support === "absent" || source_support === "ambiguous") &&
    target_expression === "explicit"
  ) {
    classification = CLASSIFICATIONS.PROJECTION;
    basis = "target makes explicit a relation not explicitly warranted by the declared source status";
  } else if (
    (source_support === "explicit" || source_support === "licensed") &&
    (target_expression === "explicit" || target_expression === "implicit")
  ) {
    if (receiver_access_delta === "gain") {
      classification = CLASSIFICATIONS.REVEAL;
      basis = "declared source relation survives and becomes more available to the named receiver";
    } else {
      classification = CLASSIFICATIONS.CARRY;
      basis = "declared source relation survives the carrier change";
    }
  }

  return {
    classification,
    basis,
    evidence_class: relation.evidence_class ?? "researcher-declared",
    nonclaim:
      "This classifier maps declared observations to a type. It does not infer semantics, translation fidelity, authorial intent, or theology from text."
  };
}

export function validateStudy(study) {
  const errors = [];
  if (study?.schema !== "national-treasure.linguistic-carry.transform-study.v1") {
    errors.push("unexpected study schema");
  }
  if (!study?.study_id) errors.push("missing study_id");
  if (!study?.receiver?.id) errors.push("missing receiver constitution");
  if (study?.target?.text_policy !== "external-reference-only") {
    errors.push("target text policy must be external-reference-only");
  }
  if (!Array.isArray(study?.passages) || study.passages.length < 1) {
    errors.push("study needs passages");
    return { passed: false, errors, passage_count: 0, relation_count: 0 };
  }

  const ids = new Set();
  let relationCount = 0;
  for (const passage of study.passages) {
    if (!passage.id || ids.has(passage.id)) errors.push(`duplicate/missing passage id: ${passage.id}`);
    ids.add(passage.id);
    if (!passage.verse) errors.push(`missing verse: ${passage.id}`);
    if (!Array.isArray(passage.sources) || passage.sources.length < 2) {
      errors.push(`insufficient source locators: ${passage.id}`);
    } else if (passage.sources.some((source) => !/^https:\/\//.test(source.url ?? ""))) {
      errors.push(`invalid source URL: ${passage.id}`);
    }
    if ("text" in passage || passage.sources?.some((source) => "text" in source)) {
      errors.push(`copyrighted target text must not be vendored: ${passage.id}`);
    }
    if (!Array.isArray(passage.relations) || passage.relations.length < 1) {
      errors.push(`passage needs at least one declared relation: ${passage.id}`);
      continue;
    }
    for (const relation of passage.relations) {
      relationCount += 1;
      if (!relation.id || !relation.description) errors.push(`bad relation metadata: ${passage.id}`);
      try {
        classifyRelation(relation);
      } catch (error) {
        errors.push(`${passage.id}/${relation.id ?? "relation"}: ${error.message}`);
      }
    }
  }

  return {
    passed: errors.length === 0,
    errors,
    passage_count: study.passages.length,
    relation_count: relationCount
  };
}

export function analyzeStudy(study) {
  const validation = validateStudy(study);
  if (!validation.passed) throw new Error(validation.errors.join("; "));

  const counts = Object.fromEntries(Object.values(CLASSIFICATIONS).map((key) => [key, 0]));
  const passages = study.passages.map((passage) => ({
    id: passage.id,
    verse: passage.verse,
    corpus_witness_id: passage.corpus_witness_id ?? null,
    relations: passage.relations.map((relation) => {
      const result = classifyRelation(relation);
      counts[result.classification] += 1;
      return {
        id: relation.id,
        description: relation.description,
        observation: relation.observation,
        ...result
      };
    })
  }));

  return {
    study_id: study.study_id,
    target: study.target,
    receiver: study.receiver,
    validation,
    counts,
    passages,
    authority_boundary:
      "CARRY/REVEAL/PROJECTION/LOSS are typed research declarations over attributable observations. They do not become source-text facts by passing validation."
  };
}
