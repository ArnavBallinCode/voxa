# Voxa Architecture Specification

> **Positioning:** Open-source meeting intelligence. Local by default. Connected when useful.

This document describes the design principles, internal subsystem contracts, data flows, and security boundaries of Voxa.

---

## 1. Core Principles & Non-Negotiable Invariants

1. **Local-First Audio:** Microphones and system loopback audio are ingested and processed strictly on the local hardware. Audio frames never route to remote analytics or cloud servers.
2. **Zero Commercial Telemetry:** Upstream telemetry networks (PostHog, Segment, etc.) have been completely removed. Diagnostic logging is 100% on-device.
3. **No Account Required:** Full application utility (recording, real-time transcription, search, AI summary generation, notes, export) is available without authentication or cloud subscriptions.
4. **Clean Integration Boundaries:** External connectivity (such as live multilingual event captioning via [VoxBento](https://github.com/fossasia/voxbento)) is isolated behind optional integration seams (`src/integrations/`).

---

## 2. System Overview

```mermaid
flowchart TD
    subgraph UI ["Frontend (Next.js / React)"]
        HD[Home Dashboard]
        LM[Live Meeting Monitor]
        MD[Meeting Details & Notes]
        EXP[Meeting Exporter]
    end

    subgraph IPC ["Tauri IPC Bridge"]
        CMD[Tauri Commands]
        EVT[Event Bus (live-transcripts)]
    end

    subgraph Native ["Rust Core Engine"]
        AC[Audio Engine: CoreAudio / WASAPI]
        VAD[Voice Activity Detection]
        TE[Transcription: Parakeet / Whisper]
        DB[(SQLite / sqlx)]
        DIAG[Local Diagnostics Tracing]
    end

    subgraph Integrations ["Optional Integrations"]
        VB[VoxBento Live Caption Bridge]
    end

    HD -->|Start Meeting| CMD
    AC -->|16kHz PCM| VAD
    VAD -->|Speech Chunks| TE
    TE -->|Segments| EVT
    EVT -->|Streaming Text| LM
    CMD -->|Persist| DB
    MD -->|Read / Update| DB
    MD -->|Export .md / .txt| EXP
    LM -.->|Optional Live Captions| VB
```

---

## 3. Audio Pipeline

### 3.1 Ingest
- **Microphone:** Captured via `cpal` / `coreaudio-rs`.
- **System Audio Loopback:** Captured on macOS using CoreAudio tap / ScreenCaptureKit, and on Windows using WASAPI loopback.
- **Sample Rate Normalization:** All channels are mixed and resampled down to 16,000 Hz, 16-bit mono PCM.

### 3.2 Speech Recognition
Voxa supports two primary local transcription engines:
1. **NVIDIA Parakeet TDT (ONNX):**
   - High speed, 0.6B FastConformer architecture.
   - Low latency, ideal for real-time streaming speech display.
2. **OpenAI Whisper (whisper.cpp / whisper-rs):**
   - Multi-lingual accuracy with Metal/CUDA GPU acceleration.
   - Ideal for detailed transcription and post-meeting retranscription.

---

## 4. Storage & Persistence

Data is stored locally in an embedded SQLite database inside the user's OS Application Support directory (`com.arnav.voxa`):
- `meetings`: Meeting metadata, start/end timestamps, folder path.
- `transcripts`: Timestamped segments with start time, end time, confidence, and text.
- `summaries`: Executive summaries, key points, and action items.
- `preferences`: User-configured model parameters and audio device selections.

---

## 5. VoxBento Integration Architecture

Located in `frontend/src/integrations/voxbento/`:
- **`types.ts`:** Domain model for rooms, booths, and session credentials.
- **`auth.ts`:** Secure OAuth2 / PKCE token management with keychain storage.
- **`client.ts`:** REST client for fetching scheduled events.
- **`session.ts`:** WebSocket bridge to stream live text captions to a multilingual booth.
- **Invariant:** The VoxBento bridge transmits *transcribed text captions only*. Raw interpreter mic audio and attendee audio ingest remain the domain of VoxBento's WebRTC / WHIP / WHEP pipeline.

---

## 6. Export Capabilities

Voxa includes built-in offline export tools (`src/lib/export.ts`):
- **Markdown (`.md`):** Comprehensive document with meeting metadata, summary, action checklist, and timestamped dialogue.
- **Plain Text (`.txt`):** Simple formatted transcript for copy-pasting into tickets or emails.
