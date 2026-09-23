#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeStudy, validateStudy } from "./transform-carry.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const defaultStudy = path.join(root, "studies", "living-bible-red-letter-001.json");

export async function loadTransformStudy(file = defaultStudy) {
  return JSON.parse(await fs.readFile(file, "utf8"));
}

async function main() {
  const [mode = "report", arg] = process.argv.slice(2);
  const study = await loadTransformStudy();
  if (mode === "check") {
    console.log(JSON.stringify(validateStudy(study), null, 2));
    return;
  }
  const report = analyzeStudy(study);
  if (mode === "report") {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  if (mode === "passage") {
    const passage = report.passages.find((item) =>
      item.id === arg || item.verse.toLowerCase() === String(arg ?? "").toLowerCase()
    );
    if (!passage) throw new Error("unknown passage");
    console.log(JSON.stringify(passage, null, 2));
    return;
  }
  throw new Error("usage: transform-cli.mjs check | report | passage <id-or-verse>");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
