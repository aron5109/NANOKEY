import React from 'react';
import { KeyMode } from '../../types';

interface ActionBarProps {
  onAction: (mode: KeyMode) => void;
  onPaste: () => void;
  isLoading: boolean;
}

export const ActionBar: React.FC<ActionBarProps> = ({ onAction, onPaste, isLoading }) => {
  const btnClass = "flex-1 h-10 mx-1 bg-gray-700 hover:bg-gray-600 active:bg-blue-600 rounded text-xs font-bold tracking-wide text-white transition-colors flex items-center justify-center border-b-2 border-gray-900";
  const iconBtnClass = "w-10 h-10 mx-1 bg-gray-700 hover:bg-gray-600 active:bg-blue-600 rounded text-white transition-colors flex items-center justify-center border-b-2 border-gray-900";

  return (
    <div className="flex flex-row items-center justify-between p-2 bg-gray-800 border-b border-gray-700 h-14">
      {/* Clipboard / Paste Button */}
      <button
        className={iconBtnClass}
        onClick={onPaste}
        title="Paste from Clipboard"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </button>

      <div className="w-[1px] h-6 bg-gray-700 mx-1"></div>

      <button 
        className={`${btnClass} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !isLoading && onAction(KeyMode.REPLY)}
      >
        Reply
      </button>
      <button 
        className={`${btnClass} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !isLoading && onAction(KeyMode.REWRITE)}
      >
        Rewrite
      </button>
      <button 
        className={`${btnClass} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !isLoading && onAction(KeyMode.TRANSLATE)}
      >
        Translate
      </button>
    </div>
  );
};