#!/usr/bin/env node
// Spike 001: DIGEST stage.
// Reads raw/*.json, packages into compact DESIGN.md + tokens.json + components.json.
// Goal: produce <20K-token digest from arbitrarily-large raw input.

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const HERE = import.meta.dirname;
const RAW = join(HERE, "raw");
const OUT = join(HERE, "digest");

const rgbToHex = ({ r, g, b, a }) => {
  const to = (v) => Math.round(v * 255).toString(16).padStart(2, "0");
  const hex = `#${to(r)}${to(g)}${to(b)}`;
  return a !== undefined && a < 1 ? `${hex}${to(a)}` : hex;
};

async function readJson(name) {
  const path = join(RAW, `${name}.json`);
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return null;
  }
}

// Walk node tree, collect components + frames matching widget pattern.
function walk(node, ctx, parentIsSet = false) {
  if (!node) return;

  // Skip COMPONENT children of COMPONENT_SET — they're variants already captured on the parent.
  const isStandaloneComponent = node.type === "COMPONENT" && !parentIsSet;
  if (node.type === "COMPONENT_SET" || isStandaloneComponent) {
    ctx.components.push({
      id: node.id,
      name: node.name,
      type: node.type,
      description: node.description || "",
      variants: node.type === "COMPONENT_SET"
        ? (node.children || []).map((c) => c.name)
        : undefined,
      props: node.componentPropertyDefinitions
        ? Object.entries(node.componentPropertyDefinitions).map(([k, v]) => ({
            name: k.split("#")[0],
            type: v.type,
            default: v.defaultValue,
            options: v.variantOptions,
          }))
        : undefined,
    });
  }

  // Track top-level frames as candidate widgets/pages
  if (ctx.depth === 1 && node.type === "FRAME") {
    ctx.frames.push({ id: node.id, name: node.name });
  }

  if (node.children) {
    ctx.depth++;
    const childParentIsSet = node.type === "COMPONENT_SET";
    for (const c of node.children) walk(c, ctx, childParentIsSet);
    ctx.depth--;
  }
}

function extractTokensFromVariables(vars) {
  if (!vars || !vars.meta) return [];
  const collections = vars.meta.variableCollections || {};
  const variables = vars.meta.variables || {};
  const tokens = [];
  for (const v of Object.values(variables)) {
    const collection = collections[v.variableCollectionId];
    const modes = collection?.modes || [];
    const valuesByMode = {};
    for (const mode of modes) {
      const raw = v.valuesByMode?.[mode.modeId];
      if (raw && typeof raw === "object" && "r" in raw) {
        valuesByMode[mode.name] = rgbToHex(raw);
      } else if (raw && raw.type === "VARIABLE_ALIAS") {
        valuesByMode[mode.name] = `{${variables[raw.id]?.name || raw.id}}`;
      } else {
        valuesByMode[mode.name] = raw;
      }
    }
    tokens.push({
      name: v.name,
      type: v.resolvedType,
      collection: collection?.name,
      modes: valuesByMode,
    });
  }
  return tokens;
}

function extractTokensFromStyles(file, styles) {
  if (!styles?.meta?.styles) return [];
  const styleNodeIds = styles.meta.styles.map((s) => s.node_id);
  const out = [];
  // Find each style's node in file tree to read its actual paint/typography
  const index = {};
  function indexNodes(node) {
    if (!node) return;
    index[node.id] = node;
    if (node.children) for (const c of node.children) indexNodes(c);
  }
  indexNodes(file.document);

  for (const s of styles.meta.styles) {
    const node = index[s.node_id];
    if (!node) continue;
    let value;
    if (s.style_type === "FILL" && node.fills?.[0]?.color) {
      value = rgbToHex({ ...node.fills[0].color, a: node.fills[0].opacity });
    } else if (s.style_type === "TEXT" && node.style) {
      const st = node.style;
      value = {
        family: st.fontFamily,
        weight: st.fontWeight,
        size: st.fontSize,
        lineHeight: st.lineHeightPx,
        letterSpacing: st.letterSpacing,
      };
    } else if (s.style_type === "EFFECT" && node.effects?.[0]) {
      value = node.effects[0];
    }
    if (value !== undefined) {
      out.push({ name: s.name, type: s.style_type, value, description: s.description || "" });
    }
  }
  return out;
}

