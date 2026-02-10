import React from 'react';
import { BackendResponse, Candidate } from '../../types';

interface ResultsOverlayProps {
  response: BackendResponse | null;
  onSelect: (text: string) => void;
  onClose: () => void;
  visible: boolean;
}

export const ResultsOverlay: React.FC<ResultsOverlayProps> = ({ response, onSelect, onClose, visible }) => {
  if (!visible || !response) return null;

  // NANOKEY v0.1 only displays first 2 candidates
  const candidates = response.candidates.slice(0, 2);

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    // In a real android app, this would be a toast
    console.log("Copied to clipboard:", text);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 shadow-2xl z-20 flex flex-col max-h-[60%] animate-slide-up">
      {/* Header */}
      <div className="flex justify-between items-center p-2 bg-gray-800 border-b border-gray-700">
        <div className="text-[10px] text-gray-400 font-mono">
           {response.debug?.backend} • {response.debug?.latencyMs}ms
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white px-2">
          ✕
        </button>
      </div>

      {/* Candidates */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {candidates.map((cand, idx) => (
          <div 
            key={idx}
            onClick={() => onSelect(cand.text)}
            className="group relative bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded p-3 cursor-pointer transition-colors active:border-blue-500"
          >
            <p className="text-sm text-gray-200 pr-8">{cand.text}</p>
            
            <button 
              onClick={(e) => handleCopy(e, cand.text)}
              className="absolute top-2 right-2 p-1 text-gray-500 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Copy"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            
            <div className="absolute top-2 left-[-4px] w-1 h-full bg-transparent group-hover:bg-blue-500 rounded-l"></div>
          </div>
        ))}
        {candidates.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-4">No candidates returned.</div>
        )}
      </div>
    </div>
  );
};