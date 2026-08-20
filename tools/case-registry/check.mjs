import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

export async function discoverCases(repoRoot) {
  const entries = await readdir(path.join(repoRoot, 'cases'), { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export async function findMissingCaseReadmes(repoRoot, cases) {
  const missing = [];
  for (const name of cases) {
    try {
      await access(path.join(repoRoot, 'cases', name, 'README.md'));
    } catch {
      missing.push(name);
    }
  }
  return missing;
}

export function hasLegacyActiveCasesBlock(readmeText) {
  return /^## Active cases\s*$/m.test(readmeText);
}

export function hasCaseReadmeCollision(changedFiles) {
  const touchesCase = changedFiles.some((name) => name.startsWith('cases/'));
  const touchesRootReadme = changedFiles.includes('README.md');
  return touchesCase && touchesRootReadme;
}

async function readChangedFilesFromStdin() {
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  return input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

export async function runCheck(repoRoot, { changedFiles = [] } = {}) {
  const cases = await discoverCases(repoRoot);
  const missingReadmes = await findMissingCaseReadmes(repoRoot, cases);
  const readme = await readFile(path.join(repoRoot, 'README.md'), 'utf8');
  const failures = [];

  if (missingReadmes.length > 0) {
    failures.push(`landed cases missing README.md: ${missingReadmes.join(', ')}`);
  }
  if (hasLegacyActiveCasesBlock(readme)) {
    failures.push('root README.md contains legacy "## Active cases"; cases/ is the constituted registry');
  }
  if (hasCaseReadmeCollision(changedFiles)) {
    failures.push('case work and root README.md maintenance must travel in separate PRs');
  }

  return { cases, failures };
}

async function main() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = path.resolve(here, '../..');
  const readChangedFiles = process.argv.includes('--changed-files-stdin');
  const changedFiles = readChangedFiles ? await readChangedFilesFromStdin() : [];
  const result = await runCheck(repoRoot, { changedFiles });

  process.stdout.write(`${result.cases.join('\n')}\n`);
  for (const failure of result.failures) process.stderr.write(`case-registry: ${failure}\n`);
  if (result.failures.length > 0) process.exitCode = 1;
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  await main();
}
