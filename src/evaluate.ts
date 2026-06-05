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

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function runEvaluation(casesPath = path.join(repoRoot, "fixtures/evaluation-cases.json")): Promise<EvaluationResult[]> {
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
      [
        tableValue(result.case.id),
        tableValue(result.case.expectedDecision),
        tableValue(result.analysis.decision),
        String(result.analysis.score),
        result.failures.length === 0 ? "pass" : tableValue(result.failures.join("; ")),
      ].join(" | ")
    ),
    "",
  ];

  return `${lines.join("\n")}\n`;
}

function tableValue(value: string): string {
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
