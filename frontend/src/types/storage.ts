/**
 * Voxa — Storage Architecture & Domain Models
 * 
 * Formal domain models separating concerns for meetings, recordings,
 * transcripts, speakers, summaries, action items, and external integration links.
 */

export interface Speaker {
  id: string;
  name: string;
  color?: string;
  avatarUrl?: string;
  isCurrentUser?: boolean;
}

export interface TranscriptSegment {
  id: string;
  meetingId: string;
  speakerId?: string;
  speakerName?: string;
  text: string;
  startTime: number;     // Seconds from meeting start
  endTime: number;       // Seconds from meeting start
  confidence?: number;
  isEdited?: boolean;
  createdAt: string;
}

export interface ActionItem {
  id: string;
  meetingId: string;
  text: string;
  assignee?: string;
  dueDate?: string;
  completed: boolean;
}

export interface MeetingDecision {
  id: string;
  meetingId: string;
  text: string;
  context?: string;
}

export interface Summary {
  id: string;
  meetingId: string;
  provider: string;      // e.g. "built-in", "ollama", "openai", "claude"
  modelName: string;
  content: string;       // Markdown formatted
  decisions: MeetingDecision[];
  actionItems: ActionItem[];
  generatedAt: string;
  durationSeconds?: number;
}

export interface Recording {
  id: string;
  meetingId: string;
  filePath: string;
  format: 'wav' | 'mp3' | 'm4a';
  durationSeconds: number;
  sampleRate: number;
  channels: number;
  fileSizeBytes?: number;
  recordedAt: string;
}

export interface IntegrationLink {
  id: string;
  meetingId: string;
  provider: 'voxbento' | 'calendar' | 'webhook';
  externalId: string;    // e.g. VoxBento room ID or session slug
  externalUrl?: string;
  syncedAt?: string;
  syncStatus: 'pending' | 'synced' | 'failed' | 'disabled';
}

export interface MeetingMetadata {
  tags?: string[];
  calendarEventId?: string;
  platform?: 'zoom' | 'google-meet' | 'teams' | 'in-person' | 'other';
  notes?: string;
}

export interface Meeting {
  id: string;            // Stable UUID v4
  title: string;
  createdAt: string;
  updatedAt: string;
  durationSeconds: number;
  status: 'recording' | 'processing' | 'completed' | 'error';
  recording?: Recording;
  transcriptCount?: number;
  speakers?: Speaker[];
  summary?: Summary;
  metadata?: MeetingMetadata;
  integrationLink?: IntegrationLink;
}
