import fs from "node:fs/promises";
import path from "node:path";

export interface SecurityIntakeConfig {
  minReadyScore?: number;
  maxMissingForReady?: number;
  lowQualitySignalsForLikely?: number;
  missingForLikelyLowQuality?: number;
  penaltyPerLowQualitySignal?: number;
  maxPenalty?: number;
  disabledRules?: string[];
}

type RawConfig = Record<string, unknown>;
type NumericConfigKey = Exclude<keyof SecurityIntakeConfig, "disabledRules">;
type ResolvedSecurityIntakeConfig = Required<SecurityIntakeConfig>;

export const DEFAULT_CONFIG: ResolvedSecurityIntakeConfig = Object.freeze({
  minReadyScore: 70,
  maxMissingForReady: 2,
  lowQualitySignalsForLikely: 3,
  missingForLikelyLowQuality: 3,
  penaltyPerLowQualitySignal: 8,
  maxPenalty: 30,
  disabledRules: [],
});

const DEFAULT_CONFIG_FILES = [".security-intake.json", ".security-intake.yml", ".security-intake.yaml"];

export async function loadConfig(
  configPath: string | null = null,
  cwd = process.cwd()
): Promise<ResolvedSecurityIntakeConfig> {
  const resolvedPath = configPath ? path.resolve(cwd, configPath) : await findDefaultConfig(cwd);
  if (!resolvedPath) return { ...DEFAULT_CONFIG };

  const raw = await fs.readFile(resolvedPath, "utf8");
  const parsed = parseConfig(raw, resolvedPath);
  return normalizeConfig(parsed);
}

async function findDefaultConfig(cwd: string): Promise<string | null> {
  for (const fileName of DEFAULT_CONFIG_FILES) {
    const candidate = path.join(cwd, fileName);
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Keep looking.
    }
  }

  return null;
}

function parseConfig(raw: string, filePath: string): RawConfig {
  if (filePath.endsWith(".json")) {
    return JSON.parse(raw) as RawConfig;
  }

  return parseSimpleYaml(raw);
}

function parseSimpleYaml(raw: string): RawConfig {
  const config: RawConfig = {};

  for (const rawLine of raw.split(/\r?\n/)) {
    const line = stripInlineComment(rawLine).trim();
    if (!line || line.startsWith("#")) continue;

    const match = /^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/.exec(line);
    if (!match) {
      throw new Error(`Unsupported config line: ${rawLine}`);
    }

    const key = match[1];
    const value = match[2];
    if (!key || value === undefined) {
      throw new Error(`Unsupported config line: ${rawLine}`);
    }

    config[key] = parseValue(value);
  }

  return config;
}

function parseValue(value: string): unknown {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed === "[]") return [];
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((item: string) => item.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }
  if (/^(true|false)$/i.test(trimmed)) return trimmed.toLowerCase() === "true";
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if (trimmed.includes(",")) {
    return trimmed
      .split(",")
      .map((item: string) => item.trim())
      .filter(Boolean);
  }
  return trimmed.replace(/^["']|["']$/g, "");
}

function normalizeConfig(config: RawConfig): ResolvedSecurityIntakeConfig {
  const normalized: ResolvedSecurityIntakeConfig = {
    ...DEFAULT_CONFIG,
    disabledRules: normalizeDisabledRules(config.disabledRules),
  };

  for (const key of [
    "minReadyScore",
    "maxMissingForReady",
    "lowQualitySignalsForLikely",
    "missingForLikelyLowQuality",
    "penaltyPerLowQualitySignal",
    "maxPenalty",
  ] as const) {
    const value = pickNumber(config, key);
    if (value !== undefined) {
      normalized[key] = value;
    }
  }

  return normalized;
}

function stripInlineComment(line: string): string {
  let quote: string | null = null;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if ((char === '"' || char === "'") && line[index - 1] !== "\\") {
      quote = quote === char ? null : quote || char;
    }
    if (char === "#" && !quote) {
      return line.slice(0, index);
    }
  }
  return line;
}

function pickNumber(config: RawConfig, key: NumericConfigKey): number | undefined {
  if (config[key] === undefined) return undefined;
  const value = Number(config[key]);
  if (!Number.isFinite(value)) {
    throw new Error(`Config value ${key} must be a number.`);
  }
  return value;
}

function normalizeDisabledRules(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
