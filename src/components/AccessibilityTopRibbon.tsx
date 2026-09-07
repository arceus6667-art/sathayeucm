import React, { useState, useEffect } from 'react';
import { 
  Twitter, Linkedin, Facebook, Languages, Accessibility, 
  Eye, Volume2, Type, RotateCcw, X, Check, ArrowRight, Minus, Plus
} from 'lucide-react';
import { SmartCampusStore } from '../smartCampusStore';
import { TRANSLATIONS, SupportedLanguage } from '../services/translations';

export default function AccessibilityTopRibbon() {
  const [prefs, setPrefs] = useState(() => SmartCampusStore.getAccessibilityPrefs());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [mouseY, setMouseY] = useState(0);

  const t = TRANSLATIONS[prefs.language as SupportedLanguage] || TRANSLATIONS.en;

  // Listen for accessibility changes
  useEffect(() => {
    const handleUpdate = (e: any) => {
      setPrefs(e.detail || SmartCampusStore.getAccessibilityPrefs());
    };
    window.addEventListener('sathaye_accessibility_updated', handleUpdate);
    return () => window.removeEventListener('sathaye_accessibility_updated', handleUpdate);
  }, []);

  // Reading guide mouse tracker
  useEffect(() => {
    if (!prefs.readingGuide) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefs.readingGuide]);

  // Voice announcement helper
  const speakNotice = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleDecreaseFont = () => {
    const next = prefs.fontSizeLevel > -1 ? prefs.fontSizeLevel - 1 : -1;
    SmartCampusStore.setFontSizeLevel(next);
    if (prefs.ttsEnabled) speakNotice(`Font size decreased to ${next === -1 ? 'small' : 'normal'}`);
  };

  const handleResetFont = () => {
    SmartCampusStore.setFontSizeLevel(0);
    if (prefs.ttsEnabled) speakNotice('Font size reset to normal default');
  };

  const handleIncreaseFont = () => {
    const next = prefs.fontSizeLevel < 2 ? prefs.fontSizeLevel + 1 : 2;
    SmartCampusStore.setFontSizeLevel(next);
    if (prefs.ttsEnabled) speakNotice(`Font size increased to ${next === 1 ? 'large' : 'extra large'}`);
  };

  const toggleOption = (key: keyof typeof prefs) => {
    const current = prefs[key];
    const updated = !current;
    SmartCampusStore.setAccessibilityPrefs({ [key]: updated });
    if (prefs.ttsEnabled || key === 'ttsEnabled') {
      const label = key === 'highContrast' ? 'High Contrast Mode' :
                    key === 'grayscale' ? 'Grayscale Monochrome Mode' :
                    key === 'invertColors' ? 'Invert Colors Mode' :
                    key === 'dyslexicFont' ? 'Dyslexia Friendly Font' :
                    key === 'highlightLinks' ? 'Highlight Links' :
                    key === 'readingGuide' ? 'Reading Guide Ruler' :
                    key === 'ttsEnabled' ? 'Voice Readout Narrator' : String(key);
      speakNotice(`${label} turned ${updated ? 'ON' : 'OFF'}`);
    }
  };

  const setLanguage = (lang: SupportedLanguage) => {
    SmartCampusStore.setLanguage(lang);
    setIsLangMenuOpen(false);
    if (prefs.ttsEnabled) {
      const msg = lang === 'hi' ? 'भाषा हिन्दी चुनी गई' : lang === 'mr' ? 'भाषा मराठी निवडली' : 'Language set to English';
      speakNotice(msg);
    }
  };

  return (
    <>
      {/* Screen Reader Skip Navigation Link */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-1 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-yellow-400 focus:text-[#003366] focus:font-black focus:shadow-xl focus:rounded-md focus:outline-hidden"
      >
        {t.topRibbon.skipToMain}
      </a>

      {/* Institutional Accessibility & Social Ribbon (Exact style from reference screenshot) */}
      <div 
        role="region" 
        aria-label="Site Accessibility and Social Media Bar"
        className="w-full bg-[#8B0000] text-white border-b border-[#730000] py-1.5 px-4 sm:px-6 lg:px-8 text-xs select-none relative z-50 shadow-xs"
      >
        <div className="max-w-[1140px] mx-auto flex items-center justify-between">
          
          {/* Left Side: Social Media Channels */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Sathaye College Twitter"
              className="text-white/90 hover:text-white transition-transform hover:scale-115 p-0.5 focus:outline-hidden focus:ring-1 focus:ring-yellow-400 rounded"
              title="Official Twitter / X"
            >
              <Twitter size={14} className="fill-current stroke-none" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Sathaye College LinkedIn"
              className="text-white/90 hover:text-white transition-transform hover:scale-115 p-0.5 focus:outline-hidden focus:ring-1 focus:ring-yellow-400 rounded"
              title="Official LinkedIn"
            >
              <Linkedin size={14} className="fill-current stroke-none" />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Sathaye College Facebook"
              className="text-white/90 hover:text-white transition-transform hover:scale-115 p-0.5 focus:outline-hidden focus:ring-1 focus:ring-yellow-400 rounded"
              title="Official Facebook"
            >
              <Facebook size={14} className="fill-current stroke-none" />
            </a>
          </div>

          {/* Right Side: Language Toggle, Font Resizers, and Universal Accessibility Icon */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Language Switcher (हिन्दी / English / मराठी) */}
            <div className="relative flex items-center">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                aria-expanded={isLangMenuOpen}
                aria-label="Select Language"
                className="flex items-center space-x-1 font-semibold text-white/95 hover:text-white px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors focus:outline-hidden focus:ring-1 focus:ring-yellow-400"
                title="Change Website Language"
              >
                <Languages size={15} className="mr-1 text-white/90" />
                <span className="font-bold text-[13px] tracking-wide">
                  {prefs.language === 'hi' ? 'हिन्दी /' : prefs.language === 'mr' ? 'मराठी /' : 'English /'}
                </span>
              </button>

              {/* Language Dropdown Menu */}
              {isLangMenuOpen && (
                <div 
                  className="absolute right-0 top-full mt-1.5 w-36 bg-white text-gray-800 rounded-lg shadow-2xl border border-gray-200 py-1.5 z-50 animate-in fade-in zoom-in-95"
                  role="menu"
                >
                  <button
                    onClick={() => setLanguage('en')}
                    role="menuitem"
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center justify-between hover:bg-gray-100 ${
                      prefs.language === 'en' ? 'text-[#003366] bg-blue-50 font-bold' : 'text-gray-700'
                    }`}
                  >
                    <span>English</span>
                    {prefs.language === 'en' && <Check size={13} className="text-[#003366]" />}
                  </button>
                  <button
                    onClick={() => setLanguage('hi')}
                    role="menuitem"
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center justify-between hover:bg-gray-100 ${
                      prefs.language === 'hi' ? 'text-[#003366] bg-blue-50 font-bold' : 'text-gray-700'
                    }`}
                  >
                    <span>हिन्दी (Hindi)</span>
                    {prefs.language === 'hi' && <Check size={13} className="text-[#003366]" />}
                  </button>
                  <button
                    onClick={() => setLanguage('mr')}
                    role="menuitem"
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center justify-between hover:bg-gray-100 ${
                      prefs.language === 'mr' ? 'text-[#003366] bg-blue-50 font-bold' : 'text-gray-700'
                    }`}
                  >
                    <span>मराठी (Marathi)</span>
                    {prefs.language === 'mr' && <Check size={13} className="text-[#003366]" />}
                  </button>
                </div>
              )}
            </div>

            {/* Font Size Adjusters: A- | A | A+ */}
            <div className="flex items-center space-x-1 font-serif">
              <button
                onClick={handleDecreaseFont}
                aria-label={t.topRibbon.fontSizeDecrease}
                title={t.topRibbon.fontSizeDecrease}
                className={`px-1.5 py-0.5 rounded font-bold text-xs tracking-tighter transition-all focus:outline-hidden focus:ring-1 focus:ring-yellow-400 ${
                  prefs.fontSizeLevel === -1
                    ? 'bg-white text-[#8B0000] shadow-xs'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                A-
              </button>

              <button
                onClick={handleResetFont}
                aria-label={t.topRibbon.fontSizeNormal}
                title={t.topRibbon.fontSizeNormal}
                className={`px-1.5 py-0.5 rounded font-bold text-xs transition-all focus:outline-hidden focus:ring-1 focus:ring-yellow-400 ${
                  prefs.fontSizeLevel === 0
                    ? 'bg-white/20 text-white font-black'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                A
              </button>

              <button
                onClick={handleIncreaseFont}
                aria-label={t.topRibbon.fontSizeIncrease}
                title={t.topRibbon.fontSizeIncrease}
                className={`px-1.5 py-0.5 rounded font-bold text-xs tracking-tighter transition-all focus:outline-hidden focus:ring-1 focus:ring-yellow-400 ${
                  prefs.fontSizeLevel >= 1
                    ? 'bg-white text-[#8B0000] shadow-xs'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                A+
              </button>
            </div>

            {/* Universal Accessibility Person Icon in Circle (Exact match to reference screenshot) */}
            <button
              onClick={() => setIsModalOpen(true)}
              aria-label={t.topRibbon.accessibilityTools}
              title="Open Campus Accessibility Toolkit (Contrast, Screen Reader, Dyslexia Mode)"
              className="p-1 rounded-full text-white hover:text-yellow-300 hover:bg-white/15 transition-all focus:outline-hidden focus:ring-2 focus:ring-yellow-400 flex items-center justify-center"
            >
              <div className="w-5 h-5 rounded-full border-[1.5px] border-white flex items-center justify-center p-0.5 shadow-xs">
                <Accessibility size={13} className="text-white stroke-[2.5]" />
              </div>
            </button>

          </div>
        </div>
      </div>

      {/* Reading Guide Line Ruler (When Enabled) */}
      {prefs.readingGuide && (
        <div 
          className="fixed left-0 right-0 h-1 bg-yellow-400/90 pointer-events-none z-[9999] shadow-lg transition-all duration-75"
          style={{ top: `${mouseY}px` }}
        />
      )}

      {/* Comprehensive Accessibility Options Modal / Drawer */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="a11y-modal-title"
            className="bg-white text-gray-900 rounded-2xl shadow-2xl border-2 border-[#003366] max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#003366] text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-yellow-400/40 flex items-center justify-center">
                  <Accessibility size={22} className="text-yellow-400" />
                </div>
                <div>
                  <h2 id="a11y-modal-title" className="text-base sm:text-lg font-bold">
                    {t.a11yModal.title}
                  </h2>
                  <p className="text-xs text-yellow-300/90">
                    {t.a11yModal.subtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-label={t.a11yModal.close}
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Text Scaling Controls */}
            <div className="p-4 bg-slate-50 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center">
                  <Type size={14} className="mr-1.5 text-[#003366]" /> Text Size Scaling
                </span>
                <span className="text-xs font-bold text-[#003366]">
                  {prefs.fontSizeLevel === -1 ? '87.5% (A-)' : prefs.fontSizeLevel === 0 ? '100% (Default A)' : prefs.fontSizeLevel === 1 ? '115% (A+)' : '130% (A++)'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => SmartCampusStore.setFontSizeLevel(-1)}
                  className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all ${
                    prefs.fontSizeLevel === -1 ? 'bg-[#003366] text-white border-[#003366]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  A- (Small)
                </button>
                <button
                  onClick={() => SmartCampusStore.setFontSizeLevel(0)}
                  className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all ${
                    prefs.fontSizeLevel === 0 ? 'bg-[#003366] text-white border-[#003366]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  A (Normal)
                </button>
                <button
                  onClick={() => SmartCampusStore.setFontSizeLevel(1)}
                  className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all ${
                    prefs.fontSizeLevel === 1 ? 'bg-[#003366] text-white border-[#003366]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  A+ (Large)
                </button>
                <button
                  onClick={() => SmartCampusStore.setFontSizeLevel(2)}
                  className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all ${
                    prefs.fontSizeLevel === 2 ? 'bg-[#003366] text-white border-[#003366]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  A++ (Max)
                </button>
              </div>
            </div>

            {/* Accessibility Toggle Cards */}
            <div className="p-5 max-h-[50vh] overflow-y-auto space-y-3">
              
              {/* High Contrast */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <div>
                  <div className="text-sm font-bold text-gray-900">{t.a11yModal.highContrast}</div>
                  <div className="text-xs text-gray-500">{t.a11yModal.highContrastDesc}</div>
                </div>
                <button
                  onClick={() => toggleOption('highContrast')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase transition-all ${
                    prefs.highContrast
                      ? 'bg-black text-yellow-400 border border-yellow-400 shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {prefs.highContrast ? t.a11yModal.on : t.a11yModal.off}
                </button>
              </div>

              {/* Grayscale */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <div>
                  <div className="text-sm font-bold text-gray-900">{t.a11yModal.grayscale}</div>
                  <div className="text-xs text-gray-500">{t.a11yModal.grayscaleDesc}</div>
                </div>
                <button
                  onClick={() => toggleOption('grayscale')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase transition-all ${
                    prefs.grayscale
                      ? 'bg-gray-800 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {prefs.grayscale ? t.a11yModal.on : t.a11yModal.off}
                </button>
              </div>

              {/* Invert Colors */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <div>
                  <div className="text-sm font-bold text-gray-900">{t.a11yModal.invertColors}</div>
                  <div className="text-xs text-gray-500">{t.a11yModal.invertColorsDesc}</div>
                </div>
                <button
                  onClick={() => toggleOption('invertColors')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase transition-all ${
                    prefs.invertColors
                      ? 'bg-[#003366] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {prefs.invertColors ? t.a11yModal.on : t.a11yModal.off}
                </button>
              </div>

              {/* Dyslexia-Friendly Font */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <div>
                  <div className="text-sm font-bold text-gray-900">{t.a11yModal.dyslexicFont}</div>
                  <div className="text-xs text-gray-500">{t.a11yModal.dyslexicFontDesc}</div>
                </div>
                <button
                  onClick={() => toggleOption('dyslexicFont')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase transition-all ${
                    prefs.dyslexicFont
                      ? 'bg-[#003366] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {prefs.dyslexicFont ? t.a11yModal.on : t.a11yModal.off}
                </button>
              </div>

              {/* Highlight Hyperlinks */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <div>
                  <div className="text-sm font-bold text-gray-900">{t.a11yModal.highlightLinks}</div>
                  <div className="text-xs text-gray-500">{t.a11yModal.highlightLinksDesc}</div>
                </div>
                <button
                  onClick={() => toggleOption('highlightLinks')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase transition-all ${
                    prefs.highlightLinks
                      ? 'bg-amber-500 text-black shadow-xs font-black'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {prefs.highlightLinks ? t.a11yModal.on : t.a11yModal.off}
                </button>
              </div>

              {/* Reading Guide Ruler */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <div>
                  <div className="text-sm font-bold text-gray-900">{t.a11yModal.readingGuide}</div>
                  <div className="text-xs text-gray-500">{t.a11yModal.readingGuideDesc}</div>
                </div>
                <button
                  onClick={() => toggleOption('readingGuide')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase transition-all ${
                    prefs.readingGuide
                      ? 'bg-yellow-500 text-slate-900 shadow-xs font-black'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {prefs.readingGuide ? t.a11yModal.on : t.a11yModal.off}
                </button>
              </div>

              {/* Screen Reader Voice Narrator */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <div>
                  <div className="text-sm font-bold text-gray-900">{t.a11yModal.tts}</div>
                  <div className="text-xs text-gray-500">{t.a11yModal.ttsDesc}</div>
                </div>
                <button
                  onClick={() => toggleOption('ttsEnabled')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase transition-all ${
                    prefs.ttsEnabled
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {prefs.ttsEnabled ? t.a11yModal.on : t.a11yModal.off}
                </button>
              </div>

            </div>

            {/* Modal Footer with Reset All and Close */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => {
                  SmartCampusStore.resetAccessibility();
                  if (prefs.ttsEnabled) speakNotice("All accessibility settings reset to default");
                }}
                className="flex items-center text-xs font-bold text-red-600 hover:text-red-700 hover:underline px-2 py-1"
              >
                <RotateCcw size={14} className="mr-1.5" />
                {t.a11yModal.resetAll}
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-[#003366] hover:bg-blue-900 text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                {t.a11yModal.close}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
