# Configuration

`security-intake` automatically reads one of these files from the current working directory:

- `.security-intake.json`
- `.security-intake.yml`
- `.security-intake.yaml`

You can also pass a file explicitly:

```bash
node src/cli.js report.md --config path/to/.security-intake.yml
```

Write an artifact:

```bash
node src/cli.js report.md --output security-intake-result.md --no-fail
```

## Supported keys

```yaml
minReadyScore: 70
maxMissingForReady: 2
lowQualitySignalsForLikely: 3
missingForLikelyLowQuality: 3
penaltyPerLowQualitySignal: 8
maxPenalty: 30
disabledRules:
```

`disabledRules` may be a comma-separated list:

```yaml
disabledRules: RP105_AI_GENERATED_DISCLOSURE,RP103_GENERIC_SCANNER_DUMP
```

The YAML parser is intentionally minimal. It supports top-level `key: value` pairs only. Use JSON if you need stricter syntax.

## Philosophy

Configuration should help projects tune policy without hiding the evidence. If a rule is disabled, the output should still be understandable to a maintainer reading the report.
