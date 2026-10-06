# Voxa — Frontend

A modern desktop application interface for recording, transcribing, and analyzing meetings with local AI assistance. Built with Next.js, React, Tailwind CSS, and Tauri v2.

---

## Features

- **Home Dashboard:** Clear time-of-day greeting, primary `Start Meeting` CTA, audio file import, and recent meetings workspace.
- **Live Meeting Stream:** Real-time speech transcription with pulsing recording indicators, mic/system audio loopback monitoring, and readable dialogue bubbles.
- **Meeting Details:** Timestamped transcripts, audio playback, editable summaries and action items, and one-click Markdown (`.md`) / Plain Text (`.txt`) export.
- **100% Local AI:** On-device speech recognition via NVIDIA Parakeet TDT & Whisper, local summarization with Ollama / llama-helper.
- **Zero Cloud Telemetry:** Zero external telemetry networks, complete privacy.

---

## Prerequisites

- **Node.js:** v20.x, v22.x, or v23.x
- **pnpm:** v10.x+
- **Rust Toolchain:** 1.80+

---

## Development

```bash
# Install dependencies
pnpm install

# Typecheck TypeScript
pnpm run typecheck

# Production Next.js build
pnpm run build

# Start desktop app in development
pnpm run tauri:dev
```
