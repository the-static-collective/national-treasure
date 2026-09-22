#!/usr/bin/env node
import fs from "node:fs/promises";
import process from "node:process";
import { buildRootPatternGraph } from "./root-pattern.mjs";
import { collisionGroups, uniformValueProbability } from "./collisions.mjs";

async function readJson(path) {
  return JSON.parse(await fs.readFile(path, "utf8"));
}

try {
  const [mode, ...args] = process.argv.slice(2);
  if (mode === "root-graph") {
    if (!args[0]) throw new Error("root-graph requires a JSON file containing an array of entries");
    const entries = await readJson(args[0]);
    process.stdout.write(JSON.stringify(buildRootPatternGraph(entries), null, 2) + "\n");
  } else if (mode === "collisions") {
    if (!args[0]) throw new Error("collisions requires a JSON file containing numeric-overlay items");
    const items = await readJson(args[0]);
    process.stdout.write(JSON.stringify(collisionGroups(items), null, 2) + "\n");
  } else if (mode === "null") {
    const [system, lengthRaw, totalRaw] = args;
    if (!system || lengthRaw == null || totalRaw == null) {
      throw new Error("null requires: <system> <length> <total>");
    }
    const result = uniformValueProbability(system, Number(lengthRaw), Number(totalRaw));
    const serializable = {
      ...result,
      matching_strings: result.matching_strings.toString(),
      total_strings: result.total_strings.toString()
    };
    process.stdout.write(JSON.stringify(serializable, null, 2) + "\n");
  } else {
    throw new Error("usage: math-cli.mjs root-graph <file> | collisions <file> | null <system> <length> <total>");
  }
} catch (error) {
  process.stderr.write(`linguistic-carry-math: ${error.message}\n`);
  process.exitCode = 1;
}
