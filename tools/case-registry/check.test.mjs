import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  discoverCases,
  findMissingCaseReadmes,
  hasLegacyActiveCasesBlock,
  hasCaseReadmeCollision,
} from './check.mjs';

test('discoverCases returns sorted first-level case directories only', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'nt-registry-'));
  await mkdir(path.join(root, 'cases', 'zeta'), { recursive: true });
  await mkdir(path.join(root, 'cases', 'alpha'), { recursive: true });
  await writeFile(path.join(root, 'cases', 'note.txt'), 'not a case');
  assert.deepEqual(await discoverCases(root), ['alpha', 'zeta']);
});

test('findMissingCaseReadmes reports only landed cases without README.md', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'nt-registry-'));
  await mkdir(path.join(root, 'cases', 'alpha'), { recursive: true });
  await mkdir(path.join(root, 'cases', 'beta'), { recursive: true });
  await writeFile(path.join(root, 'cases', 'alpha', 'README.md'), '# Alpha\n');
  assert.deepEqual(await findMissingCaseReadmes(root, ['alpha', 'beta']), ['beta']);
});

test('legacy Active cases heading is rejected', () => {
  assert.equal(hasLegacyActiveCasesBlock('# Repo\n\n## Active cases\n- x\n'), true);
  assert.equal(hasLegacyActiveCasesBlock('# Repo\n\n## Repository shape\n'), false);
});

test('case changes and root README changes cannot share a PR', () => {
  assert.equal(hasCaseReadmeCollision(['cases/new-case/README.md', 'README.md']), true);
  assert.equal(hasCaseReadmeCollision(['cases/new-case/README.md', 'METHOD.md']), false);
  assert.equal(hasCaseReadmeCollision(['README.md', 'clues/new-clue.md']), false);
});

test('collision rule is narrow to cases/** plus the root README', () => {
  assert.equal(hasCaseReadmeCollision(['cases/a/fixtures/x.json', 'README.md']), true);
  assert.equal(hasCaseReadmeCollision(['cases/a/README.md', 'cases/a/NOTES.md']), false);
  assert.equal(hasCaseReadmeCollision(['cases/a/README.md', 'docs/README.md']), false);
});
