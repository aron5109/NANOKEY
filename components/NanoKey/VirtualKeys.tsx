import React from 'react';
import { KeyboardLayout } from '../../utils/keyLayouts';

interface VirtualKeysProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onLanguageToggle: () => void;
  layout: KeyboardLayout;
}

export const VirtualKeys: React.FC<VirtualKeysProps> = ({ onKeyPress, onDelete, onLanguageToggle, layout }) => {
  const { rows, label } = layout;

  return (
    <div className="flex flex-col items-center bg-gray-900 p-1 pb-4 select-none">
      {/* Character Keys */}
      {rows.map((row, rIdx) => (
        <div key={rIdx} className="flex w-full justify-center mb-2 px-0.5">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className="h-10 flex-1 mx-[2px] bg-gray-600 rounded text-white font-medium text-lg active:bg-gray-500 active:scale-95 transition-transform min-w-[8%]"
            >
              {key}
            </button>
          ))}
        </div>
      ))}

      {/* Function Row */}
      <div className="flex w-full justify-center px-1 mt-1">
        <button className="h-10 flex-[1.5] mx-1 bg-gray-700 rounded text-gray-300 text-xs font-bold">123</button>
        
        {/* Globe / Language Key */}
        <button 
          onClick={onLanguageToggle}
          className="h-10 flex-[1] mx-1 bg-gray-700 rounded text-white text-lg flex items-center justify-center active:bg-gray-600"
        >
          🌐
        </button>

        {/* Spacebar */}
        <button 
            onClick={() => onKeyPress(' ')}
            className="h-10 flex-[4] mx-1 bg-gray-600 rounded text-white active:bg-gray-500 text-xs text-gray-400 font-normal"
        >
            {label}
        </button>

        <button className="h-10 flex-[1] mx-1 bg-gray-700 rounded text-gray-300 text-xs font-bold">.</button>
        
        {/* Backspace */}
        <button 
            onClick={onDelete}
            className="h-10 flex-[1.5] mx-1 bg-gray-700 rounded text-white flex items-center justify-center active:bg-gray-600"
        >
            ⌫
        </button>
      </div>
    </div>
  );
};