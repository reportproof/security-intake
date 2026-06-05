export interface SecurityIntakeConfig {
    minReadyScore?: number;
    maxMissingForReady?: number;
    lowQualitySignalsForLikely?: number;
    missingForLikelyLowQuality?: number;
    penaltyPerLowQualitySignal?: number;
    maxPenalty?: number;
    disabledRules?: string[];
}
type ResolvedSecurityIntakeConfig = Required<SecurityIntakeConfig>;
export declare const DEFAULT_CONFIG: ResolvedSecurityIntakeConfig;
export declare function loadConfig(configPath?: string | null, cwd?: string): Promise<ResolvedSecurityIntakeConfig>;
export {};
