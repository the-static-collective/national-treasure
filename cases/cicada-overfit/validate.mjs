export const ALLOWED_RELATIONS = new Set([
  'DEMONSTRATED_ANCESTRY',
  'CLAIMED_ANCESTRY',
  'SHARED_PRECURSOR',
  'DOCUMENTED_INFLUENCE',
  'TRANSLATION',
  'TRANSLITERATION',
  'REENCODING',
  'REINTERPRETATION',
  'FORMAL_RESEMBLANCE',
  'STRUCTURAL_ISOMORPHISM',
  'CONTEXTUAL_ASSOCIATION',
  'RETROSPECTIVE_NAMING',
  'CONTRADICTION',
  'REFUSED_ANCESTRY',
  'UNKNOWN',
]);

const NODE_KINDS = new Set(['artifact', 'text', 'person', 'date', 'symbol', 'place', 'claim']);
const EVIDENCE_KINDS = new Set(['documented', 'provided-fixture', 'synthetic']);
const REFUSAL_RELATIONS = new Set(['REFUSED_ANCESTRY', 'UNKNOWN']);

function requireString(value, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${label} must be a non-empty string`);
  }
}

function requireRelation(value, label) {
  requireString(value, label);
  if (!ALLOWED_RELATIONS.has(value)) {
    throw new TypeError(`${label} has unsupported relation: ${value}`);
  }
}

export function validateFixture(fixture) {
  if (!fixture || typeof fixture !== 'object' || Array.isArray(fixture)) {
    throw new TypeError('fixture must be an object');
  }

  for (const field of ['id', 'title', 'family', 'seduction', 'trap', 'requiredRefusal']) {
    requireString(fixture[field], `fixture.${field}`);
  }

  if (!Array.isArray(fixture.nodes) || fixture.nodes.length < 3 || fixture.nodes.length > 8) {
    throw new TypeError('fixture.nodes must contain 3-8 nodes');
  }
  if (!Array.isArray(fixture.edges) || fixture.edges.length < 2) {
    throw new TypeError('fixture.edges must contain at least 2 edges');
  }

  const nodeIds = new Set();
  for (const node of fixture.nodes) {
    if (!node || typeof node !== 'object' || Array.isArray(node)) {
      throw new TypeError('node must be an object');
    }
    requireString(node.id, 'node.id');
    requireString(node.label, 'node.label');
    requireString(node.kind, 'node.kind');
    requireString(node.evidence, 'node.evidence');

    if (nodeIds.has(node.id)) throw new TypeError(`duplicate node id: ${node.id}`);
    nodeIds.add(node.id);

    if (!NODE_KINDS.has(node.kind)) throw new TypeError(`unsupported node kind: ${node.kind}`);
    if (!EVIDENCE_KINDS.has(node.evidence)) throw new TypeError(`unsupported evidence: ${node.evidence}`);
  }

  for (const edge of fixture.edges) {
    if (!edge || typeof edge !== 'object' || Array.isArray(edge)) {
      throw new TypeError('edge must be an object');
    }
    requireString(edge.from, 'edge.from');
    requireString(edge.to, 'edge.to');
    requireRelation(edge.proposedRelation, 'edge.proposedRelation');
    requireRelation(edge.expectedRelation, 'edge.expectedRelation');
    requireString(edge.reason, 'edge.reason');

    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
      throw new TypeError(`unknown edge endpoint: ${edge.from} -> ${edge.to}`);
    }
  }

  return true;
}

function isMixedFixture(fixture) {
  let hasRefusal = false;
  let hasClassified = false;
  for (const edge of fixture.edges) {
    if (REFUSAL_RELATIONS.has(edge.expectedRelation)) hasRefusal = true;
    else hasClassified = true;
  }
  return hasRefusal && hasClassified;
}

export function validateCorpus(fixtures) {
  if (!Array.isArray(fixtures) || fixtures.length < 12) {
    throw new TypeError('corpus must contain at least 12 fixtures');
  }

  const ids = new Set();
  let mixedCount = 0;

  for (const fixture of fixtures) {
    validateFixture(fixture);
    if (ids.has(fixture.id)) throw new TypeError(`duplicate fixture id: ${fixture.id}`);
    ids.add(fixture.id);
    if (isMixedFixture(fixture)) mixedCount += 1;
  }

  if (mixedCount * 2 < fixtures.length) {
    throw new TypeError('at least half of corpus fixtures must mix classified and refused or unknown edges');
  }

  return true;
}
