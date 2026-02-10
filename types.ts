// Backend Contract Types

export enum BackendType {
  NANOBOT = 'nanobot',
  CLAWDBOT = 'clawdbot',
  CUSTOM = 'custom',
}

// Mode is now strict lowercase string in JSON, but we can use enum for internal type safety
// mapped to lower case strings.
export enum KeyMode {
  REPLY = 'reply',
  REWRITE = 'rewrite',
  TRANSLATE = 'translate',
}

export interface AppContext {
  package: string;
  displayName: string;
}

export interface RequestMeta {
  keyboardLanguage: string;
  locale: string;
  preferredLanguages: string[];
}

export interface BackendRequest {
  client: string; // "nanokey"
  version: string; // "0.1"
  mode: string; // "reply" | "rewrite" | "translate"
  text: string;
  app: AppContext;
  meta: RequestMeta;
}

export interface Candidate {
  text: string;
}

export interface BackendResponse {
  candidates: Candidate[];
  // Actions reserved for future
  actions?: any[];
  debug?: {
    backend: string;
    latencyMs: number;
  };
}

// App State Types

export interface AppSettings {
  // Backend Config
  nanobotEnabled: boolean; // Main toggle
  backendType: BackendType;
  baseUrl: string;
  timeoutSeconds: number;
  devMode: boolean;

  // Language Behavior
  fallbackLanguage: string;
  replyLanguage: string; // 'keyboard' or specific code
  translateTarget: string; // 'keyboard' or specific code
}

export interface SimulationState {
  inputText: string;
  selectionStart: number;
  selectionEnd: number;
  isKeyboardOpen: boolean;
  toastMessage: string | null;
}