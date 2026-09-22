#!/usr/bin/env node
import fs from "node:fs/promises";
import process from "node:process";
import { analyzeWitness } from "./analyze.mjs";

async function readInput() {
  const path = process.argv[2];
  if (path) return fs.readFile(path, "utf8");
  let data = "";
  for await (const chunk of process.stdin) data += chunk;
  return data;
}

try {
  const raw = await readInput();
  if (!raw.trim()) throw new Error("expected a JSON witness file path or JSON on stdin");
  const input = JSON.parse(raw);
  process.stdout.write(`${JSON.stringify(analyzeWitness(input), null, 2)}\n`);
} catch (error) {
  process.stderr.write(`linguistic-carry: ${error.message}\n`);
  process.exitCode = 1;
}
