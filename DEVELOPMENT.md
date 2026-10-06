# Voxa Developer Guide

This guide details local development workflows, toolchain prerequisites, build commands, and debugging procedures for the Voxa desktop application.

---

## Toolchain Requirements

### All Platforms
- **Node.js:** v20.x, v22.x, or v23.x
- **pnpm:** v10.x+ (`npm i -g pnpm`)
- **Rust:** Stable 1.80+ (`rustup default stable`)
- **Cargo:** Bundled with Rust

### macOS (Apple Silicon / Intel)
- Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```
- *Note:* If building on systems with only Command Line Tools (without full Xcode IDE), the build uses `clang` directly with macOS SDK frameworks (`Foundation`, `CoreAudio`, `AudioToolbox`).

### Linux (Debian / Ubuntu)
```bash
sudo apt-get update
sudo apt-get install -y \
  libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  libasound2-dev
```

### Windows (x64)
- Visual Studio 2022 C++ Build Tools
- Windows 10/11 SDK
- Microsoft WebView2 Runtime (installed by default on Windows 10/11)

---

## Project Structure

```
voxa/
├── frontend/                   # Next.js web application
│   ├── src/
│   │   ├── app/                # Pages and layouts (Home, Meeting Details, Settings)
│   │   ├── components/         # Reusable UI components & HomeDashboard
│   │   ├── contexts/           # React state contexts (Recording, Transcripts, Config)
│   │   ├── hooks/              # Custom hooks (Audio, permissions, recovery)
│   │   ├── integrations/       # Modular integration seams (e.g., voxbento/)
│   │   ├── lib/                # Export utilities, analytics shim, formatting
│   │   └── types/              # Domain types (Storage, summary, transcripts)
│   └── src-tauri/              # Rust Tauri backend
│       ├── src/
│       │   ├── api/            # Tauri IPC command handlers
│       │   ├── audio/          # CoreAudio / WASAPI stream capture
│       │   ├── database/       # SQLite repositories & migrations
│       │   ├── engines/        # Parakeet ONNX & Whisper speech engines
│       │   └── analytics/      # Local diagnostics logger (zero cloud telemetry)
│       ├── Cargo.toml          # Rust crate configuration
│       └── tauri.conf.json     # Tauri app configuration & bundle settings
├── llama-helper/               # Embedded llama.cpp helper crate
├── .github/workflows/          # CI and cross-platform build pipelines
├── README.md                   # Product overview
├── DEVELOPMENT.md              # This file
├── ARCHITECTURE.md             # System design and pipeline details
├── NOTICE.md                   # Legal derivation notice
└── LICENSE                     # MIT License
```

---

## Development Commands

### 1. Install Dependencies
```bash
cd frontend
pnpm install
```

### 2. Type Checking & Frontend Build Validation
```bash
# Type check TypeScript without emitting files:
pnpm run typecheck

# Production Next.js build:
pnpm run build
```

### 3. Rust Toolchain Validation
```bash
# Check Rust backend:
cargo check --manifest-path frontend/src-tauri/Cargo.toml

# Run Rust unit tests:
cargo test --manifest-path frontend/src-tauri/Cargo.toml
```

### 4. Running the Desktop Application
```bash
cd frontend
pnpm run tauri:dev
```
This starts the Next.js development server on `http://localhost:3118` and spawns the native Tauri window.

---

## External Binaries & Acceleration

- **`llama-helper`**: Embedded helper compiled during build time into `binaries/llama-helper-$TARGET`.
- **Metal Acceleration (macOS):** Auto-enabled on Apple Silicon via `whisper-rs/metal`.
- **CUDA Acceleration (Windows/Linux):** Configurable in `Cargo.toml` under `whisper-rs/cuda` when NVIDIA CUDA Toolkit is present.

---

## Code Quality Standards

- Maintain strict typing: zero `any` wherever possible.
- Privacy invariant: Never introduce cloud network calls for telemetry, user analytics, or audio data.
- Run `pnpm run typecheck` and `cargo check` before submitting pull requests.
