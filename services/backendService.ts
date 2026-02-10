import { AppSettings, BackendRequest, BackendResponse, KeyMode } from '../types';

const MOCK_DELAY = 600;

export class BackendService {
  
  static async callBackend(
    text: string, 
    mode: KeyMode, 
    settings: AppSettings,
    currentLanguageId: string,
    currentLocale: string
  ): Promise<BackendResponse> {
    
    // Validate Input
    if (!text || text.trim().length === 0) {
      throw new Error("No text found.");
    }

    const requestPayload: BackendRequest = {
      client: "nanokey",
      version: "0.1",
      mode: mode, // "reply" | "rewrite" | "translate"
      text: text,
      app: {
        package: "com.facebook.orca",
        displayName: "Messenger"
      },
      meta: {
        keyboardLanguage: currentLanguageId,
        locale: currentLocale,
        preferredLanguages: ["en", "is", "ru", "es"]
      }
    };

    // Simulated Security Check
    if (!settings.devMode && settings.baseUrl.startsWith("http:")) {
      console.warn("Security Warning: HTTP used without Dev Mode");
    }

    try {
      if (settings.baseUrl && settings.baseUrl !== "mock") {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), settings.timeoutSeconds * 1000);

        const response = await fetch(`${settings.baseUrl}/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestPayload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`Backend error: ${response.status}`);

        const data = await response.json();
        if (!data || !data.candidates) throw new Error("Invalid backend response");
        
        return data as BackendResponse;
      } else {
        // Mock Implementation
        await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
        return BackendService.getMockResponse(mode, text, settings.backendType, currentLanguageId);
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
          throw new Error("Backend unreachable (Timeout)");
      }
      throw error;
    }
  }

  static getMockResponse(mode: KeyMode, text: string, backendType: string, lang: string): BackendResponse {
    let candidates = [];
    const shortText = text.length > 20 ? text.substring(0, 20) + "..." : text;

    // Simulate backend logic
    switch (mode) {
      case KeyMode.REPLY:
        if (lang === 'is') {
            candidates = [{ text: "Já, það hljómar vel." }, { text: "Nei, ég kemst ekki." }];
        } else if (lang === 'ru') {
            candidates = [{ text: "Да, конечно." }, { text: "Нет, извините." }];
        } else {
            candidates = [{ text: "Yes, sounds good." }, { text: "No, I can't make it." }];
        }
        break;
      case KeyMode.REWRITE:
        candidates = [
          { text: `${text} (Formal)` },
          { text: `${text} (Concise)` }
        ];
        break;
      case KeyMode.TRANSLATE:
        // Mock translation
        if (lang === 'is') candidates = [{ text: "[EN] " + text }, { text: "[DK] " + text }];
        else candidates = [{ text: "[IS] " + text }, { text: "[ES] " + text }];
        break;
    }

    return {
      candidates,
      actions: [], // reserved
      debug: {
        backend: backendType,
        latencyMs: MOCK_DELAY
      }
    };
  }
}