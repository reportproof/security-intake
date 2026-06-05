# GitHub Action Evaluation

Use the Action in report-only mode first. The goal is to inspect the generated
result, not to block reporters or close issues automatically.

This example uses Node.js 24-compatible official helper actions:
`actions/checkout@v6` and `actions/upload-artifact@v6`.

## Copy-Paste Workflow

Create `.github/workflows/security-intake-evaluation.yml` in the repository that
will run the trial:

```yaml
name: Security intake evaluation

on:
  workflow_dispatch:
    inputs:
      report-path:
        description: Path to a sanitized Markdown report committed to this branch.
        required: true
        default: examples/ai-slop-report.md

permissions:
  contents: read

jobs:
  intake:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6

      - uses: reportproof/security-intake@main
        id: intake
        with:
          report-path: ${{ inputs.report-path }}
          config-path: .security-intake.yml
          format: markdown
          output-path: security-intake-result.md
          fail-on-low-quality: "false"

      - name: Print decision
        run: |
          echo "decision=${{ steps.intake.outputs.decision }}"
          echo "score=${{ steps.intake.outputs.score }}"
          echo "result=${{ steps.intake.outputs.result-path }}"

      - name: Upload intake result
        uses: actions/upload-artifact@v6
        with:
          name: security-intake-result
          path: ${{ steps.intake.outputs.result-path }}
          if-no-files-found: error
          retention-days: 7
```

## Where The Output Appears

The Action writes:

- step outputs: `decision`, `score`, `exit-code`, and `result-path`,
- a short GitHub job summary with the decision, score, result path, and rule IDs,
- a Markdown or JSON result file at `output-path`,
- an optional downloadable artifact if you include the upload step above.

The job summary does not include the original report body. Treat generated
artifacts as public on public repositories, and use sanitized reports only.

## Recommended Trial Settings

Keep these settings while evaluating:

```yaml
format: markdown
output-path: security-intake-result.md
fail-on-low-quality: "false"
```

Do not switch `fail-on-low-quality` to `"true"` until your project has reviewed
false positives and false negatives with sanitized examples.

## Trial Checklist

Before asking maintainers for feedback:

- run the workflow manually on one known-good sanitized report,
- run it on one incomplete but plausible report,
- run it on one scanner dump or untested claim,
- download and inspect the generated Markdown result,
- compare the decisions against [maintainer-evaluation.md](maintainer-evaluation.md),
- record any confusing rule IDs as feedback.

## External Playground

The report-only workflow is verified from a separate public repository:
[reportproof/security-intake-playground](https://github.com/reportproof/security-intake-playground).

Current external trial results are recorded in
[playground-trial-results.md](playground-trial-results.md).

## Safety Notes

- Do not commit private vulnerability reports to public repositories.
- Do not post active exploit details in public workflow artifacts.
- Do not auto-close security reports from this Action alone.
- Do not describe `ready_for_maintainer_review` as proof that a vulnerability is real.
- Do not describe low-quality decisions as proof that a reporter acted in bad faith.
