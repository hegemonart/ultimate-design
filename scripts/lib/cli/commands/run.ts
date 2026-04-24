// scripts/lib/cli/commands/run.ts — Plan 21-09 Task 2 (SDK-21).
//
// `gdd-sdk run` — drives the full design pipeline via
// `pipeline-runner.run()`. Builds a PipelineConfig from CLI flags,
// loads per-stage prompts (from --prompt-file mapping, from
// `.design/prompts/<stage>.md`, or embedded defaults), wires the
// human-gate callback, prints the outcome as JSON or human text, and
// maps pipeline status to an exit code.
//
// Exit codes:
//   * 0 — PipelineStatus === 'completed' or 'stopped-after'.
//   * 1 — PipelineStatus === 'halted'.
//   * 2 — PipelineStatus === 'awaiting-gate'.
//   * 3 — argument / config error (missing prompts, malformed flags).

import { readFileSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';

import {
  run as defaultPipelineRun,
  type HumanGateDecision,
  type HumanGateInfo,
  type PipelineConfig,
  type PipelineResult,
  type Stage,
  type StageOutcome,
} from '../../pipeline-runner/index.ts';
import { getLogger } from '../../logger/index.ts';
import { ValidationError } from '../../gdd-errors/index.ts';

import {
  coerceFlags,
  COMMON_FLAGS,
  type FlagSpec,
  type ParsedArgs,
} from '../parse-args.ts';

// ---------------------------------------------------------------------------
// Flag spec + help text.
// ---------------------------------------------------------------------------

const RUN_FLAGS: readonly FlagSpec[] = [
  ...COMMON_FLAGS,
  { name: 'stages', type: 'string' },
  { name: 'skip', type: 'string' },
  { name: 'resume-from', type: 'string' },
  { name: 'stop-after', type: 'string' },
  { name: 'prompt-file', type: 'string' },
  { name: 'gate-reply', type: 'string' },
];

const USAGE = `gdd-sdk run [flags]

Drive the full design pipeline headlessly.

Flags:
  --stages <list>          Comma-separated subset: brief,explore,plan,design,verify
  --skip <list>            Comma-separated stages to skip
  --resume-from <stage>    Start from this stage (inclusive)
  --stop-after <stage>     Stop after this stage (inclusive)
  --prompt-file <spec>     stage=path pairs; e.g., --prompt-file brief=./prompts/brief.md
  --gate-reply <mode>      Canned reply when a human-gate pauses:
                             stop            — halt with awaiting-gate (default)
                             resume[:payload]— resume with optional payload
  --budget-usd <n>         Total USD cap (default 10.0)
  --budget-input-tokens    Input-token cap (default 200000)
  --budget-output-tokens   Output-token cap (default 50000)
  --max-turns <n>          Per-stage turn cap (default 40)
  --cwd <dir>              Working directory (default: current)
  --log-level <lvl>        debug|info|warn|error (default info)
  --json                   Emit machine-parseable JSON to stdout
  --text                   Force human-readable output (default)
  --headless / --interactive  Override logger auto-mode

Exit codes:
  0  completed / stopped-after
  1  halted
  2  awaiting-gate
  3  arg/config error
`;

// ---------------------------------------------------------------------------
// Public types.
// ---------------------------------------------------------------------------

/**
 * Test-injection point. Default resolves to `pipeline-runner.run`. Keeps
 * unit tests independent of the real Agent SDK.
 */
export type PipelineRunFn = typeof defaultPipelineRun;

/** Writable streams for deterministic test capture. */
export interface RunCommandDeps {
  readonly pipelineRun?: PipelineRunFn;
  readonly stdout?: NodeJS.WritableStream;
  readonly stderr?: NodeJS.WritableStream;
}

// ---------------------------------------------------------------------------
// runCommand — entry point.
// ---------------------------------------------------------------------------

const ALL_STAGES: readonly Stage[] = ['brief', 'explore', 'plan', 'design', 'verify'];

/**
 * Entry point for `gdd-sdk run`. Returns the process exit code (never
 * throws). All diagnostic output goes to stderr; result output to stdout.
 */
export async function runCommand(
  args: ParsedArgs,
  deps: RunCommandDeps = {},
): Promise<number> {
  const stdout = deps.stdout ?? process.stdout;
  const stderr = deps.stderr ?? process.stderr;

  if (args.flags['help'] === true || args.flags['h'] === true) {
    stdout.write(USAGE);
    return 0;
  }

  let flags: Record<string, unknown>;
  try {
    flags = coerceFlags(args, RUN_FLAGS);
  } catch (err) {
    stderr.write(`gdd-sdk run: ${errMessage(err)}\n`);
    return 3;
  }

  const cwd: string = typeof flags['cwd'] === 'string' ? (flags['cwd'] as string) : process.cwd();

  // Resolve stages / skip / resumeFrom / stopAfter.
  let stages: readonly Stage[] | undefined;
  try {
    stages = parseStageList(flags['stages']);
  } catch (err) {
    stderr.write(`gdd-sdk run: ${errMessage(err)}\n`);
    return 3;
  }
  let skipStages: readonly Stage[] | undefined;
  try {
    skipStages = parseStageList(flags['skip']);
  } catch (err) {
    stderr.write(`gdd-sdk run: ${errMessage(err)}\n`);
    return 3;
  }
  const resumeFrom = parseSingleStage(flags['resume-from']);
  const stopAfter = parseSingleStage(flags['stop-after']);

  // Resolve the stage subset used for prompt loading. Defaults to all 5.
  const effectiveStages: readonly Stage[] = stages ?? ALL_STAGES;

  // Load prompts.
  let prompts: Record<Stage, string>;
  try {
    prompts = loadPrompts(effectiveStages, flags, cwd);
  } catch (err) {
    stderr.write(`gdd-sdk run: ${errMessage(err)}\n`);
    return 3;
  }

  // Build budget.
  const budget = {
    usdLimit: typeof flags['budget-usd'] === 'number' ? (flags['budget-usd'] as number) : 10.0,
    inputTokensLimit:
      typeof flags['budget-input-tokens'] === 'number'
        ? (flags['budget-input-tokens'] as number)
        : 200_000,
    outputTokensLimit:
      typeof flags['budget-output-tokens'] === 'number'
        ? (flags['budget-output-tokens'] as number)
        : 50_000,
    perStage: true as const,
  };

  const maxTurnsPerStage: number =
    typeof flags['max-turns'] === 'number' ? (flags['max-turns'] as number) : 40;

  // Human-gate callback — default STOP (exit code 2); optional canned
  // `--gate-reply resume[:payload]` lets tests / operators pre-seed a
  // decision without an interactive prompt.
  const gateReply: string | undefined =
    typeof flags['gate-reply'] === 'string' ? (flags['gate-reply'] as string) : undefined;
  const onHumanGate: (info: HumanGateInfo) => Promise<HumanGateDecision> = async (info) => {
    // Always surface gate info to stderr so operators see it even in
    // --json mode (where stdout carries the result JSON).
    stderr.write(
      `gdd-sdk run: human gate "${info.gateName}" at stage "${info.stage}"\n`,
    );
    if (gateReply === undefined) return { decision: 'stop' };
    if (gateReply === 'stop') return { decision: 'stop' };
    if (gateReply === 'resume') return { decision: 'resume' };
    if (gateReply.startsWith('resume:')) {
      return { decision: 'resume', payload: gateReply.slice('resume:'.length) };
    }
    stderr.write(
      `gdd-sdk run: unrecognized --gate-reply "${gateReply}"; defaulting to stop\n`,
    );
    return { decision: 'stop' };
  };

  const config: PipelineConfig = {
    prompts,
    budget,
    maxTurnsPerStage,
    stageRetries: 1,
    ...(stages !== undefined ? { stages } : {}),
    ...(skipStages !== undefined ? { skipStages } : {}),
    ...(resumeFrom !== undefined ? { resumeFrom } : {}),
    ...(stopAfter !== undefined ? { stopAfter } : {}),
    cwd,
    onHumanGate,
  };

  const pipelineRun: PipelineRunFn = deps.pipelineRun ?? defaultPipelineRun;

  let result: PipelineResult;
  try {
    result = await pipelineRun(config);
  } catch (err) {
    // pipeline-runner is contracted never to throw, but belt-and-braces:
    // surface the error as exit 3 rather than crashing.
    try {
      getLogger().error('cli.run.unexpected_error', {
        error: err instanceof Error ? err.message : String(err),
      });
    } catch {
      // Swallow logger failures.
    }
    stderr.write(`gdd-sdk run: unexpected error: ${errMessage(err)}\n`);
    return 3;
  }

  // Output.
  if (flags['json'] === true) {
    stdout.write(JSON.stringify(result, null, 2) + '\n');
  } else {
    stdout.write(renderHumanSummary(result));
  }

  // Exit code mapping.
  if (result.status === 'completed' || result.status === 'stopped-after') return 0;
  if (result.status === 'awaiting-gate') return 2;
  return 1;
}

// ---------------------------------------------------------------------------
// Helpers.
// ---------------------------------------------------------------------------

/** Default embedded prompt body when no file is supplied. */
const DEFAULT_PROMPTS: Readonly<Record<Stage, string>> = Object.freeze({
  brief: 'Draft the design brief. Follow SKILL.md for the stage.',
  explore: 'Run the explore-stage mappers and synthesize DESIGN-PATTERNS.md.',
  plan: 'Plan the design changes. Produce locked decisions + must-haves.',
  design: 'Implement design-stage deliverables per plan.',
  verify: 'Verify design deliverables; close must-haves; probe regressions.',
});

function loadPrompts(
  stages: readonly Stage[],
  flags: Record<string, unknown>,
  cwd: string,
): Record<Stage, string> {
  // Start with defaults, then layer in per-stage file paths (convention),
  // then layer in explicit `--prompt-file stage=path` mappings. Later
  // sources override earlier ones.
  const prompts: Record<Stage, string> = {
    brief: DEFAULT_PROMPTS.brief,
    explore: DEFAULT_PROMPTS.explore,
    plan: DEFAULT_PROMPTS.plan,
    design: DEFAULT_PROMPTS.design,
    verify: DEFAULT_PROMPTS.verify,
  };

  // Convention: `.design/prompts/<stage>.md` (load if file readable).
  for (const stage of stages) {
    const p = resolvePath(cwd, '.design/prompts', `${stage}.md`);
    try {
      prompts[stage] = readFileSync(p, 'utf8');
    } catch {
      // Best-effort: falls back to default.
    }
  }

  // Explicit --prompt-file mapping. Support comma-separated pairs plus
  // repeated --prompt-file usage (coerceFlags last-write-wins collapses
  // repeats, so for tests we also accept a semicolon-separated list).
  const rawMapping = flags['prompt-file'];
  if (typeof rawMapping === 'string' && rawMapping.length > 0) {
    // Split by `;` or `,` to support multiple pairs; a single `stage=path`
    // parses as one entry.
    const parts = rawMapping.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
    for (const pair of parts) {
      const eq = pair.indexOf('=');
      if (eq < 0) {
        throw new ValidationError(
          `--prompt-file expected stage=path, got "${pair}"`,
          'BAD_PROMPT_FILE_SPEC',
          { spec: pair },
        );
      }
      const stageName = pair.slice(0, eq).trim();
      const filePath = pair.slice(eq + 1).trim();
      if (!isStage(stageName)) {
        throw new ValidationError(
          `--prompt-file stage "${stageName}" is not one of brief|explore|plan|design|verify`,
          'BAD_PROMPT_FILE_STAGE',
          { stageName },
        );
      }
      const absPath = resolvePath(cwd, filePath);
      try {
        prompts[stageName] = readFileSync(absPath, 'utf8');
      } catch (err) {
        throw new ValidationError(
          `--prompt-file ${stageName}: cannot read "${filePath}": ${errMessage(err)}`,
          'PROMPT_FILE_READ_ERROR',
          { stage: stageName, path: absPath },
        );
      }
    }
  }

  return prompts;
}

function parseStageList(value: unknown): readonly Stage[] | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string') return undefined;
  const parts = value.split(',').map((s) => s.trim()).filter(Boolean);
  const stages: Stage[] = [];
  for (const p of parts) {
    if (!isStage(p)) {
      throw new ValidationError(
        `stage "${p}" is not one of brief|explore|plan|design|verify`,
        'INVALID_STAGE_NAME',
        { stage: p },
      );
    }
    stages.push(p);
  }
  return stages.length === 0 ? undefined : stages;
}

