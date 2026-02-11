import React from 'react';
import { LAYOUTS, LANGUAGE_ORDER } from '../../utils/keyLayouts';

interface LanguagePickerProps {
  currentLang: string;
  onSelect: (langId: string) => void;
  onClose: () => void;
}

export const LanguagePicker: React.FC<LanguagePickerProps> = ({ currentLang, onSelect, onClose }) => {
  return (
    <div className="absolute inset-0 bg-gray-900/95 z-50 flex flex-col justify-center items-center animate-fade-in p-4">
      <h3 className="text-gray-400 text-sm font-bold mb-4 uppercase tracking-widest">Select Language</h3>
      <div className="w-full max-w-xs space-y-2">
        {LANGUAGE_ORDER.map((langId) => {
           const layout = LAYOUTS[langId];
           const isActive = currentLang === langId;
           return (
             <button
               key={langId}
               onClick={() => onSelect(langId)}
               className={`w-full p-4 rounded-lg font-medium text-lg transition-colors flex justify-between items-center ${
                 isActive 
                   ? 'bg-blue-600 text-white' 
                   : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
               }`}
             >
               <span>{layout.label}</span>
               {isActive && <span className="text-white">✓</span>}
             </button>
           );
        })}
      </div>
      <button 
        onClick={onClose}
        className="mt-8 text-gray-500 hover:text-white text-sm"
      >
        Cancel
      </button>
    </div>
  );
};