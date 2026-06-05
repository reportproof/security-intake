#!/usr/bin/env node
import fs from "node:fs/promises";
import { loadConfig } from "./config.js";
import { analyzeReport, EXIT_CODES, toMarkdown } from "./rules.js";

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  if (!options.filePath) {
    console.error("Usage: security-intake <report.md> [--json] [--config <path>] [--no-fail]");
    process.exitCode = 1;
    return;
  }

  const config = await loadConfig(options.configPath);
  const text = await fs.readFile(options.filePath, "utf8");
  const result = analyzeReport(text, config);

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(toMarkdown(result));
  }

  if (!options.noFail) {
    process.exitCode = result.exitCode;
  }
}

function parseArgs(args) {
  const options = {
    configPath: null,
    filePath: null,
    help: false,
    json: false,
    noFail: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--json") {
      options.json = true;
    } else if (arg === "--no-fail") {
      options.noFail = true;
    } else if (arg === "--config") {
      options.configPath = args[index + 1];
      index += 1;
    } else if (arg.startsWith("--config=")) {
      options.configPath = arg.slice("--config=".length);
    } else if (!arg.startsWith("-") && !options.filePath) {
      options.filePath = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`security-intake

Usage:
  security-intake <report.md> [--json] [--config <path>] [--no-fail]

Exit codes:
  ${EXIT_CODES.ready_for_maintainer_review} ready_for_maintainer_review
  ${EXIT_CODES.needs_more_evidence} needs_more_evidence
  ${EXIT_CODES.likely_low_quality_or_ai_generated} likely_low_quality_or_ai_generated

Options:
  --json        Print JSON instead of Markdown
  --config      Read .json, .yml, or .yaml config
  --no-fail     Always exit 0 after printing the result
`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
