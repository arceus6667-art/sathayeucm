import React, { useState, useEffect } from 'react';
import { Eye, Type, Volume2, X } from 'lucide-react';
import { SmartCampusStore } from '../smartCampusStore';

export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [prefs, setPrefs] = useState(() => SmartCampusStore.getAccessibilityPrefs());

  useEffect(() => {
    // Apply classes to document root
    if (prefs.highContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }

    if (prefs.largeText) {
      document.documentElement.classList.add('large-text-mode');
    } else {
      document.documentElement.classList.remove('large-text-mode');
    }
  }, [prefs]);

  const toggleContrast = () => {
    const updated = { ...prefs, highContrast: !prefs.highContrast };
    setPrefs(updated);
    SmartCampusStore.setAccessibilityPrefs(updated);
  };

  const toggleTextSize = () => {
    const updated = { ...prefs, largeText: !prefs.largeText };
    setPrefs(updated);
    SmartCampusStore.setAccessibilityPrefs(updated);
  };

  const toggleTts = () => {
    const updated = { ...prefs, ttsEnabled: !prefs.ttsEnabled };
    setPrefs(updated);
    SmartCampusStore.setAccessibilityPrefs(updated);
    if (!prefs.ttsEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Accessibility voice assistant enabled for Smart Sathaye Campus.");
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Floating Toggle Icon */}
      <div className="fixed top-24 right-4 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Accessibility Tools"
            className="bg-[#003366] text-yellow-400 hover:bg-blue-900 shadow-md border border-yellow-500/50 p-2.5 rounded-full flex items-center justify-center transition-all hover:scale-105"
            title="Accessibility Settings (High Contrast, Large Text, TTS)"
          >
            <Eye size={20} />
          </button>
        )}
      </div>

      {/* Slide-in Bar */}
      {isOpen && (
        <aside 
          aria-label="Campus Accessibility Controls"
          className="fixed top-20 right-4 z-50 bg-white border-2 border-[#003366] shadow-2xl rounded-xl p-4 w-72 transition-all animate-in fade-in slide-in-from-right-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-gray-200 mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#003366] flex items-center">
              <Eye size={16} className="mr-1.5 text-yellow-600" /> Accessibility Tools
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={toggleContrast}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                prefs.highContrast
                  ? 'bg-black text-yellow-400 border border-yellow-400'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <Eye size={16} className="mr-2" /> High Contrast Mode
              </span>
              <span className="text-[10px] uppercase">{prefs.highContrast ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={toggleTextSize}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                prefs.largeText
                  ? 'bg-[#003366] text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <Type size={16} className="mr-2" /> Large Text (120%)
              </span>
              <span className="text-[10px] uppercase">{prefs.largeText ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={toggleTts}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                prefs.ttsEnabled
                  ? 'bg-[#003366] text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <Volume2 size={16} className="mr-2" /> Voice Readout / TTS
              </span>
              <span className="text-[10px] uppercase">{prefs.ttsEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          <p className="text-[10px] text-gray-500 mt-3 pt-2 border-t border-gray-100 text-center">
            Wheelchair route filtering is available directly on the Campus Map.
          </p>
        </aside>
      )}

      {/* Global Accessibility Styles */}
      <style>{`
        .high-contrast-mode {
          filter: contrast(125%);
        }
        .high-contrast-mode body {
          background-color: #f8fafc !important;
          color: #000000 !important;
        }
        .large-text-mode {
          font-size: 112%;
        }
      `}</style>
    </>
  );
}

export default AccessibilityToolbar;
