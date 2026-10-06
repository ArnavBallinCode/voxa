# Voxa

> **Open-source meeting intelligence. Local by default. Connected when useful.**

Voxa is a production-grade, privacy-first desktop application for recording, transcribing, and summarizing meetings entirely on your local machine.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)](#platform-support)
[![Tauri v2](https://img.shields.io/badge/Framework-Tauri%20v2-orange.svg)](https://tauri.app)

---

## Highlights

- **100% On-Device AI:** High-accuracy local speech-to-text using NVIDIA Parakeet TDT (ONNX) and OpenAI Whisper (Whisper.cpp) with full Metal / GPU hardware acceleration.
- **Zero Cloud Audio Upload:** Audio streams and raw recordings remain strictly on your physical machine. No third-party servers, no accounts required.
- **Dual-Channel Audio Capture:** Record microphone input alongside system audio (Zoom, Google Meet, Microsoft Teams, Slack Huddles, WebRTC) without intrusive bots or meeting permissions.
- **Local Summarization:** Generate executive summaries, key decisions, and action items using local LLMs via Ollama or embedded llama-helper.
- **Structured Workspace:** Clean meeting details screen featuring timestamped transcripts, synchronized audio playback, editable notes, and one-click Markdown & Plain Text export.
- **Future-Ready Architecture:** Designed with modular integration boundaries (`src/integrations/voxbento`) to bridge seamlessly with [VoxBento](https://github.com/fossasia/voxbento) for real-time multilingual event interpretation.

---

## Architecture Overview

```
Voxa Desktop Architecture
┌─────────────────────────────────────────────────────────────┐
│                    Voxa Frontend (Next.js)                  │
│   Home Dashboard │ Live Meeting Monitor │ Meeting Details   │
└──────────────────────────────┬──────────────────────────────┘
                               │ Tauri IPC Bridge
┌──────────────────────────────▼──────────────────────────────┐
│                    Tauri Backend (Rust)                     │
│  ┌───────────────────────┐         ┌──────────────────────┐ │
│  │  Native Audio Engine  │         │   Local DB (SQLite)  │ │
│  │ (CoreAudio / WASAPI)  │         │   sqlx Migrations    │ │
│  └───────────┬───────────┘         └──────────────────────┘ │
│              │ PCM 16kHz                                    │
│  ┌───────────▼───────────┐         ┌──────────────────────┐ │
│  │ Transcription Engine  │         │  Zero-Cloud Tracing  │ │
│  │ (Parakeet / Whisper)  │         │ (Local Logging Only) │ │
│  └───────────────────────┘         └──────────────────────┘ │
└──────────────────────────────┬──────────────────────────────┘
                               │ Optional Integration Seam
┌──────────────────────────────▼──────────────────────────────┐
│            VoxBento Integration (src/integrations)          │
│   REST Client │ Live Caption WebSocket │ Zero Audio Ingest  │
└─────────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js:** v20.x or v22.x+
- **pnpm:** v9.x or v10.x+ (`corepack enable` or `npm install -g pnpm`)
- **Rust Toolchain:** 1.80+ (`rustup default stable`)
- **macOS:** Xcode Command Line Tools (`xcode-select --install`)
- **Linux:** System libraries (`libwebkit2gtk-4.1-dev`, `libssl-dev`, `libasound2-dev`, `libgtk-3-dev`)
- **Windows:** Visual Studio C++ Build Tools & WebView2

### Quick Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ArnavBallinCode/voxa.git
   cd voxa
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   pnpm install
   ```

3. **Verify the Rust and frontend toolchains:**
   ```bash
   # In frontend/ directory:
   pnpm run typecheck
   pnpm run build

   # In project root:
   cargo check --manifest-path frontend/src-tauri/Cargo.toml
   ```

4. **Launch the desktop application in development mode:**
   ```bash
   cd frontend
   pnpm run tauri:dev
   ```

---

## Exporting & Data Ownership

Meetings and transcripts can be exported immediately:
- **Markdown (`.md`):** Executive summary, action checklist, key decisions, and timestamped dialogue.
- **Plain Text (`.txt`):** Formatted transcript suitable for pasting into email or project tickets.
- **Raw Audio:** Accessible directly via the "Recording Folder" button in Meeting Details.

---

## Platform Support

| Operating System | Target Architecture | Packaging Formats |
|---|---|---|
| **macOS** | Apple Silicon (`aarch64`) & Intel (`x86_64`) | `.app`, `.dmg` |
| **Windows** | x64 (`x86_64`) | NSIS `.exe`, `.msi` |
| **Linux** | x64 (`x86_64`) | `.AppImage`, `.deb` |

---

## Licensing & Attribution

Voxa is licensed under the [MIT License](LICENSE).

Portions of this software are derived from [Meetily Community Edition](https://github.com/Zackriya-Solutions/meetily) (Copyright © 2024 Zackriya Solutions) under the terms of the MIT License.

See [NOTICE.md](NOTICE.md) for legal derivation notices and [ATTRIBUTIONS.md](ATTRIBUTIONS.md) for complete third-party dependency acknowledgments.
