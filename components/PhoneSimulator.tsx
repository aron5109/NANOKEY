import React, { ReactNode } from 'react';

interface PhoneSimulatorProps {
  children: ReactNode;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] p-4">
      <div className="relative w-[360px] h-[740px] bg-black rounded-[40px] border-[8px] border-[#222] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
        {/* Status Bar (Visual Only) */}
        <div className="h-8 w-full flex justify-between items-center px-6 bg-transparent absolute top-0 left-0 z-50 pointer-events-none">
             <span className="text-[10px] font-bold text-white">12:30</span>
             <div className="flex space-x-1">
                <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                <div className="w-3 h-3 bg-white/20 rounded-full"></div>
             </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col w-full h-full pt-8 bg-black">
          {children}
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full"></div>
      </div>
    </div>
  );
};