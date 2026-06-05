# Problem

Security maintainers increasingly receive vulnerability reports that look plausible but do not contain enough evidence to triage. The failure mode is not only "spam." It is usually a report that uses serious security language while omitting affected versions, reproduction steps, concrete impact, or proof.

## Public signals

- OpenSSF and Alpha-Omega announced funding for maintainer-centric security work, including support for overworked maintainers processing increased AI-generated security reports: <https://openssf.org/blog/2026/03/17/leading-tech-coalition-invests-12-5-million-through-openssf-and-alpha-omega-to-strengthen-open-source-security/>
- OpenSSF Vulnerability Disclosures WG has an AI-SLOP practices issue for maintainers facing high volumes of low-quality AI-generated reports: <https://github.com/ossf/wg-vulnerability-disclosures/issues/178>
- curl reported that a meaningful share of 2025 security submissions looked AI-generated and that only a small share became real vulnerabilities: <https://daniel.haxx.se/blog/2025/07/14/death-by-a-thousand-slops/>
- curl ended its bug bounty on January 31, 2026, citing AI slop and low-quality submissions: <https://daniel.haxx.se/blog/2026/01/26/the-end-of-the-curl-bug-bounty/>
- Node.js added a HackerOne Signal requirement after low-quality reports crossed the team's triage capacity: <https://nodejs.org/en/blog/announcements/hackerone-signal-requirement>
- Apache Log4j maintainers described the report volume as a denial-of-service situation through their bug bounty program: <https://github.com/apache/logging-log4j2/discussions/4052>
- Linux kernel security documentation now includes responsible AI-assisted reporting guidance and warns about low-quality reports overloading maintainers: <https://www.kernel.org/doc/html/next/process/security-bugs.html>
- Bugcrowd changed policy after AI agents created large volumes of low-quality, unverified submissions: <https://www.bugcrowd.com/blog/bugcrowd-policy-changes-to-address-ai-slop-submissions/>

## Product thesis

The first useful tool is not an AI judge. It is a transparent evidence gate.

`security-intake` should help maintainers answer:

- Does this report name the affected version or component?
- Are there reproduction steps?
- Is there concrete observed behavior?
- Is the security impact specific?
- Is there proof of concept or observable evidence?
- Does the report contain low-quality signals that should trigger a request for more evidence?

## Business thesis

The open-source core should stay useful for individual maintainers. Any future paid product should target manager-mandated workflows: org routing, audit retention, policy, integrations, hosted queues, SSO/RBAC, and reporting.

The near-term goal is validation, not monetization.
