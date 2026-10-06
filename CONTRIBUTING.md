# Contributing to Voxa

Thank you for your interest in contributing to Voxa!

Voxa is an open-source, local-first meeting intelligence application. We welcome contributions that improve performance, enhance privacy, and expand platform compatibility.

---

## Code of Conduct

Please treat all community members with respect, kindness, and professionalism.

---

## Development Setup

See [DEVELOPMENT.md](DEVELOPMENT.md) for full instructions on setting up your local environment and required tools.

---

## Pull Request Guidelines

1. **Keep Pull Requests Focused:** One feature or bugfix per PR.
2. **Type Safety:** Ensure `pnpm run typecheck` passes with zero errors before submitting.
3. **Build Verification:** Ensure `pnpm run build` and `cargo check --manifest-path frontend/src-tauri/Cargo.toml` succeed cleanly.
4. **Preserve Privacy:** Under no circumstances should pull requests introduce cloud network telemetry or remote audio streaming without explicit user consent.
5. **Licensing:** All code contributions must be compatible with the project's [MIT License](LICENSE).
