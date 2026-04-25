'use strict';

// Config-dir lookup chain for the get-design-done multi-runtime installer.
//
// Order of precedence (Phase 24 D-03):
//   1. Explicit override (--config-dir <dir> from caller).
//   2. Per-runtime env var (CLAUDE_CONFIG_DIR, OPENCODE_CONFIG_DIR, ...).
//   3. POSIX/Windows fallback at $HOME / $USERPROFILE + the runtime's
//      configDirFallback (e.g. ~/.claude, ~/.gemini, ~/.config/opencode).
//
// resolveConfigDir returns the absolute path the installer should target.
// It does NOT verify the directory exists — that is the caller's job.

const path = require('node:path');
const os = require('node:os');

const { getRuntime, listRuntimes } = require('./runtimes.cjs');

function homeDir() {
  return os.homedir();
}

function resolveConfigDir(runtimeId, opts) {
  const runtime = getRuntime(runtimeId);
  const overrides = (opts && opts.env) || process.env;
  const explicit = opts && opts.configDir;

  if (explicit && String(explicit).trim()) {
    return path.resolve(String(explicit).trim());
  }

  const envValue = overrides[runtime.configDirEnv];
  if (envValue && String(envValue).trim()) {
    return path.resolve(String(envValue).trim());
  }

  const home = (opts && opts.home) || homeDir();
  // configDirFallback may use POSIX separators (e.g. ".config/opencode") for
  // cross-runtime portability — path.join + path.resolve normalises to the
  // host platform's separator on output.
  return path.resolve(path.join(home, ...runtime.configDirFallback.split('/')));
}

function resolveAllConfigDirs(opts) {
  const out = {};
  for (const runtime of listRuntimes()) {
    out[runtime.id] = resolveConfigDir(runtime.id, opts);
  }
  return out;
}

module.exports = {
  resolveConfigDir,
  resolveAllConfigDirs,
};
