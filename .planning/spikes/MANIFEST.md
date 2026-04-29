# Spike Manifest

## Idea

Validate that GDD can extract a large Figma design system to a compact, LLM-readable digest **without burning Claude context or Figma MCP calls** — by hitting Figma REST API directly from a Node script and packaging the raw JSON into a `DESIGN.md` + `tokens.json` + `components.json` triplet locally. Goal: cheap, fast, repeatable DS-to-code workflow as an additional GDD function.

## Spikes

| # | Name | Validates | Verdict | Tags |
|---|------|-----------|---------|------|
| 001 | figma-offcontext-extractor | REST-based off-context extraction of a 167-component DS into a <20K-token DESIGN.md without raw JSON entering LLM context | ⚠ PARTIAL | figma, extractor, design-system, off-context, rest-api |
