#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeReport } from "./rules.js";
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultCasesPath = path.join(repoRoot, "fixtures/evaluation-cases.json");
const profileOrder = ["Core synthetic corpus", "Expo-style", "Flutter-style", "Node.js-style"];
export async function runEvaluation(casesPath = defaultCasesPath) {
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
        ...results.map((result) => tableRow([
            tableValue(result.case.id),
            tableValue(result.case.expectedDecision),
            tableValue(result.analysis.decision),
            String(result.analysis.score),
            result.failures.length === 0 ? "pass" : tableValue(result.failures.join("; ")),
        ])),
        "",
    ];
    return `${lines.join("\n")}\n`;
}
function renderBenchmarkResults(results) {
    const passed = results.filter((result) => result.failures.length === 0).length;
    const failed = results.length - passed;
    const summaries = summarizeByProfile(results);
    const lines = [
        "# Benchmark Results",
        "",
        "Generated from `fixtures/evaluation-cases.json` by `npm run benchmark:results`.",
        "",
        "These results test report-quality classification only. They do not claim that any benchmarked project has a vulnerability, and they do not decide vulnerability truth.",
        "",
        "## Summary",
        "",
        `- Cases: ${results.length}`,
        `- Passed: ${passed}`,
        `- Failed: ${failed}`,
        "",
        "| Profile | Cases | Ready | Needs evidence | Low quality |",
        "| --- | ---: | ---: | ---: | ---: |",
        ...summaries.map((summary) => tableRow([
            tableValue(summary.profile),
            String(summary.cases),
            String(summary.ready),
            String(summary.needsEvidence),
            String(summary.lowQuality),
        ])),
        "",
        "## Cases",
        "",
        "| Profile | Case | Expected | Actual | Score | Result | What this tests |",
        "| --- | --- | --- | --- | ---: | --- | --- |",
        ...results.map((result) => tableRow([
            tableValue(profileFor(result.case.reportPath)),
            formatCaseLink(result.case),
            tableValue(decisionLabel(result.case.expectedDecision)),
            tableValue(decisionLabel(result.analysis.decision)),
            String(result.analysis.score),
            result.failures.length === 0 ? "Pass" : tableValue(`Fail: ${result.failures.join("; ")}`),
            tableValue(result.case.protects),
        ])),
        "",
        "## Safety Notes",
        "",
        "- Benchmark profiles are synthetic style fixtures, not upstream project reports.",
        "- Do not open upstream issues based on these fixtures.",
        "- Use the results to critique `security-intake` decisions, not Expo, Flutter, Node.js, or their maintainers.",
        "- `ready_for_maintainer_review` means evidence readiness, not vulnerability truth.",
        "",
    ];
    return `${lines.join("\n")}\n`;
}
function summarizeByProfile(results) {
    const summaries = new Map();
    for (const profile of profileOrder) {
        summaries.set(profile, { profile, cases: 0, ready: 0, needsEvidence: 0, lowQuality: 0 });
    }
    for (const result of results) {
        const profile = profileFor(result.case.reportPath);
        const summary = summaries.get(profile);
        if (!summary) {
            throw new Error(`Unknown benchmark profile: ${profile}`);
        }
        summary.cases += 1;
        if (result.analysis.decision === "ready_for_maintainer_review")
            summary.ready += 1;
        if (result.analysis.decision === "needs_more_evidence")
            summary.needsEvidence += 1;
        if (result.analysis.decision === "likely_low_quality_or_ai_generated")
            summary.lowQuality += 1;
    }
    return profileOrder.map((profile) => summaries.get(profile));
}
function profileFor(reportPath) {
    if (reportPath.startsWith("benchmarks/expo-style/"))
        return "Expo-style";
    if (reportPath.startsWith("benchmarks/flutter-style/"))
        return "Flutter-style";
    if (reportPath.startsWith("benchmarks/nodejs-style/"))
        return "Node.js-style";
    return "Core synthetic corpus";
}
function decisionLabel(decision) {
    if (decision === "ready_for_maintainer_review")
        return "Ready for maintainer review";
    if (decision === "needs_more_evidence")
        return "Needs more evidence";
    return "Likely low quality / AI-generated";
}
function formatCaseLink(evaluationCase) {
    return `[${tableValue(evaluationCase.id)}](../${evaluationCase.reportPath})`;
}
function tableRow(values) {
    return `| ${values.join(" | ")} |`;
}
function tableValue(value) {
    return value.replaceAll("|", "\\|").replace(/\r?\n/g, " ");
}
function parseArgs(args) {
    const options = { casesPath: defaultCasesPath };
    for (let index = 0; index < args.length; index += 1) {
        const arg = args[index];
        if (arg === "--cases") {
            const value = readOptionValue(args, index, arg);
            options.casesPath = path.resolve(process.cwd(), value);
            index += 1;
        }
        else if (arg === "--output") {
            const value = readOptionValue(args, index, arg);
            options.outputPath = path.resolve(process.cwd(), value);
            index += 1;
        }
        else if (arg === "--check-output") {
            const value = readOptionValue(args, index, arg);
            options.checkOutputPath = path.resolve(process.cwd(), value);
            index += 1;
        }
        else {
            throw new Error(`Unknown option: ${String(arg)}`);
        }
    }
    if (options.outputPath && options.checkOutputPath) {
        throw new Error("Use either --output or --check-output, not both.");
    }
    return options;
}
function readOptionValue(args, index, optionName) {
    const value = args[index + 1];
    if (!value || value.startsWith("--")) {
        throw new Error(`${optionName} requires a path value.`);
    }
    return value;
}
async function main() {
    const options = parseArgs(process.argv.slice(2));
    const results = await runEvaluation(options.casesPath);
    const hasFailures = results.some((result) => result.failures.length > 0);
    if (options.outputPath) {
        await fs.mkdir(path.dirname(options.outputPath), { recursive: true });
        await fs.writeFile(options.outputPath, renderBenchmarkResults(results));
        process.stdout.write(`Wrote ${path.relative(repoRoot, options.outputPath)}\n`);
    }
    else if (options.checkOutputPath) {
        const expectedOutput = renderBenchmarkResults(results);
        let existingOutput = "";
        try {
            existingOutput = await fs.readFile(options.checkOutputPath, "utf8");
        }
        catch (error) {
            if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) {
                throw error;
            }
        }
        if (existingOutput !== expectedOutput) {
            console.error(`${path.relative(repoRoot, options.checkOutputPath)} is out of date. Run npm run benchmark:results.`);
            process.exitCode = 1;
            return;
        }
        process.stdout.write(`${path.relative(repoRoot, options.checkOutputPath)} is up to date.\n`);
    }
    else {
        process.stdout.write(render(results));
    }
    if (hasFailures) {
        process.exitCode = 1;
    }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main().catch((error) => {
        console.error(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
    });
}
//# sourceMappingURL=evaluate.js.map