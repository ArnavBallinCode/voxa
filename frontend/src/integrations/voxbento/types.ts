/**
 * VoxBento Integration — Type Definitions
 * 
 * Provides types for connecting Voxa (local meeting intelligence)
 * with VoxBento (real-time multilingual event & interpretation infrastructure).
 */

export interface VoxBentoOrganizer {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface VoxBentoEvent {
  id: string;
  slug: string;
  title: string;
  description?: string;
  startsAt: string;
  endsAt: string;
  rooms: VoxBentoRoom[];
}

export interface VoxBentoRoom {
  id: string;
  name: string;
  eventSlug: string;
  jitsiRoomName: string;
  booths: VoxBentoBooth[];
}

export interface VoxBentoBooth {
  boothId: string;       // e.g. "pycon2026-en"
  languageCode: string;  // ISO 639-1 (e.g. "en", "es", "ja")
  languageName: string;  // e.g. "English", "Spanish"
  whipUrl: string;       // WebRTC ingest
  whepUrl: string;       // WebRTC playback
  wsUrl: string;         // Live booth coordination & captions feed
}

export interface VoxBentoAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;     // Unix timestamp (ms)
  tokenType: string;
}

export interface VoxBentoPrivacySettings {
  /** Never upload raw meeting audio (Strict local-only audio principle) */
  audioUploadAllowed: boolean;
  /** Allow syncing transcript segments to linked VoxBento session */
  syncTranscript: boolean;
  /** Allow syncing post-meeting AI summary to linked VoxBento session */
  syncSummary: boolean;
  /** Allow receiving live multilingual captions from VoxBento in Voxa UI */
  receiveLiveCaptions: boolean;
}

export interface VoxBentoConnectionState {
  isConnected: boolean;
  organizer: VoxBentoOrganizer | null;
  serverUrl: string;
  privacy: VoxBentoPrivacySettings;
  activeLinkedSession: {
    eventSlug: string;
    roomId: string;
    boothId?: string;
    linkedAt: string;
  } | null;
  lastSyncAt: string | null;
}
