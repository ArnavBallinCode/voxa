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
  Sparkles,
  Radio,
  Pencil,
  Trash2,
} from 'lucide-react';
import type { CurrentMeeting } from '@/components/Sidebar/SidebarProvider';
import { Button } from '@/components/ui/button';
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
  // Graceful mockup/fallback relative time for local meetings
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

  // Filter out any template/mock items like "intro-call" if present
  const validMeetings = useMemo(() => {
    return meetings.filter(
      (m) => m.id && !m.id.startsWith('intro-call') && m.title.trim().length > 0
    );
  }, [meetings]);

  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-b from-zinc-50/70 via-white to-zinc-50/30 flex flex-col items-center px-6 py-10 md:py-14 text-zinc-900">
      <div className="w-full max-w-4xl space-y-10">
        {/* Brand & Greeting Hero */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-900 text-white tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              VOXA
            </span>
            <span className="text-xs text-zinc-600 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Local-first · Zero cloud audio upload
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">
            {greeting}
          </h1>
          <p className="text-base md:text-lg text-zinc-700 max-w-2xl leading-relaxed">
            Open-source meeting intelligence. Capture conversations, generate timestamped
            transcripts, and extract summaries with completely local AI.
          </p>
        </div>

        {/* Primary Action Section */}
        <div className="p-6 md:p-8 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <Button
              size="lg"
              onClick={onStartMeeting}
              disabled={isStartingRecording}
              className="bg-zinc-900 hover:bg-zinc-800 text-white px-7 py-6 rounded-xl font-semibold text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-full bg-red-700 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <Mic className="w-4 h-4 animate-pulse" />
              </div>
              <span>{isStartingRecording ? 'Initializing engine...' : 'Start Meeting'}</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={onImportAudio}
              className="border-zinc-300 hover:bg-zinc-100 text-zinc-800 px-6 py-6 rounded-xl font-medium text-base transition-colors flex items-center justify-center gap-2.5"
            >
              <Upload className="w-4 h-4 text-zinc-600" />
              <span>Import Audio File</span>
            </Button>
          </div>

          {/* Device & Engine Status Pills */}
          <div className="pt-2 border-t border-zinc-100 flex flex-wrap items-center gap-4 text-xs text-zinc-600">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  hasMicrophone ? 'bg-emerald-700' : 'bg-amber-700'
                }`}
              />
              <span>{hasMicrophone ? 'Microphone ready' : 'Microphone check required'}</span>
            </div>
            <span className="text-zinc-400">•</span>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-zinc-500" />
              <span>
                Engine: <strong className="text-zinc-800 capitalize font-medium">{modelProvider}</strong>
              </span>
            </div>
            <span className="text-zinc-400">•</span>
            <div className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-zinc-500" />
              <span>System Audio loopback available</span>
            </div>
          </div>
        </div>

        {/* Recent Meetings Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-zinc-600" />
              Recent Meetings
            </h2>
            {validMeetings.length > 0 && (
              <span className="text-xs font-medium text-zinc-600 px-2.5 py-0.5 bg-zinc-100 rounded-full">
                {validMeetings.length} {validMeetings.length === 1 ? 'meeting' : 'meetings'}
              </span>
            )}
          </div>

          {validMeetings.length === 0 ? (
            /* Polished Empty State */
            <div className="rounded-2xl border border-dashed border-zinc-300 p-10 md:p-14 text-center bg-zinc-50/50 space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-base font-semibold text-zinc-900">No meetings recorded yet</h3>
                <p className="text-sm text-zinc-600">
                  Click <strong className="text-zinc-800">Start Meeting</strong> above to begin your first
                  session with real-time speech transcription. Everything remains strictly on your
                  computer.
                </p>
              </div>
            </div>
          ) : (
            /* Meeting Cards List */
            <div className="bg-white rounded-2xl border border-zinc-200/80 divide-y divide-zinc-100 overflow-hidden shadow-sm">
              <TooltipProvider>
                {validMeetings.slice(0, 10).map((meeting, index) => (
                  <div
                    key={meeting.id}
                    onClick={() => router.push(`/meeting-details?id=${meeting.id}`)}
                    className="p-4 md:p-5 hover:bg-zinc-50/80 transition-colors flex items-center justify-between gap-4 cursor-pointer group"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 flex-shrink-0 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <h4 className="text-sm md:text-base font-semibold text-zinc-900 truncate group-hover:text-zinc-950">
                          {meeting.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-zinc-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatRelativeTime(index)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {onEditMeeting && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditMeeting(meeting.id, meeting.title);
                              }}
                              className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit title</p>
                          </TooltipContent>
                        </Tooltip>
                      )}

                      {onDeleteMeeting && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteMeeting(meeting.id);
                              }}
                              className="p-2 text-zinc-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete meeting</p>
                          </TooltipContent>
                        </Tooltip>
                      )}

                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all">
                        <ArrowRight className="w-4 h-4" />
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
