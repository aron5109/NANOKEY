import React, { useState } from 'react';
import { ActionBar } from './ActionBar';
import { VirtualKeys } from './VirtualKeys';
import { ResultsOverlay } from './ResultsOverlay';
import { AppSettings, BackendResponse, KeyMode } from '../../types';
import { BackendService } from '../../services/backendService';

interface NanoKeyContainerProps {
  inputText: string;
  selectionStart: number;
  selectionEnd: number;
  settings: AppSettings;
  onUpdateText: (newText: string) => void;
  onToast: (msg: string) => void;
}

export const NanoKeyContainer: React.FC<NanoKeyContainerProps> = ({ 
  inputText, 
  selectionStart, 
  selectionEnd, 
  settings, 
  onUpdateText,
  onToast
}) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<BackendResponse | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const handleAction = async (mode: KeyMode) => {
    // 4) Supported input sources logic
    // Priority: Selected text -> Composing text
    let targetText = inputText;
    
    // Simple selection extraction simulation
    if (selectionEnd > selectionStart) {
        targetText = inputText.substring(selectionStart, selectionEnd);
    }

    if (!targetText) {
        onToast("No text found.");
        return;
    }

    setLoading(true);
    setResponse(null);
    setOverlayVisible(false);

    try {
        const res = await BackendService.callBackend(targetText, mode, settings);
        setResponse(res);
        setOverlayVisible(true);
    } catch (e: any) {
        onToast(e.message || "Backend error");
    } finally {
        setLoading(false);
    }
  };

  const handleInsert = (text: string) => {
    // Basic insertion logic (simulating replacing text or appending)
    // If text was selected, replace selection.
    // If no selection, append to end (simplification for v0.1 sim).
    let newText = "";
    if (selectionEnd > selectionStart) {
        const before = inputText.substring(0, selectionStart);
        const after = inputText.substring(selectionEnd);
        newText = before + text + after;
    } else {
        // If cursor is at end or midway, insert there. 
        // For this simulator, if cursor is at 0 and no text, just set text.
        // If cursor is somewhere, insert.
        const before = inputText.substring(0, selectionEnd);
        const after = inputText.substring(selectionEnd);
        newText = before + text + after;
    }
    
    onUpdateText(newText);
    setOverlayVisible(false);
  };

  const handleKeyPress = (key: string) => {
     // Insert char at cursor position (simplified)
     const before = inputText.substring(0, selectionEnd);
     const after = inputText.substring(selectionEnd);
     onUpdateText(before + key + after);
  };

  const handleDelete = () => {
    if (selectionEnd === 0 && selectionStart === 0) return;
    
    if (selectionEnd > selectionStart) {
        // Delete selection
        const before = inputText.substring(0, selectionStart);
        const after = inputText.substring(selectionEnd);
        onUpdateText(before + after);
    } else {
        // Delete character before cursor
        const before = inputText.substring(0, selectionEnd - 1);
        const after = inputText.substring(selectionEnd);
        onUpdateText(before + after);
    }
  };

  return (
    <div className="w-full bg-gray-900 flex flex-col relative border-t border-gray-700">
       <ActionBar onAction={handleAction} isLoading={loading} />
       
       <div className="relative">
          <VirtualKeys onKeyPress={handleKeyPress} onDelete={handleDelete} />
          
          <ResultsOverlay 
            visible={overlayVisible}
            response={response}
            onSelect={handleInsert}
            onClose={() => setOverlayVisible(false)}
          />
          
          {loading && (
             <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center z-30">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
             </div>
          )}
       </div>
    </div>
  );
};