import React from 'react';

interface VirtualKeysProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
}

export const VirtualKeys: React.FC<VirtualKeysProps> = ({ onKeyPress, onDelete }) => {
  const rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];

  return (
    <div className="flex flex-col items-center bg-gray-900 p-1 pb-4 select-none">
      {rows.map((row, rIdx) => (
        <div key={rIdx} className="flex w-full justify-center mb-2">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className="h-10 flex-1 mx-0.5 bg-gray-600 rounded text-white font-medium text-lg active:bg-gray-500 active:scale-95 transition-transform max-w-[9%]"
            >
              {key}
            </button>
          ))}
        </div>
      ))}
      <div className="flex w-full justify-center px-1">
        <button className="h-10 flex-[1.5] mx-1 bg-gray-700 rounded text-gray-300 text-xs">123</button>
        <button 
            onClick={() => onKeyPress(' ')}
            className="h-10 flex-[4] mx-1 bg-gray-600 rounded text-white active:bg-gray-500"
        >
            space
        </button>
        <button className="h-10 flex-[1] mx-1 bg-gray-700 rounded text-gray-300 text-xs">.</button>
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