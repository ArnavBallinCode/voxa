import { VirtualizedTranscriptView } from '@/components/VirtualizedTranscriptView';
import { PermissionWarning } from '@/components/PermissionWarning';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Copy, GlobeIcon } from 'lucide-react';
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
    <div ref={transcriptContainerRef} className="w-full bg-white flex flex-col overflow-y-auto">
      {/* Title area - Sticky header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm px-6 py-3.5 border-b border-zinc-200/80">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {isRecording && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-red-50 text-red-600 border border-red-200">
                <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-500' : 'bg-red-500 animate-pulse'}`} />
                {isPaused ? 'Paused' : 'Live'}
              </span>
            )}
            <h2 className="text-base font-semibold text-zinc-900 truncate">
              {displayTitle}
            </h2>
            {transcripts?.length > 0 && (
              <span className="text-xs text-zinc-400 font-medium">
                {transcripts.length} {transcripts.length === 1 ? 'segment' : 'segments'}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <ButtonGroup>
              {transcripts?.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyTranscript}
                  title="Copy Transcript"
                  className="text-xs"
                >
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  <span>Copy</span>
                </Button>
              )}
              {transcriptModelConfig.provider === "localWhisper" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showModal('languageSettings')}
                  title="Language"
                  className="text-xs"
                >
                  <GlobeIcon className="w-3.5 h-3.5 mr-1" />
                  <span>Language</span>
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
