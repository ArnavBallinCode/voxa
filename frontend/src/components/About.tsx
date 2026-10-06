'use client';

import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { getVersion } from '@tauri-apps/api/app';
import { Button } from './ui/button';
import { ExternalLink, Github, Shield, Cpu, Lock } from 'lucide-react';

export function About() {
  const [currentVersion, setCurrentVersion] = useState<string>('0.1.0');

  useEffect(() => {
    getVersion().then(setCurrentVersion).catch(console.error);
  }, []);

  const openUrl = async (url: string) => {
    try {
      await invoke('open_external_url', { url });
    } catch (error) {
      console.error('Failed to open external url:', error);
    }
  };

  return (
    <div className="p-5 space-y-6 max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 text-white shadow-md mb-1 font-bold text-2xl tracking-tight">
          V
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Voxa</h1>
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          v{currentVersion} • Open-Source Meeting Intelligence
        </p>
        <p className="text-sm text-zinc-600 max-w-sm mx-auto">
          Local by default. Connected when useful. Real-time transcription and intelligence that never leaves your machine.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50 space-y-1.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-semibold text-zinc-900">Zero Cloud Ingest</h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            All audio and transcripts remain local on your filesystem. No telemetry tracking or third-party monitoring.
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50 space-y-1.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-1">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-semibold text-zinc-900">Native Hardware</h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Optimized for Apple Silicon Metal, NVIDIA CUDA, and Vulkan via Whisper.cpp and Parakeet ONNX engines.
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50 space-y-1.5">
          <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-1">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-semibold text-zinc-900">Connected Option</h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Architected to seamlessly link with VoxBento live multilingual session infrastructure when desired.
          </p>
        </div>
      </div>

      {/* Links & Community */}
      <div className="space-y-2 pt-2">
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1.5"
            onClick={() => openUrl('https://github.com/ArnavBallinCode/voxa')}
          >
            <Github className="w-3.5 h-3.5" />
            GitHub Repository
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1.5"
            onClick={() => openUrl('https://github.com/ArnavBallinCode/voxa/releases')}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Releases & Changelog
          </Button>
        </div>
      </div>

      {/* Attribution & Legal Notice */}
      <div className="pt-4 border-t border-zinc-200 text-center space-y-1.5">
        <p className="text-[11px] text-zinc-500">
          Created by Arnav Angarkar and the Voxa contributors under the MIT License.
        </p>
        <p className="text-[10px] text-zinc-400 max-w-md mx-auto leading-normal">
          Voxa incorporates open-source engineering derived from Meetily Community Edition (MIT License). Audio transcription powered by Whisper.cpp and ONNX Runtime.
        </p>
      </div>
    </div>
  );
}