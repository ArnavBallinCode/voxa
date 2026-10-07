'use client';

import React, { useState, useMemo } from 'react';
import { Globe, ArrowRight, Languages, Sparkles, Check, Info } from 'lucide-react';
import Analytics from '@/lib/analytics';
import { toast } from 'sonner';
import { useConfig } from '@/contexts/ConfigContext';
import {
  ALL_WHISPER_LANGUAGES,
  parseLanguagePreference,
  formatLanguagePreference,
  getLanguageName,
  getLanguageBadgeInfo,
  Language,
} from '@/lib/language-settings';

export { ALL_WHISPER_LANGUAGES as LANGUAGES };
export type { Language };

interface LanguageSelectionProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  disabled?: boolean;
  provider?: 'localWhisper' | 'parakeet' | 'deepgram' | 'elevenLabs' | 'groq' | 'openai' | string;
  compact?: boolean;
  isRecording?: boolean;
}

export function LanguageSelection({
  selectedLanguage,
  onLanguageChange,
  disabled = false,
  provider = 'localWhisper',
  compact = false,
  isRecording = false,
}: LanguageSelectionProps) {
  const [saving, setSaving] = useState(false);
  const { setSelectedLanguage } = useConfig();

  // Parse current state into spoken language + translation mode
  const { spoken, translate } = useMemo(
    () => parseLanguagePreference(selectedLanguage),
    [selectedLanguage]
  );

  const isParakeet = provider === 'parakeet';

  // Apply change
  const applyChange = async (newSpoken: string, newTranslate: boolean) => {
    // If English is selected as spoken, translation to English is redundant
    const effectiveTranslate = newSpoken === 'en' ? false : newTranslate;
    const formatted = formatLanguagePreference(newSpoken, effectiveTranslate);

    setSaving(true);
    try {
      setSelectedLanguage(formatted);
      onLanguageChange(formatted);

      const badge = getLanguageBadgeInfo(formatted);
      await Analytics.track('language_selected', {
        language_code: formatted,
        spoken_code: newSpoken,
        is_translating: effectiveTranslate.toString(),
      });

      toast.success('Language setting updated', {
        description: isRecording
          ? `Live stream switched to: ${badge.displayText}`
          : `Ingest set to: ${badge.displayText}`,
      });
    } catch (error) {
      console.error('Failed to save language preference:', error);
      toast.error('Failed to update language setting', {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSpokenChange = (code: string) => {
    applyChange(code, translate);
  };

  const handleTargetModeChange = (targetTranslate: boolean) => {
    applyChange(spoken, targetTranslate);
  };

  const badgeInfo = getLanguageBadgeInfo(selectedLanguage);

  return (
    <div className={`space-y-4 text-[#0d0f10] ${compact ? 'text-xs' : ''}`}>
      {/* Live Ingest Telemetry Banner */}
      <div className="flex items-center justify-between p-3 bg-zinc-50 border-2 border-[#0d0f10] rounded-lg shadow-[2px_2px_0px_#0d0f10]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-emerald-100 border border-[#0d0f10] flex items-center justify-center">
            <Languages className="w-3.5 h-3.5 text-emerald-800" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase font-bold text-zinc-500">
              Active Ingest Route
            </div>
            <div className="text-xs font-mono font-black text-[#0d0f10]">
              {badgeInfo.displayText}
            </div>
          </div>
        </div>

        {isRecording && (
          <span className="brutal-badge brutal-badge-live text-[10px] py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse mr-1" />
            LIVE HOT-SWAP
          </span>
        )}
      </div>

      {/* Option 1: Conversation / Spoken Language */}
      <div className="space-y-1.5">
        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">
          1. Spoken Language (Conversation)
        </label>
        <div className="relative">
          <select
            value={spoken}
            onChange={(e) => handleSpokenChange(e.target.value)}
            disabled={disabled || saving || isParakeet}
            className="w-full px-3 py-2 text-xs font-mono font-bold bg-white border-2 border-[#0d0f10] rounded-md shadow-[2px_2px_0px_#0d0f10] focus:outline-none focus:ring-0 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {ALL_WHISPER_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} {lang.code !== 'auto' ? `(${lang.code})` : '— Automatic'}
              </option>
            ))}
          </select>
        </div>
        <p className="text-[11px] text-zinc-600 leading-normal">
          The primary language spoken in the room or meeting audio.
        </p>
      </div>

      {/* Option 2: Target / Output Language (Translate Mode) */}
      <div className="space-y-1.5">
        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">
          2. Target Language (Output Transcript)
        </label>

        {spoken === 'en' ? (
          <div className="p-2.5 bg-zinc-100 border-2 border-zinc-300 rounded-md text-xs font-mono text-zinc-600 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Spoken language is English. Output is transcribed directly in English.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Mode A: Original */}
            <button
              type="button"
              onClick={() => handleTargetModeChange(false)}
              disabled={disabled || saving || isParakeet}
              className={`p-3 text-left border-2 rounded-lg transition-all ${
                !translate
                  ? 'border-[#0d0f10] bg-white shadow-[3px_3px_0px_#0d0f10]'
                  : 'border-zinc-200 bg-zinc-50 hover:border-zinc-400 text-zinc-600 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-xs uppercase text-[#0d0f10]">
                  Original Language
                </span>
                {!translate && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                )}
              </div>
              <p className="text-[11px] text-zinc-600 leading-snug">
                Transcribe verbatim in the conversation language ({getLanguageName(spoken)}).
              </p>
            </button>

            {/* Mode B: Real-Time English Translation */}
            <button
              type="button"
              onClick={() => handleTargetModeChange(true)}
              disabled={disabled || saving || isParakeet}
              className={`p-3 text-left border-2 rounded-lg transition-all ${
                translate
                  ? 'border-[#0d0f10] bg-blue-50/50 shadow-[3px_3px_0px_#2563eb]'
                  : 'border-zinc-200 bg-zinc-50 hover:border-zinc-400 text-zinc-600 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-xs uppercase text-blue-900">
                    Translate to English
                  </span>
                  <Sparkles className="w-3 h-3 text-blue-600" />
                </div>
                {translate && (
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                )}
              </div>
              <p className="text-[11px] text-zinc-600 leading-snug">
                Real-time speech translation into English using Whisper on-device.
              </p>
            </button>
          </div>
        )}
      </div>

      {/* Parakeet notice if active */}
      {isParakeet && (
        <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-lg text-amber-900 text-xs font-mono flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Parakeet STT is English-only.</strong>
            <p className="mt-0.5 text-[11px] text-amber-800">
              To transcribe other languages or use real-time speech translation, switch STT Engine to Local Whisper in Settings.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
