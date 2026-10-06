import { ModelConfig } from "@/components/ModelSettingsModal";
import { PreferenceSettings } from "@/components/PreferenceSettings";
import { DeviceSelection } from "@/components/DeviceSelection";
import { LanguageSelection } from "@/components/LanguageSelection";
import { TranscriptSettings } from "@/components/TranscriptSettings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { useConfig } from "@/contexts/ConfigContext";
import { useRecordingState } from "@/contexts/RecordingStateContext";

type modalType = "modelSettings" | "deviceSettings" | "languageSettings" | "modelSelector" | "errorAlert" | "chunkDropWarning";

/**
 * SettingsModals Component
 *
 * All settings modals consolidated into a single component.
 * Uses ConfigContext and RecordingStateContext internally - no prop drilling needed!
 */

interface SettingsModalsProps {
  modals: {
    modelSettings: boolean;
    deviceSettings: boolean;
    languageSettings: boolean;
    modelSelector: boolean;
    errorAlert: boolean;
    chunkDropWarning: boolean;
  };
  messages: {
    errorAlert: string;
    chunkDropWarning: string;
    modelSelector: string;
  };
  onClose: (name: modalType) => void;
}

export function SettingsModals({
  modals,
  messages,
  onClose,
}: SettingsModalsProps) {
  // Contexts
  const {
    modelConfig,
    setModelConfig,
    models,
    modelOptions,
    error,
    selectedDevices,
    setSelectedDevices,
    selectedLanguage,
    setSelectedLanguage,
    transcriptModelConfig,
    setTranscriptModelConfig,
    showConfidenceIndicator,
    toggleConfidenceIndicator,
  } = useConfig();

  const { isRecording } = useRecordingState();

  return <>
    {/* Legacy Settings Modal */}
    {modals.modelSettings && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl border-2 border-[#0d0f10] shadow-[6px_6px_0px_#0d0f10] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b-2 border-[#0d0f10] bg-[#fafbfc]">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#0d0f10]">Voxa // Preferences</h3>
            <button
              onClick={() => onClose("modelSettings")}
              className="text-gray-500 hover:text-black font-mono text-sm"
            >
              ✕
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* General Preferences Section */}
            <PreferenceSettings />

            {/* Divider */}
            <div className="border-t-2 border-[#0d0f10] pt-6">
              <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-gray-900 mb-4">AI Model Configuration</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 mb-1">
                    Summarization Model
                  </label>
                  <div className="flex space-x-2">
                    <select
                      className="px-3 py-2 text-xs font-mono bg-white border-2 border-[#0d0f10] rounded-lg shadow-[2px_2px_0px_#0d0f10] focus:outline-none"
                      value={modelConfig.provider}
                      onChange={(e) => {
                        const provider = e.target.value as ModelConfig['provider'];
                        setModelConfig({
                          ...modelConfig,
                          provider,
                          model: modelOptions[provider][0]
                        });
                      }}
                    >
                      <option value="builtin-ai">Built-in AI</option>
                      <option value="claude">Claude</option>
                      <option value="groq">Groq</option>
                      <option value="ollama">Ollama</option>
                      <option value="openrouter">OpenRouter</option>
                      <option value="openai">OpenAI</option>
                    </select>

                    <select
                      className="flex-1 px-3 py-2 text-xs font-mono bg-white border-2 border-[#0d0f10] rounded-lg shadow-[2px_2px_0px_#0d0f10] focus:outline-none"
                      value={modelConfig.model}
                      onChange={(e) => setModelConfig((prev: ModelConfig) => ({ ...prev, model: e.target.value }))}
                    >
                      {modelOptions[modelConfig.provider].map((model: string) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {modelConfig.provider === 'ollama' && (
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase mb-3">Available Ollama Models</h4>
                    {error && (
                      <div className="bg-red-50 border-2 border-red-500 text-red-700 px-4 py-3 rounded-lg font-mono text-xs mb-4">
                        {error}
                      </div>
                    )}
                    <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-2">
                      {models.map((model) => (
                        <div
                          key={model.id}
                          className={`bg-white p-3 rounded-lg border-2 border-[#0d0f10] cursor-pointer transition-all ${
                            modelConfig.model === model.name
                              ? 'bg-[#0d0f10] text-white shadow-none'
                              : 'shadow-[2px_2px_0px_#0d0f10] hover:bg-gray-50'
                          }`}
                          onClick={() => setModelConfig((prev: ModelConfig) => ({ ...prev, model: model.name }))}
                        >
                          <h3 className="font-mono text-xs font-bold uppercase">{model.name}</h3>
                          <p className="text-[10px] opacity-75 font-mono">Size: {model.size} | Modified: {model.modified}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-[#0d0f10] bg-[#fafbfc] p-4 flex justify-end">
            <button
              onClick={() => onClose('modelSettings')}
              className="brutal-btn brutal-btn-primary px-4 py-2 text-xs"
            >
              Save & Dismiss
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Device Settings Modal */}
    {modals.deviceSettings && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl border-2 border-[#0d0f10] shadow-[6px_6px_0px_#0d0f10] max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-[#0d0f10]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0d0f10]">Audio Device Routing</h3>
            <button
              onClick={() => onClose('deviceSettings')}
              className="text-gray-500 hover:text-black font-mono text-sm"
            >
              ✕
            </button>
          </div>

          <DeviceSelection
            selectedDevices={selectedDevices}
            onDeviceChange={setSelectedDevices}
            disabled={isRecording}
          />

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                const micDevice = selectedDevices.micDevice || 'Default';
                const systemDevice = selectedDevices.systemDevice || 'Default';
                toast.success("Devices selected", {
                  description: `Microphone: ${micDevice}, System Audio: ${systemDevice}`
                });
                onClose('deviceSettings');
              }}
              className="brutal-btn brutal-btn-primary px-4 py-2 text-xs"
            >
              Confirm Devices
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Language Settings Modal */}
    {modals.languageSettings && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl border-2 border-[#0d0f10] shadow-[6px_6px_0px_#0d0f10] max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-[#0d0f10]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0d0f10]">Language Ingest Configuration</h3>
            <button
              onClick={() => onClose('languageSettings')}
              className="text-gray-500 hover:text-black font-mono text-sm"
            >
              ✕
            </button>
          </div>

          <LanguageSelection
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            disabled={isRecording}
            provider={transcriptModelConfig.provider}
          />

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => onClose('languageSettings')}
              className="brutal-btn brutal-btn-primary px-4 py-2 text-xs"
            >
              Confirm Language
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Model Selection Modal */}
    {modals.modelSelector && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl border-2 border-[#0d0f10] shadow-[6px_6px_0px_#0d0f10] max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
          {/* Fixed Header */}
          <div className="flex justify-between items-center p-5 border-b-2 border-[#0d0f10] bg-[#fafbfc]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0d0f10]">
              {messages.modelSelector ? 'Speech Recognition Setup Required' : 'Transcription Model Pipeline'}
            </h3>
            <button
              onClick={() => onClose('modelSelector')}
              className="text-gray-500 hover:text-black font-mono text-sm"
            >
              ✕
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 pt-4">
            <TranscriptSettings
              transcriptModelConfig={transcriptModelConfig}
              setTranscriptModelConfig={setTranscriptModelConfig}
              onModelSelect={() => onClose('modelSelector')}
            />
          </div>

          {/* Fixed Footer */}
          <div className="p-4 border-t-2 border-[#0d0f10] bg-[#fafbfc] flex items-center justify-between">
            {/* Confidence Indicator Toggle */}
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showConfidenceIndicator}
                  onChange={(e) => toggleConfidenceIndicator(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none border-2 border-[#0d0f10] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-[#0d0f10] peer-checked:after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#0d0f10]"></div>
              </label>
              <div>
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#0d0f10]">Confidence Indicators</p>
                <p className="text-[10px] font-mono text-gray-500">Render color dots for segment confidence</p>
              </div>
            </div>

            <button
              onClick={() => onClose('modelSelector')}
              className="brutal-btn brutal-btn-primary px-4 py-2 text-xs"
            >
              {messages.modelSelector ? 'Cancel' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Error Alert Modal */}
    {modals.errorAlert && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <Alert className="max-w-md mx-4 border-2 border-red-600 bg-red-50 shadow-[4px_4px_0px_#0d0f10] rounded-xl">
          <AlertTitle className="text-xs font-mono font-bold uppercase tracking-wider text-red-900">Recording Interrupted</AlertTitle>
          <AlertDescription className="text-xs font-mono text-red-800 mt-2">
            {messages.errorAlert}
            <button
              onClick={() => onClose('errorAlert')}
              className="block mt-3 brutal-btn bg-white px-3 py-1 text-xs font-mono uppercase"
            >
              Dismiss
            </button>
          </AlertDescription>
        </Alert>
      </div>
    )}

    {/* Chunk Drop Warning Modal */}
    {modals.chunkDropWarning && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <Alert className="max-w-lg mx-4 border-2 border-amber-600 bg-amber-50 shadow-[4px_4px_0px_#0d0f10] rounded-xl">
          <AlertTitle className="text-xs font-mono font-bold uppercase tracking-wider text-amber-900">Transcription Buffer Warning</AlertTitle>
          <AlertDescription className="text-xs font-mono text-amber-800 mt-2">
            {messages.chunkDropWarning}
            <button
              onClick={() => onClose('chunkDropWarning')}
              className="block mt-3 brutal-btn bg-white px-3 py-1 text-xs font-mono uppercase"
            >
              Dismiss
            </button>
          </AlertDescription>
        </Alert>
      </div>
    )}
  </>
}
