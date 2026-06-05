import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { analyzeReport } from "../src/rules.js";

test("marks complete reports as ready for maintainer review", async () => {
  const text = await fs.readFile(new URL("../examples/good-report.md", import.meta.url), "utf8");
  const result = analyzeReport(text);

  assert.equal(result.decision, "ready_for_maintainer_review");
  assert.ok(result.score >= 70);
  assert.deepEqual(result.missing, []);
});

test("marks vague AI-style reports as low quality", async () => {
  const text = await fs.readFile(new URL("../examples/ai-slop-report.md", import.meta.url), "utf8");
  const result = analyzeReport(text);

  assert.equal(result.decision, "likely_low_quality_or_ai_generated");
  assert.ok(result.score < 45);
  assert.ok(result.missing.includes("Reproduction steps"));
  assert.ok(result.lowQualitySignals.length >= 3);
});