function summarizeWidgets(file, components) {
  // Heuristic: top-level frames whose names suggest compositions.
  // For this spike, just list top-level frames with their child component refs.
  const ctx = { components: [], frames: [], depth: 0 };
  for (const page of file.document.children || []) {
    if (page.children) for (const c of page.children) walk(c, { ...ctx, depth: 1 });
  }
  return ctx.frames;
}

function buildDesignMd({ tokens, components, widgets, fileMeta }) {
  const colorTokens = tokens.filter((t) => t.type === "COLOR" || t.type === "FILL");
  const textTokens = tokens.filter((t) => t.type === "TEXT");
  const otherTokens = tokens.filter(
    (t) => !["COLOR", "FILL", "TEXT"].includes(t.type)
  );

  const lines = [];
  lines.push(`# DESIGN.md`);
  lines.push(``);
  lines.push(`> Auto-generated from Figma file \`${fileMeta.file_key}\` at ${fileMeta.fetched_at}`);
  lines.push(`> Source: ${fileMeta.name || "Design system"}`);
  lines.push(``);
  lines.push(`## Tokens`);
  lines.push(``);

  if (colorTokens.length) {
    lines.push(`### Color`);
    lines.push(``);
    for (const t of colorTokens.slice(0, 200)) {
      const modes = t.modes
        ? Object.entries(t.modes)
            .map(([m, v]) => `${m}: ${typeof v === "string" ? v : JSON.stringify(v)}`)
            .join(" | ")
        : JSON.stringify(t.value);
      lines.push(`- \`${t.name}\` — ${modes}`);
    }
    lines.push(``);
  }

  if (textTokens.length) {
    lines.push(`### Typography`);
    lines.push(``);
    for (const t of textTokens.slice(0, 100)) {
      const v = t.value || Object.values(t.modes || {})[0];
      lines.push(`- \`${t.name}\` — ${typeof v === "object" ? JSON.stringify(v) : v}`);
    }
    lines.push(``);
  }

  if (otherTokens.length) {
    lines.push(`### Other`);
    lines.push(``);
    for (const t of otherTokens.slice(0, 100)) {
      lines.push(`- \`${t.name}\` (${t.type})`);
    }
    lines.push(``);
  }

  lines.push(`## Components`);
  lines.push(``);
  const sets = components.filter((c) => c.type === "COMPONENT_SET");
  const singles = components.filter((c) => c.type === "COMPONENT");
  lines.push(`Total: ${sets.length} component sets + ${singles.length} singleton components`);
  lines.push(``);

  for (const c of sets) {
    lines.push(`### ${c.name}`);
    if (c.description) lines.push(`> ${c.description}`);
    if (c.variants?.length) {
      lines.push(`Variants (${c.variants.length}):`);
      for (const v of c.variants.slice(0, 20)) lines.push(`- ${v}`);
      if (c.variants.length > 20) lines.push(`- … +${c.variants.length - 20} more`);
    }
    if (c.props?.length) {
      lines.push(`Props:`);
      for (const p of c.props) {
        const opts = p.options ? ` [${p.options.join(", ")}]` : "";
        lines.push(`- \`${p.name}\` (${p.type})${opts} — default: \`${p.default}\``);
      }
    }
    lines.push(``);
  }

  if (singles.length) {
    lines.push(`### Singleton components`);
    lines.push(``);
    for (const c of singles.slice(0, 100)) {
      lines.push(`- \`${c.name}\``);
    }
    lines.push(``);
  }

  lines.push(`## Widgets / Pages`);
  lines.push(``);
  for (const w of widgets.slice(0, 50)) {
    lines.push(`- ${w.name} (\`${w.id}\`)`);
  }

  return lines.join("\n");
}

