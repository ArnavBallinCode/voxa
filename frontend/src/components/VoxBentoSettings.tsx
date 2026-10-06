'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Globe, Radio, Shield, Cloud, LogOut, CheckCircle2, RefreshCw } from 'lucide-react';
import { VoxBentoIntegration, type VoxBentoConnectionState, type VoxBentoEvent } from '@/integrations/voxbento';
import { toast } from 'sonner';

export function VoxBentoSettings() {
  const [connectionState, setConnectionState] = useState<VoxBentoConnectionState>(
    VoxBentoIntegration.getState()
  );
  const [serverUrl, setServerUrl] = useState(connectionState.serverUrl || 'https://voxbento.org');
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<VoxBentoEvent[]>([]);
  const [selectedEventSlug, setSelectedEventSlug] = useState<string>('');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');

  useEffect(() => {
    const unsubscribe = VoxBentoIntegration.subscribe((state) => {
      setConnectionState(state);
      setServerUrl(state.serverUrl);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (connectionState.isConnected) {
      loadEvents();
    }
  }, [connectionState.isConnected]);

  const loadEvents = async () => {
    try {
      const list = await VoxBentoIntegration.listEvents();
      setEvents(list);
    } catch {
      // offline or unconfigured
    }
  };

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await VoxBentoIntegration.connectAccount(serverUrl);
      toast.success('Opened browser for VoxBento account authentication');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to connect to VoxBento instance');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await VoxBentoIntegration.disconnectAccount();
      toast.success('Disconnected from VoxBento');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to disconnect');
    }
  };

  const handleLinkSession = () => {
    if (!selectedEventSlug || !selectedRoomId) {
      toast.error('Please select both an event and a room to link');
      return;
    }
    VoxBentoIntegration.linkSession(selectedEventSlug, selectedRoomId);
    toast.success('Linked Voxa session with VoxBento room');
  };

  const handleUnlinkSession = () => {
    VoxBentoIntegration.unlinkSession();
    toast.success('Unlinked VoxBento session');
  };

  return (
    <div className="space-y-6 max-w-4xl py-2">
      {/* Header Info */}
      <div className="flex items-start justify-between border-2 border-[#0d0f10] shadow-[3px_3px_0px_#0d0f10] rounded-xl p-4 bg-white">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-400 border-2 border-[#0d0f10] flex items-center justify-center font-black">
            <Radio className="w-5 h-5 text-[#0d0f10]" />
          </div>
          <div>
            <h2 className="text-base font-black uppercase tracking-wider text-[#0d0f10]">
              VoxBento Cloud Connect
            </h2>
            <p className="text-xs text-gray-600 font-mono mt-0.5">
              Connect Voxa on-device intelligence with your VoxBento interpretation console.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {connectionState.isConnected ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-700 border border-zinc-300">
              Disconnected
            </span>
          )}
        </div>
      </div>

      {/* Account Authentication Card */}
      <div className="border-2 border-[#0d0f10] shadow-[3px_3px_0px_#0d0f10] rounded-xl p-4 bg-white space-y-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-[#0d0f10]">
            1. VoxBento Instance & Account
          </h3>
          <p className="text-xs text-gray-500 font-mono mt-0.5">
            Enter your self-hosted or managed VoxBento server address.
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider">Instance URL</Label>
          <div className="flex gap-2">
            <Input
              placeholder="https://voxbento.org"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              disabled={connectionState.isConnected || isLoading}
              className="font-mono text-xs border-2 border-[#0d0f10] shadow-[2px_2px_0px_#0d0f10]"
            />
            {connectionState.isConnected ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="border-2 border-[#0d0f10] shadow-[2px_2px_0px_#0d0f10] font-bold text-xs uppercase"
              >
                <LogOut className="w-3.5 h-3.5 mr-1 text-red-600" />
                Disconnect
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleConnect}
                disabled={isLoading}
                className="bg-[#0d0f10] text-white hover:bg-zinc-800 border-2 border-[#0d0f10] shadow-[2px_2px_0px_#0d0f10] font-bold text-xs uppercase"
              >
                <Cloud className="w-3.5 h-3.5 mr-1" />
                Sign In
              </Button>
            )}
          </div>
        </div>

        {connectionState.organizer && (
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-xs font-mono flex items-center justify-between">
            <div>
              <span className="font-bold text-zinc-800">{connectionState.organizer.name}</span>
              <span className="text-zinc-500 ml-2">({connectionState.organizer.email})</span>
            </div>
            <span className="text-xs text-zinc-400">Authenticated</span>
          </div>
        )}
      </div>

      {/* Cloud Session Linking */}
      {connectionState.isConnected && (
        <div className="border-2 border-[#0d0f10] shadow-[3px_3px_0px_#0d0f10] rounded-xl p-4 bg-white space-y-4">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0d0f10]">
              2. Link Event & Room
            </h3>
            <p className="text-xs text-gray-500 font-mono mt-0.5">
              Synchronize live transcripts or captions with a specific event booth.
            </p>
          </div>

          {connectionState.activeLinkedSession ? (
            <div className="border border-green-300 bg-green-50 rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-green-900 font-mono">
                  Linked to: {connectionState.activeLinkedSession.eventSlug} / Room #{connectionState.activeLinkedSession.roomId}
                </div>
                <div className="text-[11px] text-green-700 font-mono mt-0.5">
                  Connected at {new Date(connectionState.activeLinkedSession.linkedAt).toLocaleTimeString()}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUnlinkSession}
                className="border-2 border-[#0d0f10] font-bold text-xs uppercase"
              >
                Unlink
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wider">Select Event</Label>
                    <select
                      value={selectedEventSlug}
                      onChange={(e) => setSelectedEventSlug(e.target.value)}
                      className="w-full mt-1.5 px-3 py-2 border-2 border-[#0d0f10] shadow-[2px_2px_0px_#0d0f10] rounded-lg text-xs font-mono bg-white"
                    >
                      <option value="">-- Choose Event --</option>
                      {events.map((ev) => (
                        <option key={ev.slug} value={ev.slug}>
                          {ev.title} ({ev.slug})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wider">Select Room</Label>
                    <select
                      value={selectedRoomId}
                      onChange={(e) => setSelectedRoomId(e.target.value)}
                      className="w-full mt-1.5 px-3 py-2 border-2 border-[#0d0f10] shadow-[2px_2px_0px_#0d0f10] rounded-lg text-xs font-mono bg-white"
                    >
                      <option value="">-- Choose Room --</option>
                      {events
                        .find((ev) => ev.slug === selectedEventSlug)
                        ?.rooms.map((rm) => (
                          <option key={rm.id} value={rm.id}>
                            {rm.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-500 font-mono py-2">
                  No active events found on this account.{' '}
                  <button
                    onClick={loadEvents}
                    className="text-blue-600 underline font-bold"
                  >
                    Refresh
                  </button>
                </div>
              )}

              <Button
                size="sm"
                onClick={handleLinkSession}
                disabled={!selectedEventSlug || !selectedRoomId}
                className="bg-[#0d0f10] text-white hover:bg-zinc-800 border-2 border-[#0d0f10] shadow-[2px_2px_0px_#0d0f10] font-bold text-xs uppercase"
              >
                Link Active Meeting
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Privacy & Sovereignty Guardrails */}
      <div className="border-2 border-[#0d0f10] shadow-[3px_3px_0px_#0d0f10] rounded-xl p-4 bg-amber-50/40 space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-700" />
            <h3 className="text-sm font-black uppercase tracking-wider text-amber-950">
              3. Privacy Guardrails (Local Sovereignty)
            </h3>
          </div>
          <p className="text-xs text-amber-900 font-mono mt-0.5">
            Voxa guarantees zero raw audio upload. You decide what text data synchronizes.
          </p>
        </div>

        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between py-1 border-b border-amber-200/60 pb-2">
            <div className="space-y-0.5">
              <Label className="text-xs font-bold text-zinc-900">Audio Upload Disabled</Label>
              <p className="text-[11px] text-gray-600 font-mono">
                Microphone and system audio strictly process on-device.
              </p>
            </div>
            <Switch checked={false} disabled={true} />
          </div>

          <div className="flex items-center justify-between py-1 border-b border-amber-200/60 pb-2">
            <div className="space-y-0.5">
              <Label className="text-xs font-bold text-zinc-900">Sync Transcript Segments</Label>
              <p className="text-[11px] text-gray-600 font-mono">
                Upload text segments to linked VoxBento room in real-time.
              </p>
            </div>
            <Switch
              checked={connectionState.privacy.syncTranscript}
              onCheckedChange={(checked) =>
                VoxBentoIntegration.updatePrivacySettings({ syncTranscript: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="space-y-0.5">
              <Label className="text-xs font-bold text-zinc-900">Sync AI Summary</Label>
              <p className="text-[11px] text-gray-600 font-mono">
                Publish executive summary & decisions to event archives.
              </p>
            </div>
            <Switch
              checked={connectionState.privacy.syncSummary}
              onCheckedChange={(checked) =>
                VoxBentoIntegration.updatePrivacySettings({ syncSummary: checked })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
