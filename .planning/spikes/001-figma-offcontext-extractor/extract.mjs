#!/usr/bin/env node
// Spike 001: Figma off-context extractor — RAW PULL stage.
// Pulls file JSON, variables, styles, components into local cache.
// Raw JSON never enters Claude context — written to disk only.

import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const FIGMA_TOKEN = process.env.FIGMA_TOKEN || process.env.FIGMA_PERSONAL_ACCESS_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY || "IAHNrYoqIh56SCxgv3PjCS";
const OUT_DIR = process.env.OUT_DIR || join(import.meta.dirname, "raw");

if (!FIGMA_TOKEN) {
  console.error("ERROR: FIGMA_TOKEN env var required.");
  console.error("Get one at https://www.figma.com/developers/api#access-tokens");
  console.error("Then: export FIGMA_TOKEN=figd_...");
  process.exit(1);
}

const headers = { "X-Figma-Token": FIGMA_TOKEN };
const BASE = "https://api.figma.com/v1";

async function fetchJson(path) {
  const url = `${BASE}${path}`;
  const t0 = Date.now();
  const res = await fetch(url, { headers });
  const ms = Date.now() - t0;
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma API ${res.status} on ${path}: ${body.slice(0, 200)}`);
  }
  const json = await res.json();
  return { json, ms };
}

async function save(name, data, meta) {
  const path = join(OUT_DIR, `${name}.json`);
  const body = JSON.stringify(data);
  await writeFile(path, body);
  const bytes = Buffer.byteLength(body, "utf8");
  console.log(`  ${name.padEnd(20)} ${(bytes / 1024).toFixed(1).padStart(8)} KB  (${meta.ms}ms)`);
  return { name, bytes, ms: meta.ms };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  console.log(`\nFigma file: ${FILE_KEY}`);
  console.log(`Cache dir:  ${OUT_DIR}\n`);

  const totals = [];

  // 1. Full file (geometry + node tree + components manifest)
  console.log("Endpoint pulls:");
  const file = await fetchJson(`/files/${FILE_KEY}?geometry=paths`);
  totals.push(await save("file", file.json, file));

  // 2. Variables (modern tokens) — Enterprise-only endpoint, may 403.
  try {
    const vars = await fetchJson(`/files/${FILE_KEY}/variables/local`);
    totals.push(await save("variables", vars.json, vars));
  } catch (e) {
    console.log(`  variables           SKIPPED (${e.message.split(":")[0]})`);
    totals.push({ name: "variables", bytes: 0, ms: 0, skipped: true, reason: e.message });
  }

  // 3. Styles (legacy color/text/effect styles)
  const styles = await fetchJson(`/files/${FILE_KEY}/styles`);
  totals.push(await save("styles", styles.json, styles));

  // 4. Components registry
  const components = await fetchJson(`/files/${FILE_KEY}/components`);
  totals.push(await save("components", components.json, components));

  // 5. Component sets (variants)
  const componentSets = await fetchJson(`/files/${FILE_KEY}/component_sets`);
  totals.push(await save("component_sets", componentSets.json, componentSets));

  // Summary
  const totalBytes = totals.reduce((a, b) => a + b.bytes, 0);
  const totalMs = totals.reduce((a, b) => a + b.ms, 0);
  console.log(`\n${"─".repeat(50)}`);
  console.log(`Total raw: ${(totalBytes / 1024 / 1024).toFixed(2)} MB in ${totalMs}ms`);
  console.log(`Token estimate (raw): ~${Math.round(totalBytes / 4).toLocaleString()} tokens (would blow up Claude context)`);
  console.log(`${"─".repeat(50)}\n`);

  await writeFile(
    join(OUT_DIR, "_meta.json"),
    JSON.stringify({ file_key: FILE_KEY, fetched_at: new Date().toISOString(), totals }, null, 2)
  );
}

main().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
