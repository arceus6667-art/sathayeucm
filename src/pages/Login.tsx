import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  GraduationCap, BookOpen, Coffee, ShieldCheck, 
  ArrowRight, Building2, CheckCircle2, Lock, 
  Sparkles, KeyRound, LogIn, ChevronRight, BookMarked
} from 'lucide-react';
import { campusStore, UserRole, DEMO_ACCOUNTS } from '../services/campusStore';
import { SmartCampusStore } from '../smartCampusStore';

interface RoleDemoCard {
  id: string;
  role: UserRole;
  title: string;
  subtitle: string;
  name: string;
  dept: string;
  idCode: string;
  username: string;
  icon: any;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  badge: string;
  badgeBg: string;
  features: string[];
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/portal';

  const [activeTab, setActiveTab] = useState<'demo' | 'manual'>('demo');
  const [manualUsername, setManualUsername] = useState('');
  const [manualPassword, setManualPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 5 Canonical Demo Institutional Profiles
  const demoCards: RoleDemoCard[] = [
    {
      id: 'student-card',
      role: 'STUDENT',
      title: 'Student Desk',
      subtitle: 'Degree College Portal',
      name: 'Aarav Mehta',
      dept: 'B.Sc. Information Technology',
      idCode: 'PRN20240182',
      username: 'demo.student',
      icon: GraduationCap,
      colorBg: 'hover:bg-emerald-50/50',
      colorBorder: 'border-emerald-200 hover:border-emerald-500',
      colorText: 'text-emerald-700',
      badge: 'Student Active',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      features: ['Timetable & Attendance', 'Digital Food Orders & Tokens', 'Library Book Loans']
    },
    {
      id: 'faculty-card',
      role: 'FACULTY',
      title: 'Faculty Portal',
      subtitle: 'Academic Operations',
      name: 'Prof. Rohan Desai',
      dept: 'B.Sc. IT & Computer Science',
      idCode: 'DEMO-FAC-IT-10',
      username: 'it.faculty01',
      icon: BookOpen,
      colorBg: 'hover:bg-blue-50/50',
      colorBorder: 'border-blue-200 hover:border-blue-500',
      colorText: 'text-blue-700',
      badge: 'Faculty Active',
      badgeBg: 'bg-blue-100 text-blue-800',
      features: ['Lecture Timetable', 'Upload Course Material', 'Department Notices']
    },
    {
      id: 'canteen-card',
      role: 'CANTEEN',
      title: 'Canteen Operations',
      subtitle: 'POS & Kitchen Dispatch',
      name: 'Central Canteen Manager',
      dept: 'Campus Food Court & Cafeteria',
      idCode: 'CANTEEN-MGR-01',
      username: 'canteen@123',
      icon: Coffee,
      colorBg: 'hover:bg-amber-50/50',
      colorBorder: 'border-amber-200 hover:border-amber-500',
      colorText: 'text-amber-700',
      badge: 'Canteen Desk',
      badgeBg: 'bg-amber-100 text-amber-800',
      features: ['Live Token QR Scanner', 'Order Preparation Board', 'Stock & Queue Broadcaster']
    },
    {
      id: 'library-card',
      role: 'LIBRARY',
      title: 'Central Library',
      subtitle: 'Circulation & Reading Hall',
      name: 'Sathaye Central Librarian',
      dept: 'Knowledge Resource Center',
      idCode: 'LIB-DESK-01',
      username: 'librarymanagement@123',
      icon: BookMarked,
      colorBg: 'hover:bg-purple-50/50',
      colorBorder: 'border-purple-200 hover:border-purple-500',
      colorText: 'text-purple-700',
      badge: 'Library Desk',
      badgeBg: 'bg-purple-100 text-purple-800',
      features: ['Book Issue & Return Circulation', 'Digital OPAC Stack Tracking', 'Reading Zone Occupancy']
    },
    {
      id: 'admin-card',
      role: 'ADMIN',
      title: 'Admin Command',
      subtitle: 'Autonomous Registrar',
      name: 'Principal & Registrar Desk',
      dept: 'Central College Administration',
      idCode: 'ADM-REG-01',
      username: 'demo.admin',
      icon: ShieldCheck,
      colorBg: 'hover:bg-indigo-50/50',
      colorBorder: 'border-indigo-200 hover:border-indigo-500',
      colorText: 'text-[#003366]',
      badge: 'System Admin',
      badgeBg: 'bg-indigo-100 text-indigo-900',
      features: ['Campus Status & Audit Logs', 'Role Switching Control', 'Facility & Grievance Dispatch']
    },
    {
      id: 'recruiter-card',
      role: 'RECRUITER',
      title: 'Corporate Recruiter',
      subtitle: 'Placement & Industry Cell',
      name: 'Rajesh Singhania',
      dept: 'Corporate Campus Relations (TCS)',
      idCode: 'REC-TCS-01',
      username: 'recruiter.tcs',
      icon: Building2,
      colorBg: 'hover:bg-teal-50/50',
      colorBorder: 'border-teal-200 hover:border-teal-500',
      colorText: 'text-teal-700',
      badge: 'Recruiter Active',
      badgeBg: 'bg-teal-100 text-teal-800',
      features: ['Post JDs & Filter Cutoffs', '1-Click Auto-Shortlisting', 'Schedule On-Campus Interviews']
    }
  ];

  // 1-Click Instant Login Function
  const handleInstantLogin = (demo: RoleDemoCard) => {
    // Find pre-configured demo account or construct authoritative profile
    const match = DEMO_ACCOUNTS.find(a => a.user.role === demo.role)?.user;
    const userProfile = match || {
      id: `usr-${demo.role.toLowerCase()}-01`,
      username: demo.username,
      name: demo.name,
      role: demo.role,
      department: demo.dept,
      email: `${demo.username}@sathaye.edu.in`,
      prn: demo.idCode
    };

    // Commit to both reactive stores immediately
    campusStore.setCurrentUser(userProfile);
    SmartCampusStore.setCurrentUser({
      id: userProfile.id,
      username: userProfile.username,
      name: userProfile.name,
      email: userProfile.email || `${userProfile.username}@sathaye.edu.in`,
      role: userProfile.role.toLowerCase() as any,
      avatar: userProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      department: userProfile.department
    });

    // Navigate immediately to requested path or portal
    navigate(redirectPath);
  };

  // Manual Credentials Login
  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const u = manualUsername.trim().toLowerCase();
    const p = manualPassword.trim();

    // Look up in DEMO_ACCOUNTS
    const acc = DEMO_ACCOUNTS.find(a => 
      a.user.username.toLowerCase() === u || 
      (a.user.email && a.user.email.toLowerCase() === u)
    );

    if (!acc) {
      setErrorMessage('Account not found. Select a 1-Click Demo ID above to login instantly.');
      return;
    }

    campusStore.setCurrentUser(acc.user);
    SmartCampusStore.setCurrentUser({
      id: acc.user.id,
      username: acc.user.username,
      name: acc.user.name,
      email: acc.user.email || `${acc.user.username}@sathaye.edu.in`,
      role: acc.user.role.toLowerCase() as any,
      department: acc.user.department
    });

    navigate(redirectPath);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-blue-50/40 flex flex-col justify-between font-sans">
      
      {/* Top Header - Compact for laptop viewports */}
      <header className="bg-[#003366] text-white border-b-4 border-yellow-500 shadow-sm shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 bg-white rounded-full p-0.5 flex items-center justify-center shadow">
              <img 
                src="/WhatsApp%20Image%202026-09-07%20at%209.12.07%20AM.jpeg" 
                alt="Sathaye College Logo" 
                className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight text-white group-hover:text-yellow-400 transition-colors leading-tight">
                Sathaye College (Autonomous)
              </div>
              <div className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold leading-tight">
                Unified Campus Management Portal
              </div>
            </div>
          </Link>

          <div className="flex items-center space-x-3 text-xs">
            <Link 
              to="/" 
              className="text-yellow-400 hover:text-white font-bold px-3 py-1 rounded border border-yellow-400/40 hover:border-yellow-400 transition-all text-[11px] uppercase tracking-wider"
            >
              Public Website
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container - Fitted for laptop screen */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 flex flex-col justify-center">
        
        {/* Title Bar */}
        <div className="text-center max-w-2xl mx-auto mb-4 md:mb-5">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-[11px] font-bold text-[#003366] uppercase tracking-wider mb-1.5 shadow-2xs">
            <Sparkles size={13} className="text-yellow-600" />
            <span>Instant 1-Click Role Access</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#003366] tracking-tight">
            Institutional Access Portal
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Select any institutional profile below to enter the respective management dashboard immediately.
          </p>

          {/* Mode Switcher */}
          <div className="flex justify-center mt-3">
            <div className="bg-gray-200/80 p-0.5 rounded-lg flex space-x-1 text-xs font-bold">
              <button
                onClick={() => setActiveTab('demo')}
                className={`px-4 py-1.5 rounded-md transition-all ${
                  activeTab === 'demo' ? 'bg-[#003366] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                1-Click Demo Profiles
              </button>
              <button
                onClick={() => setActiveTab('manual')}
                className={`px-4 py-1.5 rounded-md transition-all ${
                  activeTab === 'manual' ? 'bg-[#003366] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Manual Credentials
              </button>
            </div>
          </div>
        </div>

        {/* 1-CLICK DEMO CARDS GRID */}
        {activeTab === 'demo' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 max-w-7xl mx-auto w-full">
            {demoCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => handleInstantLogin(card)}
                  className={`bg-white rounded-2xl border-2 ${card.colorBorder} ${card.colorBg} p-4 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group relative`}
                >
                  <div>
                    {/* Top Icon & Badge */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className={`w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center ${card.colorText} group-hover:scale-105 transition-transform shadow-2xs`}>
                        <IconComponent size={20} />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${card.badgeBg}`}>
                        {card.role}
                      </span>
                    </div>

                    {/* Role & Name */}
                    <h3 className="font-extrabold text-[#003366] text-base group-hover:text-blue-900 leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-xs font-bold text-gray-800 mt-0.5">{card.name}</p>
                    <p className="text-[11px] text-gray-500 leading-tight mt-0.5">{card.dept}</p>

                    {/* Features list */}
                    <ul className="mt-3 pt-2.5 border-t border-gray-100 space-y-1 text-[10px] text-gray-600 font-medium">
                      {card.features.map((feat, i) => (
                        <li key={i} className="flex items-center space-x-1.5">
                          <CheckCircle2 size={11} className="text-green-600 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 pt-2.5 border-t border-gray-100">
                    <button
                      type="button"
                      className="w-full py-2 bg-[#003366] group-hover:bg-yellow-500 group-hover:text-[#003366] text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1 transition-all shadow-xs"
                    >
                      <span>Enter Portal</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MANUAL CREDENTIALS TAB */}
        {activeTab === 'manual' && (
          <div className="max-w-md mx-auto w-full bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <h3 className="text-base font-bold text-[#003366] mb-1 flex items-center space-x-2">
              <KeyRound size={18} className="text-yellow-600" />
              <span>Sign In with Username / Email</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Enter institutional credentials or any demo account username.
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleManualLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Username / ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. demo.student / it.faculty01 / canteen@123"
                  value={manualUsername}
                  onChange={e => setManualUsername(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#003366] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter institutional password"
                  value={manualPassword}
                  onChange={e => setManualPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#003366] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#003366] hover:bg-blue-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs flex items-center justify-center space-x-1.5 mt-2"
              >
                <LogIn size={15} />
                <span>Authorize & Enter</span>
              </button>
            </form>
          </div>
        )}

      </main>

      {/* Footer - Slim for laptop screens */}
      <footer className="py-2.5 border-t border-gray-200 bg-white/80 text-center text-[11px] text-gray-500 shrink-0">
        <p>© 2026 Sathaye College (Autonomous) • Unified Campus Management System</p>
      </footer>
    </div>
  );
}
