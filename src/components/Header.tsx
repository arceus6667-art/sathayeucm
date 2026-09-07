import { Link } from 'react-router-dom';
import { Search, Phone, Mail, Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { siteMenu, MenuItem } from '../menuData';
import AccessibilityTopRibbon from './AccessibilityTopRibbon';
import { SmartCampusStore } from '../smartCampusStore';
import { TRANSLATIONS, SupportedLanguage } from '../services/translations';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [lang, setLang] = useState<SupportedLanguage>(() => SmartCampusStore.getAccessibilityPrefs().language);

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail?.language) {
        setLang(e.detail.language);
      }
    };
    window.addEventListener('sathaye_accessibility_updated', handleUpdate);
    return () => window.removeEventListener('sathaye_accessibility_updated', handleUpdate);
  }, []);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const toggleDropdown = (id: string) => {
    if (openDropdown === id) setOpenDropdown(null);
    else setOpenDropdown(id);
  };

  const toggleMobileDropdown = (id: string) => {
    if (openMobileDropdown === id) setOpenMobileDropdown(null);
    else setOpenMobileDropdown(id);
  };

  const getTranslatedMenuTitle = (item: MenuItem): string => {
    if (item.id === "1") return t.nav.home;
    if (item.id === "smart-campus") return t.nav.smartCampus;
    if (item.id === "209") return t.nav.about;
    if (item.id === "16") return t.nav.departments;
    if (item.id === "230") return t.nav.admissions;
    if (item.id === "191") return t.nav.studentSection;
    return item.type;
  };

  const renderDesktopMenu = (items: MenuItem[]) => {
    return items.map((item) => (
      <div 
        key={item.id} 
        className="relative group"
      >
        <Link 
          to={item.path || '#'}
          className="flex items-center px-4 h-12 text-[13px] font-semibold text-white uppercase tracking-wider hover:text-yellow-400 transition-colors"
        >
          {getTranslatedMenuTitle(item)}
          {item.children && <ChevronDown size={14} className="ml-1 opacity-70" />}
        </Link>
        
        {/* Dropdown */}
        {item.children && (
          <div className="absolute top-full left-0 bg-white shadow-lg border-t-[3px] border-yellow-500 min-w-[240px] z-50 py-2 hidden group-hover:block">
            {item.children.map((child) => (
              <div key={child.id} className="relative group/sub">
                <Link 
                  to={child.path || '#'}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#003366] capitalize flex items-center justify-between"
                >
                  {child.type}
                  {child.children && <ChevronDown size={14} className="-rotate-90" />}
                </Link>
                
                {/* 3rd Level Dropdown */}
                {child.children && (
                  <div className="absolute top-0 left-full bg-white shadow-lg border-t-2 border-[#003366] min-w-[220px] z-50 py-2 hidden group-hover/sub:block">
                    {child.children.map((grandchild) => (
                      <Link 
                        key={grandchild.id}
                        to={grandchild.path || '#'}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#003366] capitalize"
                      >
                        {grandchild.type}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  };

  const renderMobileMenu = (items: MenuItem[]) => {
    return items.map((item) => (
      <div key={item.id} className="border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <Link 
            to={item.path || '#'}
            className="text-gray-800 font-medium uppercase text-sm"
            onClick={() => !item.children && setIsMobileMenuOpen(false)}
          >
            {getTranslatedMenuTitle(item)}
          </Link>
          {item.children && (
            <button 
              onClick={() => toggleMobileDropdown(item.id)}
              className="p-1"
            >
              <ChevronDown size={18} className={`transition-transform ${openMobileDropdown === item.id ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
        
        {item.children && openMobileDropdown === item.id && (
          <div className="bg-gray-50 px-4 py-2 flex flex-col space-y-2">
            {item.children.map((child) => (
              <Link 
                key={child.id}
                to={child.path || '#'}
                className="text-gray-600 text-sm py-1 capitalize"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {child.type}
              </Link>
            ))}
          </div>
        )}
      </div>
    ));
  };

  return (
    <header className="w-full bg-white flex flex-col font-sans relative z-40">
      {/* 1. Official Red Accessibility & Social Ribbon (Reference Screenshot Match) */}
      <AccessibilityTopRibbon />

      {/* 2. Secondary Info & Quick Portal Strip */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 h-10 flex flex-wrap items-center justify-between text-xs text-gray-600">
          <div className="flex space-x-4 items-center">
            <span className="flex items-center hover:text-[#003366] cursor-pointer"><Phone size={14} className="mr-1" /> {t.topRibbon.phone}</span>
            <span className="flex items-center hover:text-[#003366] cursor-pointer hidden sm:flex"><Mail size={14} className="mr-1" /> {t.topRibbon.email}</span>
            <span className="bg-yellow-400 text-[#003366] text-[10px] font-black px-2 py-0.5 rounded uppercase hidden md:inline-block">
              {t.topRibbon.autonomousBadge}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/map" className="hover:text-[#003366] font-semibold text-blue-700 hidden sm:block">{t.nav.map}</Link>
            <span className="text-gray-300 hidden sm:block">|</span>
            <Link to="/canteen" className="hover:text-[#003366] font-semibold hidden md:block">{t.nav.canteen}</Link>
            <span className="text-gray-300 hidden md:block">|</span>
            <Link to="/library" className="hover:text-[#003366] font-semibold hidden md:block">{t.nav.library}</Link>
            <span className="text-gray-300 hidden md:block">|</span>
            <Link to="/events" className="hover:text-[#003366] font-semibold hidden sm:block">{t.nav.events}</Link>
            <span className="text-gray-300 hidden sm:block">|</span>
            <Link to="/safety" className="hover:text-red-700 font-bold text-red-600 hidden sm:block">{t.nav.sos}</Link>
            <span className="text-gray-300 hidden sm:block">|</span>
            <Link to="/portal" className="bg-[#003366] text-yellow-400 hover:bg-blue-900 px-2.5 py-1 rounded text-xs font-black uppercase tracking-wider">
              {t.nav.portal}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Area */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center">
          <Link to="/" className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mr-4 md:mr-5 shadow-sm border-2 border-yellow-500 shrink-0 overflow-hidden">
            <img src="/WhatsApp%20Image%202026-09-07%20at%209.12.07%20AM.jpeg" alt="Sathaye College Logo" className="w-full h-full object-contain p-1" />
          </Link>
          <div>
            <p className="text-[11px] md:text-[13px] font-semibold text-[#003366] uppercase tracking-wide leading-tight mb-1">Parle Tilak Vidyalaya Association's</p>
            <h1 className="text-2xl md:text-4xl font-extrabold text-[#003366] uppercase tracking-tight leading-none mb-1">Sathaye College</h1>
            <p className="text-[10px] md:text-xs font-semibold text-gray-600 mt-1">(AUTONOMOUS 2021-31)</p>
            <p className="text-[10px] md:text-xs text-gray-500 mt-1 hidden sm:block">Re-accredited "A" Grade by NAAC (3rd CYCLE)</p>
          </div>
        </div>
        
        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-[#003366] hover:text-blue-800 focus:outline-none p-2"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Navigation Bar (Desktop) */}
      <nav className="hidden lg:block bg-[#003366] text-white shrink-0 sticky top-0 z-50">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 flex relative">
          <div className="flex items-center space-x-1">
            {renderDesktopMenu(siteMenu)}
          </div>
          
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-white/80 hover:text-yellow-400 p-3 h-12 flex items-center justify-center bg-[#002244]"
            >
              <Search size={18} />
            </button>
            {isSearchOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow-lg border border-gray-200 p-2 rounded z-50">
                <div className="flex">
                  <input type="text" placeholder="Search..." className="w-full px-3 py-1 border border-gray-300 rounded-l focus:outline-none focus:border-[#003366]" autoFocus />
                  <button onClick={() => setIsSearchOpen(false)} className="bg-[#003366] text-white px-3 py-1 rounded-r">Go</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-200 z-50 max-h-[70vh] overflow-y-auto">
          <div className="flex flex-col">
            {renderMobileMenu(siteMenu)}
          </div>
        </div>
      )}
    </header>
  );
}
