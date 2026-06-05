# Architecture

`security-intake` intentionally starts as a deterministic local tool.

## Flow

1. Read a Markdown report.
2. Load `.security-intake.yml`, `.security-intake.yaml`, `.security-intake.json`, or defaults.
3. Match report text against required evidence rules.
4. Match report text against low-quality signal rules.
5. Score the report.
6. Emit Markdown or JSON.
7. Optionally return a nonzero exit code for automation.

## Boundaries

The tool does not:

- decide if a vulnerability is real;
- generate exploits;
- contact reporters;
- close issues;
- upload report contents to a service;
- call an LLM.

The first trust boundary is local execution: the report stays in the repository or workflow where the user runs the tool.

## Future seams

The current interfaces are deliberately small:

- `src/rules.js`: deterministic rule catalog and scoring.
- `src/config.js`: project policy.
- `src/cli.js`: local command-line use.
- `src/action.js`: GitHub Action execution and outputs.

Future GitHub comments, private vulnerability reporting helpers, or hosted queues should build on these interfaces instead of bypassing them.
