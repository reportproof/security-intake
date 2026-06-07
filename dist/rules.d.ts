export declare const EXIT_CODES: {
    readonly ready_for_maintainer_review: 0;
    readonly needs_more_evidence: 1;
    readonly likely_low_quality_or_ai_generated: 2;
};
export type Decision = keyof typeof EXIT_CODES;
type RuleCategory = "required_evidence" | "low_quality_signal";
type Severity = "low" | "medium" | "high";
interface BaseRule {
    id: string;
    category: RuleCategory;
    label: string;
    severity: Severity;
    why: string;
}
interface RequiredEvidenceRule extends BaseRule {
    category: "required_evidence";
    weight: number;
    patterns: RegExp[];
    negativePatterns?: RegExp[];
    placeholderPatterns?: RegExp[];
}
interface LowQualityRule extends BaseRule {
    category: "low_quality_signal";
    pattern: RegExp;
}
type IntakeRule = RequiredEvidenceRule | LowQualityRule;
export interface AnalysisConfig {
    minReadyScore?: number;
    maxMissingForReady?: number;
    lowQualitySignalsForLikely?: number;
    missingForLikelyLowQuality?: number;
    penaltyPerLowQualitySignal?: number;
    maxPenalty?: number;
    disabledRules?: string[];
}
export interface EffectiveAnalysisConfig {
    minReadyScore: number;
    maxMissingForReady: number;
    lowQualitySignalsForLikely: number;
    missingForLikelyLowQuality: number;
    penaltyPerLowQualitySignal: number;
    maxPenalty: number;
    disabledRules: string[];
}
export interface Finding {
    id: string;
    category: RuleCategory;
    label: string;
    severity: Severity;
    why: string;
}
export interface AnalysisResult {
    decision: Decision;
    exitCode: (typeof EXIT_CODES)[Decision];
    score: number;
    present: Finding[];
    missing: Finding[];
    lowQualitySignals: Finding[];
    suggestedResponse: string;
    stats: {
        lines: number;
        characters: number;
    };
    config: Pick<EffectiveAnalysisConfig, "minReadyScore" | "maxMissingForReady" | "lowQualitySignalsForLikely" | "missingForLikelyLowQuality" | "disabledRules">;
}
export declare const REQUIRED_EVIDENCE_RULES: RequiredEvidenceRule[];
export declare const LOW_QUALITY_RULES: LowQualityRule[];
export declare function allRules(): IntakeRule[];
export declare function analyzeReport(text: string, config?: AnalysisConfig): AnalysisResult;
export declare function toMarkdown(result: AnalysisResult): string;
export {};
