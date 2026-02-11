import React, { useRef, useEffect } from 'react';

interface DummyAppProps {
  inputText: string;
  setInputText: (t: string) => void;
  onSelectionChange: (start: number, end: number) => void;
  messages: string[];
}

export const DummyApp: React.FC<DummyAppProps> = ({ inputText, setInputText, onSelectionChange, messages }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync external text updates to textarea cursor if needed, or just let React handle value.
  // We need to capture selection changes.
  
  const handleSelect = () => {
    if (textareaRef.current) {
        onSelectionChange(textareaRef.current.selectionStart, textareaRef.current.selectionEnd);
    }
  };

  // Auto-resize or just fixed height for simulator
  return (
    <div className="flex-1 min-h-0 bg-black flex flex-col overflow-hidden">
      {/* App Header */}
      <div className="h-12 bg-[#202020] flex items-center px-4 border-b border-[#333] flex-shrink-0">
         <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-3">M</div>
         <span className="text-white font-medium">Messenger (Sim)</span>
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, i) => (
            <div key={i} className={`flex w-full ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                 <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${i % 2 === 0 ? 'bg-[#333] text-gray-200' : 'bg-blue-600 text-white'}`}>
                    {msg}
                 </div>
            </div>
        ))}
        <div className="text-xs text-center text-gray-600 mt-4">NANOKEY v0.1 DEMO</div>
      </div>

      {/* Input Area */}
      <div className="p-2 bg-[#202020] flex-shrink-0">
        <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onSelect={handleSelect}
            className="w-full bg-[#333] text-white rounded-2xl px-4 py-2 text-sm focus:outline-none resize-none h-12 pt-3"
            placeholder="Type a message..."
            spellCheck={false} // Disable browser spellcheck to focus on our keys
        />
      </div>
    </div>
  );
};