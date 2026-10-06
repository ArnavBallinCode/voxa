import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Copy, FolderOpen, RefreshCw, Download, FileText, FileCode } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Analytics from '@/lib/analytics';
import { RetranscribeDialog } from './RetranscribeDialog';
import { useConfig } from '@/contexts/ConfigContext';

interface TranscriptButtonGroupProps {
  transcriptCount: number;
  onCopyTranscript: () => void;
  onOpenMeetingFolder: () => Promise<void>;
  meetingId?: string;
  meetingFolderPath?: string | null;
  onRefetchTranscripts?: () => Promise<void>;
  onExportMarkdown?: (style?: 'generic' | 'obsidian') => void;
  onExportText?: () => void;
}

export function TranscriptButtonGroup({
  transcriptCount,
  onCopyTranscript,
  onOpenMeetingFolder,
  meetingId,
  meetingFolderPath,
  onRefetchTranscripts,
  onExportMarkdown,
  onExportText,
}: TranscriptButtonGroupProps) {
  const { betaFeatures } = useConfig();
  const [showRetranscribeDialog, setShowRetranscribeDialog] = useState(false);

  const handleRetranscribeComplete = useCallback(async () => {
    if (onRefetchTranscripts) {
      await onRefetchTranscripts();
    }
  }, [onRefetchTranscripts]);

  return (
    <div className="flex items-center justify-center w-full gap-2">
      <ButtonGroup>
        <Button
          variant="outline"
          size="sm"
          className="px-2 @[22rem]:px-3 border-2 border-[#0d0f10] shadow-[2px_2px_0px_#0d0f10] font-bold text-xs uppercase tracking-wider hover:bg-zinc-100 text-[#0d0f10]"
          onClick={() => {
            Analytics.trackButtonClick('copy_transcript', 'meeting_details');
            onCopyTranscript();
          }}
          disabled={transcriptCount === 0}
          title={transcriptCount === 0 ? 'No transcript available' : 'Copy Transcript'}
        >
          <Copy className="w-3.5 h-3.5" />
          <span className="hidden @[22rem]:inline text-xs ml-1">Copy</span>
        </Button>

        {(onExportMarkdown || onExportText) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="px-2 @[22rem]:px-3 border-2 border-[#0d0f10] shadow-[2px_2px_0px_#0d0f10] font-bold text-xs uppercase tracking-wider hover:bg-zinc-100 text-[#0d0f10]"
                disabled={transcriptCount === 0}
                title="Export Transcript"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden @[22rem]:inline text-xs ml-1">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="border-2 border-[#0d0f10] shadow-[4px_4px_0px_#0d0f10] rounded-lg bg-white">
              {onExportMarkdown && (
                <>
                  <DropdownMenuItem onClick={() => onExportMarkdown('generic')} className="cursor-pointer font-bold text-xs uppercase tracking-wider">
                    <FileCode className="w-4 h-4 mr-2 text-blue-600" />
                    <span>Markdown (.md)</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExportMarkdown('obsidian')} className="cursor-pointer font-bold text-xs uppercase tracking-wider">
                    <FileCode className="w-4 h-4 mr-2 text-purple-600" />
                    <span>Obsidian (.md)</span>
                  </DropdownMenuItem>
                </>
              )}
              {onExportText && (
                <DropdownMenuItem onClick={onExportText} className="cursor-pointer font-bold text-xs uppercase tracking-wider">
                  <FileText className="w-4 h-4 mr-2 text-zinc-700" />
                  <span>Plain Text (.txt)</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button
          size="sm"
          variant="outline"
          className="px-2 @[22rem]:px-4 border-2 border-[#0d0f10] shadow-[2px_2px_0px_#0d0f10] font-bold text-xs uppercase tracking-wider hover:bg-zinc-100 text-[#0d0f10]"
          onClick={() => {
            Analytics.trackButtonClick('open_recording_folder', 'meeting_details');
            onOpenMeetingFolder();
          }}
          title="Open Recording Folder"
        >
          <FolderOpen className="@[22rem]:mr-2" size={16} />
          <span className="hidden @[22rem]:inline">Folder</span>
        </Button>

        {betaFeatures.importAndRetranscribe && meetingId && meetingFolderPath && (
          <Button
            size="sm"
            variant="outline"
            className="bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-blue-200 px-2 @[22rem]:px-4"
            onClick={() => {
              Analytics.trackButtonClick('enhance_transcript', 'meeting_details');
              setShowRetranscribeDialog(true);
            }}
            title="Retranscribe to enhance your recorded audio"
          >
            <RefreshCw className="@[22rem]:mr-2" size={18} />
            <span className="hidden @[22rem]:inline">Enhance</span>
          </Button>
        )}
      </ButtonGroup>

      {betaFeatures.importAndRetranscribe && meetingId && meetingFolderPath && (
        <RetranscribeDialog
          open={showRetranscribeDialog}
          onOpenChange={setShowRetranscribeDialog}
          meetingId={meetingId}
          meetingFolderPath={meetingFolderPath}
          onComplete={handleRetranscribeComplete}
        />
      )}
    </div>
  );
}
