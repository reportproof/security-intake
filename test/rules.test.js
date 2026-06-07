import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { runAction } from "../dist/action.js";
import { analyzeReport } from "../dist/rules.js";
import { loadConfig } from "../dist/config.js";

test("marks complete reports as ready for maintainer review", async () => {
  const text = await fixture("good-report.md");
  const result = analyzeReport(text);

  assert.equal(result.decision, "ready_for_maintainer_review");
  assert.equal(result.exitCode, 0);
  assert.ok(result.score >= 70);
  assert.deepEqual(result.missing, []);
  assert.ok(result.present.some((rule) => rule.id === "RP003_REPRODUCTION_STEPS"));
});

test("marks vague AI-style reports as low quality", async () => {
  const text = await fixture("ai-slop-report.md");
  const result = analyzeReport(text);

  assert.equal(result.decision, "likely_low_quality_or_ai_generated");
  assert.equal(result.exitCode, 2);
  assert.ok(result.score < 45);
  assert.ok(result.missing.some((rule) => rule.id === "RP003_REPRODUCTION_STEPS"));
  assert.ok(result.lowQualitySignals.some((rule) => rule.id === "RP102_UNTESTED_CLAIM"));
  assert.ok(result.lowQualitySignals.length >= 3);
});

test("does not count headings and unknown placeholders as evidence", () => {
  const result = analyzeReport([
    "# Security report template",
    "",
    "## Affected version",
    "Version: unknown",
    "",
    "## Affected component",
    "Component: TBD",
    "",
    "## Reproduction steps",
    "Steps: not provided",
    "",
    "## Observed result",
    "Observed result: not available",
    "",
    "## Security impact",
    "Impact: unknown",
    "",
    "## Proof of concept",
    "PoC: N/A",
    "",
    "## Environment",
    "Environment: not sure",
  ].join("\n"));

  assert.equal(result.decision, "needs_more_evidence");
  assert.equal(result.score, 0);
  assert.deepEqual(
    result.missing.map((rule) => rule.id),
    [
      "RP001_AFFECTED_VERSION",
      "RP002_AFFECTED_COMPONENT",
      "RP003_REPRODUCTION_STEPS",
      "RP004_OBSERVED_RESULT",
      "RP005_SECURITY_IMPACT",
      "RP006_PROOF_OR_EVIDENCE",
      "RP007_TESTED_ENVIRONMENT",
    ]
  );
});

test("suggested response includes specific evidence requests", () => {
  const result = analyzeReport("Version 1.0.0\nEndpoint /api/session\nNode 24");

  assert.match(result.suggestedResponse, /provide the exact steps, request, command, or minimal example/i);
  assert.match(result.suggestedResponse, /explain the attacker capability/i);
});

test("loads simple YAML config and disables selected rules", async () => {
  const config = await loadConfig(".security-intake.yml", new URL("..", import.meta.url).pathname);
  assert.equal(config.minReadyScore, 70);
  assert.deepEqual(config.disabledRules, []);

  const text = await fixture("ai-slop-report.md");
  const result = analyzeReport(text, {
    ...config,
    disabledRules: ["RP105_AI_GENERATED_DISCLOSURE"],
  });

  assert.equal(result.config.disabledRules[0], "RP105_AI_GENERATED_DISCLOSURE");
  assert.equal(
    result.lowQualitySignals.some((rule) => rule.id === "RP105_AI_GENERATED_DISCLOSURE"),
    false
  );
});

test("loads inline YAML arrays and strips comments", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "security-intake-config-"));
  await fs.writeFile(
    path.join(tempDir, ".security-intake.yml"),
    [
      "minReadyScore: 60 # local policy",
      "disabledRules: [RP105_AI_GENERATED_DISCLOSURE, RP103_GENERIC_SCANNER_DUMP]",
      "",
    ].join("\n")
  );

  const config = await loadConfig(null, tempDir);

  assert.equal(config.minReadyScore, 60);
  assert.deepEqual(config.disabledRules, ["RP105_AI_GENERATED_DISCLOSURE", "RP103_GENERIC_SCANNER_DUMP"]);
});

test("rejects invalid config keys, ranges, and disabled rules", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "security-intake-invalid-config-"));

  await fs.writeFile(path.join(tempDir, ".security-intake.yml"), "minReadinessScore: 60\n");
  await assert.rejects(() => loadConfig(null, tempDir), /Unknown config key: minReadinessScore/);

  await fs.writeFile(path.join(tempDir, ".security-intake.yml"), "minReadyScore: 101\n");
  await assert.rejects(() => loadConfig(null, tempDir), /minReadyScore must be between 0 and 100/);

  await fs.writeFile(path.join(tempDir, ".security-intake.yml"), "disabledRules: [RP999_NOT_A_RULE]\n");
  await assert.rejects(() => loadConfig(null, tempDir), /Unknown disabled rule: RP999_NOT_A_RULE/);
});

test("action runner writes result file and GitHub outputs", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "security-intake-action-"));
  const reportPath = path.join(tempDir, "report.md");
  const outputPath = path.join(tempDir, "result.json");
  const githubOutput = path.join(tempDir, "github-output");
  const githubStepSummary = path.join(tempDir, "github-step-summary");
  await fs.writeFile(reportPath, await fixture("ai-slop-report.md"));

  const writes = [];
  const action = await runAction(
    {
      "INPUT_REPORT-PATH": reportPath,
      INPUT_FORMAT: "json",
      "INPUT_OUTPUT-PATH": outputPath,
      "INPUT_FAIL-ON-LOW-QUALITY": "false",
      GITHUB_OUTPUT: githubOutput,
      GITHUB_STEP_SUMMARY: githubStepSummary,
    },
    tempDir,
    { write: (text) => writes.push(text) }
  );

  assert.equal(action.result.decision, "likely_low_quality_or_ai_generated");
  assert.equal(action.processExitCode, 0);
  assert.match(await fs.readFile(outputPath, "utf8"), /likely_low_quality_or_ai_generated/);
  assert.match(await fs.readFile(githubOutput, "utf8"), /decision=likely_low_quality_or_ai_generated/);
  assert.match(await fs.readFile(githubStepSummary, "utf8"), /Security Intake Result/);
  assert.match(await fs.readFile(githubStepSummary, "utf8"), /RP003_REPRODUCTION_STEPS/);
  assert.equal(writes.length, 1);
});

test("public evaluation corpus matches expected decisions", async () => {
  const cases = JSON.parse(await fs.readFile(new URL("../fixtures/evaluation-cases.json", import.meta.url), "utf8"));

  for (const evaluationCase of cases) {
    const text = await fs.readFile(new URL(`../${evaluationCase.reportPath}`, import.meta.url), "utf8");
    const result = analyzeReport(text);

    assert.equal(result.decision, evaluationCase.expectedDecision, evaluationCase.id);
    assertExpectedIds(result.present, evaluationCase.expectedPresent, evaluationCase.id);
    assertExpectedIds(result.missing, evaluationCase.expectedMissing, evaluationCase.id);
    assertExpectedIds(result.lowQualitySignals, evaluationCase.expectedLowQualitySignals, evaluationCase.id);
  }
});

async function fixture(name) {
  return fs.readFile(new URL(`../examples/${name}`, import.meta.url), "utf8");
}

function assertExpectedIds(findings, expectedIds, caseId) {
  if (!expectedIds) return;
  const actualIds = new Set(findings.map((finding) => finding.id));
  for (const expectedId of expectedIds) {
    assert.equal(actualIds.has(expectedId), true, `${caseId} should include ${expectedId}`);
  }
}
