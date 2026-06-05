#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeReport, type AnalysisResult, type Decision } from "./rules.js";

export interface EvaluationCase {
  id: string;
  reportPath: string;
  description: string;
  expectedDecision: Decision;
  expectedPresent?: string[];
  expectedMissing?: string[];
  expectedLowQualitySignals?: string[];
  protects: string;
}

interface EvaluationResult {
  case: EvaluationCase;
  analysis: AnalysisResult;
  failures: string[];
}

interface EvaluationCliOptions {
  casesPath: string;
  outputPath?: string;
  checkOutputPath?: string;
  report: EvaluationReport;
}

interface ProfileSummary {
  profile: ProfileName;
  cases: number;
  ready: number;
  needsEvidence: number;
  lowQuality: number;
}

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultCasesPath = path.join(repoRoot, "fixtures/evaluation-cases.json");
const profileOrder = [
  "Core synthetic corpus",
  "Expo-style",
  "Flutter-style",
  "Node.js-style",
  "Kubernetes-style",
  "pnpm-style",
  "Homebrew-style",
  "Rust-style",
  "Public advisory-style",
] as const;

type ProfileName = (typeof profileOrder)[number];
type EvaluationReport = "benchmark" | "oss-trial";

export async function runEvaluation(casesPath = defaultCasesPath): Promise<EvaluationResult[]> {
  const cases = await readCases(casesPath);
  const root = path.resolve(path.dirname(casesPath), "..");
  const results: EvaluationResult[] = [];

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

function evaluateCase(evaluationCase: EvaluationCase, analysis: AnalysisResult): string[] {
  const failures: string[] = [];

  if (analysis.decision !== evaluationCase.expectedDecision) {
    failures.push(`expected decision ${evaluationCase.expectedDecision}, got ${analysis.decision}`);
  }

  failures.push(...missingExpectedIds("present", evaluationCase.expectedPresent, analysis.present.map((finding) => finding.id)));
  failures.push(...missingExpectedIds("missing", evaluationCase.expectedMissing, analysis.missing.map((finding) => finding.id)));
  failures.push(
    ...missingExpectedIds(
      "low-quality signal",
      evaluationCase.expectedLowQualitySignals,
      analysis.lowQualitySignals.map((finding) => finding.id)
    )
  );

  return failures;
}

function missingExpectedIds(label: string, expected: string[] | undefined, actual: string[]): string[] {
  if (!expected) return [];
  const actualSet = new Set(actual);
  return expected.filter((id) => !actualSet.has(id)).map((id) => `expected ${label} ${id}`);
}

async function readCases(casesPath: string): Promise<EvaluationCase[]> {
  const parsed = JSON.parse(await fs.readFile(casesPath, "utf8")) as EvaluationCase[];
  return parsed;
}

function render(results: EvaluationResult[]): string {
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
    ...results.map((result) =>
      tableRow([
        tableValue(result.case.id),
        tableValue(result.case.expectedDecision),
        tableValue(result.analysis.decision),
        String(result.analysis.score),
        result.failures.length === 0 ? "pass" : tableValue(result.failures.join("; ")),
      ])
    ),
    "",
  ];

  return `${lines.join("\n")}\n`;
}

function renderBenchmarkResults(results: EvaluationResult[]): string {
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
    ...summaries.map((summary) =>
      tableRow([
        tableValue(summary.profile),
        String(summary.cases),
        String(summary.ready),
        String(summary.needsEvidence),
        String(summary.lowQuality),
      ])
    ),
    "",
    "## Cases",
    "",
    "| Profile | Case | Expected | Actual | Score | Result | What this tests |",
    "| --- | --- | --- | --- | ---: | --- | --- |",
    ...results.map((result) =>
      tableRow([
        tableValue(profileFor(result.case.reportPath)),
        formatCaseLink(result.case),
        tableValue(decisionLabel(result.case.expectedDecision)),
        tableValue(decisionLabel(result.analysis.decision)),
        String(result.analysis.score),
        result.failures.length === 0 ? "Pass" : tableValue(`Fail: ${result.failures.join("; ")}`),
        tableValue(result.case.protects),
      ])
    ),
    "",
    "## Safety Notes",
    "",
    "- Benchmark profiles are synthetic style fixtures, not upstream project reports.",
    "- Do not open upstream issues based on these fixtures.",
    "- Use the results to critique `security-intake` decisions, not Expo, Flutter, Node.js, Kubernetes, pnpm, Homebrew, Rust, GitHub Security Lab, Rails, Next.js, Grafana, RustSec, curl, or their maintainers.",
    "- `ready_for_maintainer_review` means evidence readiness, not vulnerability truth.",
    "",
  ];

  return `${lines.join("\n")}\n`;
}

