---
spike: 001
name: figma-offcontext-extractor
validates: "Given a real Figma DS file, when a Node script pulls it via REST API and packages it locally, then a compact DESIGN.md digest can be produced without raw JSON ever entering Claude context"
verdict: PARTIAL
related: []
tags: [figma, extractor, design-system, off-context, rest-api]
---

# Spike 001: Figma off-context extractor

## What this validates

**Given** a real Figma design system file (test target: `IAHNrYoqIh56SCxgv3PjCS` — a 167-component DS with 88 top-level frames),
**When** a Node script hits Figma REST API directly with just a `FIGMA_TOKEN` env var and writes raw JSON to disk,
**Then** a separate digest script can produce `DESIGN.md` + `components.json` + `tokens.json` artifacts compact enough for an LLM to consume — and the raw JSON (200+ MB) never touches the LLM context window.

## How to run

```bash
export FIGMA_TOKEN=figd_...                              # personal access token
export FIGMA_FILE_KEY=IAHNrYoqIh56SCxgv3PjCS             # default if unset
node extract.mjs                                          # raw pull → ./raw/*.json
node digest.mjs                                           # package → ./digest/*
```

`extract.mjs` and `digest.mjs` are decoupled. Re-run digest without re-pulling. Raw JSON is gitignored — reproducible from extract.

## What to expect

After `extract.mjs`: `raw/file.json` ~225 MB, plus smaller endpoint dumps (styles, components, component_sets). One `_meta.json` summarizing pull stats.

After `digest.mjs`: `digest/DESIGN.md` (~15K tokens) listing every component set with variants and props, `digest/components.json` (~50K tokens) for queryable detail, `digest/tokens.json` for design tokens.

## Results

### What worked

- **Off-context architecture confirmed.** Raw JSON (223 MB / ~58.5M tokens) never enters Claude context. Only the digest does.
- **Compression: 898×.** From 223 MB raw → 254 KB digest. DESIGN.md alone is 15.7K tokens — fits comfortably in any reasonable LLM budget.
- **Cost comparison vs. Figma MCP:** zero MCP calls, zero Claude tokens during extraction. End-to-end pull took ~33 seconds (file endpoint dominates at ~30s for this DS size).
- **Component structure preserved.** 127 component sets correctly captured with variants, prop definitions, defaults, and BOOLEAN/TEXT/VARIANT prop types — enough for an LLM to write code against them without guessing.
- **Variant deduplication.** First pass produced 2,593 entries because each COMPONENT_SET's children were also counted. Fixed: skip COMPONENT children of COMPONENT_SET. Now: 167 entries (127 sets + 40 singletons), matches Figma reality.
- **Top-level frames as widget candidates.** 88 frames identified by name, ready for downstream classification.

### What did NOT work — token extraction is the weak link

- **Variables endpoint (`/v1/files/:key/variables/local`) returned 403** — this is Enterprise-only. Most modern Figma DSs put colors and spacing here. Without enterprise access, we cannot read the canonical tokens via API. **This is a blocker for any DS that uses Variables.**
- **Style extraction returned 0 tokens.** The `/v1/files/:key/styles` endpoint returns 43 styles (TEXT + EFFECT only — colors are in Variables for this DS), but the digest's style→node lookup failed to find them in the document tree. Likely because published styles' source nodes live in canvas frames that need a separate `/v1/files/:key/nodes?ids=...` call to fetch.
- **Net result for this DS:** zero tokens extracted. The DESIGN.md `## Tokens` section is empty.

### Verdict: PARTIAL ⚠

The off-context architecture is **proven and viable**. Compression works. Component extraction works.

But the **token extraction path is incomplete** for two real-world cases:
1. Enterprise Variables — needs Enterprise plan or alternative source
2. Legacy styles — needs a second-pass `/files/:key/nodes` fetch by node_id

Production version must handle both before this is shippable.

### Cost comparison: this approach vs. Figma MCP

| | Off-context script (this spike) | Figma MCP for whole DS |
|---|---|---|
| Claude tokens consumed | 0 (extract) + ~15K (digest read) | ~50–500K+ depending on calls |
| Figma MCP tool calls | 0 | 100+ for 167 components |
| Wall time | ~33s | tens of minutes |
| Cost per re-run | free (just rerun extract) | linearly expensive |

Off-context wins by **orders of magnitude** for any non-trivial DS.

### Surprises

- The test DS has **2,466 component variants** rolled up under 127 sets. The naive walker counts these as separate components and inflates the digest by 16×. Variant rollup is mandatory, not optional.
- File endpoint is slow (~30s for a 223 MB DS). Not a blocker — it's a one-time pull that produces a reusable cache. But productionized version should support incremental fetch via `/v1/files/:key/nodes?ids=…` rather than re-pulling the whole file.
- `geometry=paths` query param costs nothing for our use case (we throw away geometry); leave at default to skip it and shrink raw size further.

## Signal for the build

If we move forward with `gsd-figma-extract` as a real plugin command:

1. **Two-stage pipeline confirmed correct:** raw pull → digest. Keep them separate. Cache raw/, gitignore it.
2. **Variant rollup is non-negotiable.** Skip COMPONENT children of COMPONENT_SET; rollup variants onto the parent.
3. **Token extraction needs three paths:**
   - Variables API (Enterprise) — primary
   - `/styles` + `/nodes?ids=` two-step — fallback for non-Enterprise
   - DTCG file ingestion — for DSs that already export tokens
4. **Drop `geometry=paths`.** Saves ~30% raw size.
5. **DESIGN.md format is solid** as the LLM-facing entry point. Keep components.json as queryable companion.
6. **Build a `--component <name>` filter** on digest.mjs so an LLM working on one component reads only its slice (~500 tokens) instead of the full digest.

## Files

- `extract.mjs` — Figma REST puller, writes `raw/*.json`
- `digest.mjs` — packager, writes `digest/DESIGN.md` + `digest/components.json` + `digest/tokens.json`
- `digest/DESIGN.md` — the LLM-facing artifact (sample output kept in repo)
- `raw/` — gitignored, reproducible via `extract.mjs`
