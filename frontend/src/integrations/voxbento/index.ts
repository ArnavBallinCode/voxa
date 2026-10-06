/**
 * VoxBento Integration — Public Service Boundary
 * 
 * Philosophy: Local by default. Connected when useful.
 * 
 * Rules:
 * 1. Audio never leaves the user's computer.
 * 2. Cloud syncing of transcripts or summaries is strictly opt-in.
 * 3. Voxa remains 100% operational without VoxBento.
 */

import { VoxBentoAuth } from './auth';
import { VoxBentoClient } from './client';
import { VoxBentoSessionManager } from './session';
import type {
  VoxBentoConnectionState,
  VoxBentoPrivacySettings,
  VoxBentoOrganizer,
  VoxBentoEvent,
} from './types';

const DEFAULT_PRIVACY_SETTINGS: VoxBentoPrivacySettings = {
  audioUploadAllowed: false, // Invariant: always false
  syncTranscript: false,     // Opt-in
  syncSummary: false,        // Opt-in
  receiveLiveCaptions: true, // Receive-only
};

class VoxBentoIntegrationService {
  private client: VoxBentoClient;
  private sessionManager: VoxBentoSessionManager;
  private state: VoxBentoConnectionState = {
    isConnected: false,
    organizer: null,
    serverUrl: 'https://voxbento.org',
    privacy: { ...DEFAULT_PRIVACY_SETTINGS },
    activeLinkedSession: null,
    lastSyncAt: null,
  };
  private listeners: Set<(state: VoxBentoConnectionState) => void> = new Set();

  constructor() {
    this.client = new VoxBentoClient(this.state.serverUrl);
    this.sessionManager = new VoxBentoSessionManager();
    this.loadPersistedState();
  }

  private async loadPersistedState() {
    try {
      const token = await VoxBentoAuth.getStoredToken();
      if (token) {
        const organizer = await this.client.getOrganizer();
        this.updateState({
          isConnected: true,
          organizer,
        });
      }
    } catch {
      // Offline or unauthenticated
      this.updateState({ isConnected: false, organizer: null });
    }
  }

  private updateState(partial: Partial<VoxBentoConnectionState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((listener) => listener(this.state));
  }

  getState(): VoxBentoConnectionState {
    return { ...this.state };
  }

  subscribe(listener: (state: VoxBentoConnectionState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  /**
   * Connects VoxBento account via browser OAuth
   */
  async connectAccount(serverUrl?: string): Promise<void> {
    const url = serverUrl || this.state.serverUrl;
    this.client.setServerUrl(url);
    await VoxBentoAuth.startOAuthFlow(url);
  }

  /**
   * Completes OAuth connection with authorization code
   */
  async handleOAuthCallback(code: string, verifier: string): Promise<VoxBentoOrganizer> {
    await VoxBentoAuth.exchangeCodeForTokens(this.state.serverUrl, code, verifier);
    const organizer = await this.client.getOrganizer();
    this.updateState({
      isConnected: true,
      organizer,
    });
    return organizer;
  }

  /**
   * Disconnects account and clears tokens
   */
  async disconnectAccount(): Promise<void> {
    await VoxBentoAuth.clearCredentials();
    this.sessionManager.disconnect();
    this.updateState({
      isConnected: false,
      organizer: null,
      activeLinkedSession: null,
    });
  }

  /**
   * Updates user privacy settings
   */
  updatePrivacySettings(settings: Partial<VoxBentoPrivacySettings>) {
    // Invariant: audioUploadAllowed cannot be forced to true
    const updated = {
      ...this.state.privacy,
      ...settings,
      audioUploadAllowed: false,
    };
    this.updateState({ privacy: updated });
  }

  /**
   * Lists events for the authenticated organizer
   */
  async listEvents(): Promise<VoxBentoEvent[]> {
    if (!this.state.isConnected) return [];
    return this.client.listEvents();
  }

  /**
   * Links a local Voxa meeting to a remote VoxBento session
   */
  linkSession(eventSlug: string, roomId: string, boothId?: string) {
    this.updateState({
      activeLinkedSession: {
        eventSlug,
        roomId,
        boothId,
        linkedAt: new Date().toISOString(),
      },
    });
  }

  /**
   * Unlinks the active session
   */
  unlinkSession() {
    this.sessionManager.disconnect();
    this.updateState({ activeLinkedSession: null });
  }

  /**
   * Gets session manager for live caption feeds
   */
  getSessionManager(): VoxBentoSessionManager {
    return this.sessionManager;
  }
}

export const VoxBentoIntegration = new VoxBentoIntegrationService();
export * from './types';
export * from './auth';
export * from './client';
export * from './session';