function renderOssTrialResults(results: EvaluationResult[]): string {
  const ossResults = results.filter(isOssStyleResult);
  if (ossResults.length === 0) {
    throw new Error("OSS trial report has no OSS-style cases.");
  }

  const passed = ossResults.filter((result) => result.failures.length === 0).length;
  const failed = ossResults.length - passed;
  const summaries = summarizeByProfile(ossResults).filter((summary) => summary.cases > 0);
  const ready = ossResults.filter((result) => result.analysis.decision === "ready_for_maintainer_review").length;
  const needsEvidence = ossResults.filter((result) => result.analysis.decision === "needs_more_evidence").length;
  const lowQuality = ossResults.filter((result) => result.analysis.decision === "likely_low_quality_or_ai_generated").length;
  const lines = [
    "# OSS Triage Trial Results",
    "",
    "Generated from `fixtures/evaluation-cases.json` by `npm run oss-trial:results`.",
    "",
    "This is the focused pre-outreach trial set for real-world-style maintainer workflows. The cases are synthetic `*-style` fixtures, not copied upstream reports, and they test report-quality classification only.",
    "",
    "## Summary",
    "",
    `- Cases: ${ossResults.length}`,
    `- Passed: ${passed}`,
    `- Failed: ${failed}`,
    `- Ready for maintainer review: ${ready}`,
    `- Needs more evidence: ${needsEvidence}`,
    `- Likely low quality / AI-generated: ${lowQuality}`,
    "",
    "## What This Tests",
    "",
    "- Evidence-complete reports should reach a human maintainer instead of being blocked by automation.",
    "- Salvageable reports should get a specific evidence request instead of being dismissed as junk.",
    "- Generic scanner dumps and untested AI-style claims should be routed away from direct maintainer triage.",
    "- Policy-boundary cases should remain evidence decisions; the tool should not decide final project scope or vulnerability truth.",
    "",
    "## Profile Summary",
    "",
    "| Profile | Cases | Ready | Needs evidence | Low quality |",
    "| --- | ---: | ---: | ---: | ---: |",
    ...summaries.map((summary) =>
      tableRow([
        tableValue(summary.profile),
        String(summary.cases),
        String(summary.ready),
        String(summary.needsEvidence),
        String(summary.lowQuality),
      ])
    ),
    "",
    "## Cases",
    "",
    "| Profile | Case | Manual expectation | Actual | Score | Result | Triage value |",
    "| --- | --- | --- | --- | ---: | --- | --- |",
    ...ossResults.map((result) =>
      tableRow([
        tableValue(profileFor(result.case.reportPath)),
        formatCaseLink(result.case),
        tableValue(decisionLabel(result.case.expectedDecision)),
        tableValue(decisionLabel(result.analysis.decision)),
        String(result.analysis.score),
        result.failures.length === 0 ? "Pass" : tableValue(`Fail: ${result.failures.join("; ")}`),
        tableValue(result.case.protects),
      ])
    ),
    "",
    "## How To Reproduce",
    "",
    "```bash",
    "npm run oss-trial:results",
    "npm run check:oss-trial-results",
    "node dist/cli.js benchmarks/expo-style/vague-ai-mobile-claim.md --no-fail",
    "node dist/cli.js benchmarks/nodejs-style/complete-http-parser-dos.md --no-fail",
    "```",
    "",
    "## What This Does Not Prove",
    "",
    "- It does not prove any upstream project is vulnerable.",
    "- It does not validate exploitability or patch correctness.",
    "- It does not replace maintainer judgment, security policy, or project scope decisions.",
    "- It does not prove private reports will classify perfectly; real maintainer feedback is still required.",
    "",
  ];

  return `${lines.join("\n")}\n`;
}

function summarizeByProfile(results: EvaluationResult[]): ProfileSummary[] {
  const summaries = new Map<ProfileName, ProfileSummary>();
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
    if (result.analysis.decision === "ready_for_maintainer_review") summary.ready += 1;
    if (result.analysis.decision === "needs_more_evidence") summary.needsEvidence += 1;
    if (result.analysis.decision === "likely_low_quality_or_ai_generated") summary.lowQuality += 1;
  }

  return profileOrder.map((profile) => summaries.get(profile)!);
}

