#!/usr/bin/env node
import fs from "node:fs/promises";
import { analyzeReport, toMarkdown } from "./rules.js";

async function main() {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const filePath = args.find((arg) => !arg.startsWith("-"));

  if (!filePath) {
    console.error("Usage: security-intake <report.md> [--json]");
    process.exitCode = 1;
    return;
  }

  const text = await fs.readFile(filePath, "utf8");
  const result = analyzeReport(text);

  if (json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(toMarkdown(result));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
