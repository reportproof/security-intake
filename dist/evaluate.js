#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeReport } from "./rules.js";
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export async function runEvaluation(casesPath = path.join(repoRoot, "fixtures/evaluation-cases.json")) {
    const cases = await readCases(casesPath);
    const root = path.resolve(path.dirname(casesPath), "..");
    const results = [];
    for (const evaluationCase of cases) {
        const text = await fs.readFile(path.resolve(root, evaluationCase.reportPath), "utf8");
        const analysis = analyzeReport(text);
        results.push({
            case: evaluationCase,
            analysis,
            failures: evaluateCase(evaluationCase, analysis),
        });
    }
    return results;
}
function evaluateCase(evaluationCase, analysis) {
    const failures = [];
    if (analysis.decision !== evaluationCase.expectedDecision) {
        failures.push(`expected decision ${evaluationCase.expectedDecision}, got ${analysis.decision}`);
    }
    failures.push(...missingExpectedIds("present", evaluationCase.expectedPresent, analysis.present.map((finding) => finding.id)));
    failures.push(...missingExpectedIds("missing", evaluationCase.expectedMissing, analysis.missing.map((finding) => finding.id)));
    failures.push(...missingExpectedIds("low-quality signal", evaluationCase.expectedLowQualitySignals, analysis.lowQualitySignals.map((finding) => finding.id)));
    return failures;
}
function missingExpectedIds(label, expected, actual) {
    if (!expected)
        return [];
    const actualSet = new Set(actual);
    return expected.filter((id) => !actualSet.has(id)).map((id) => `expected ${label} ${id}`);
}
async function readCases(casesPath) {
    const parsed = JSON.parse(await fs.readFile(casesPath, "utf8"));
    return parsed;
}
function render(results) {
    const passed = results.filter((result) => result.failures.length === 0).length;
    const failed = results.length - passed;
    const lines = [
        "# Security Intake Evaluation",
        "",
        `Cases: ${results.length}`,
        `Passed: ${passed}`,
        `Failed: ${failed}`,
        "",
        "| Case | Expected | Actual | Score | Result |",
        "| --- | --- | --- | ---: | --- |",
        ...results.map((result) => [
            tableValue(result.case.id),
            tableValue(result.case.expectedDecision),
            tableValue(result.analysis.decision),
            String(result.analysis.score),
            result.failures.length === 0 ? "pass" : tableValue(result.failures.join("; ")),
        ].join(" | ")),
        "",
    ];
    return `${lines.join("\n")}\n`;
}
function tableValue(value) {
    return value.replaceAll("|", "\\|").replace(/\r?\n/g, " ");
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    runEvaluation()
        .then((results) => {
        process.stdout.write(render(results));
        if (results.some((result) => result.failures.length > 0)) {
            process.exitCode = 1;
        }
    })
        .catch((error) => {
        console.error(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
    });
}
//# sourceMappingURL=evaluate.js.map