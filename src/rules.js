export const REQUIRED_EVIDENCE_RULES = [
  {
    id: "RP001_AFFECTED_VERSION",
    category: "required_evidence",
    label: "Affected version or commit",
    weight: 16,
    severity: "high",
    why: "Maintainers need a concrete release, tag, or commit before they can reproduce or scope a report.",
    patterns: [/\bversion\b/i, /\bcommit\b/i, /\bsha\b/i, /\brelease\b/i, /\btag\b/i],
  },
  {
    id: "RP002_AFFECTED_COMPONENT",
    category: "required_evidence",
    label: "Affected component, endpoint, package, or file",
    weight: 14,
    severity: "high",
    why: "A report should name the component or code path that is allegedly vulnerable.",
    patterns: [/\bcomponent\b/i, /\bendpoint\b/i, /\broute\b/i, /\bpackage\b/i, /\bfile\b/i, /\bmodule\b/i],
  },
  {
    id: "RP003_REPRODUCTION_STEPS",
    category: "required_evidence",
    label: "Reproduction steps",
    weight: 18,
    severity: "high",
    why: "A maintainer should not have to reverse-engineer the claimed exploit path from a vague narrative.",
    patterns: [/\brepro/i, /\breproduce/i, /\bsteps?\b/i, /\bcommand\b/i, /\brequest\b/i, /\bcurl\b/i],
  },
  {
    id: "RP004_OBSERVED_RESULT",
    category: "required_evidence",
    label: "Observed result",
    weight: 12,
    severity: "medium",
    why: "The report should describe what actually happened, not only what might happen.",
    patterns: [/\bobserved\b/i, /\bactual\b/i, /\bresult\b/i, /\bresponse\b/i, /\berror\b/i, /\blog\b/i],
  },
  {
    id: "RP005_SECURITY_IMPACT",
    category: "required_evidence",
    label: "Concrete security impact",
    weight: 18,
    severity: "high",
    why: "Maintainers need to understand the attacker capability or user/data impact.",
    patterns: [/\bimpact\b/i, /\battacker\b/i, /\bexploit/i, /\bprivilege\b/i, /\baccess\b/i, /\bdata\b/i, /\baccount\b/i],
  },
  {
    id: "RP006_PROOF_OR_EVIDENCE",
    category: "required_evidence",
    label: "Proof of concept or observable evidence",
    weight: 14,
    severity: "high",
    why: "Evidence such as a PoC, log, trace, payload, screenshot, or failing test makes the report independently checkable.",
    patterns: [/\bpoc\b/i, /\bproof\b/i, /\bscreenshot\b/i, /\blog\b/i, /\btrace\b/i, /\bfailing test\b/i, /\bregression test\b/i, /\bpayload\b/i],
  },
  {
    id: "RP007_TESTED_ENVIRONMENT",
    category: "required_evidence",
    label: "Tested environment",
    weight: 8,
    severity: "medium",
    why: "Environment details help maintainers distinguish project bugs from local setup or dependency issues.",
    patterns: [/\benvironment\b/i, /\bos\b/i, /\bbrowser\b/i, /\bnode\b/i, /\bpython\b/i, /\bdocker\b/i],
  },
];

export const LOW_QUALITY_RULES = [
  {
    id: "RP101_SPECULATIVE_IMPACT",
    category: "low_quality_signal",
    label: "Speculative impact language",
    severity: "medium",
    why: "Speculative language is not automatically wrong, but it should be paired with concrete evidence.",
    pattern: /\b(may|might|could|possibly|potentially|likely)\b.{0,80}\b(vulnerab|exploit|impact|allow|lead to)\b/i,
  },
  {
    id: "RP102_UNTESTED_CLAIM",
    category: "low_quality_signal",
    label: "Admits the finding was not tested",
    severity: "high",
    why: "Untested claims push validation cost to maintainers.",
    pattern: /\b(not tested|did not test|unable to verify|theoretically|looks like)\b/i,
  },
  {
    id: "RP103_GENERIC_SCANNER_DUMP",
    category: "low_quality_signal",
    label: "Generic scanner or template language",
    severity: "medium",
    why: "Scanner dumps often need project-specific reachability and exploitability evidence before triage.",
    pattern: /\b(scanner|automated tool|template|generic|best practice|industry standard)\b/i,
  },
  {
    id: "RP104_NO_CONCRETE_TARGET",
    category: "low_quality_signal",
    label: "No concrete target is named",
    severity: "high",
    why: "Reports that only say 'your application' or 'the system' rarely give maintainers enough to inspect.",
    pattern: /\b(your application|your software|the system|the project)\b/i,
  },
  {
    id: "RP105_AI_GENERATED_DISCLOSURE",
    category: "low_quality_signal",
    label: "Mentions AI-generated analysis",
    severity: "low",
    why: "AI assistance is not disqualifying, but AI-generated claims should still meet the same evidence bar.",
    pattern: /\b(ai|llm|chatgpt|language model|generated analysis)\b/i,
  },
];

