# Security Policy

## Reporting Security Issues

We take the security and privacy of Voxa very seriously. If you discover a vulnerability or security flaw, please report it responsibly.

### How to Report
Please do **not** open a public GitHub issue for security vulnerabilities.
Instead, email security disclosures to:
`arnav@voxa.dev` or reach out directly to the repository maintainer on GitHub.

Please provide:
- A description of the vulnerability.
- Steps to reproduce the issue or proof-of-concept code.
- Impact analysis and potential mitigations.

We will acknowledge receipt within 48 hours and work with you to patch and disclose the issue responsibly.

---

## Core Security Invariants

- **Zero Audio Egress:** Audio captures must remain strictly on the host system.
- **Local Storage:** SQLite files and audio recordings reside exclusively in the local user application directory.
- **Dependency Auditing:** Dependencies are audited with `pnpm audit` and `cargo audit`.
