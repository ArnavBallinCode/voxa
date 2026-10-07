import { VirtualizedTranscriptView } from '@/components/VirtualizedTranscriptView';
import { PermissionWarning } from '@/components/PermissionWarning';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Copy, GlobeIcon } from 'lucide-react';
import { LiveLanguageSwitcher } from '@/components/LiveLanguageSwitcher';
import { useTranscripts } from '@/contexts/TranscriptContext';
import { useConfig } from '@/contexts/ConfigContext';
import { useRecordingState } from '@/contexts/RecordingStateContext';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import { ModalType } from '@/hooks/useModalState';
import { useIsLinux } from '@/hooks/usePlatform';
import { useMemo } from 'react';

/**
 * TranscriptPanel Component
 *
 * Displays transcript content with controls for copying and language settings.
 * Uses TranscriptContext, ConfigContext, and RecordingStateContext internally.
 */

interface TranscriptPanelProps {
  // indicates stop-processing state for transcripts; derived from backend statuses.
  isProcessingStop: boolean;
  isStopping: boolean;
  showModal: (name: ModalType, message?: string) => void;
}

export function TranscriptPanel({
  isProcessingStop,
  isStopping,
  showModal
}: TranscriptPanelProps) {
  // Contexts
  const { transcripts, transcriptContainerRef, copyTranscript, meetingTitle } = useTranscripts();
  const { transcriptModelConfig } = useConfig();
  const { isRecording, isPaused } = useRecordingState();
  const { checkPermissions, isChecking, hasSystemAudio, hasMicrophone } = usePermissionCheck();
  const isLinux = useIsLinux();

  // Convert transcripts to segments for virtualized view
  const segments = useMemo(() =>
    transcripts.map(t => ({
      id: t.id,
      timestamp: t.audio_start_time ?? 0,
      endTime: t.audio_end_time,
      text: t.text,
      confidence: t.confidence,
    })),
    [transcripts]
  );

  const displayTitle = meetingTitle && meetingTitle !== '+ New Call' ? meetingTitle : 'Live Meeting';

  return (
    <div ref={transcriptContainerRef} className="w-full h-full flex-1 bg-white flex flex-col overflow-y-auto">
      {/* Title area - Sticky header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm px-6 py-3.5 border-b border-zinc-200/80">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {isRecording && (
              <span className={`brutal-badge ${isPaused ? 'bg-amber-100 text-amber-950' : 'brutal-badge-record'}`}>
                <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-600' : 'bg-red-600 animate-pulse'}`} />
                {isPaused ? 'STANDBY // PAUSED' : 'ON AIR // LIVE INGEST'}
              </span>
            )}
            <h2 className="text-base font-black uppercase tracking-tight text-[#0d0f10] truncate">
              {displayTitle}
            </h2>
            {transcripts?.length > 0 && (
              <span className="brutal-badge brutal-badge-tech">
                {transcripts.length} {transcripts.length === 1 ? 'SEGMENT' : 'SEGMENTS'}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <LiveLanguageSwitcher isRecording={isRecording} />
            <ButtonGroup>
              {transcripts?.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyTranscript}
                  title="Copy Transcript"
                  className="border-2 border-[#0d0f10] shadow-[2px_2px_0px_#0d0f10] font-bold text-xs uppercase tracking-wider hover:bg-zinc-100 text-[#0d0f10]"
                >
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  <span>Copy</span>
                </Button>
              )}
            </ButtonGroup>
          </div>
        </div>
      </div>

      {/* Permission Warning - Not needed on Linux */}
      {!isRecording && !isChecking && !isLinux && (
        <div className="flex justify-center px-4 pt-4">
          <PermissionWarning
            hasMicrophone={hasMicrophone}
            hasSystemAudio={hasSystemAudio}
            onRecheck={checkPermissions}
            isRechecking={isChecking}
          />
        </div>
      )}

      {/* Transcript content */}
      <div className="pb-20">
        <div className="flex justify-center">
          <div className="w-2/3 max-w-[750px]">
            <VirtualizedTranscriptView
              segments={segments}
              isRecording={isRecording}
              isPaused={isPaused}
              isProcessing={isProcessingStop}
              isStopping={isStopping}
              enableStreaming={isRecording}
              showConfidence={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
