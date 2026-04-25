'use strict';

// Per-runtime install matrix for the get-design-done plugin.
//
// Each entry is pure data describing how to install / uninstall the plugin
// into one runtime. The 14 runtimes listed below are roadmap-locked
// (Phase 24 D-02). Two `kind`s exist:
//
//   - `claude-marketplace` — register a marketplace entry + flip
//     `enabledPlugins[<name>@<marketplace>]` in settings.json. Today only
//     Claude Code uses this.
//
//   - `agents-md` — drop a runtime-specific instructions file (AGENTS.md /
//     GEMINI.md) into the runtime's config directory. Most modern AI coding
//     CLIs follow this convention.
//
// Adding a new runtime: append to RUNTIMES below, append the same id to the
// alphabetised baseline at test-fixture/baselines/phase-24/runtimes.txt.

const REPO = 'hegemonart/get-design-done';
const MARKETPLACE_NAME = 'get-design-done';
const PLUGIN_NAME = 'get-design-done';

const RUNTIMES = Object.freeze([
  {
    id: 'claude',
    displayName: 'Claude Code',
    configDirEnv: 'CLAUDE_CONFIG_DIR',
    configDirFallback: '.claude',
    kind: 'claude-marketplace',
    files: [],
    marketplaceEntry: {
      name: MARKETPLACE_NAME,
      pluginName: PLUGIN_NAME,
      repo: REPO,
    },
  },
  {
    id: 'opencode',
    displayName: 'OpenCode',
    configDirEnv: 'OPENCODE_CONFIG_DIR',
    configDirFallback: '.config/opencode',
    kind: 'agents-md',
    files: ['AGENTS.md'],
  },
  {
    id: 'gemini',
    displayName: 'Gemini CLI',
    configDirEnv: 'GEMINI_CONFIG_DIR',
    configDirFallback: '.gemini',
    kind: 'agents-md',
    files: ['GEMINI.md'],
  },
  {
    id: 'kilo',
    displayName: 'Kilo Code',
    configDirEnv: 'KILO_CONFIG_DIR',
    configDirFallback: '.kilo',
    kind: 'agents-md',
    files: ['AGENTS.md'],
  },
  {
    id: 'codex',
    displayName: 'OpenAI Codex CLI',
    configDirEnv: 'CODEX_HOME',
    configDirFallback: '.codex',
    kind: 'agents-md',
    files: ['AGENTS.md'],
  },
  {
    id: 'copilot',
    displayName: 'GitHub Copilot CLI',
    configDirEnv: 'COPILOT_CONFIG_DIR',
    configDirFallback: '.copilot',
    kind: 'agents-md',
    files: ['AGENTS.md'],
  },
  {
    id: 'cursor',
    displayName: 'Cursor',
    configDirEnv: 'CURSOR_CONFIG_DIR',
    configDirFallback: '.cursor',
    kind: 'agents-md',
    files: ['AGENTS.md'],
  },
  {
    id: 'windsurf',
    displayName: 'Windsurf',
    configDirEnv: 'WINDSURF_CONFIG_DIR',
    configDirFallback: '.windsurf',
    kind: 'agents-md',
    files: ['AGENTS.md'],
  },
  {
    id: 'antigravity',
    displayName: 'Antigravity',
    configDirEnv: 'ANTIGRAVITY_CONFIG_DIR',
    configDirFallback: '.antigravity',
    kind: 'agents-md',
    files: ['AGENTS.md'],
  },
  {
    id: 'augment',
    displayName: 'Augment',
    configDirEnv: 'AUGMENT_CONFIG_DIR',
    configDirFallback: '.augment',
    kind: 'agents-md',
    files: ['AGENTS.md'],
  },
  {
    id: 'trae',
    displayName: 'Trae',
    configDirEnv: 'TRAE_CONFIG_DIR',
    configDirFallback: '.trae',
    kind: 'agents-md',
    files: ['AGENTS.md'],
  },
  {
    id: 'qwen',
    displayName: 'Qwen Code',
    configDirEnv: 'QWEN_CONFIG_DIR',
    configDirFallback: '.qwen',
    kind: 'agents-md',
    files: ['AGENTS.md'],
  },
  {
    id: 'codebuddy',
    displayName: 'CodeBuddy',
    configDirEnv: 'CODEBUDDY_CONFIG_DIR',
    configDirFallback: '.codebuddy',
    kind: 'agents-md',
    files: ['AGENTS.md'],
  },
  {
    id: 'cline',
    displayName: 'Cline',
    configDirEnv: 'CLINE_CONFIG_DIR',
    configDirFallback: '.cline',
    kind: 'agents-md',
    files: ['AGENTS.md'],
  },
]);

const BY_ID = new Map(RUNTIMES.map((r) => [r.id, r]));

function getRuntime(id) {
  const r = BY_ID.get(id);
  if (!r) {
    throw new RangeError(
      `Unknown runtime "${id}". Known: ${[...BY_ID.keys()].join(', ')}`,
    );
  }
  return r;
}

function listRuntimes() {
  return RUNTIMES;
}

function listRuntimeIds() {
  return RUNTIMES.map((r) => r.id);
}

module.exports = {
  RUNTIMES,
  REPO,
  MARKETPLACE_NAME,
  PLUGIN_NAME,
  getRuntime,
  listRuntimes,
  listRuntimeIds,
};
