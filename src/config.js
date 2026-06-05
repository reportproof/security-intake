import fs from "node:fs/promises";
import path from "node:path";

export const DEFAULT_CONFIG = Object.freeze({
  minReadyScore: 70,
  maxMissingForReady: 2,
  lowQualitySignalsForLikely: 3,
  missingForLikelyLowQuality: 3,
  penaltyPerLowQualitySignal: 8,
  maxPenalty: 30,
  disabledRules: [],
});

const DEFAULT_CONFIG_FILES = [".security-intake.json", ".security-intake.yml", ".security-intake.yaml"];

export async function loadConfig(configPath, cwd = process.cwd()) {
  const resolvedPath = configPath ? path.resolve(cwd, configPath) : await findDefaultConfig(cwd);
  if (!resolvedPath) return { ...DEFAULT_CONFIG };

  const raw = await fs.readFile(resolvedPath, "utf8");
  const parsed = parseConfig(raw, resolvedPath);
  return normalizeConfig(parsed);
}

async function findDefaultConfig(cwd) {
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

function parseConfig(raw, filePath) {
  if (filePath.endsWith(".json")) {
    return JSON.parse(raw);
  }

  return parseSimpleYaml(raw);
}

function parseSimpleYaml(raw) {
  const config = {};

  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const match = /^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/.exec(line);
    if (!match) {
      throw new Error(`Unsupported config line: ${rawLine}`);
    }

    const [, key, value] = match;
    config[key] = parseValue(value);
  }

  return config;
}

function parseValue(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^(true|false)$/i.test(trimmed)) return trimmed.toLowerCase() === "true";
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if (trimmed.includes(",")) {
    return trimmed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return trimmed.replace(/^["']|["']$/g, "");
}

function normalizeConfig(config) {
  return {
    ...DEFAULT_CONFIG,
    ...pickNumber(config, "minReadyScore"),
    ...pickNumber(config, "maxMissingForReady"),
    ...pickNumber(config, "lowQualitySignalsForLikely"),
    ...pickNumber(config, "missingForLikelyLowQuality"),
    ...pickNumber(config, "penaltyPerLowQualitySignal"),
    ...pickNumber(config, "maxPenalty"),
    disabledRules: normalizeDisabledRules(config.disabledRules),
  };
}

function pickNumber(config, key) {
  if (config[key] === undefined) return {};
  const value = Number(config[key]);
  if (!Number.isFinite(value)) {
    throw new Error(`Config value ${key} must be a number.`);
  }
  return { [key]: value };
}

function normalizeDisabledRules(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
