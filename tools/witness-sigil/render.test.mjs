import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { renderWitnessSigil } from './render.mjs';

const DIGEST = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

test('maps payload nibbles and rotations deterministically', () => {
  const { recipe } = renderWitnessSigil(DIGEST);
  assert.equal(recipe.schema, 'witness-sigil.recipe/v0.1');
  assert.equal(recipe.projection, 'witness-sigil/v0.1');
  assert.equal(recipe.digestAlgorithm, 'sha256');
  assert.equal(recipe.digest, DIGEST);
  assert.equal(recipe.digestPrefix, '0123456789ab');
  assert.equal(recipe.payload, '0123456789abcdef');
  assert.equal(recipe.rotationPayload, '0123456789abcdef');
  assert.deepEqual(
    recipe.slots.map((slot) => slot.primitive),
    ['P0','P1','P2','P3','P4','P5','P6','P7','P8','P9','PA','PB','PC','PD','PE','PF'],
  );
  assert.deepEqual(
    recipe.slots.map((slot) => slot.rotationDegrees),
    [0,90,180,270,0,90,180,270,0,90,180,270,0,90,180,270],
  );
  assert.deepEqual(
    recipe.slots.map(({ quadrant, localSlot }) => [quadrant, localSlot]),
    [
      ['NW','NW'], ['NW','NE'], ['NW','SW'], ['NW','SE'],
      ['NE','NW'], ['NE','NE'], ['NE','SW'], ['NE','SE'],
      ['SW','NW'], ['SW','NE'], ['SW','SW'], ['SW','SE'],
      ['SE','NW'], ['SE','NE'], ['SE','SW'], ['SE','SE'],
    ],
  );
});

for (const [name, digest] of [
  ['63 chars', '0'.repeat(63)],
  ['65 chars', '0'.repeat(65)],
  ['uppercase', 'A'.repeat(64)],
  ['whitespace', ` ${'0'.repeat(64)}`],
  ['prefix', `sha256:${'0'.repeat(64)}`],
  ['non-hex', `${'0'.repeat(63)}g`],
  ['empty', ''],
]) {
  test(`refuses ${name}`, () => {
    assert.throws(
      () => renderWitnessSigil(digest),
      /canonical lowercase SHA-256 digest/,
    );
  });
}

test('renders a deterministic accessible SVG recognition surface', () => {
  const first = renderWitnessSigil(DIGEST);
  const second = renderWitnessSigil(DIGEST);

  assert.equal(first.recipeText, second.recipeText);
  assert.equal(first.svgText, second.svgText);
  assert.match(first.svgText, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 256 256"/);
  assert.match(first.svgText, /<title id="title">Witness Sigil 0123456789ab<\/title>/);
  assert.match(first.svgText, /<desc id="desc">witness-sigil\/v0\.1 geometric recognition cue, not authentication/);
  assert.match(first.svgText, /recognition cue, not authentication/);
  assert.match(first.svgText, />witness-sigil\/v0\.1<\/text>/);
  assert.match(first.svgText, />0123456789ab<\/text>/);
  assert.equal((first.svgText.match(/data-slot="/g) ?? []).length, 16);
  assert.ok(first.svgText.endsWith('\n'));
});

const GOLDEN_VECTORS = [
  '0'.repeat(64),
  'f'.repeat(64),
  '0123456789abcdef'.repeat(4),
  `${'a'.repeat(16)}0123456789abcdef${'5'.repeat(32)}`,
  '2d711642b726b04401627ca9fbac32f5c8530fb1903cc4db02258717921a4881', // SHA-256 of UTF-8 "x"
];

for (const digest of GOLDEN_VECTORS) {
  test(`matches committed golden bytes for ${digest.slice(0, 12)}`, async () => {
    const rendered = renderWitnessSigil(digest);
    const prefix = digest.slice(0, 12);
    const recipeFixture = await readFile(new URL(`./fixtures/${prefix}.recipe.json`, import.meta.url), 'utf8');
    const svgFixture = await readFile(new URL(`./fixtures/${prefix}.sigil.svg`, import.meta.url), 'utf8');
    assert.equal(rendered.recipeText, recipeFixture);
    assert.equal(rendered.svgText, svgFixture);
  });
}

function runCli(args) {
  return spawnSync(process.execPath, [fileURLToPath(new URL('./cli.mjs', import.meta.url)), ...args], {
    encoding: 'utf8',
  });
}

test('CLI writes exactly two deterministic files and is idempotent', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'witness-sigil-'));
  const first = runCli([DIGEST, '--out', directory]);
  assert.equal(first.status, 0, first.stderr);
  assert.deepEqual((await readdir(directory)).sort(), [
    '0123456789ab.recipe.json',
    '0123456789ab.sigil.svg',
  ]);

  const recipePath = join(directory, '0123456789ab.recipe.json');
  const svgPath = join(directory, '0123456789ab.sigil.svg');
  const before = [await readFile(recipePath, 'utf8'), await readFile(svgPath, 'utf8')];

  const second = runCli([DIGEST, '--out', directory]);
  assert.equal(second.status, 0, second.stderr);
  const after = [await readFile(recipePath, 'utf8'), await readFile(svgPath, 'utf8')];
  assert.deepEqual(after, before);
});

test('CLI refuses to overwrite differing bytes', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'witness-sigil-'));
  const recipePath = join(directory, '0123456789ab.recipe.json');
  await writeFile(recipePath, 'foreign bytes\n', 'utf8');

  const result = runCli([DIGEST, '--out', directory]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /refusing to overwrite differing file/);
  assert.equal(await readFile(recipePath, 'utf8'), 'foreign bytes\n');
});

test('CLI refuses malformed digest input', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'witness-sigil-'));
  const result = runCli(['A'.repeat(64), '--out', directory]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /canonical lowercase SHA-256 digest/);
});
