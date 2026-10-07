interface StatusOverlaysProps {
  // Status flags
  isProcessing: boolean;      // Processing transcription after recording stops
  isSaving: boolean;          // Saving transcript to database

  // Layout
  sidebarCollapsed: boolean;  // For responsive margin calculation
}

// Internal reusable component for individual status overlays
interface StatusOverlayProps {
  show: boolean;
  message: string;
  sidebarCollapsed: boolean;
}

function StatusOverlay({ show, message, sidebarCollapsed }: StatusOverlayProps) {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 pointer-events-none transition-all duration-300 ease-out animate-in fade-in-0 slide-in-from-bottom-3">
      <div
        className="flex justify-center transition-[margin] duration-300 ease-in-out"
        style={{
          marginLeft: sidebarCollapsed ? '4rem' : '16rem'
        }}
      >
        <div className="flex justify-center pointer-events-auto">
          <div className="bg-[#0d0f10] text-white rounded-xl border-2 border-[#0d0f10] shadow-[4px_4px_0px_#22c55e] px-4 py-2.5 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-emerald-400 border-t-transparent"></div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">{message}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatusOverlays({
  isProcessing,
  isSaving,
  sidebarCollapsed
}: StatusOverlaysProps) {
  if (!isProcessing && !isSaving) return null;

  return (
    <>
      {/* Processing status overlay - shown after recording stops while finalizing transcription */}
      <StatusOverlay
        show={isProcessing}
        message="Finalizing transcription..."
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Saving status overlay - shown while saving transcript to database */}
      <StatusOverlay
        show={isSaving}
        message="Saving transcript..."
        sidebarCollapsed={sidebarCollapsed}
      />
    </>
  );
}