function profileFor(reportPath: string): ProfileName {
  if (reportPath.startsWith("benchmarks/expo-style/")) return "Expo-style";
  if (reportPath.startsWith("benchmarks/flutter-style/")) return "Flutter-style";
  if (reportPath.startsWith("benchmarks/nodejs-style/")) return "Node.js-style";
  if (reportPath.startsWith("benchmarks/kubernetes-style/")) return "Kubernetes-style";
  if (reportPath.startsWith("benchmarks/pnpm-style/")) return "pnpm-style";
  if (reportPath.startsWith("benchmarks/homebrew-style/")) return "Homebrew-style";
  if (reportPath.startsWith("benchmarks/rust-style/")) return "Rust-style";
  if (reportPath.startsWith("benchmarks/public-advisory-style/")) return "Public advisory-style";
  return "Core synthetic corpus";
}

function isOssStyleResult(result: EvaluationResult): boolean {
  return profileFor(result.case.reportPath) !== "Core synthetic corpus";
}

function renderReport(results: EvaluationResult[], report: EvaluationReport): string {
  if (report === "oss-trial") return renderOssTrialResults(results);
  return renderBenchmarkResults(results);
}

function resultsForReport(results: EvaluationResult[], report: EvaluationReport): EvaluationResult[] {
  if (report === "oss-trial") return results.filter(isOssStyleResult);
  return results;
}

function decisionLabel(decision: Decision): string {
  if (decision === "ready_for_maintainer_review") return "Ready for maintainer review";
  if (decision === "needs_more_evidence") return "Needs more evidence";
  return "Likely low quality / AI-generated";
}

function formatCaseLink(evaluationCase: EvaluationCase): string {
  return `[${tableValue(evaluationCase.id)}](../${evaluationCase.reportPath})`;
}

function tableRow(values: string[]): string {
  return `| ${values.join(" | ")} |`;
}

function tableValue(value: string): string {
  return value.replaceAll("|", "\\|").replace(/\r?\n/g, " ");
}

function parseArgs(args: string[]): EvaluationCliOptions {
  const options: EvaluationCliOptions = { casesPath: defaultCasesPath, report: "benchmark" };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg) {
      continue;
    }

    if (arg === "--cases") {
      const value = readOptionValue(args, index, arg);
      options.casesPath = path.resolve(process.cwd(), value);
      index += 1;
    } else if (arg === "--output") {
      const value = readOptionValue(args, index, arg);
      options.outputPath = path.resolve(process.cwd(), value);
      index += 1;
    } else if (arg === "--check-output") {
      const value = readOptionValue(args, index, arg);
      options.checkOutputPath = path.resolve(process.cwd(), value);
      index += 1;
    } else if (arg === "--report") {
      const value = readOptionValue(args, index, arg);
      options.report = parseReport(value);
      index += 1;
    } else if (arg.startsWith("--report=")) {
      options.report = parseReport(arg.slice("--report=".length));
    } else {
      throw new Error(`Unknown option: ${String(arg)}`);
    }
  }

  if (options.outputPath && options.checkOutputPath) {
    throw new Error("Use either --output or --check-output, not both.");
  }

  return options;
}

function parseReport(value: string): EvaluationReport {
  if (value === "benchmark" || value === "oss-trial") return value;
  throw new Error(`Unsupported report: ${value}. Use benchmark or oss-trial.`);
}

function readOptionValue(args: string[], index: number, optionName: string): string {
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${optionName} requires a path value.`);
  }
  return value;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const results = await runEvaluation(options.casesPath);
  const reportResults = resultsForReport(results, options.report);
  const hasFailures = reportResults.some((result) => result.failures.length > 0);

  if (options.outputPath) {
    await fs.mkdir(path.dirname(options.outputPath), { recursive: true });
    await fs.writeFile(options.outputPath, renderReport(results, options.report));
    process.stdout.write(`Wrote ${path.relative(repoRoot, options.outputPath)}\n`);
  } else if (options.checkOutputPath) {
    const expectedOutput = renderReport(results, options.report);
    let existingOutput = "";
    try {
      existingOutput = await fs.readFile(options.checkOutputPath, "utf8");
    } catch (error) {
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
  } else {
    process.stdout.write(render(reportResults));
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