async function main() {
  const { mkdir } = await import("node:fs/promises");
  await mkdir(OUT, { recursive: true });

  const file = await readJson("file");
  if (!file) {
    console.error("ERROR: raw/file.json not found. Run extract.mjs first.");
    process.exit(1);
  }
  const variables = await readJson("variables");
  const styles = await readJson("styles");
  const componentsManifest = await readJson("components");
  const componentSetsManifest = await readJson("component_sets");
  const meta = await readJson("_meta");

  // Walk file tree to collect components with full metadata
  const ctx = { components: [], frames: [], depth: 0 };
  for (const page of file.document.children || []) {
    if (page.children) for (const c of page.children) walk(c, Object.assign(ctx, { depth: 1 }));
  }

  // Tokens
  const variableTokens = extractTokensFromVariables(variables);
  const styleTokens = extractTokensFromStyles(file, styles);
  const allTokens = [...variableTokens, ...styleTokens];

  const widgets = summarizeWidgets(file, ctx.components);

  const fileMeta = {
    file_key: meta?.file_key,
    fetched_at: meta?.fetched_at,
    name: file.name,
  };

  const designMd = buildDesignMd({
    tokens: allTokens,
    components: ctx.components,
    widgets,
    fileMeta,
  });

  await writeFile(join(OUT, "DESIGN.md"), designMd);
  await writeFile(join(OUT, "tokens.json"), JSON.stringify(allTokens, null, 2));
  await writeFile(
    join(OUT, "components.json"),
    JSON.stringify(ctx.components, null, 2)
  );

  // Stats
  const designBytes = Buffer.byteLength(designMd, "utf8");
  const tokensBytes = Buffer.byteLength(JSON.stringify(allTokens), "utf8");
  const componentsBytes = Buffer.byteLength(JSON.stringify(ctx.components), "utf8");
  const totalDigestBytes = designBytes + tokensBytes + componentsBytes;
  const rawTotal = (meta?.totals || []).reduce((a, b) => a + (b.bytes || 0), 0);

  const tokenEst = (b) => Math.round(b / 4);

  console.log(`\nDigest summary`);
  console.log(`${"─".repeat(50)}`);
  console.log(`  DESIGN.md         ${(designBytes / 1024).toFixed(1).padStart(8)} KB  ~${tokenEst(designBytes).toLocaleString().padStart(7)} tokens`);
  console.log(`  tokens.json       ${(tokensBytes / 1024).toFixed(1).padStart(8)} KB  ~${tokenEst(tokensBytes).toLocaleString().padStart(7)} tokens`);
  console.log(`  components.json   ${(componentsBytes / 1024).toFixed(1).padStart(8)} KB  ~${tokenEst(componentsBytes).toLocaleString().padStart(7)} tokens`);
  console.log(`  ${"─".repeat(48)}`);
  console.log(`  TOTAL DIGEST      ${(totalDigestBytes / 1024).toFixed(1).padStart(8)} KB  ~${tokenEst(totalDigestBytes).toLocaleString().padStart(7)} tokens`);
  console.log(``);
  console.log(`  Raw input total   ${(rawTotal / 1024 / 1024).toFixed(2).padStart(8)} MB  ~${tokenEst(rawTotal).toLocaleString().padStart(7)} tokens`);
  console.log(`  Compression       ${rawTotal ? (rawTotal / totalDigestBytes).toFixed(0) : "?"}x smaller`);
  console.log(`${"─".repeat(50)}`);
  console.log(``);
  console.log(`Counts:`);
  console.log(`  - tokens (variables + styles): ${allTokens.length}`);
  console.log(`  - components (incl. sets):     ${ctx.components.length}`);
  console.log(`  - widgets/top-level frames:    ${widgets.length}`);
  console.log(``);
  console.log(`Output: ${OUT}`);
}

main().catch((e) => {
  console.error("FAILED:", e.stack);
  process.exit(1);
});
