#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "./config.js";
import { analyzeReport, toMarkdown } from "./rules.js";
export async function runAction(env = process.env, cwd = process.cwd(), io = defaultIo) {
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
    await writeStepSummary(env.GITHUB_STEP_SUMMARY, result, outputPath);
    return {
        result,
        outputPath: resolvedOutputPath,
        processExitCode: failOnLowQuality ? result.exitCode : 0,
    };
}
function requireActionInput(env, inputId) {
    const value = optionalActionInput(env, inputId);
    if (!value) {
        throw new Error(`Missing required action input: ${inputId}`);
    }
    return value;
}
function optionalActionInput(env, inputId) {
    for (const key of inputEnvKeys(inputId)) {
        const value = optionalEnv(env, key);
        if (value)
            return value;
    }
    return "";
}
function inputEnvKeys(inputId) {
    const upper = inputId.toUpperCase();
    return [`INPUT_${upper}`, `INPUT_${upper.replaceAll("-", "_")}`];
}
function optionalEnv(env, key) {
    const value = env[key];
    return value === undefined ? "" : String(value).trim();
}
function normalizeFormat(value) {
    if (value === "markdown" || value === "json")
        return value;
    throw new Error(`Unsupported format: ${value}. Use markdown or json.`);
}
function parseBoolean(value) {
    if (value === "true")
        return true;
    if (value === "false")
        return false;
    throw new Error(`Boolean input must be true or false, received: ${value}`);
}
async function writeOutputs(outputFile, outputs) {
    if (!outputFile)
        return;
    const lines = Object.entries(outputs).map(([key, value]) => `${key}=${value}`);
    await fs.appendFile(outputFile, `${lines.join("\n")}\n`);
}
async function writeStepSummary(summaryFile, result, outputPath) {
    if (!summaryFile)
        return;
    const summary = [
        "## Security Intake Result",
        "",
        "| Field | Value |",
        "| --- | --- |",
        `| Decision | ${tableValue(result.decision)} |`,
        `| Score | ${result.score}/100 |`,
        `| Exit code | ${result.exitCode} |`,
        `| Present evidence | ${result.present.length} |`,
        `| Missing evidence | ${result.missing.length} |`,
        `| Low-quality signals | ${result.lowQualitySignals.length} |`,
        `| Result file | ${tableValue(outputPath)} |`,
        "",
        result.missing.length ? `Missing evidence: ${result.missing.map((rule) => `\`${rule.id}\``).join(", ")}` : "Missing evidence: none",
        result.lowQualitySignals.length
            ? `Low-quality signals: ${result.lowQualitySignals.map((rule) => `\`${rule.id}\``).join(", ")}`
            : "Low-quality signals: none",
        "",
    ].join("\n");
    await fs.appendFile(summaryFile, summary);
}
function tableValue(value) {
    return value.replaceAll("|", "\\|").replace(/\r?\n/g, " ");
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
//# sourceMappingURL=action.js.map