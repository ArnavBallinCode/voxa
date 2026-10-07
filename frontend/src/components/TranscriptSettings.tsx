import { useState, useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Eye, EyeOff, Lock, Unlock, BookOpen, Check, Loader2 } from 'lucide-react';
import { ModelManager } from './WhisperModelManager';
import { ParakeetModelManager } from './ParakeetModelManager';


export interface TranscriptModelProps {
    provider: 'localWhisper' | 'parakeet' | 'deepgram' | 'elevenLabs' | 'groq' | 'openai';
    model: string;
    apiKey?: string | null;
}

export interface TranscriptSettingsProps {
    transcriptModelConfig: TranscriptModelProps;
    setTranscriptModelConfig: (config: TranscriptModelProps) => void;
    onModelSelect?: () => void;
}

export function TranscriptSettings({ transcriptModelConfig, setTranscriptModelConfig, onModelSelect }: TranscriptSettingsProps) {
    const [apiKey, setApiKey] = useState<string | null>(transcriptModelConfig.apiKey || null);
    const [showApiKey, setShowApiKey] = useState<boolean>(false);
    const [isApiKeyLocked, setIsApiKeyLocked] = useState<boolean>(true);
    const [isLockButtonVibrating, setIsLockButtonVibrating] = useState<boolean>(false);
    const [uiProvider, setUiProvider] = useState<TranscriptModelProps['provider']>(transcriptModelConfig.provider);

    // Global Vocabulary state
    const [vocabulary, setVocabulary] = useState<string>('');
    const [isSavingVocabulary, setIsSavingVocabulary] = useState<boolean>(false);
    const [vocabularySaved, setVocabularySaved] = useState<boolean>(false);
    const [vocabularyError, setVocabularyError] = useState<string | null>(null);
    const vocabularyRevisionRef = useRef<number>(0);

    useEffect(() => {
        const revision = vocabularyRevisionRef.current;
        invoke<{ global: string; meeting: string }>('api_get_vocabulary', { meetingId: null })
            .then((config) => {
                if (vocabularyRevisionRef.current === revision) {
                    setVocabulary(config.global || '');
                }
            })
            .catch((error) => {
                console.error('Failed to load vocabulary:', error);
                setVocabularyError('Could not load the saved vocabulary.');
            });
    }, []);

    const saveVocabulary = async () => {
        setIsSavingVocabulary(true);
        setVocabularySaved(false);
        setVocabularyError(null);
        const revision = vocabularyRevisionRef.current;
        try {
            const normalized = await invoke<string>('api_save_global_vocabulary', { vocabulary });
            if (vocabularyRevisionRef.current === revision) {
                setVocabulary(normalized);
            }
            setVocabularySaved(true);
            window.setTimeout(() => setVocabularySaved(false), 2000);
        } catch (error) {
            setVocabularyError(typeof error === 'string' ? error : String(error));
        } finally {
            setIsSavingVocabulary(false);
        }
    };

    // Sync uiProvider when backend config changes (e.g., after model selection or initial load)
    useEffect(() => {
        setUiProvider(transcriptModelConfig.provider);
    }, [transcriptModelConfig.provider]);

    useEffect(() => {
        if (transcriptModelConfig.provider === 'localWhisper' || transcriptModelConfig.provider === 'parakeet') {
            setApiKey(null);
        }
    }, [transcriptModelConfig.provider]);

    const fetchApiKey = async (provider: string) => {
        try {

            const data = await invoke('api_get_transcript_api_key', { provider }) as string;

            setApiKey(data || '');
        } catch (err) {
            console.error('Error fetching API key:', err);
            setApiKey(null);
        }
    };
    const modelOptions = {
        localWhisper: [], // Model selection handled by ModelManager component
        parakeet: [], // Model selection handled by ParakeetModelManager component
        deepgram: ['nova-2-phonecall'],
        elevenLabs: ['eleven_multilingual_v2'],
        groq: ['llama-3.3-70b-versatile'],
        openai: ['gpt-4o'],
    };
    const requiresApiKey = transcriptModelConfig.provider === 'deepgram' || transcriptModelConfig.provider === 'elevenLabs' || transcriptModelConfig.provider === 'openai' || transcriptModelConfig.provider === 'groq';

    const handleInputClick = () => {
        if (isApiKeyLocked) {
            setIsLockButtonVibrating(true);
            setTimeout(() => setIsLockButtonVibrating(false), 500);
        }
    };

    const handleWhisperModelSelect = (modelName: string) => {
        // Always update config when model is selected, regardless of current provider
        // This ensures the model is set when user switches back
        setTranscriptModelConfig({
            ...transcriptModelConfig,
            provider: 'localWhisper', // Ensure provider is set correctly
            model: modelName
        });
        // Close modal after selection
        if (onModelSelect) {
            onModelSelect();
        }
    };

    const handleParakeetModelSelect = (modelName: string) => {
        // Always update config when model is selected, regardless of current provider
        // This ensures the model is set when user switches back
        setTranscriptModelConfig({
            ...transcriptModelConfig,
            provider: 'parakeet', // Ensure provider is set correctly
            model: modelName
        });
        // Close modal after selection
        if (onModelSelect) {
            onModelSelect();
        }
    };

    return (
        <div>
            <div>
                {/* <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Transcript Settings</h3>
                </div> */}
                <div className="space-y-4 pb-6">
                    <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-1">
                            Transcript Model
                        </Label>
                        <div className="flex space-x-2 mx-1">
                            <Select
                                value={uiProvider}
                                onValueChange={(value) => {
                                    const provider = value as TranscriptModelProps['provider'];
                                    setUiProvider(provider);
                                    if (provider !== 'localWhisper' && provider !== 'parakeet') {
                                        fetchApiKey(provider);
                                    }
                                }}
                            >
                                <SelectTrigger className='focus:ring-1 focus:ring-blue-500 focus:border-blue-500'>
                                    <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="parakeet">⚡ Parakeet (Recommended - Real-time / Accurate)</SelectItem>
                                    <SelectItem value="localWhisper">🏠 Local Whisper (High Accuracy)</SelectItem>
                                    {/* <SelectItem value="deepgram">☁️ Deepgram (Backup)</SelectItem>
                                    <SelectItem value="elevenLabs">☁️ ElevenLabs</SelectItem>
                                    <SelectItem value="groq">☁️ Groq</SelectItem>
                                    <SelectItem value="openai">☁️ OpenAI</SelectItem> */}
                                </SelectContent>
                            </Select>

                            {uiProvider !== 'localWhisper' && uiProvider !== 'parakeet' && (
                                <Select
                                    value={transcriptModelConfig.model}
                                    onValueChange={(value) => {
                                        const model = value as TranscriptModelProps['model'];
                                        setTranscriptModelConfig({ ...transcriptModelConfig, provider: uiProvider, model });
                                    }}
                                >
                                    <SelectTrigger className='focus:ring-1 focus:ring-blue-500 focus:border-blue-500'>
                                        <SelectValue placeholder="Select model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {modelOptions[uiProvider].map((model) => (
                                            <SelectItem key={model} value={model}>{model}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}

                        </div>
                    </div>

                    {uiProvider === 'localWhisper' && (
                        <div className="mt-6">
                            <ModelManager
                                selectedModel={transcriptModelConfig.provider === 'localWhisper' ? transcriptModelConfig.model : undefined}
                                onModelSelect={handleWhisperModelSelect}
                                autoSave={true}
                            />
                        </div>
                    )}

                    {uiProvider === 'parakeet' && (
                        <div className="mt-6">
                            <ParakeetModelManager
                                selectedModel={transcriptModelConfig.provider === 'parakeet' ? transcriptModelConfig.model : undefined}
                                onModelSelect={handleParakeetModelSelect}
                                autoSave={true}
                            />
                        </div>
                    )}


                    {requiresApiKey && (
                        <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-1">
                                API Key
                            </Label>
                            <div className="relative mx-1">
                                <Input
                                    type={showApiKey ? "text" : "password"}
                                    className={`pr-24 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${isApiKeyLocked ? 'bg-gray-100 cursor-not-allowed' : ''
                                        }`}
                                    value={apiKey || ''}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    disabled={isApiKeyLocked}
                                    onClick={handleInputClick}
                                    placeholder="Enter your API key"
                                />
                                {isApiKeyLocked && (
                                    <div
                                        onClick={handleInputClick}
                                        className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 rounded-md cursor-not-allowed"
                                    />
                                )}
                                <div className="absolute inset-y-0 right-0 pr-1 flex items-center">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsApiKeyLocked(!isApiKeyLocked)}
                                        className={`transition-colors duration-200 ${isLockButtonVibrating ? 'animate-vibrate text-red-500' : ''
                                            }`}
                                        title={isApiKeyLocked ? "Unlock to edit" : "Lock to prevent editing"}
                                    >
                                        {isApiKeyLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowApiKey(!showApiKey)}
                                    >
                                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pro Feature: Global Vocabulary Hints & Token Biasing */}
                    <div className="mt-6 p-4 rounded-xl border-2 border-[#0d0f10] bg-[#fafaf9] shadow-[3px_3px_0px_#0d0f10] space-y-3">
                        <div className="flex items-start gap-3">
                            <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-[#0d0f10]" />
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="transcription-vocabulary" className="text-xs font-bold uppercase tracking-wider text-[#0d0f10]">
                                        Global Vocabulary & Glossary Hints
                                    </Label>
                                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-300">
                                        PRO
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-gray-600">
                                    Boost recognized names, companies, technical acronyms, and specialized jargon. Parakeet uses contextual token-boosting; Whisper utilizes prompt biasing (up to 224 tokens).
                                </p>
                            </div>
                        </div>
                        <Textarea
                            id="transcription-vocabulary"
                            value={vocabulary}
                            onChange={(event) => {
                                vocabularyRevisionRef.current += 1;
                                setVocabulary(event.target.value);
                                setVocabularySaved(false);
                                setVocabularyError(null);
                            }}
                            maxLength={1000}
                            rows={4}
                            disabled={isSavingVocabulary}
                            placeholder="VoxBento&#10;Tauri&#10;Kubernetes&#10;Whisper&#10;Parakeet"
                            className="text-xs font-mono resize-y border-2 border-[#0d0f10]"
                        />
                        <div className="flex items-center justify-between gap-3 pt-1">
                            <div className="min-h-5 text-xs font-mono">
                                {vocabularyError ? (
                                    <span className="text-red-600 font-bold">{vocabularyError}</span>
                                ) : vocabularySaved ? (
                                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                                        <Check className="h-3.5 w-3.5" /> Saved & Active
                                    </span>
                                ) : (
                                    <span className="text-gray-500">{vocabulary.length}/1000 characters</span>
                                )}
                            </div>
                            <Button
                                type="button"
                                size="sm"
                                onClick={saveVocabulary}
                                disabled={isSavingVocabulary}
                                className="border-2 border-[#0d0f10] shadow-[2px_2px_0px_#0d0f10] bg-[#0d0f10] text-white hover:bg-gray-800 font-mono text-xs font-bold"
                            >
                                {isSavingVocabulary && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                                Save Glossary
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}








