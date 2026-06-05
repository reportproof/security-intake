import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
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

async function fixture(name) {
  return fs.readFile(new URL(`../examples/${name}`, import.meta.url), "utf8");
}
