import React, { useState } from 'react';
import { ActionBar } from './ActionBar';
import { VirtualKeys } from './VirtualKeys';
import { ResultsOverlay } from './ResultsOverlay';
import { LanguagePicker } from './LanguagePicker';
import { AppSettings, BackendResponse, KeyMode } from '../../types';
import { BackendService } from '../../services/backendService';
import { LAYOUTS, LANGUAGE_ORDER } from '../../utils/keyLayouts';

interface NanoKeyContainerProps {
  inputText: string;
  selectionStart: number;
  selectionEnd: number;
  settings: AppSettings;
  onUpdateText: (newText: string) => void;
  onToast: (msg: string) => void;
  onOpenSettings: () => void;
}

export const NanoKeyContainer: React.FC<NanoKeyContainerProps> = ({ 
  inputText, 
  selectionStart, 
  selectionEnd, 
  settings, 
  onUpdateText,
  onToast,
  onOpenSettings
}) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<BackendResponse | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [currentLangId, setCurrentLangId] = useState(LANGUAGE_ORDER[0]);

  // Get current layout definition
  const currentLayout = LAYOUTS[currentLangId];

  const handleAction = async (mode: KeyMode) => {
    // 1. Check if Nanobot is enabled
    if (!settings.nanobotEnabled) {
      onToast("Nanobot is off");
      setTimeout(() => onOpenSettings(), 600);
      return;
    }

    // 2. Input Source Priority: Selected -> Composing
    let targetText = inputText;
    if (selectionEnd > selectionStart) {
        targetText = inputText.substring(selectionStart, selectionEnd);
    }

    if (!targetText) {
        onToast("No text selected");
        return;
    }

    setLoading(true);
    setResponse(null);
    setOverlayVisible(false);

    try {
        const res = await BackendService.callBackend(
          targetText, 
          mode, 
          settings,
          currentLayout.id,
          currentLayout.locale
        );
        setResponse(res);
        setOverlayVisible(true);
    } catch (e: any) {
        onToast(e.message || "Backend error");
    } finally {
        setLoading(false);
    }
  };

  const handleInsert = (text: string) => {
    let newText = "";
    if (selectionEnd > selectionStart) {
        const before = inputText.substring(0, selectionStart);
        const after = inputText.substring(selectionEnd);
        newText = before + text + after;
    } else {
        const before = inputText.substring(0, selectionEnd);
        const after = inputText.substring(selectionEnd);
        newText = before + text + after;
    }
    
    onUpdateText(newText);
    setOverlayVisible(false);
  };

  const handlePaste = async () => {
     try {
         const text = await navigator.clipboard.readText();
         if (text) {
             handleInsert(text);
             onToast("Pasted from clipboard");
         } else {
             onToast("Clipboard empty");
         }
     } catch (e) {
         // In simulation/iframe environments, readText often fails.
         // We can fallback to a dummy paste for the demo if it fails.
         console.warn(e);
         handleInsert(" [Clipboard Content] ");
         onToast("Simulated Paste (Browser blocked real clipboard)");
     }
  };

  const handleEmoji = () => {
      onToast("Emoji not implemented in v0.1");
  };

  const handleKeyPress = (key: string) => {
     const before = inputText.substring(0, selectionEnd);
     const after = inputText.substring(selectionEnd);
     onUpdateText(before + key + after);
  };

  const handleDelete = () => {
    if (selectionEnd === 0 && selectionStart === 0) return;
    
    if (selectionEnd > selectionStart) {
        const before = inputText.substring(0, selectionStart);
        const after = inputText.substring(selectionEnd);
        onUpdateText(before + after);
    } else {
        const before = inputText.substring(0, selectionEnd - 1);
        const after = inputText.substring(selectionEnd);
        onUpdateText(before + after);
    }
  };

  return (
    <div className="w-full bg-gray-900 flex flex-col relative border-t border-gray-700 flex-shrink-0 pb-6">
       <ActionBar 
         onAction={handleAction} 
         onPaste={handlePaste}
         isLoading={loading} 
       />
       
       <div className="relative">
          <VirtualKeys 
            onKeyPress={handleKeyPress} 
            onDelete={handleDelete}
            onEmoji={handleEmoji}
            onSpaceLongPress={() => setShowLangPicker(true)}
            layout={currentLayout} 
          />
          
          <ResultsOverlay 
            visible={overlayVisible}
            response={response}
            onSelect={handleInsert}
            onClose={() => setOverlayVisible(false)}
          />

          {showLangPicker && (
              <LanguagePicker
                 currentLang={currentLangId}
                 onSelect={(lang) => {
                     setCurrentLangId(lang);
                     setShowLangPicker(false);
                 }}
                 onClose={() => setShowLangPicker(false)}
              />
          )}
          
          {loading && (
             <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center z-30">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
             </div>
          )}
       </div>
    </div>
  );
};