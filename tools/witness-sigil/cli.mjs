#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { renderWitnessSigil } from './render.mjs';

async function ensureExactFile(path, expected) {
  try {
    const existing = await readFile(path, 'utf8');
    if (existing === expected) return;
    throw new Error(`refusing to overwrite differing file: ${path}`);
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }

  await writeFile(path, expected, { encoding: 'utf8', flag: 'wx' });
}

async function main(argv) {
  const [digest, outFlag, directory, ...extra] = argv;
  if (!digest || outFlag !== '--out' || !directory || extra.length > 0) {
    throw new Error('usage: node tools/witness-sigil/cli.mjs <digest> --out <directory>');
  }

  const { recipe, recipeText, svgText } = renderWitnessSigil(digest);
  await mkdir(directory, { recursive: true });
  await ensureExactFile(join(directory, `${recipe.digestPrefix}.recipe.json`), recipeText);
  await ensureExactFile(join(directory, `${recipe.digestPrefix}.sigil.svg`), svgText);
}

try {
  await main(process.argv.slice(2));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
