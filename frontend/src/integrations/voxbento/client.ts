/**
 * VoxBento Integration — REST API Client
 * 
 * Provides communication with VoxBento backend services.
 */

import { VoxBentoAuth } from './auth';
import type { VoxBentoOrganizer, VoxBentoEvent, VoxBentoRoom } from './types';

export class VoxBentoClient {
  private serverUrl: string;

  constructor(serverUrl: string = 'https://voxbento.org') {
    this.serverUrl = serverUrl.replace(/\/+$/, '');
  }

  setServerUrl(url: string) {
    this.serverUrl = url.replace(/\/+$/, '');
  }

  private async fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await VoxBentoAuth.getStoredToken();
    if (!token) {
      throw new Error('VoxBento authentication required. Please connect your account.');
    }

    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${token}`);
    headers.set('Accept', 'application/json');

    const res = await fetch(`${this.serverUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      await VoxBentoAuth.clearCredentials();
      throw new Error('VoxBento session expired. Please reconnect your account.');
    }

    if (!res.ok) {
      throw new Error(`VoxBento request failed (${res.status}): ${res.statusText}`);
    }

    return res.json() as Promise<T>;
  }

  /**
   * Fetches profile of currently authenticated organizer
   */
  async getOrganizer(): Promise<VoxBentoOrganizer> {
    return this.fetchWithAuth<VoxBentoOrganizer>('/api/v1/organizer/me');
  }

  /**
   * Lists events accessible to current organizer
   */
  async listEvents(): Promise<VoxBentoEvent[]> {
    return this.fetchWithAuth<VoxBentoEvent[]>('/api/v1/events');
  }

  /**
   * Fetches details of a specific event
   */
  async getEvent(eventSlug: string): Promise<VoxBentoEvent> {
    return this.fetchWithAuth<VoxBentoEvent>(`/api/v1/events/${eventSlug}`);
  }

  /**
   * Syncs transcript segment to linked VoxBento session
   */
  async syncTranscriptSegment(
    eventSlug: string,
    roomId: string,
    segment: { speaker?: string; text: string; timestampMs: number }
  ): Promise<{ success: boolean }> {
    return this.fetchWithAuth<{ success: boolean }>(
      `/api/v1/events/${eventSlug}/rooms/${roomId}/transcripts`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(segment),
      }
    );
  }

  /**
   * Syncs AI meeting summary to linked VoxBento session
   */
  async syncSummary(
    eventSlug: string,
    roomId: string,
    summary: { title: string; markdownContent: string; actionItems?: string[] }
  ): Promise<{ success: boolean }> {
    return this.fetchWithAuth<{ success: boolean }>(
      `/api/v1/events/${eventSlug}/rooms/${roomId}/summary`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(summary),
      }
    );
  }
}
