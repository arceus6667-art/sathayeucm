import React, { useState, useEffect } from 'react';
import { Accessibility, Type, Volume2, X, Eye, Palette, RotateCcw } from 'lucide-react';
import { SmartCampusStore } from '../smartCampusStore';

export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [prefs, setPrefs] = useState(() => SmartCampusStore.getAccessibilityPrefs());

  useEffect(() => {
    const handleUpdate = (e: any) => {
      setPrefs(e.detail || SmartCampusStore.getAccessibilityPrefs());
    };
    window.addEventListener('sathaye_accessibility_updated', handleUpdate);
    return () => window.removeEventListener('sathaye_accessibility_updated', handleUpdate);
  }, []);

  const toggleContrast = () => {
    SmartCampusStore.setAccessibilityPrefs({ highContrast: !prefs.highContrast });
  };

  const toggleGrayscale = () => {
    SmartCampusStore.setAccessibilityPrefs({ grayscale: !prefs.grayscale });
  };

  const toggleTextSize = () => {
    const nextLevel = prefs.fontSizeLevel === 1 ? 0 : 1;
    SmartCampusStore.setFontSizeLevel(nextLevel);
  };

  const toggleDyslexic = () => {
    SmartCampusStore.setAccessibilityPrefs({ dyslexicFont: !prefs.dyslexicFont });
  };

  const toggleTts = () => {
    const updated = !prefs.ttsEnabled;
    SmartCampusStore.setAccessibilityPrefs({ ttsEnabled: updated });
    if (updated && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Accessibility voice narrator enabled for Sathaye College.");
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Floating Universal Accessibility Quick Button */}
      <div className="fixed bottom-6 left-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Accessibility Tools"
            className="bg-[#8B0000] text-white hover:bg-red-800 shadow-xl border-2 border-white p-3 rounded-full flex items-center justify-center transition-all hover:scale-110 focus:outline-hidden focus:ring-4 focus:ring-yellow-400"
            title="Accessibility Toolkit (Contrast, Screen Reader, Font Size)"
          >
            <Accessibility size={22} className="stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Slide-in Bar */}
      {isOpen && (
        <aside 
          aria-label="Campus Accessibility Controls"
          className="fixed bottom-20 left-6 z-50 bg-white border-2 border-[#8B0000] shadow-2xl rounded-2xl p-4 w-76 transition-all animate-in fade-in slide-in-from-bottom-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-gray-200 mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#8B0000] flex items-center">
              <Accessibility size={16} className="mr-1.5 text-yellow-600 stroke-[2.5]" /> Accessibility Tools
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-2">
            <button
              onClick={toggleContrast}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                prefs.highContrast
                  ? 'bg-black text-yellow-400 border border-yellow-400'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <Eye size={15} className="mr-2 text-yellow-500" /> High Contrast Mode
              </span>
              <span className="text-[10px] uppercase font-black">{prefs.highContrast ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={toggleGrayscale}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                prefs.grayscale
                  ? 'bg-gray-800 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <Palette size={15} className="mr-2 text-gray-500" /> Grayscale Mode
              </span>
              <span className="text-[10px] uppercase font-black">{prefs.grayscale ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={toggleTextSize}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                prefs.fontSizeLevel > 0
                  ? 'bg-[#003366] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <Type size={15} className="mr-2 text-blue-500" /> Large Text (115%)
              </span>
              <span className="text-[10px] uppercase font-black">{prefs.fontSizeLevel > 0 ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={toggleDyslexic}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                prefs.dyslexicFont
                  ? 'bg-[#003366] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <Type size={15} className="mr-2 text-purple-500" /> Dyslexia-Friendly Font
              </span>
              <span className="text-[10px] uppercase font-black">{prefs.dyslexicFont ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={toggleTts}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                prefs.ttsEnabled
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <Volume2 size={15} className="mr-2 text-emerald-400" /> Voice Narrator
              </span>
              <span className="text-[10px] uppercase font-black">{prefs.ttsEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => SmartCampusStore.resetAccessibility()}
              className="text-[11px] font-bold text-red-600 hover:underline flex items-center"
            >
              <RotateCcw size={12} className="mr-1" /> Reset Default
            </button>
            <span className="text-[10px] text-gray-400 font-semibold">WCAG 2.1 AA</span>
          </div>
        </aside>
      )}
    </>
  );
}

export default AccessibilityToolbar;
