'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mic,
  Upload,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Cpu,
  FileText,
  Radio,
  Pencil,
  Trash2,
  Activity,
  Layers,
  Sparkles,
  Volume2,
} from 'lucide-react';
import type { CurrentMeeting } from '@/components/Sidebar/SidebarProvider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HomeDashboardProps {
  meetings: CurrentMeeting[];
  onStartMeeting: () => void;
  onImportAudio: () => void;
  isStartingRecording?: boolean;
  modelProvider?: string;
  hasMicrophone?: boolean;
  onEditMeeting?: (id: string, title: string) => void;
  onDeleteMeeting?: (id: string) => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatRelativeTime(index: number): string {
  if (index === 0) return 'Today · Recent';
  if (index === 1) return 'Yesterday';
  if (index === 2) return '2 days ago';
  return `${index + 1} days ago`;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  meetings,
  onStartMeeting,
  onImportAudio,
  isStartingRecording = false,
  modelProvider = 'parakeet',
  hasMicrophone = true,
  onEditMeeting,
  onDeleteMeeting,
}) => {
  const router = useRouter();
  const greeting = useMemo(() => getGreeting(), []);

  // Filter out placeholder/mock items if present
  const validMeetings = useMemo(() => {
    return meetings.filter(
      (m) => m.id && !m.id.startsWith('intro-call') && m.title.trim().length > 0
    );
  }, [meetings]);

  return (
    <div className="w-full h-full overflow-y-auto bg-[#eef1f6] flex flex-col items-center px-4 py-8 md:px-8 md:py-10 text-[#0d0f10]">
      <div className="w-full max-w-5xl space-y-8">
        
        {/* Top Broadcast Telemetry Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white border-2 border-[#0d0f10] rounded-xl shadow-[3px_3px_0px_#0d0f10]">
          <div className="flex items-center gap-2.5">
            <span className="brutal-badge brutal-badge-live">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              SYSTEM ONLINE
            </span>
            <span className="brutal-badge brutal-badge-tech hidden sm:inline-flex">
              VOXA CONSOLE // V2
            </span>
            <span className="brutal-badge brutal-badge-tech hidden md:inline-flex">
              16 KHZ DUAL LOOPBACK
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 inline" />
            <span className="hidden sm:inline">ZERO CLOUD UPLOAD ·</span>
            <span>100% ON-DEVICE</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0d0f10] text-white rounded-md text-xs font-mono font-bold tracking-widest uppercase shadow-[2px_2px_0px_#2563eb]">
            <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            BROADCAST INTELLIGENCE DESK
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#0d0f10] uppercase">
            {greeting}, OPERATOR.
          </h1>
          <p className="text-sm md:text-base text-zinc-700 max-w-3xl leading-relaxed font-medium">
            Local-first meeting intelligence engine. Monitor conversations, record dual-channel audio,
            stream real-time transcripts, and extract structured summaries entirely on your machine.
          </p>
        </div>

        {/* Master Control Operations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Live Audio Recording */}
          <div className="brutal-card brutal-card-hover p-6 flex flex-col justify-between space-y-6 bg-white border-2 border-[#0d0f10]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="brutal-badge brutal-badge-record">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                  LIVE CAPTURE
                </span>
                {/* Audio visualizer bars preview */}
                <div className="flex items-end gap-1 h-5 px-2 bg-zinc-100 rounded border border-[#0d0f10]">
                  <span className="meter-bar" style={{ animationDelay: '0ms' }} />
                  <span className="meter-bar" style={{ animationDelay: '150ms' }} />
                  <span className="meter-bar" style={{ animationDelay: '300ms' }} />
                  <span className="meter-bar" style={{ animationDelay: '75ms' }} />
                </div>
              </div>

              <h2 className="text-xl font-black uppercase tracking-tight text-[#0d0f10]">
                Live Session Console
              </h2>
              <p className="text-xs text-zinc-600 font-medium leading-relaxed">
                Records microphone input alongside system audio (Zoom, Google Meet, Teams) with instant VAD segmentation.
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t-2 border-zinc-100">
              <button
                type="button"
                onClick={onStartMeeting}
                disabled={isStartingRecording}
                className="brutal-btn brutal-btn-record w-full flex items-center justify-center gap-2.5 py-3 text-sm font-black uppercase tracking-wider text-white"
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <Mic className="w-3.5 h-3.5" />
                </div>
                <span>{isStartingRecording ? 'INITIALIZING ENGINE...' : 'START RECORDING CONSOLE'}</span>
              </button>

              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 font-semibold">
                <span>CH 01: MIC ({hasMicrophone ? 'ONLINE' : 'CHECK'})</span>
                <span>CH 02: SYSTEM LOOPBACK</span>
              </div>
            </div>
          </div>

          {/* Card 2: Offline Media Ingest */}
          <div className="brutal-card brutal-card-hover p-6 flex flex-col justify-between space-y-6 bg-white border-2 border-[#0d0f10]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="brutal-badge brutal-badge-accent">
                  <Layers className="w-3 h-3 text-blue-700 inline mr-1" />
                  FILE INGEST
                </span>
                <span className="text-[10px] font-mono font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-300">
                  BATCH VAD
                </span>
              </div>

              <h2 className="text-xl font-black uppercase tracking-tight text-[#0d0f10]">
                Import & Retranscribe
              </h2>
              <p className="text-xs text-zinc-600 font-medium leading-relaxed">
                Ingest existing audio recordings to generate new timestamped transcripts or enhance past sessions.
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t-2 border-zinc-100">
              <button
                type="button"
                onClick={onImportAudio}
                className="brutal-btn brutal-btn-primary w-full flex items-center justify-center gap-2.5 py-3 text-sm font-black uppercase tracking-wider text-white"
              >
                <Upload className="w-4 h-4" />
                <span>IMPORT AUDIO FILE</span>
              </button>

              <div className="text-center text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider">
                SUPPORTS .M4A · .MP3 · .WAV · .AAC · .FLAC
              </div>
            </div>
          </div>

          {/* Card 3: Engine Telemetry & Pipeline */}
          <div className="brutal-card p-6 flex flex-col justify-between space-y-6 bg-white border-2 border-[#0d0f10] md:col-span-2 lg:col-span-1">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="brutal-badge brutal-badge-tech">
                  <Activity className="w-3 h-3 text-zinc-700 inline mr-1" />
                  ENGINE STATUS
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <h2 className="text-xl font-black uppercase tracking-tight text-[#0d0f10]">
                Hardware Profile
              </h2>

              <div className="space-y-2 text-xs font-mono font-semibold pt-1">
                <div className="flex items-center justify-between p-2 rounded bg-zinc-50 border border-zinc-200">
                  <span className="text-zinc-500">STT ENGINE:</span>
                  <span className="text-[#0d0f10] uppercase font-bold">{modelProvider} (METAL / GPU)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-zinc-50 border border-zinc-200">
                  <span className="text-zinc-500">VAD REDEMPTION:</span>
                  <span className="text-[#0d0f10] font-bold">500MS (STREAMING)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-zinc-50 border border-zinc-200">
                  <span className="text-zinc-500">STORAGE DB:</span>
                  <span className="text-emerald-700 font-bold">SQLITE WAL (LOCAL)</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t-2 border-zinc-100 text-[11px] font-mono text-zinc-600 font-semibold flex items-center justify-between">
              <span>SECURITY: ISOLATED LOCAL</span>
              <span className="text-emerald-700 font-bold">✓ HARDENED</span>
            </div>
          </div>

        </div>

        {/* Recent Meetings Log Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-[#0d0f10] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#0d0f10]" />
                Recent Meeting Sessions
              </h2>
              {validMeetings.length > 0 && (
                <span className="brutal-badge brutal-badge-tech">
                  {validMeetings.length} {validMeetings.length === 1 ? 'SESSION' : 'SESSIONS'}
                </span>
              )}
            </div>
          </div>

          {validMeetings.length === 0 ? (
            /* Empty State */
            <div className="brutal-card p-10 md:p-14 text-center bg-white border-2 border-[#0d0f10] space-y-4">
              <div className="w-14 h-14 mx-auto rounded-xl bg-zinc-100 border-2 border-[#0d0f10] shadow-[2px_2px_0px_#0d0f10] flex items-center justify-center text-[#0d0f10]">
                <FileText className="w-7 h-7" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-lg font-black uppercase tracking-wide text-[#0d0f10]">
                  No Sessions Logged Yet
                </h3>
                <p className="text-xs text-zinc-600 font-medium leading-relaxed">
                  Click <strong className="text-[#0d0f10]">Start Recording Console</strong> above to launch your first
                  session. All transcripts and recordings remain strictly confidential on your Mac.
                </p>
              </div>
            </div>
          ) : (
            /* Sessions Log Cards */
            <div className="space-y-3">
              <TooltipProvider>
                {validMeetings.slice(0, 10).map((meeting, index) => (
                  <div
                    key={meeting.id}
                    onClick={() => router.push(`/meeting-details?id=${meeting.id}`)}
                    className="brutal-card brutal-card-hover p-4 md:p-5 bg-white border-2 border-[#0d0f10] flex items-center justify-between gap-4 cursor-pointer group"
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-11 h-11 rounded-lg bg-zinc-100 border-2 border-[#0d0f10] shadow-[2px_2px_0px_#0d0f10] flex items-center justify-center text-[#0d0f10] flex-shrink-0 group-hover:bg-[#0d0f10] group-hover:text-white transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm md:text-base font-extrabold text-[#0d0f10] truncate uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                            {meeting.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-mono font-semibold text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-zinc-400" />
                            {formatRelativeTime(index)}
                          </span>
                          <span>•</span>
                          <span className="text-zinc-600">ID: {meeting.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {onEditMeeting && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditMeeting(meeting.id, meeting.title);
                              }}
                              className="p-2 text-zinc-600 hover:text-[#0d0f10] hover:bg-zinc-100 rounded-md border border-transparent hover:border-[#0d0f10] transition-all"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Rename session</p>
                          </TooltipContent>
                        </Tooltip>
                      )}

                      {onDeleteMeeting && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteMeeting(meeting.id);
                              }}
                              className="p-2 text-zinc-600 hover:text-red-700 hover:bg-red-50 rounded-md border border-transparent hover:border-red-600 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Purge session data</p>
                          </TooltipContent>
                        </Tooltip>
                      )}

                      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md border-2 border-[#0d0f10] bg-white font-mono text-xs font-bold text-[#0d0f10] shadow-[2px_2px_0px_#0d0f10] group-hover:bg-[#0d0f10] group-hover:text-white transition-all">
                        <span>OPEN CONSOLE</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </TooltipProvider>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
