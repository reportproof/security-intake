#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "./config.js";
import { analyzeReport, toMarkdown } from "./rules.js";

export async function runAction(env = process.env, cwd = process.cwd(), io = defaultIo) {
  const reportPath = requireInput(env, "INPUT_REPORT_PATH");
  const configPath = optionalInput(env, "INPUT_CONFIG_PATH");
  const format = normalizeFormat(optionalInput(env, "INPUT_FORMAT") || "markdown");
  const outputPath = optionalInput(env, "INPUT_OUTPUT_PATH") || "security-intake-result.md";
  const failOnLowQuality = parseBoolean(optionalInput(env, "INPUT_FAIL_ON_LOW_QUALITY") || "false");

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

function requireInput(env, key) {
  const value = optionalInput(env, key);
  if (!value) {
    throw new Error(`Missing required action input: ${key}`);
  }
  return value;
}

function optionalInput(env, key) {
  const value = env[key];
  return value === undefined ? "" : String(value).trim();
}

function normalizeFormat(value) {
  if (value === "markdown" || value === "json") return value;
  throw new Error(`Unsupported format: ${value}. Use markdown or json.`);
}

function parseBoolean(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`Boolean input must be true or false, received: ${value}`);
}

async function writeOutputs(outputFile, outputs) {
  if (!outputFile) return;

  const lines = Object.entries(outputs).map(([key, value]) => `${key}=${value}`);
  await fs.appendFile(outputFile, `${lines.join("\n")}\n`);
}

const defaultIo = {
  write(text) {
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
