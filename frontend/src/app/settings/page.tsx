'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings2, Mic, Database as DatabaseIcon, SparkleIcon, FlaskConical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { invoke } from '@tauri-apps/api/core';
import { TranscriptSettings } from '@/components/TranscriptSettings';
import { RecordingSettings } from '@/components/RecordingSettings';
import { PreferenceSettings } from '@/components/PreferenceSettings';
import { SummaryModelSettings } from '@/components/SummaryModelSettings';
import { BetaSettings } from '@/components/BetaSettings';
import { useConfig } from '@/contexts/ConfigContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Tabs configuration (constant)
const TABS = [
  { value: 'general', label: 'General', icon: Settings2 },
  { value: 'recording', label: 'Recordings', icon: Mic },
  { value: 'Transcriptionmodels', label: 'Transcription', icon: DatabaseIcon },
  { value: 'summaryModels', label: 'Summary', icon: SparkleIcon },
  { value: 'beta', label: 'Beta', icon: FlaskConical }
] as const;

export default function SettingsPage() {
  const router = useRouter();
  const { transcriptModelConfig, setTranscriptModelConfig } = useConfig();

  const [activeTab, setActiveTab] = useState('general');

  // Load saved transcript configuration on mount
  useEffect(() => {
    const loadTranscriptConfig = async () => {
      try {
        const config = await invoke('api_get_transcript_config') as any;
        if (config) {
          console.log('Loaded saved transcript config:', config);
          setTranscriptModelConfig({
            provider: config.provider || 'localWhisper',
            model: config.model || 'large-v3',
            apiKey: config.apiKey || null
          });
        }
      } catch (error) {
        console.error('Failed to load transcript config:', error);
      }
    };
    loadTranscriptConfig();
  }, [setTranscriptModelConfig]);

  return (
    <div className="h-screen bg-[#eef1f6] flex flex-col font-sans">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-[#eef1f6] border-b-2 border-[#0d0f10]">
        <div className="max-w-6xl mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="brutal-btn bg-white flex items-center gap-2 px-3 py-1.5 text-xs font-mono uppercase tracking-wider font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return</span>
              </button>
              <div>
                <h1 className="text-xl font-mono font-black uppercase tracking-wider text-[#0d0f10]">
                  Voxa // System Settings
                </h1>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  Local Configuration & Hardware Runtime
                </p>
              </div>
            </div>
            <div className="brutal-badge brutal-badge-tech hidden sm:flex">
              COREML + METAL ACTIVE
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8 pt-6">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent relative rounded-none border-b-2 border-[#0d0f10] p-0 h-auto flex flex-wrap gap-2 pb-3">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="brutal-btn data-[state=active]:bg-[#0d0f10] data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:bg-white flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold transition-all"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="mt-6 brutal-card p-6 bg-white border-2 border-[#0d0f10] shadow-[4px_4px_0px_#0d0f10] rounded-xl">
              <TabsContent value="general" className="mt-0">
                <PreferenceSettings />
              </TabsContent>
              <TabsContent value="recording" className="mt-0">
                <RecordingSettings />
              </TabsContent>
              <TabsContent value="Transcriptionmodels" className="mt-0">
                <TranscriptSettings
                  transcriptModelConfig={transcriptModelConfig}
                  setTranscriptModelConfig={setTranscriptModelConfig}
                />
              </TabsContent>
              <TabsContent value="summaryModels" className="mt-0">
                <SummaryModelSettings />
              </TabsContent>
              <TabsContent value="beta" className="mt-0">
                <BetaSettings />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
