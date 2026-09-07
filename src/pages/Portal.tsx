import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, LogOut, Bell, ChevronRight, Activity, 
  MapPin, Coffee, BookOpen, ShieldAlert, Wrench, Calendar, Sparkles, RefreshCw,
  ShieldCheck, CheckCircle2, Lock
} from 'lucide-react';
import { campusStore, UserRole, CampusUser } from '../services/campusStore';
import { SmartCampusStore } from '../smartCampusStore';
import { logoutUser } from '../services/firebase';
import FacultyPortalView from '../components/portal/FacultyPortalView';
import CanteenPortalView from '../components/portal/CanteenPortalView';
import LibraryPortalView from '../components/portal/LibraryPortalView';
import StudentPortalView from '../components/portal/StudentPortalView';
import AdminPortalView from '../components/portal/AdminPortalView';
import SafetySOSModal from '../components/SafetySOSModal';
import AICampusCopilot from '../components/AICampusCopilot';
import AccessibilityToolbar from '../components/AccessibilityToolbar';

export default function Portal() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<CampusUser | null>(null);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const user = campusStore.getCurrentUser();
      if (!user) {
        navigate('/login');
      } else {
        setCurrentUser(user);
      }
    };

    checkAuth();
    return campusStore.subscribe(checkAuth);
  }, [navigate]);

  const handleLogout = async () => {
    await logoutUser();
    campusStore.logout();
    SmartCampusStore.logout();
    navigate('/login');
  };

  if (!currentUser) return null;

  const role = currentUser.role;
  const notifications = campusStore.getNotificationsForRole(role);

  const getPortalTitle = () => {
    switch (role) {
      case 'FACULTY': return 'Faculty Portal';
      case 'CANTEEN': return 'Canteen Operations';
      case 'LIBRARY': return 'Library Management';
      case 'ADMIN': return 'Admin Command Center';
      case 'STUDENT': default: return 'Student Portal';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      
      {/* Top Navbar */}
      <nav className="bg-[#003366] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Brand Logo & Portal Name */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#003366] font-extrabold shadow-sm border-2 border-yellow-500 overflow-hidden">
                <img 
                  src="/WhatsApp%20Image%202026-09-07%20at%209.12.07%20AM.jpeg" 
                  alt="Sathaye Emblem" 
                  className="w-full h-full object-contain p-0.5"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </Link>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-base sm:text-lg font-black uppercase tracking-tight leading-none text-white">
                    {getPortalTitle()}
                  </h1>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                    role === 'ADMIN' ? 'bg-rose-500 text-white' :
                    role === 'FACULTY' ? 'bg-blue-400 text-slate-900' :
                    role === 'CANTEEN' ? 'bg-amber-400 text-slate-900' :
                    role === 'LIBRARY' ? 'bg-indigo-400 text-white' : 'bg-yellow-400 text-[#003366]'
                  }`}>
                    {role}
                  </span>
                </div>
                <p className="text-[10px] text-yellow-300 font-semibold tracking-wider">
                  SATHAYE AUTONOMOUS CAMPUS • UCM
                </p>
              </div>
            </div>

            {/* Quick Actions & Profile */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              
              {/* Emergency In-App Incident SOS */}
              <button
                onClick={() => setIsSosOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 shadow"
                title="Trigger Emergency In-App SOS Report"
              >
                <ShieldAlert size={15} />
                <span className="hidden sm:inline">SOS Report</span>
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="text-gray-300 hover:text-white p-2 relative transition-colors"
                  aria-label="Notifications"
                >
                  <Bell size={19} />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 bg-yellow-400 text-[#003366] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 text-gray-800 overflow-hidden">
                    <div className="p-3 bg-[#003366] text-white flex justify-between items-center text-xs font-bold">
                      <span>Campus Bulletins & Alerts</span>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-300 hover:text-white text-xs"
                      >
                        Close
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-gray-400">
                          No active bulletins.
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className="p-3 hover:bg-gray-50 text-xs">
                            <div className="font-bold text-gray-900 mb-0.5">{n.title}</div>
                            <div className="text-gray-600 text-[11px] leading-relaxed">{n.message}</div>
                            <div className="text-[10px] text-gray-400 mt-1">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile info */}
              <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-blue-700/60">
                <div className="w-8 h-8 rounded-full bg-blue-900 border border-yellow-400/40 flex items-center justify-center text-yellow-300 font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left text-xs">
                  <div className="font-bold text-white leading-tight max-w-[120px] truncate">{currentUser.name}</div>
                  <div className="text-[10px] text-blue-200 leading-tight">{currentUser.department || 'Degree College'}</div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="text-red-300 hover:text-red-100 hover:bg-red-900/30 p-2 rounded-lg transition-colors flex items-center space-x-1 text-xs font-semibold"
                title="Sign Out"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area: Render Authorized Role View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {role === 'STUDENT' && <StudentPortalView />}
        {role === 'FACULTY' && <FacultyPortalView />}
        {role === 'CANTEEN' && <CanteenPortalView />}
        {role === 'LIBRARY' && <LibraryPortalView />}
        {role === 'ADMIN' && <AdminPortalView />}
      </main>

      {/* Emergency In-App SOS Modal */}
      <SafetySOSModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />

      {/* Floating AI Campus Copilot */}
      <AICampusCopilot />

      {/* Accessibility Toolbar */}
      <AccessibilityToolbar />
    </div>
  );
}
