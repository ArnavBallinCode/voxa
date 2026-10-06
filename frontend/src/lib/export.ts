/**
 * Voxa — Meeting Export Utilities
 * 
 * Clean export functionality for Markdown, plain text, and future PDF/DOCX targets.
 */

import type { Meeting, TranscriptSegment, Summary } from '@/types/storage';

export class MeetingExporter {
  /**
   * Generates a clean Markdown export of the meeting, transcript, and summary
   */
  static toMarkdown(
    meeting: Partial<Meeting>,
    segments: TranscriptSegment[] = [],
    summary?: Partial<Summary>
  ): string {
    const lines: string[] = [];

    // Header
    lines.push(`# ${meeting.title || 'Untitled Meeting'}`);
    lines.push('');
    lines.push(`- **Date:** ${meeting.createdAt ? new Date(meeting.createdAt).toLocaleString() : new Date().toLocaleString()}`);
    if (meeting.durationSeconds) {
      const minutes = Math.floor(meeting.durationSeconds / 60);
      const seconds = meeting.durationSeconds % 60;
      lines.push(`- **Duration:** ${minutes}m ${seconds}s`);
    }
    lines.push('');

    // Summary Section
    if (summary?.content) {
      lines.push('## Executive Summary');
      lines.push('');
      lines.push(summary.content);
      lines.push('');
    }

    // Action Items Section
    if (summary?.actionItems && summary.actionItems.length > 0) {
      lines.push('## Action Items');
      lines.push('');
      for (const item of summary.actionItems) {
        lines.push(`- [ ] ${item.text}${item.assignee ? ` (@${item.assignee})` : ''}`);
      }
      lines.push('');
    }

    // Decisions Section
    if (summary?.decisions && summary.decisions.length > 0) {
      lines.push('## Key Decisions');
      lines.push('');
      for (const decision of summary.decisions) {
        lines.push(`- ${decision.text}`);
      }
      lines.push('');
    }

    // Transcript Section
    if (segments.length > 0) {
      lines.push('## Full Transcript');
      lines.push('');
      for (const seg of segments) {
        const timeStr = this.formatTimestamp(seg.startTime);
        const speaker = seg.speakerName || 'Speaker';
        lines.push(`**[${timeStr}] ${speaker}:** ${seg.text}`);
        lines.push('');
      }
    }

    lines.push('---');
    lines.push('*Generated locally by [Voxa](https://github.com/ArnavBallinCode/voxa) meeting intelligence.*');

    return lines.join('\n');
  }

  /**
   * Generates clean plain text export
   */
  static toPlainText(meeting: Partial<Meeting>, segments: TranscriptSegment[] = []): string {
    const lines: string[] = [];
    lines.push(`${meeting.title || 'Untitled Meeting'}`);
    lines.push(`Date: ${meeting.createdAt ? new Date(meeting.createdAt).toLocaleString() : ''}`);
    lines.push('----------------------------------------');
    lines.push('');

    for (const seg of segments) {
      const timeStr = this.formatTimestamp(seg.startTime);
      const speaker = seg.speakerName || 'Speaker';
      lines.push(`[${timeStr}] ${speaker}: ${seg.text}`);
    }

    return lines.join('\n');
  }

  private static formatTimestamp(seconds: number = 0): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Browser file download helper
   */
  static downloadFile(content: string, filename: string, mimeType: string = 'text/markdown') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
