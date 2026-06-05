# Architecture

`security-intake` intentionally starts as a deterministic local tool. The source is TypeScript and the shipped CLI/GitHub Action run on compiled JavaScript in `dist/` using Node.js 24.

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

## Language choice

The project uses TypeScript from the start because the first distribution surfaces are an npm CLI and a GitHub Action. TypeScript gives the rule engine, config parser, Action inputs, and future integration APIs explicit contracts while still shipping plain JavaScript that runs directly on GitHub's Node 24 action runtime.

Go may become useful later for a single-binary scanner if installation friction becomes a blocker. Python is kept out of the core runtime because package setup friction is higher for public CI users, and Rust is unnecessary unless the project grows into high-performance static analysis.

## Future seams

The current interfaces are deliberately small:

- `src/rules.ts`: deterministic rule catalog and scoring.
- `src/config.ts`: project policy.
- `src/cli.ts`: local command-line use.
- `src/action.ts`: GitHub Action execution and outputs.
- `dist/*.js`: compiled runtime files used by npm and GitHub Actions.

Future GitHub comments, private vulnerability reporting helpers, or hosted queues should build on these interfaces instead of bypassing them.
