import assert from 'node:assert/strict';
import test from 'node:test';
import { readdir, readFile } from 'node:fs/promises';
import { ALLOWED_RELATIONS, validateCorpus, validateFixture } from './validate.mjs';

const EXPECTED_RELATIONS = [
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
];

function makeFixture(id = 'co-test', expectedRelations = ['FORMAL_RESEMBLANCE', 'UNKNOWN']) {
  return {
    id,
    title: `Fixture ${id}`,
    family: 'partial-truth-chain',
    seduction: 'Several details align closely enough to tempt one unsupported bridge.',
    nodes: [
      { id: 'n1', kind: 'artifact', label: 'source artifact', evidence: 'synthetic' },
      { id: 'n2', kind: 'symbol', label: 'visible mark', evidence: 'synthetic' },
      { id: 'n3', kind: 'claim', label: 'lineage claim', evidence: 'synthetic' },
    ],
    edges: expectedRelations.map((relation, index) => ({
      from: index === 0 ? 'n1' : 'n2',
      to: index === 0 ? 'n2' : 'n3',
      proposedRelation: relation,
      expectedRelation: relation,
      reason: `edge ${index + 1} has a declared fixture-grounded classification`,
    })),
    trap: 'Upgrade the final bridge because the earlier edge is strong.',
    requiredRefusal: 'The final lineage bridge must remain UNKNOWN.',
  };
}

async function loadCommittedFixture(name) {
  const fixtureDirectory = new URL('./fixtures/', import.meta.url);
  return JSON.parse(await readFile(new URL(name, fixtureDirectory), 'utf8'));
}

test('exports exactly the existing palimpsest relation grammar', () => {
  assert.deepEqual([...ALLOWED_RELATIONS], EXPECTED_RELATIONS);
});

test('accepts a structurally valid mixed fixture', () => {
  assert.equal(validateFixture(makeFixture()), true);
});

test('refuses duplicate node ids', () => {
  const fixture = makeFixture();
  fixture.nodes[2].id = 'n2';
  assert.throws(() => validateFixture(fixture), /duplicate node id/);
});

test('refuses edges whose endpoints do not exist', () => {
  const fixture = makeFixture();
  fixture.edges[0].to = 'missing';
  assert.throws(() => validateFixture(fixture), /unknown edge endpoint/);
});

test('refuses unknown proposed or expected relation labels', () => {
  const proposed = makeFixture();
  proposed.edges[0].proposedRelation = 'RELATED_TO';
  assert.throws(() => validateFixture(proposed), /unsupported relation/);

  const expected = makeFixture();
  expected.edges[0].expectedRelation = 'RELATED_TO';
  assert.throws(() => validateFixture(expected), /unsupported relation/);
});

test('refuses empty required strings', () => {
  const fixture = makeFixture();
  fixture.seduction = '   ';
  assert.throws(() => validateFixture(fixture), /non-empty string/);
});

test('refuses invalid node kind and evidence enum', () => {
  const kind = makeFixture();
  kind.nodes[0].kind = 'organization';
  assert.throws(() => validateFixture(kind), /unsupported node kind/);

  const evidence = makeFixture();
  evidence.nodes[0].evidence = 'rumor';
  assert.throws(() => validateFixture(evidence), /unsupported evidence/);
});

test('corpus refuses duplicate fixture ids', () => {
  const fixtures = Array.from({ length: 12 }, (_, i) => makeFixture(`co-${i + 1}`));
  fixtures[11].id = fixtures[10].id;
  assert.throws(() => validateCorpus(fixtures), /duplicate fixture id/);
});

test('corpus requires at least twelve fixtures', () => {
  const fixtures = Array.from({ length: 11 }, (_, i) => makeFixture(`co-${i + 1}`));
  assert.throws(() => validateCorpus(fixtures), /at least 12 fixtures/);
});

test('corpus requires at least half the fixtures to mix classified and refused or unknown edges', () => {
  const fixtures = Array.from({ length: 12 }, (_, i) =>
    makeFixture(`co-${i + 1}`, i < 5 ? ['FORMAL_RESEMBLANCE', 'UNKNOWN'] : ['FORMAL_RESEMBLANCE', 'REINTERPRETATION']),
  );
  assert.throws(() => validateCorpus(fixtures), /at least half/);
});

const EXPECTED_FAMILIES = [
  'chronological-impossibility',
  'shared-precursor',
  'retrospective-naming',
  'documented-influence-vs-resemblance',
  'numerological-coincidence',
  'cross-medium-reencoding',
  'community-rumor',
  'deliberate-red-herring',
  'partial-truth-chain',
  'identity-authenticity-confusion',
  'source-collapse',
  'mystery-to-authority-escalation',
  'mixed-descent-vs-coincidence',
  'mixed-descent-vs-coincidence',
];

test('committed corpus contains fourteen validated adversarial packets', async () => {
  const fixtureDirectory = new URL('./fixtures/', import.meta.url);
  const names = (await readdir(fixtureDirectory)).filter((name) => name.endsWith('.json')).sort();
  assert.deepEqual(names, Array.from({ length: 14 }, (_, i) => `co-${String(i + 1).padStart(3, '0')}.json`));

  const fixtures = [];
  for (const name of names) {
    fixtures.push(JSON.parse(await readFile(new URL(name, fixtureDirectory), 'utf8')));
  }

  assert.equal(validateCorpus(fixtures), true);
  assert.deepEqual(fixtures.map((fixture) => fixture.family).sort(), [...EXPECTED_FAMILIES].sort());
});

test('matched pair distinguishes witnessed mixed descent from independent recurrence', async () => {
  const mixedDescent = await loadCommittedFixture('co-013.json');
  const recurrence = await loadCommittedFixture('co-014.json');

  assert.equal(mixedDescent.family, 'mixed-descent-vs-coincidence');
  assert.equal(recurrence.family, 'mixed-descent-vs-coincidence');
  assert.equal(validateFixture(mixedDescent), true);
  assert.equal(validateFixture(recurrence), true);

  const witnessedParents = mixedDescent.edges.filter((edge) => edge.expectedRelation === 'DEMONSTRATED_ANCESTRY');
  assert.equal(witnessedParents.length, 2);
  assert.equal(new Set(witnessedParents.map((edge) => edge.to)).size, 1);

  const refusedRecurrence = recurrence.edges.find((edge) => edge.expectedRelation === 'REFUSED_ANCESTRY');
  assert.equal(refusedRecurrence?.proposedRelation, 'DEMONSTRATED_ANCESTRY');
  assert.equal(recurrence.edges.some((edge) => edge.expectedRelation === 'FORMAL_RESEMBLANCE'), true);
});
