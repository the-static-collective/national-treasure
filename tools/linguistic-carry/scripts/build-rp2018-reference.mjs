#!/usr/bin/env node
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { canonicalGreekLetters, sha256 } from "../reference-corpus.mjs";

const BOOKS = [
  ["MAT", "Matthew"], ["MAR", "Mark"], ["LUK", "Luke"], ["JOH", "John"],
  ["ACT", "Acts"], ["ROM", "Romans"], ["1CO", "1 Corinthians"], ["2CO", "2 Corinthians"],
  ["GAL", "Galatians"], ["EPH", "Ephesians"], ["PHP", "Philippians"], ["COL", "Colossians"],
  ["1TH", "1 Thessalonians"], ["2TH", "2 Thessalonians"], ["1TI", "1 Timothy"], ["2TI", "2 Timothy"],
  ["TIT", "Titus"], ["PHM", "Philemon"], ["HEB", "Hebrews"], ["JAM", "James"],
  ["1PE", "1 Peter"], ["2PE", "2 Peter"], ["1JO", "1 John"], ["2JO", "2 John"],
  ["3JO", "3 John"], ["JUD", "Jude"], ["REV", "Revelation"]
];
const SEED = "NT-LC004-RP2018-REFERENCE-v1";
const SAMPLE_PER_STRATUM = 256;
const here = path.dirname(fileURLToPath(import.meta.url));
const toolRoot = path.resolve(here, "..");

function rank(locator) {
  return crypto.createHash("sha256").update(`${SEED}\0${locator}`).digest("hex");
}

function decodeXml(text) {
  return text.replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
}

async function readTargets() {
  const corpusDir = path.join(toolRoot, "corpus");
  const names = (await fs.readdir(corpusDir)).filter((name) => name.endsWith(".json")).sort();
  return Promise.all(names.map(async (name) => {
    const witness = JSON.parse(await fs.readFile(path.join(corpusDir, name), "utf8"));
    const greek = witness.layers.find((layer) => layer.language === "grc");
    const normalizedText = canonicalGreekLetters(greek.text);
    return {
      witness_id: witness.witness_id,
      verse: witness.verse,
      normalized_text: normalizedText,
      normalized_text_sha256: sha256(normalizedText)
    };
  }));
}

function extractVerses(xml, bookIndex, abbreviation, bookName, sourceCommit) {
  const verses = [];
  const pattern = /<ab n="B(\d+)K(\d+)V(\d+)">([\s\S]*?)<\/ab>/g;
  for (const match of xml.matchAll(pattern)) {
    const words = [...match[4].matchAll(/<w(?:\s[^>]*)?>([\s\S]*?)<\/w>/g)]
      .map((word) => decodeXml(word[1].replace(/<[^>]+>/g, "").trim()))
      .filter(Boolean);
    const chapter = Number(match[2]);
    const verseNumber = Number(match[3]);
    const locator = `RP2018:B${String(bookIndex).padStart(2, "0")}K${chapter}V${verseNumber}`;
    verses.push({
      id: locator.replaceAll(":", "-"),
      locator,
      verse: `${bookName} ${chapter}:${verseNumber}`,
      book: bookName,
      chapter,
      verse_number: verseNumber,
      stratum: bookIndex <= 4 ? "gospel" : "non-gospel",
      text: words.join(" "),
      source_url: `https://github.com/byztxt/byzantine-majority-text/blob/${sourceCommit}/tei-xml-unicode/no-accents/${abbreviation}.xml`
    });
  }
  return verses;
}

