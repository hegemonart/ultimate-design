# Deprecations

This registry tracks renamed, split, or removed plugin concepts. Each entry names the deprecated name, the phase that deprecated it, the replacement, and a migration note.

## Namespaces

- **`/design:<cmd>`** → `/gdd:<cmd>` — deprecated in Phase 7 (namespace rename). All commands now use the `/gdd:` prefix. Migrated: every shipped skill invocation and agent reference now uses `/gdd:`.

## Agents

- **`design-pattern-mapper`** (monolithic) → split into 5 domain mappers in Phase 3 (migrated):
  - `token-mapper`
  - `component-taxonomy-mapper`
  - `a11y-mapper`
  - `motion-mapper`
  - `visual-hierarchy-mapper`

  The legacy `design-pattern-mapper.md` agent is retained as a compatibility shim pending full removal in a later phase. New work should spawn the domain mappers directly.

## Stages

- **`scan`** (stage name) → merged/renamed into `explore` in Phase 3. Migration: references to the `scan` stage in shipped skills and agents were replaced with `explore`.
- **`discover`** (stage name) → merged/renamed into `explore` in Phase 3. Migration: references to the `discover` stage in shipped skills and agents were replaced with `explore`.
