export interface Language {
  code: string;
  name: string;
}

// ISO 639-1 language codes supported by Whisper
export const ALL_WHISPER_LANGUAGES: Language[] = [
  { code: 'auto', name: 'Auto-Detect' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'it', name: 'Italian' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ko', name: 'Korean' },
  { code: 'nl', name: 'Dutch' },
  { code: 'tr', name: 'Turkish' },
  { code: 'pl', name: 'Polish' },
  { code: 'sv', name: 'Swedish' },
  { code: 'id', name: 'Indonesian' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'el', name: 'Greek' },
  { code: 'cs', name: 'Czech' },
  { code: 'ro', name: 'Romanian' },
  { code: 'da', name: 'Danish' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'ta', name: 'Tamil' },
  { code: 'no', name: 'Norwegian' },
  { code: 'th', name: 'Thai' },
  { code: 'ur', name: 'Urdu' },
  { code: 'hr', name: 'Croatian' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'la', name: 'Latin' },
  { code: 'mi', name: 'Maori' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'cy', name: 'Welsh' },
  { code: 'sk', name: 'Slovak' },
  { code: 'te', name: 'Telugu' },
  { code: 'fa', name: 'Persian' },
  { code: 'lv', name: 'Latvian' },
  { code: 'bn', name: 'Bengali' },
  { code: 'sr', name: 'Serbian' },
  { code: 'az', name: 'Azerbaijani' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'kn', name: 'Kannada' },
  { code: 'et', name: 'Estonian' },
  { code: 'mk', name: 'Macedonian' },
  { code: 'br', name: 'Breton' },
  { code: 'eu', name: 'Basque' },
  { code: 'is', name: 'Icelandic' },
  { code: 'hy', name: 'Armenian' },
  { code: 'ne', name: 'Nepali' },
  { code: 'mn', name: 'Mongolian' },
  { code: 'bs', name: 'Bosnian' },
  { code: 'kk', name: 'Kazakh' },
  { code: 'sq', name: 'Albanian' },
  { code: 'sw', name: 'Swahili' },
  { code: 'gl', name: 'Galician' },
  { code: 'mr', name: 'Marathi' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'si', name: 'Sinhala' },
  { code: 'km', name: 'Khmer' },
  { code: 'sn', name: 'Shona' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'so', name: 'Somali' },
  { code: 'af', name: 'Afrikaans' },
  { code: 'oc', name: 'Occitan' },
  { code: 'ka', name: 'Georgian' },
  { code: 'be', name: 'Belarusian' },
  { code: 'tg', name: 'Tajik' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'am', name: 'Amharic' },
  { code: 'yi', name: 'Yiddish' },
  { code: 'lo', name: 'Lao' },
  { code: 'uz', name: 'Uzbek' },
  { code: 'fo', name: 'Faroese' },
  { code: 'ht', name: 'Haitian Creole' },
  { code: 'ps', name: 'Pashto' },
  { code: 'tk', name: 'Turkmen' },
  { code: 'nn', name: 'Norwegian Nynorsk' },
  { code: 'mt', name: 'Maltese' },
  { code: 'sa', name: 'Sanskrit' },
  { code: 'lb', name: 'Luxembourgish' },
  { code: 'my', name: 'Myanmar' },
  { code: 'bo', name: 'Tibetan' },
  { code: 'tl', name: 'Tagalog' },
  { code: 'mg', name: 'Malagasy' },
  { code: 'as', name: 'Assamese' },
  { code: 'tt', name: 'Tatar' },
  { code: 'haw', name: 'Hawaiian' },
  { code: 'ln', name: 'Lingala' },
  { code: 'ha', name: 'Hausa' },
  { code: 'ba', name: 'Bashkir' },
  { code: 'jw', name: 'Javanese' },
  { code: 'su', name: 'Sundanese' },
  { code: 'ca', name: 'Catalan' },
  { code: 'fi', name: 'Finnish' },
  { code: 'he', name: 'Hebrew' },
  { code: 'ms', name: 'Malay' },
];

export interface ParsedLanguageConfig {
  spoken: string;
  translate: boolean;
  target: 'original' | 'en';
}

/**
 * Parses a stored language preference string into spoken and translation targets.
 * e.g.:
 * - "auto-translate" -> { spoken: "auto", translate: true, target: "en" }
 * - "es:translate"   -> { spoken: "es", translate: true, target: "en" }
 * - "auto"           -> { spoken: "auto", translate: false, target: "original" }
 * - "es"             -> { spoken: "es", translate: false, target: "original" }
 * - "en"             -> { spoken: "en", translate: false, target: "en" }
 */
export function parseLanguagePreference(pref: string | null | undefined): ParsedLanguageConfig {
  if (!pref || pref === 'auto') {
    return { spoken: 'auto', translate: false, target: 'original' };
  }
  if (pref === 'auto-translate') {
    return { spoken: 'auto', translate: true, target: 'en' };
  }
  if (pref.endsWith(':translate')) {
    const spoken = pref.replace(':translate', '');
    return { spoken: spoken || 'auto', translate: true, target: 'en' };
  }
  if (pref === 'en') {
    return { spoken: 'en', translate: false, target: 'en' };
  }
  return { spoken: pref, translate: false, target: 'original' };
}

/**
 * Formats a spoken language and translation flag into the canonical storage string.
 */
export function formatLanguagePreference(spoken: string, translate: boolean): string {
  if (spoken === 'en') {
    return 'en';
  }
  if (translate) {
    return spoken === 'auto' ? 'auto-translate' : `${spoken}:translate`;
  }
  return spoken;
}

export function getLanguageName(code: string): string {
  if (code === 'auto') return 'Auto-Detect';
  if (code === 'original') return 'Original Spoken Language';
  const found = ALL_WHISPER_LANGUAGES.find((l) => l.code === code);
  return found ? found.name : code.toUpperCase();
}

export interface LanguageBadgeInfo {
  spokenLabel: string;
  targetLabel: string;
  isTranslating: boolean;
  displayText: string;
}

export function getLanguageBadgeInfo(pref: string | null | undefined): LanguageBadgeInfo {
  const { spoken, translate } = parseLanguagePreference(pref);
  const spokenLabel = getLanguageName(spoken);

  if (translate) {
    return {
      spokenLabel,
      targetLabel: 'English',
      isTranslating: true,
      displayText: `${spokenLabel} ➔ English`,
    };
  }

  if (spoken === 'auto') {
    return {
      spokenLabel: 'Auto-Detect',
      targetLabel: 'Original',
      isTranslating: false,
      displayText: 'Auto-Detect (Original)',
    };
  }

  return {
    spokenLabel,
    targetLabel: spokenLabel,
    isTranslating: false,
    displayText: spoken === 'en' ? 'English' : `${spokenLabel} (Original)`,
  };
}