export async function buildReference(upstreamRoot, sourceCommit) {
  if (!/^[0-9a-f]{40}$/.test(sourceCommit ?? "")) throw new Error("pass an exact 40-character upstream commit SHA");
  const targets = await readTargets();
  const excludedVerses = new Set(targets.map((target) => target.verse));
  const targetTexts = new Set(targets.map((target) => target.normalized_text));
  const all = [];
  const sourceFiles = [];

  for (const [index, [abbreviation, bookName]] of BOOKS.entries()) {
    const sourcePath = `tei-xml-unicode/no-accents/${abbreviation}.xml`;
    const xml = execFileSync(
      "git",
      ["-C", upstreamRoot, "show", `${sourceCommit}:${sourcePath}`],
      { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 }
    );
    sourceFiles.push({
      path: sourcePath,
      sha256: sha256(xml)
    });
    all.push(...extractVerses(xml, index + 1, abbreviation, bookName, sourceCommit));
  }

  const eligible = all.filter((record) =>
    !excludedVerses.has(record.verse) && !targetTexts.has(canonicalGreekLetters(record.text))
  );
  const selected = ["gospel", "non-gospel"].flatMap((stratum) => eligible
    .filter((record) => record.stratum === stratum)
    .sort((left, right) => rank(left.locator).localeCompare(rank(right.locator)))
    .slice(0, SAMPLE_PER_STRATUM)
  ).sort((left, right) => left.locator.localeCompare(right.locator));
  if (selected.length !== SAMPLE_PER_STRATUM * 2) throw new Error("not enough eligible verses for requested sample");

  const recordsText = selected.map((record) => JSON.stringify(record)).join("\n") + "\n";
  const excludedTargets = targets.map((target) => {
    const bookIndex = BOOKS.findIndex(([, name]) => name === target.verse.split(/ (?=\d+:)/)[0]) + 1;
    const [, chapter, verseNumber] = target.verse.match(/ (\d+):(\d+)$/) ?? [];
    return {
      ...target,
      locator: `RP2018:B${String(bookIndex).padStart(2, "0")}K${Number(chapter)}V${Number(verseNumber)}`
    };
  });
  const manifest = {
    schema: "national-treasure.linguistic-carry.reference-corpus.v1",
    corpus_id: "RP2018-HASH-SAMPLE-001",
    generated_on: "2026-09-22",
    source: {
      title: "The New Testament in the Original Greek: Byzantine Textform (Robinson-Pierpont 2018)",
      edition: "RP2018; repository Unicode TEI, no-accents representation",
      repository: "https://github.com/byztxt/byzantine-majority-text",
      commit: sourceCommit,
      license: "Public Domain / Unlicense; attribution and disclaimer retained",
      license_url: "https://github.com/byztxt/byzantine-majority-text/blob/27a45ff1b7be6c17ccbfeac414f3f55732ae8e28/LICENSE.txt",
      responsibility: "Maurice A. Robinson and William G. Pierpont, The New Testament in the Original Greek: Byzantine Textform",
      disclaimer: "Use or reproduction does not imply doctrinal or theological agreement by the editors or publisher with views maintained by downstream users.",
      files: sourceFiles
    },
    selection: {
      algorithm: "sha256-rank-v1",
      seed: SEED,
      unit: "verse",
      rule: "Rank eligible verse locators by SHA-256(seed + NUL + locator); take the first 256 per declared stratum.",
      strata: { gospel: SAMPLE_PER_STRATUM, "non-gospel": SAMPLE_PER_STRATUM },
      excluded_targets: excludedTargets,
      nonclaim: "Hash ranking is deterministic pseudo-random sampling, not proof of statistical representativeness."
    },
    artifact: {
      path: "rp2018-sample.jsonl",
      record_count: selected.length,
      sha256: sha256(recordsText)
    },
    boundaries: [
      "The reference is a different declared Greek edition from the current greekbible.com display witnesses.",
      "The sample is a control surface for sensitivity analysis, not the reconstructed language of Jesus.",
      "No Syriac or Aramaic layer is introduced by this artifact.",
      "Reference frequency cannot establish intention, ancestry, semantics, prophecy, or theology."
    ]
  };

  const outputDir = path.join(toolRoot, "reference");
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, "rp2018-sample.jsonl"), recordsText);
  await fs.writeFile(path.join(outputDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  return { manifest, selected };
}

const [upstreamRoot, sourceCommit] = process.argv.slice(2);
if (!upstreamRoot || !sourceCommit) {
  console.error("usage: build-rp2018-reference.mjs <upstream-repo-root> <exact-commit-sha>");
  process.exitCode = 1;
} else {
  buildReference(upstreamRoot, sourceCommit)
    .then(({ manifest }) => console.log(JSON.stringify(manifest.artifact, null, 2)))
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
