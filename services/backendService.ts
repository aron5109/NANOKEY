import { AppSettings, BackendRequest, BackendResponse, KeyMode } from '../types';

const MOCK_DELAY = 800;

export class BackendService {
  
  static async callBackend(
    text: string, 
    mode: KeyMode, 
    settings: AppSettings
  ): Promise<BackendResponse> {
    
    // Validate Input
    if (!text || text.trim().length === 0) {
      throw new Error("No text found.");
    }

    const requestPayload: BackendRequest = {
      client: "nanokey",
      version: "0.1",
      mode: mode,
      text: text,
      app: {
        package: "com.facebook.orca", // Simulating Messenger
        displayName: "Messenger"
      },
      meta: {
        locale: "en-US", // Hardcoded for demo
        timestamp: Date.now()
      }
    };

    // If Dev Mode is OFF, force HTTPS (simulated validation)
    if (!settings.devMode && settings.baseUrl.startsWith("http:")) {
      // Note: In a browser, mixed content blocks this anyway, but this checks logic.
      // We'll allow it for the simulator but warn.
      console.warn("Security Warning: HTTP used without Dev Mode (Simulated Check)");
    }

    try {
      // Real Fetch Implementation
      if (settings.baseUrl && settings.baseUrl !== "mock") {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), settings.timeoutSeconds * 1000);

        const response = await fetch(`${settings.baseUrl}/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestPayload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
           throw new Error(`Backend error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data || !data.candidates) {
            throw new Error("Invalid backend response");
        }
        
        return data as BackendResponse;
      } 
      
      // MOCK Implementation (Default or if URL is "mock")
      else {
        await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
        
        return BackendService.getMockResponse(mode, text, settings.backendType);
      }

    } catch (error: unknown) {
      if (error instanceof Error) {
          if (error.name === 'AbortError') {
              throw new Error("Backend unreachable (Timeout)");
          }
          throw error;
      }
      throw new Error("Backend unreachable");
    }
  }

  static getMockResponse(mode: KeyMode, text: string, backendType: string): BackendResponse {
    let candidates = [];
    
    const shortText = text.length > 20 ? text.substring(0, 20) + "..." : text;

    switch (mode) {
      case KeyMode.GEN:
        candidates = [
          { text: `Sure, I can help with "${shortText}". Let's meet at 5?` },
          { text: `That sounds interesting regarding "${shortText}". Tell me more.` }
        ];
        break;
      case KeyMode.REWRITE:
        candidates = [
          { text: `(Formal) ${text} Furthermore, we should consider...` },
          { text: `(Casual) ${text} lol that's crazy.` }
        ];
        break;
      case KeyMode.TRANSLATE:
        candidates = [
          { text: `(ES) ${text} [Simulated Translation]` },
          { text: `(FR) ${text} [Simulated Translation]` }
        ];
        break;
    }

    return {
      candidates,
      actions: [],
      debug: {
        backend: backendType,
        latencyMs: MOCK_DELAY
      }
    };
  }
}