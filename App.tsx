import React, { useState, useEffect } from 'react';
import { PhoneSimulator } from './components/PhoneSimulator';
import { DummyApp } from './components/DummyApp';
import { NanoKeyContainer } from './components/NanoKey/NanoKeyContainer';
import { SettingsView } from './components/SettingsView';
import { AppSettings, BackendType } from './types';

function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<'app' | 'settings'>('app');
  
  // App Data State
  const [inputText, setInputText] = useState("");
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [toast, setToast] = useState<{ msg: string; id: number } | null>(null);

  // Settings State (Persisted in memory for demo, could be localStorage)
  const [settings, setSettings] = useState<AppSettings>({
    nanobotEnabled: true,
    backendType: BackendType.NANOBOT,
    baseUrl: 'mock',
    timeoutSeconds: 20,
    devMode: false,
    fallbackLanguage: 'en',
    replyLanguage: 'keyboard',
    translateTarget: 'keyboard'
  });

  // Mock Messages for the Dummy App
  const [messages] = useState([
    "Hey! Are we still on for the meeting?",
    "Yeah, definitely.",
    "What time works best for you?"
  ]);

  const showToast = (msg: string) => {
    const id = Date.now();
    setToast({ msg, id });
    setTimeout(() => {
        setToast(prev => (prev?.id === id ? null : prev));
    }, 3000);
  };

  useEffect(() => {
    // Load settings from local storage if available (Simulator persistence)
    const saved = localStorage.getItem('nanokey_settings');
    if (saved) {
        try {
            setSettings({ ...settings, ...JSON.parse(saved) });
        } catch (e) {}
    }
  }, []);

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('nanokey_settings', JSON.stringify(newSettings));
    showToast("Settings Saved");
  };

  return (
    <PhoneSimulator>
      {currentView === 'settings' ? (
        <SettingsView 
            settings={settings} 
            onSave={handleSaveSettings}
            onBack={() => setCurrentView('app')}
        />
      ) : (
        <>
          <DummyApp 
            inputText={inputText}
            setInputText={setInputText}
            onSelectionChange={(start, end) => setSelection({ start, end })}
            messages={messages}
          />
          
          <div className="flex justify-end bg-[#202020] px-2 py-1 flex-shrink-0">
             <button 
                onClick={() => setCurrentView('settings')}
                className="text-[10px] text-gray-500 uppercase font-bold tracking-wider px-2 py-1 hover:text-white"
             >
                Settings ⚙
             </button>
          </div>

          <NanoKeyContainer 
            inputText={inputText}
            selectionStart={selection.start}
            selectionEnd={selection.end}
            settings={settings}
            onUpdateText={(t) => {
                setInputText(t);
                // Reset selection to end of inserted text roughly
                setSelection({ start: t.length, end: t.length });
            }}
            onToast={showToast}
            onOpenSettings={() => setCurrentView('settings')}
          />

          {/* Toast Notification */}
          {toast && (
            <div className="absolute bottom-60 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-full shadow-lg border border-gray-600 animate-fade-in-up z-50">
                {toast.msg}
            </div>
          )}
        </>
      )}
    </PhoneSimulator>
  );
}

export default App;