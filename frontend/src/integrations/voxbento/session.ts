/**
 * VoxBento Integration — Live Session Coordination & Caption Feed
 * 
 * Manages WebSocket feeds for real-time live captions and multilingual booth streaming.
 */

export interface LiveCaptionMessage {
  type: 'caption';
  languageCode: string;
  speaker?: string;
  text: string;
  isFinal: boolean;
  timestamp: number;
}

export class VoxBentoSessionManager {
  private socket: WebSocket | null = null;
  private captionCallbacks: Set<(caption: LiveCaptionMessage) => void> = new Set();

  /**
   * Connects to VoxBento live caption WebSocket feed
   */
  connectCaptionsFeed(wsUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.socket) {
          this.socket.close();
        }

        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
          console.log('[VoxBento] Connected to live captions WebSocket');
          resolve();
        };

        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'caption') {
              this.captionCallbacks.forEach((cb) => cb(data));
            }
          } catch (e) {
            console.error('[VoxBento] Error parsing WS message:', e);
          }
        };

        this.socket.onerror = (err) => {
          console.error('[VoxBento] WebSocket error:', err);
          reject(err);
        };

        this.socket.onclose = () => {
          console.log('[VoxBento] WebSocket closed');
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Subscribe to live incoming multilingual captions
   */
  onCaption(callback: (caption: LiveCaptionMessage) => void): () => void {
    this.captionCallbacks.add(callback);
    return () => {
      this.captionCallbacks.delete(callback);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.captionCallbacks.clear();
  }
}
