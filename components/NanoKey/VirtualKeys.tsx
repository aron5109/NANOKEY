import React, { useRef } from 'react';
import { KeyboardLayout } from '../../utils/keyLayouts';

interface VirtualKeysProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onEmoji: () => void;
  onSpaceLongPress: () => void;
  layout: KeyboardLayout;
}

export const VirtualKeys: React.FC<VirtualKeysProps> = ({ onKeyPress, onDelete, onEmoji, onSpaceLongPress, layout }) => {
  const { rows, label } = layout;
  const longPressTimer = useRef<number | null>(null);
  const isLongPress = useRef(false);

  const startPress = (key: string) => {
    if (key === ' ') {
        isLongPress.current = false;
        longPressTimer.current = window.setTimeout(() => {
            isLongPress.current = true;
            onSpaceLongPress();
        }, 500); // 500ms for long press
    }
  };

  const endPress = (key: string) => {
    if (key === ' ') {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
        if (!isLongPress.current) {
            onKeyPress(' ');
        }
        isLongPress.current = false;
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 p-1 pb-4 select-none w-full">
      {/* Character Keys */}
      {rows.map((row, rIdx) => {
        const isDense = row.length > 10;
        return (
          <div key={rIdx} className="flex w-full justify-center mb-1 px-1">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={`h-10 flex-1 ${isDense ? 'mx-[1px] text-sm' : 'mx-[2px] text-lg'} bg-gray-600 rounded text-white font-medium active:bg-gray-500 active:scale-95 transition-transform`}
              >
                {key}
              </button>
            ))}
          </div>
        );
      })}

      {/* Function Row */}
      <div className="flex w-full justify-center px-1 mt-1">
        <button className="h-10 flex-[1.5] mx-1 bg-gray-700 rounded text-gray-300 text-xs font-bold">123</button>
        
        {/* Emoji Key (Replaces Globe) */}
        <button 
          onClick={onEmoji}
          className="h-10 flex-[1] mx-1 bg-gray-700 rounded text-white text-xl flex items-center justify-center active:bg-gray-600"
        >
          🙂
        </button>

        {/* Spacebar with Long Press */}
        <button 
            onMouseDown={() => startPress(' ')}
            onMouseUp={() => endPress(' ')}
            onMouseLeave={() => endPress(' ')}
            onTouchStart={() => startPress(' ')}
            onTouchEnd={() => endPress(' ')}
            className="h-10 flex-[4] mx-1 bg-gray-600 rounded text-white active:bg-gray-500 text-xs text-gray-400 font-normal truncate px-1"
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