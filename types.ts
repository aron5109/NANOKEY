// Backend Contract Types

export enum BackendType {
  NANOBOT = 'nanobot',
  CLAWDBOT = 'clawdbot',
  CUSTOM = 'custom',
}

export enum KeyMode {
  GEN = 'gen',
  REWRITE = 'rewrite',
  TRANSLATE = 'translate',
}

export interface AppContext {
  package: string;
  displayName: string;
}

export interface RequestMeta {
  locale: string;
  timestamp: number;
}

export interface BackendRequest {
  client: string; // "nanokey"
  version: string; // "0.1"
  mode: KeyMode;
  text: string;
  app: AppContext;
  meta: RequestMeta;
}

export interface Candidate {
  text: string;
}

export interface BackendResponse {
  candidates: Candidate[];
  actions: any[]; // Reserved for v0.2
  debug: {
    backend: string;
    latencyMs: number;
  };
}

// App State Types

export interface AppSettings {
  backendType: BackendType;
  baseUrl: string;
  timeoutSeconds: number;
  devMode: boolean; // Allows HTTP
}

export interface SimulationState {
  inputText: string;
  selectionStart: number;
  selectionEnd: number;
  isKeyboardOpen: boolean;
  toastMessage: string | null;
}