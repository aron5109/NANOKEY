import React, { useState } from 'react';
import { AppSettings, BackendType } from '../types';
import { BackendService } from '../services/backendService';

interface SettingsViewProps {
  settings: AppSettings;
  onSave: (s: AppSettings) => void;
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onSave, onBack }) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const handleChange = (key: keyof AppSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
        // Spec says GET {baseUrl}/health, but for v0.1 generic test we might just try a dry run or ping.
        // Spec: GET {baseUrl}/health (optional; used for “Test connection”)
        if (localSettings.baseUrl && localSettings.baseUrl !== 'mock') {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 5000);
            try {
                const res = await fetch(`${localSettings.baseUrl}/health`, { signal: controller.signal });
                clearTimeout(id);
                if (res.ok) {
                    setTestResult("Success: 200 OK");
                } else {
                    setTestResult(`Error: ${res.status}`);
                }
            } catch (e) {
                setTestResult("Error: Unreachable");
            }
        } else {
            // Mock test
            await new Promise(r => setTimeout(r, 500));
            setTestResult("Success: Mock Backend Ready");
        }
    } catch (e) {
        setTestResult("Failed");
    } finally {
        setTesting(false);
    }
  };

  const handleSave = () => {
    onSave(localSettings);
    onBack();
  };

  return (
    <div className="flex-1 bg-black text-white flex flex-col font-sans">
       <div className="h-14 flex items-center px-4 border-b border-gray-800 bg-gray-900">
          <button onClick={onBack} className="text-xl mr-4 text-gray-400 hover:text-white">←</button>
          <h1 className="font-bold text-lg">NANOKEY Settings</h1>
       </div>

       <div className="p-4 space-y-6 overflow-y-auto flex-1">
          {/* Backend Selector */}
          <div>
            <label className="block text-xs text-gray-500 uppercase font-bold mb-2">Backend Type</label>
            <div className="grid grid-cols-3 gap-2">
                {Object.values(BackendType).map(type => (
                    <button
                        key={type}
                        onClick={() => handleChange('backendType', type)}
                        className={`py-2 text-sm rounded border ${localSettings.backendType === type ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
                    >
                        {type}
                    </button>
                ))}
            </div>
          </div>

          {/* Base URL */}
          <div>
             <label className="block text-xs text-gray-500 uppercase font-bold mb-2">Base URL</label>
             <input 
                type="text" 
                value={localSettings.baseUrl}
                onChange={(e) => handleChange('baseUrl', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-sm focus:border-blue-500 outline-none font-mono"
                placeholder="https://api.example.com/v1"
             />
             <p className="text-[10px] text-gray-500 mt-1">Use 'mock' for internal simulator.</p>
          </div>

          {/* Timeout */}
          <div>
             <label className="block text-xs text-gray-500 uppercase font-bold mb-2">Timeout (Seconds)</label>
             <input 
                type="number" 
                value={localSettings.timeoutSeconds}
                onChange={(e) => handleChange('timeoutSeconds', parseInt(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-sm focus:border-blue-500 outline-none"
             />
          </div>

           {/* Dev Mode */}
           <div className="flex items-center justify-between py-2 border-t border-gray-800 border-b">
             <div>
                <span className="block text-sm font-medium">Dev Mode</span>
                <span className="text-xs text-gray-500">Allow HTTP connections</span>
             </div>
             <button 
                onClick={() => handleChange('devMode', !localSettings.devMode)}
                className={`w-12 h-6 rounded-full relative transition-colors ${localSettings.devMode ? 'bg-blue-600' : 'bg-gray-700'}`}
             >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${localSettings.devMode ? 'left-7' : 'left-1'}`}></div>
             </button>
          </div>

          {/* Actions */}
          <div className="pt-4 space-y-3">
             <button 
                onClick={handleTestConnection}
                className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded text-sm font-medium transition-colors border border-gray-600"
             >
                {testing ? 'Testing...' : 'Test Connection'}
             </button>
             {testResult && (
                 <div className={`text-xs p-2 rounded ${testResult.startsWith('Success') ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                     {testResult}
                 </div>
             )}
          </div>
       </div>

       <div className="p-4 border-t border-gray-800">
            <button 
                onClick={handleSave}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold tracking-wide"
            >
                SAVE SETTINGS
            </button>
       </div>
    </div>
  );
};