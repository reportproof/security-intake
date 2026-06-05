#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "./config.js";
import { analyzeReport, type AnalysisResult, toMarkdown } from "./rules.js";

type ActionEnv = NodeJS.ProcessEnv;
type OutputFormat = "markdown" | "json";

interface ActionIo {
  write(text: string): void;
}

interface ActionRunResult {
  result: AnalysisResult;
  outputPath: string;
  processExitCode: number;
}

export async function runAction(
  env: ActionEnv = process.env,
  cwd = process.cwd(),
  io: ActionIo = defaultIo
): Promise<ActionRunResult> {
  const reportPath = requireActionInput(env, "report-path");
  const configPath = optionalActionInput(env, "config-path");
  const format = normalizeFormat(optionalActionInput(env, "format") || "markdown");
  const outputPath = optionalActionInput(env, "output-path") || "security-intake-result.md";
  const failOnLowQuality = parseBoolean(optionalActionInput(env, "fail-on-low-quality") || "false");

  const resolvedReportPath = path.resolve(cwd, reportPath);
  const resolvedOutputPath = path.resolve(cwd, outputPath);
  const text = await fs.readFile(resolvedReportPath, "utf8");
  const config = await loadConfig(configPath, cwd);
  const result = analyzeReport(text, config);
  const rendered = format === "json" ? `${JSON.stringify(result, null, 2)}\n` : `${toMarkdown(result)}\n`;

  await fs.mkdir(path.dirname(resolvedOutputPath), { recursive: true });
  await fs.writeFile(resolvedOutputPath, rendered);
  io.write(rendered);

  await writeOutputs(env.GITHUB_OUTPUT, {
    decision: result.decision,
    score: String(result.score),
    "exit-code": String(result.exitCode),
    "result-path": outputPath,
  });

  return {
    result,
    outputPath: resolvedOutputPath,
    processExitCode: failOnLowQuality ? result.exitCode : 0,
  };
}

function requireActionInput(env: ActionEnv, inputId: string): string {
  const value = optionalActionInput(env, inputId);
  if (!value) {
    throw new Error(`Missing required action input: ${inputId}`);
  }
  return value;
}

function optionalActionInput(env: ActionEnv, inputId: string): string {
  for (const key of inputEnvKeys(inputId)) {
    const value = optionalEnv(env, key);
    if (value) return value;
  }

  return "";
}

function inputEnvKeys(inputId: string): string[] {
  const upper = inputId.toUpperCase();
  return [`INPUT_${upper}`, `INPUT_${upper.replaceAll("-", "_")}`];
}

function optionalEnv(env: ActionEnv, key: string): string {
  const value = env[key];
  return value === undefined ? "" : String(value).trim();
}

function normalizeFormat(value: string): OutputFormat {
  if (value === "markdown" || value === "json") return value;
  throw new Error(`Unsupported format: ${value}. Use markdown or json.`);
}

function parseBoolean(value: string): boolean {
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`Boolean input must be true or false, received: ${value}`);
}

async function writeOutputs(outputFile: string | undefined, outputs: Record<string, string>): Promise<void> {
  if (!outputFile) return;

  const lines = Object.entries(outputs).map(([key, value]) => `${key}=${value}`);
  await fs.appendFile(outputFile, `${lines.join("\n")}\n`);
}

const defaultIo = {
  write(text: string) {
    process.stdout.write(text);
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runAction()
    .then(({ processExitCode }) => {
      process.exitCode = processExitCode;
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    });
}