function parseSingleStage(value: unknown): Stage | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (trimmed === '') return undefined;
  if (!isStage(trimmed)) {
    throw new ValidationError(
      `stage "${trimmed}" is not one of brief|explore|plan|design|verify`,
      'INVALID_STAGE_NAME',
      { stage: trimmed },
    );
  }
  return trimmed;
}

function isStage(s: string): s is Stage {
  return (
    s === 'brief' || s === 'explore' || s === 'plan' || s === 'design' || s === 'verify'
  );
}

function errMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

function renderHumanSummary(result: PipelineResult): string {
  const lines: string[] = [];
  lines.push(`pipeline status: ${result.status}`);
  if (result.halted_at !== undefined) {
    lines.push(`halted at stage: ${result.halted_at}`);
  }
  if (result.gate !== undefined) {
    lines.push(`awaiting gate: ${result.gate.gateName} (stage=${result.gate.stage})`);
  }
  lines.push(
    `total usage: input=${result.total_usage.input_tokens} ` +
      `output=${result.total_usage.output_tokens} cost=$${result.total_usage.usd_cost.toFixed(4)}`,
  );
  lines.push('stage outcomes:');
  for (const outcome of result.outcomes) {
    lines.push(`  ${formatOutcome(outcome)}`);
  }
  return lines.join('\n') + '\n';
}

function formatOutcome(outcome: StageOutcome): string {
  const retries = outcome.retries > 0 ? ` retries=${outcome.retries}` : '';
  const blockers =
    outcome.blockers !== undefined && outcome.blockers.length > 0
      ? ` blockers=[${outcome.blockers.join('; ')}]`
      : '';
  return `${outcome.stage}: ${outcome.status}${retries}${blockers}`;
}
