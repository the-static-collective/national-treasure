#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { buildQuestionFrontier } from './engine.mjs';

function parseArgs(argv) {
  const result = { json: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') {
      result.json = true;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      result.help = true;
      continue;
    }
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2).replaceAll('-', '_');
    result[key] = argv[i + 1] ?? '';
    i += 1;
  }
  return result;
}

function splitList(value = '') {
  return String(value).split('|').map((part) => part.trim()).filter(Boolean);
}

function help() {
  return [
    'National Treasure // Question Box v0.1',
    '',
    'A deterministic puzzle box that returns a better question, not an answer.',
    '',
    'Usage:',
    '  node tools/question-box/treasure.mjs',
    '  node tools/question-box/treasure.mjs --clue "..." --source "..."',
    '  node tools/question-box/treasure.mjs --clue "..." --json',
    '',
    'Options:',
    '  --clue TEXT',
    '  --claim TEXT',
    '  --provenance observed|primary|inference|speculation|failed',
    '  --confidence established|probable|possible|unsupported',
    '  --source TEXT',
    '  --source-families "family A|family B"',
    '  --chronology TEXT',
    '  --counterevidence TEXT',
    '  --falsifier TEXT',
    '  --competing "model A|model B"',
    '  --receipt PATH       write the JSON receipt to disk',
    '  --json               print raw JSON',
    '  --help',
  ].join('\n');
}

async function interactiveSeed(seed = {}) {
  const rl = readline.createInterface({ input, output });
  try {
    const clue = seed.clue || await rl.question('CLUE > ');
    const claim = seed.claim ?? await rl.question('CLAIM / READING (optional) > ');
    const provenance = seed.provenance ?? await rl.question('PROVENANCE [speculation] > ');
    const confidence = seed.confidence ?? await rl.question('SUPPORT [possible] > ');
    const source = seed.source ?? await rl.question('SOURCE LOCATOR (optional) > ');
    const chronology = seed.chronology ?? await rl.question('CHRONOLOGY (optional) > ');
    const counterevidence = seed.counterevidence ?? await rl.question('COUNTEREVIDENCE (optional) > ');
    const falsifier = seed.falsifier ?? await rl.question('WHAT WOULD COUNT AGAINST IT? (optional) > ');
    const competing = seed.competing ?? await rl.question('COMPETING EXPLANATIONS, separated by | (optional) > ');
    return {
      clue,
      claim,
      provenance_class: provenance || 'speculation',
      support_confidence: confidence || 'possible',
      source_locator: source,
      source_families: splitList(seed.source_families || ''),
      chronology,
      counterevidence,
      falsifier,
      competing_explanations: splitList(competing),
    };
  } finally {
    rl.close();
  }
}

function fromArgs(args) {
  return {
    clue: args.clue,
    claim: args.claim,
    provenance_class: args.provenance || 'speculation',
    support_confidence: args.confidence || 'possible',
    source_locator: args.source,
    source_families: splitList(args.source_families),
    chronology: args.chronology,
    counterevidence: args.counterevidence,
    falsifier: args.falsifier,
    competing_explanations: splitList(args.competing),
  };
}

function pretty(receipt) {
  const lines = [
    '',
    '╔══════════════════════════════════════════════════════════════╗',
    '║ NATIONAL TREASURE // QUESTION BOX v0.1                     ║',
    '╚══════════════════════════════════════════════════════════════╝',
    '',
    `APERTURE : ${receipt.aperture.id}`,
    `MISSING  : ${receipt.aperture.missing}`,
    `WHY      : ${receipt.aperture.reason}`,
    '',
    'QUESTION',
    `? ${receipt.question}`,
    '',
    'HOUSE RULE',
    '> Wild hypotheses are welcome. Convergence must be earned.',
    '> The box returns a frontier, not a verdict.',
    '',
  ];
  return lines.join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(help() + '\n');
    return;
  }

  const seed = args.clue || args.claim ? fromArgs(args) : await interactiveSeed(args);
  const receipt = buildQuestionFrontier(seed);

  if (args.receipt) {
    const target = path.resolve(args.receipt);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, JSON.stringify(receipt, null, 2) + '\n', 'utf8');
  }

  process.stdout.write(args.json ? JSON.stringify(receipt, null, 2) + '\n' : pretty(receipt));
}

await main();
