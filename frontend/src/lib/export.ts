/**
 * Voxa — Meeting Export Utilities
 * 
 * Clean export functionality for Markdown, plain text, and future PDF/DOCX targets.
 */

import type { Meeting, TranscriptSegment, Summary } from '@/types/storage';
import { buildFrontmatter, formatSpeakerMention, type LinkStyle } from './exportMarkdownFrontmatter';
import { isLinkableSpeakerName } from './speakerLabels';

export interface MarkdownExportOptions {
  linkStyle?: LinkStyle;
  includeFrontmatter?: boolean;
}

export class MeetingExporter {
  /**
   * Generates a clean Markdown export of the meeting, transcript, and summary
   */
  static toMarkdown(
    meeting: Partial<Meeting>,
    segments: TranscriptSegment[] = [],
    summary?: Partial<Summary>,
    options: MarkdownExportOptions = { linkStyle: 'generic', includeFrontmatter: true }
  ): string {
    const lines: string[] = [];
    const linkStyle = options.linkStyle || 'generic';

    // Collect identified speakers for frontmatter attendees
    const uniqueSpeakers = Array.from(
      new Set(
        segments
          .map((s) => s.speakerName?.trim())
          .filter((s): s is string => isLinkableSpeakerName(s))
      )
    );

    // Frontmatter (YAML)
    if (options.includeFrontmatter !== false) {
      lines.push(
        buildFrontmatter({
          title: meeting.title || 'Untitled Meeting',
          meetingId: String(meeting.id || ''),
          date: meeting.createdAt ? new Date(meeting.createdAt) : new Date(),
          attendees: uniqueSpeakers,
          linkStyle,
        })
      );
      lines.push('');
    }

    // Header
    lines.push(`# ${meeting.title || 'Untitled Meeting'}`);
    lines.push('');
    lines.push(`- **Date:** ${meeting.createdAt ? new Date(meeting.createdAt).toLocaleString() : new Date().toLocaleString()}`);
    if (meeting.durationSeconds) {
      const minutes = Math.floor(meeting.durationSeconds / 60);
      const seconds = meeting.durationSeconds % 60;
      lines.push(`- **Duration:** ${minutes}m ${seconds}s`);
    }
    if (uniqueSpeakers.length > 0) {
      const attendeesList = uniqueSpeakers
        .map((name) => (linkStyle === 'obsidian' ? `[[${name}]]` : name))
        .join(', ');
      lines.push(`- **Attendees:** ${attendeesList}`);
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
        const speakerLabel = formatSpeakerMention(speaker, linkStyle);
        lines.push(`[${timeStr}] ${speakerLabel} ${seg.text}`);
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
