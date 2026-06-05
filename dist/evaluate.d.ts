#!/usr/bin/env node
import { type AnalysisResult, type Decision } from "./rules.js";
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
export declare function runEvaluation(casesPath?: string): Promise<EvaluationResult[]>;
export {};
