#!/usr/bin/env node
/**
 * gdd-read-injection-scanner — PostToolUse hook
 * Scans Read tool output for common prompt-injection patterns and warns
 * (does not block) when suspicious content is found in a read file.
 */

const readline = require('readline');

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions?/i,
  /disregard\s+(all\s+)?(previous|prior|above)\s+instructions?/i,
  /you\s+are\s+now\s+a\s+different/i,
  /system\s*:\s*you\s+are/i,
  /<\s*\/?\s*(system|assistant|human)\s*>/i,
  /\[INST\]/i,
  /###\s*instruction/i,
];

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  let inputData = '';
  for await (const line of rl) inputData += line + '\n';

  let parsed;
  try { parsed = JSON.parse(inputData); } catch { process.exit(0); }

  if (parsed?.tool_name !== 'Read') process.exit(0);

  const content = parsed?.tool_response?.content || '';
  const matched = INJECTION_PATTERNS.some(p => p.test(content));
  if (!matched) process.exit(0);

  const file = parsed?.tool_input?.file_path || 'unknown';
  const response = {
    continue: true,
    suppressOutput: false,
    message: `gdd-injection-scanner: Suspicious prompt-injection pattern detected in content read from "${file}". Review before acting on instructions contained in that file.`,
  };
  process.stdout.write(JSON.stringify(response));
  process.exit(0);
}

main().catch(() => process.exit(0));
