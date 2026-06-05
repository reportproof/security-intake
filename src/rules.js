const REQUIRED_SIGNALS = [
  {
    id: "affected_version",
    label: "Affected version or commit",
    weight: 16,
    patterns: [
      /\bversion\b/i,
      /\bcommit\b/i,
      /\bsha\b/i,
      /\brelease\b/i,
      /\btag\b/i,
    ],
  },
  {
    id: "affected_component",
    label: "Affected component, endpoint, package, or file",
    weight: 14,
    patterns: [
      /\bcomponent\b/i,
      /\bendpoint\b/i,
      /\broute\b/i,
      /\bpackage\b/i,
      /\bfile\b/i,
      /\bmodule\b/i,
    ],
  },
  {
    id: "reproduction_steps",
    label: "Reproduction steps",
    weight: 18,
    patterns: [
      /\brepro/i,
      /\breproduce/i,
      /\bsteps?\b/i,
      /\bcommand\b/i,
      /\brequest\b/i,
      /\bcurl\b/i,
    ],
  },
  {
    id: "observed_result",
    label: "Observed result",
    weight: 12,
    patterns: [
      /\bobserved\b/i,
      /\bactual\b/i,
      /\bresult\b/i,
      /\bresponse\b/i,
      /\berror\b/i,
      /\blog\b/i,
    ],
  },
  {
    id: "security_impact",
    label: "Concrete security impact",
    weight: 18,
    patterns: [
      /\bimpact\b/i,
      /\battacker\b/i,
      /\bexploit/i,
      /\bprivilege\b/i,
      /\baccess\b/i,
      /\bdata\b/i,
      /\baccount\b/i,
    ],
  },
  {
    id: "evidence",
    label: "Proof of concept or observable evidence",
    weight: 14,
    patterns: [
      /\bpoc\b/i,
      /\bproof\b/i,
      /\bscreenshot\b/i,
      /\blog\b/i,
      /\btrace\b/i,
      /\bfailing test\b/i,
      /\bregression test\b/i,
      /\bpayload\b/i,
    ],
  },
  {
    id: "environment",
    label: "Tested environment",
    weight: 8,
    patterns: [
      /\benvironment\b/i,
      /\bos\b/i,
      /\bbrowser\b/i,
      /\bnode\b/i,
      /\bpython\b/i,
      /\bdocker\b/i,
    ],
  },
];

const LOW_QUALITY_PATTERNS = [
  {
    id: "speculative_language",
    label: "Speculative impact language",
    pattern: /\b(may|might|could|possibly|potentially|likely)\b.{0,80}\b(vulnerab|exploit|impact|allow|lead to)\b/i,
  },
  {
    id: "untested_claim",
    label: "Admits the finding was not tested",
    pattern: /\b(not tested|did not test|unable to verify|theoretically|looks like)\b/i,
  },
  {
    id: "generic_scanner_dump",
    label: "Generic scanner or template language",
    pattern: /\b(scanner|automated tool|template|generic|best practice|industry standard)\b/i,
  },
  {
    id: "no_concrete_target",
    label: "No concrete target is named",
    pattern: /\b(your application|your software|the system|the project)\b/i,
  },
  {
    id: "ai_disclosure",
    label: "Mentions AI-generated analysis",
    pattern: /\b(ai|llm|chatgpt|language model|generated analysis)\b/i,
  },
];

function hasSignal(text, signal) {
  return signal.patterns.some((pattern) => pattern.test(text));
}

function splitLines(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function analyzeReport(text) {
  const normalizedText = text.trim();
  const present = [];
  const missing = [];

  for (const signal of REQUIRED_SIGNALS) {
    if (hasSignal(normalizedText, signal)) {
      present.push(signal);
    } else {
      missing.push(signal);
    }
  }

  const lowQualitySignals = LOW_QUALITY_PATTERNS.filter((signal) => signal.pattern.test(normalizedText));
  const evidenceScore = present.reduce((total, signal) => total + signal.weight, 0);
  const penalty = Math.min(30, lowQualitySignals.length * 8);
  const score = Math.max(0, Math.min(100, evidenceScore - penalty));

  let decision = "ready_for_maintainer_review";
  if (score < 45 || missing.length >= 4) {
    decision = "needs_more_evidence";
  }
  if (lowQualitySignals.length >= 3 && missing.length >= 3) {
    decision = "likely_low_quality_or_ai_generated";
  }

  return {
    decision,
    score,
    present: present.map((signal) => signal.label),
    missing: missing.map((signal) => signal.label),
    lowQualitySignals: lowQualitySignals.map((signal) => signal.label),
    suggestedResponse: buildSuggestedResponse(missing, lowQualitySignals),
    stats: {
      lines: splitLines(text).length,
      characters: normalizedText.length,
    },
  };
}

function buildSuggestedResponse(missing, lowQualitySignals) {
  if (missing.length === 0 && lowQualitySignals.length === 0) {
    return "Thanks for the report. It includes enough initial evidence for maintainer review. We will validate the claim and follow up through the security process.";
  }

  const missingText = missing.map((signal) => `- ${signal.label}`).join("\n");
  const qualityText = lowQualitySignals.length
    ? `\n\nThe report also contains low-confidence signals:\n${lowQualitySignals.map((signal) => `- ${signal.label}`).join("\n")}`
    : "";

  return `Thanks for the report. We cannot assess this as a vulnerability without the following evidence:\n${missingText}${qualityText}\n\nPlease resubmit with concrete affected versions, reproduction steps, observed behavior, and security impact.`;
}

export function toMarkdown(result) {
  const lines = [
    "# Security Intake Result",
    "",
    `Decision: ${result.decision}`,
    `Score: ${result.score}/100`,
    "",
    "## Present Evidence",
    ...listOrNone(result.present),
    "",
    "## Missing Evidence",
    ...listOrNone(result.missing),
    "",
    "## Low-Quality Signals",
    ...listOrNone(result.lowQualitySignals),
    "",
    "## Suggested Maintainer Response",
    result.suggestedResponse,
    "",
  ];

  return lines.join("\n");
}

function listOrNone(items) {
  if (items.length === 0) return ["- None"];
  return items.map((item) => `- ${item}`);
}
