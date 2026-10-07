'use client';

import React, { useState, useMemo } from 'react';
import { Languages, ChevronDown, Sparkles, Check, Globe } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useConfig } from '@/contexts/ConfigContext';
import { toast } from 'sonner';
import Analytics from '@/lib/analytics';
import {
  ALL_WHISPER_LANGUAGES,
  parseLanguagePreference,
  formatLanguagePreference,
  getLanguageName,
  getLanguageBadgeInfo,
} from '@/lib/language-settings';

interface LiveLanguageSwitcherProps {
  className?: string;
  isRecording?: boolean;
}

export function LiveLanguageSwitcher({
  className = '',
  isRecording = false,
}: LiveLanguageSwitcherProps) {
  const { selectedLanguage, setSelectedLanguage, transcriptModelConfig } = useConfig();
  const [open, setOpen] = useState(false);

  const { spoken, translate } = useMemo(
    () => parseLanguagePreference(selectedLanguage),
    [selectedLanguage]
  );

  const badgeInfo = useMemo(
    () => getLanguageBadgeInfo(selectedLanguage),
    [selectedLanguage]
  );

  const isParakeet = transcriptModelConfig.provider === 'parakeet';

  const handleUpdate = async (newSpoken: string, newTranslate: boolean) => {
    const effectiveTranslate = newSpoken === 'en' ? false : newTranslate;
    const formatted = formatLanguagePreference(newSpoken, effectiveTranslate);

    try {
      setSelectedLanguage(formatted);

      const newBadge = getLanguageBadgeInfo(formatted);
      await Analytics.track('language_switched_live', {
        language_code: formatted,
        spoken: newSpoken,
        translate: effectiveTranslate.toString(),
        is_recording: isRecording.toString(),
      });

      toast.success('Live Language Switched', {
        description: `Now transcribing: ${newBadge.displayText}`,
      });
    } catch (err) {
      console.error('Failed to switch language live:', err);
      toast.error('Failed to switch language');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title="Change conversation language or translation target"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded-md border-2 border-[#0d0f10] bg-white hover:bg-zinc-100 shadow-[2px_2px_0px_#0d0f10] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all text-[#0d0f10] ${className}`}
        >
          <Languages className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="truncate max-w-[170px] sm:max-w-[220px]">
            {badgeInfo.displayText}
          </span>
          <ChevronDown className="w-3 h-3 text-zinc-500 shrink-0" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-80 p-4 border-2 border-[#0d0f10] shadow-[4px_4px_0px_#0d0f10] bg-white space-y-4"
      >
        <div className="border-b-2 border-[#0d0f10] pb-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase font-black tracking-wider text-zinc-500">
              Live Ingest Routing
            </div>
            <div className="text-sm font-black uppercase text-[#0d0f10]">
              Switch Language
            </div>
          </div>
          {isRecording && (
            <span className="brutal-badge brutal-badge-record text-[9px] py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse mr-1" />
              HOT-SWAP
            </span>
          )}
        </div>

        {/* Option 1: Conversation Language */}
        <div className="space-y-1">
          <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-700">
            1. Conversation Language (Spoken)
          </label>
          <select
            value={spoken}
            onChange={(e) => handleUpdate(e.target.value, translate)}
            disabled={isParakeet}
            className="w-full px-2.5 py-1.5 text-xs font-mono font-bold bg-white border-2 border-[#0d0f10] rounded shadow-[2px_2px_0px_#0d0f10] focus:outline-none cursor-pointer disabled:opacity-50"
          >
            {ALL_WHISPER_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} {lang.code !== 'auto' ? `(${lang.code})` : '— Auto-Detect'}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-zinc-500">
            Language spoken by participants in this session.
          </p>
        </div>

        {/* Option 2: Target Mode */}
        <div className="space-y-1">
          <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-700">
            2. Target Output
          </label>

          {spoken === 'en' ? (
            <div className="p-2 bg-zinc-100 border border-zinc-300 rounded text-xs font-mono text-zinc-600 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>English output (no translation needed)</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleUpdate(spoken, false)}
                disabled={isParakeet}
                className={`p-2 text-left border-2 rounded transition-all ${
                  !translate
                    ? 'border-[#0d0f10] bg-zinc-50 shadow-[2px_2px_0px_#0d0f10]'
                    : 'border-zinc-200 hover:border-zinc-400 opacity-70'
                }`}
              >
                <div className="font-mono font-bold text-[11px] uppercase text-[#0d0f10] flex items-center justify-between">
                  <span>Original</span>
                  {!translate && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                </div>
                <div className="text-[9px] text-zinc-500 mt-0.5 truncate">
                  {getLanguageName(spoken)}
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleUpdate(spoken, true)}
                disabled={isParakeet}
                className={`p-2 text-left border-2 rounded transition-all ${
                  translate
                    ? 'border-[#0d0f10] bg-blue-50/70 shadow-[2px_2px_0px_#2563eb]'
                    : 'border-zinc-200 hover:border-zinc-400 opacity-70'
                }`}
              >
                <div className="font-mono font-bold text-[11px] uppercase text-blue-900 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    Translate
                    <Sparkles className="w-2.5 h-2.5 text-blue-600" />
                  </span>
                  {translate && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                </div>
                <div className="text-[9px] text-blue-700 mt-0.5 truncate">
                  To English
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Telemetry info */}
        <div className="pt-1 border-t border-zinc-200 text-[10px] font-mono text-zinc-500 flex items-center justify-between">
          <span>ACTIVE: {badgeInfo.displayText}</span>
          <span className="text-emerald-600 font-bold">● HOT-SWAP READY</span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
