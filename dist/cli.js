#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { loadConfig } from "./config.js";
import { analyzeReport, EXIT_CODES, toMarkdown } from "./rules.js";
async function main() {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
        printHelp();
        return;
    }
    if (!options.filePath) {
        console.error("Usage: security-intake <report.md> [--json] [--config <path>] [--output <path>] [--no-fail]");
        process.exitCode = 1;
        return;
    }
    const config = await loadConfig(options.configPath);
    const text = await fs.readFile(options.filePath, "utf8");
    const result = analyzeReport(text, config);
    const rendered = options.json ? `${JSON.stringify(result, null, 2)}\n` : `${toMarkdown(result)}\n`;
    if (options.outputPath) {
        await fs.mkdir(path.dirname(path.resolve(options.outputPath)), { recursive: true });
        await fs.writeFile(options.outputPath, rendered);
    }
    process.stdout.write(rendered);
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
        outputPath: null,
    };
    for (let index = 0; index < args.length; index += 1) {
        const arg = args[index];
        if (arg === undefined) {
            continue;
        }
        if (arg === "--help" || arg === "-h") {
            options.help = true;
        }
        else if (arg === "--json") {
            options.json = true;
        }
        else if (arg === "--no-fail") {
            options.noFail = true;
        }
        else if (arg === "--config") {
            options.configPath = readOptionValue(args, index, arg);
            index += 1;
        }
        else if (arg.startsWith("--config=")) {
            options.configPath = arg.slice("--config=".length);
        }
        else if (arg === "--output") {
            options.outputPath = readOptionValue(args, index, arg);
            index += 1;
        }
        else if (arg.startsWith("--output=")) {
            options.outputPath = arg.slice("--output=".length);
        }
        else if (!arg.startsWith("-") && !options.filePath) {
            options.filePath = arg;
        }
        else {
            throw new Error(`Unknown argument: ${arg}`);
        }
    }
    return options;
}
function readOptionValue(args, index, optionName) {
    const value = args[index + 1];
    if (!value || value.startsWith("-")) {
        throw new Error(`${optionName} requires a value.`);
    }
    return value;
}
function printHelp() {
    console.log(`security-intake

Usage:
  security-intake <report.md> [--json] [--config <path>] [--output <path>] [--no-fail]

Exit codes:
  ${EXIT_CODES.ready_for_maintainer_review} ready_for_maintainer_review
  ${EXIT_CODES.needs_more_evidence} needs_more_evidence
  ${EXIT_CODES.likely_low_quality_or_ai_generated} likely_low_quality_or_ai_generated

Options:
  --json        Print JSON instead of Markdown
  --config      Read .json, .yml, or .yaml config
  --output      Write the result to a file as well as stdout
  --no-fail     Always exit 0 after printing the result
`);
}
main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
});
//# sourceMappingURL=cli.js.map