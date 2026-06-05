import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { runAction } from "../src/action.js";
import { analyzeReport } from "../src/rules.js";
import { loadConfig } from "../src/config.js";

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

test("action runner writes result file and GitHub outputs", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "security-intake-action-"));
  const reportPath = path.join(tempDir, "report.md");
  const outputPath = path.join(tempDir, "result.json");
  const githubOutput = path.join(tempDir, "github-output");
  await fs.writeFile(reportPath, await fixture("ai-slop-report.md"));

  const writes = [];
  const action = await runAction(
    {
      INPUT_REPORT_PATH: reportPath,
      INPUT_FORMAT: "json",
      INPUT_OUTPUT_PATH: outputPath,
      INPUT_FAIL_ON_LOW_QUALITY: "false",
      GITHUB_OUTPUT: githubOutput,
    },
    tempDir,
    { write: (text) => writes.push(text) }
  );

  assert.equal(action.result.decision, "likely_low_quality_or_ai_generated");
  assert.equal(action.processExitCode, 0);
  assert.match(await fs.readFile(outputPath, "utf8"), /likely_low_quality_or_ai_generated/);
  assert.match(await fs.readFile(githubOutput, "utf8"), /decision=likely_low_quality_or_ai_generated/);
  assert.equal(writes.length, 1);
});

async function fixture(name) {
  return fs.readFile(new URL(`../examples/${name}`, import.meta.url), "utf8");
}
