"use client";

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Copy, Save, Loader2 } from 'lucide-react';
import Analytics from '@/lib/analytics';

interface SummaryUpdaterButtonGroupProps {
  isSaving: boolean;
  isDirty: boolean;
  onSave: () => Promise<void>;
  onCopy: () => Promise<void>;
}

export function SummaryUpdaterButtonGroup({
  isSaving,
  isDirty,
  onSave,
  onCopy,
}: SummaryUpdaterButtonGroupProps) {
  return (
    <ButtonGroup className="gap-2">
      {/* Save button */}
      <Button
        variant="outline"
        size="sm"
        className={`brutal-btn ${isDirty ? 'bg-emerald-300' : 'bg-white'} text-xs font-mono uppercase tracking-wider h-8 px-3`}
        title={isSaving ? "Saving" : "Save Changes"}
        onClick={() => {
          Analytics.trackButtonClick('save_changes', 'meeting_details');
          onSave();
        }}
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <Loader2 className="animate-spin h-3.5 w-3.5 mr-1" />
            <span className="hidden @[40rem]:inline">Saving...</span>
          </>
        ) : (
          <>
            <Save className="h-3.5 w-3.5 mr-1" />
            <span className="hidden @[40rem]:inline">Save</span>
          </>
        )}
      </Button>

      {/* Copy button */}
      <Button
        variant="outline"
        size="sm"
        title="Copy Summary"
        onClick={() => {
          Analytics.trackButtonClick('copy_summary', 'meeting_details');
          onCopy();
        }}
        className="brutal-btn bg-white text-xs font-mono uppercase tracking-wider h-8 px-3 cursor-pointer"
      >
        <Copy className="h-3.5 w-3.5 mr-1" />
        <span className="hidden @[40rem]:inline">Copy</span>
      </Button>
    </ButtonGroup>
  );
}
