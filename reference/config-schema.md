# .design/config.json Schema

The config file is created on first `/gdd:settings` call or when any stage initializes a new project. It controls model selection (profile) and how stages dispatch agents in parallel.

## Full Schema

```json
{
  "model_profile": "balanced",
  "parallelism": {
    "enabled": true,
    "max_parallel_agents": 5,
    "min_tasks_to_parallelize": 2,
    "min_estimated_savings_seconds": 30,
    "require_disjoint_touches": true,
    "worktree_isolation": false,
    "per_stage_override": {
      "explore": { "max_parallel_agents": 5 },
      "design":  { "max_parallel_agents": 3 }
    }
  }
}
```

## Default Config

If no `.design/config.json` exists, stages and `/gdd:settings` assume:

```json
{
  "model_profile": "balanced",
  "parallelism": {
    "enabled": true,
    "max_parallel_agents": 5,
    "min_tasks_to_parallelize": 2,
    "min_estimated_savings_seconds": 30,
    "require_disjoint_touches": true,
    "worktree_isolation": false,
    "per_stage_override": {}
  }
}
```

## Fields

### `model_profile`

| Value | Planner / Researcher | Executor | Verifier / Checker |
|---|---|---|---|
| `"quality"`  | Opus   | Sonnet | Sonnet |
| `"balanced"` (default) | Opus   | Sonnet | Haiku  |
| `"budget"`   | Sonnet | Sonnet | Sonnet |

Agents authored with `model: inherit` read the active profile at spawn time. Agents that hard-code `model:` in their frontmatter ignore the profile.

### `parallelism.enabled`

Master switch. When `false`, all stages run serially regardless of other settings.

### `parallelism.max_parallel_agents`

Cap on simultaneous agent spawns. Default: `5`.

### `parallelism.min_tasks_to_parallelize`

Minimum tasks in a wave before parallelism is considered. Default: `2`.

### `parallelism.min_estimated_savings_seconds`

Minimum estimated wall-clock savings (sum of `typical-duration-seconds` for would-be parallel agents, minus serial cost) before parallelism is chosen. Default: `30`.

### `parallelism.require_disjoint_touches`

When `true`, agents whose `Touches:` fields overlap are never parallelized. Default: `true` (safe).

### `parallelism.worktree_isolation`

When `true`, parallel agents run in dedicated git worktrees. Default: `false` (lower overhead, shared working tree).

### `parallelism.per_stage_override`

Keyed by stage name (`brief`, `explore`, `plan`, `design`, `verify`). Any field above may be overridden per stage.

## How Agents Read The Profile

Stages are the only code that read `.design/config.json`. When spawning an agent, the stage:

1. Reads `model_profile` from config.
2. Injects it into the agent prompt (e.g., `model_profile: balanced`) so the agent can reason about its own budget.
3. Selects the concrete model per the profile table above and passes it to the `Task` tool.

Agents never read config directly — the profile is always injected at spawn time.