const DEFAULT_ANALYSIS_CONFIG = Object.freeze({
  minReadyScore: 70,
  maxMissingForReady: 2,
  lowQualitySignalsForLikely: 3,
  missingForLikelyLowQuality: 3,
  penaltyPerLowQualitySignal: 8,
  maxPenalty: 30,
  disabledRules: [],
});

export const EXIT_CODES = {
  ready_for_maintainer_review: 0,
  needs_more_evidence: 1,
  likely_low_quality_or_ai_generated: 2,
};

export function allRules() {
  return [...REQUIRED_EVIDENCE_RULES, ...LOW_QUALITY_RULES];
}

export function analyzeReport(text, config = {}) {
  const effectiveConfig = { ...DEFAULT_ANALYSIS_CONFIG, ...config };
  const normalizedText = text.trim();
  const disabledRules = new Set(effectiveConfig.disabledRules || []);
  const requiredRules = REQUIRED_EVIDENCE_RULES.filter((rule) => !disabledRules.has(rule.id));
  const lowQualityRules = LOW_QUALITY_RULES.filter((rule) => !disabledRules.has(rule.id));

  const present = [];
  const missing = [];

  for (const rule of requiredRules) {
    if (hasRequiredEvidence(normalizedText, rule)) {
      present.push(rule);
    } else {
      missing.push(rule);
    }
  }

  const lowQualitySignals = lowQualityRules.filter((rule) => rule.pattern.test(normalizedText));
  const evidenceScore = present.reduce((total, rule) => total + rule.weight, 0);
  const penalty = Math.min(effectiveConfig.maxPenalty, lowQualitySignals.length * effectiveConfig.penaltyPerLowQualitySignal);
  const score = Math.max(0, Math.min(100, evidenceScore - penalty));
  const decision = decide({ score, missing, lowQualitySignals, config: effectiveConfig });

  return {
    decision,
    exitCode: EXIT_CODES[decision],
    score,
    present: present.map(toFinding),
    missing: missing.map(toFinding),
    lowQualitySignals: lowQualitySignals.map(toFinding),
    suggestedResponse: buildSuggestedResponse(missing, lowQualitySignals),
    stats: {
      lines: splitLines(text).length,
      characters: normalizedText.length,
    },
    config: {
      minReadyScore: effectiveConfig.minReadyScore,
      maxMissingForReady: effectiveConfig.maxMissingForReady,
      lowQualitySignalsForLikely: effectiveConfig.lowQualitySignalsForLikely,
      missingForLikelyLowQuality: effectiveConfig.missingForLikelyLowQuality,
      disabledRules: [...disabledRules],
    },
  };
}

function decide({ score, missing, lowQualitySignals, config }) {
  if (
    lowQualitySignals.length >= config.lowQualitySignalsForLikely &&
    missing.length >= config.missingForLikelyLowQuality
  ) {
    return "likely_low_quality_or_ai_generated";
  }

  if (score < config.minReadyScore || missing.length > config.maxMissingForReady) {
    return "needs_more_evidence";
  }

  return "ready_for_maintainer_review";
}

function hasRequiredEvidence(text, rule) {
  return rule.patterns.some((pattern) => pattern.test(text));
}

function splitLines(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function toFinding(rule) {
  return {
    id: rule.id,
    category: rule.category,
    label: rule.label,
    severity: rule.severity,
    why: rule.why,
  };
}

function buildSuggestedResponse(missing, lowQualitySignals) {
  if (missing.length === 0 && lowQualitySignals.length === 0) {
    return "Thanks for the report. It includes enough initial evidence for maintainer review. We will validate the claim and follow up through the security process.";
  }

  const missingText = missing.map((rule) => `- ${rule.id}: ${rule.label}`).join("\n");
  const qualityText = lowQualitySignals.length
    ? `\n\nThe report also contains low-confidence signals:\n${lowQualitySignals.map((rule) => `- ${rule.id}: ${rule.label}`).join("\n")}`
    : "";

  return `Thanks for the report. We cannot assess this as a vulnerability without the following evidence:\n${missingText}${qualityText}\n\nPlease resubmit with concrete affected versions, reproduction steps, observed behavior, and security impact.`;
}

export function toMarkdown(result) {
  const lines = [
    "# Security Intake Result",
    "",
    `Decision: ${result.decision}`,
    `Exit code: ${result.exitCode}`,
    `Score: ${result.score}/100`,
    "",
    "## Present Evidence",
    ...listFindings(result.present),
    "",
    "## Missing Evidence",
    ...listFindings(result.missing),
    "",
    "## Low-Quality Signals",
    ...listFindings(result.lowQualitySignals),
    "",
    "## Suggested Maintainer Response",
    result.suggestedResponse,
    "",
  ];

  return lines.join("\n");
}

function listFindings(items) {
  if (items.length === 0) return ["- None"];
  return items.map((item) => `- ${item.id}: ${item.label} (${item.severity})`);
}
