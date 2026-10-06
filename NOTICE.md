# Legal Notices & Source Derivation

## Voxa
Copyright (c) 2026 Arnav Angarkar and Voxa Contributors.
Licensed under the MIT License.

## Upstream Derivative Work
Portions of Voxa are derived from **Meetily Community Edition** under the terms of the MIT License:
- Original Copyright (c) 2024 Zackriya Solutions
- Upstream Source: https://github.com/Zackriya-Solutions/meetily
- License: MIT License

### Scope of Reused Community Edition Code
Voxa utilizes the MIT-licensed community desktop foundation from Meetily Community Edition, including:
- Audio capture and device enumeration routines in Rust
- Speech recognition integration wrappers (Whisper.cpp, Parakeet TDT ONNX)
- Local SQLite persistence and migration schemas
- Tauri v2 application bridge and IPC command structures

### Modifications & Independent Architecture
Voxa has been engineered as an independent product and codebase:
- Aggressive removal of all upstream product assumptions, marketing links, updater endpoints, and cloud analytics.
- Complete elimination of proprietary telemetry (PostHog has been completely decoupled and replaced with zero-network local tracing).
- Redesigned user interface and information architecture featuring the dedicated Voxa Home experience, real-time live meeting monitor, and modern workspace.
- Integration architecture for future decentralized event intelligence with [VoxBento](https://github.com/fossasia/voxbento) (`src/integrations/voxbento`).
- Cleaned and modernized dependencies, build tooling, and cross-platform packaging.

### Third-Party Components & Notice Preservation
Voxa bundles and links to several open-source libraries. Please refer to [ATTRIBUTIONS.md](ATTRIBUTIONS.md) for detailed licenses and third-party notices.
