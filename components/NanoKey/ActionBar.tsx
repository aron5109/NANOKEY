import React from 'react';
import { KeyMode } from '../../types';

interface ActionBarProps {
  onAction: (mode: KeyMode) => void;
  isLoading: boolean;
}

export const ActionBar: React.FC<ActionBarProps> = ({ onAction, isLoading }) => {
  const btnClass = "flex-1 h-10 mx-1 bg-gray-700 hover:bg-gray-600 active:bg-blue-600 rounded text-xs font-bold tracking-wider text-white transition-colors flex items-center justify-center border-b-2 border-gray-900";

  return (
    <div className="flex flex-row items-center justify-between p-2 bg-gray-800 border-b border-gray-700 h-14">
      <button 
        className={`${btnClass} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !isLoading && onAction(KeyMode.GEN)}
      >
        GEN
      </button>
      <button 
        className={`${btnClass} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !isLoading && onAction(KeyMode.REWRITE)}
      >
        RWR
      </button>
      <button 
        className={`${btnClass} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !isLoading && onAction(KeyMode.TRANSLATE)}
      >
        TRN
      </button>
    </div>
  );
};