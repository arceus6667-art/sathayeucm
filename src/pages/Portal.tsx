import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, LogOut, Bell, ChevronRight, Activity, 
  MapPin, Coffee, BookOpen, ShieldAlert, Wrench, Calendar, Sparkles, RefreshCw
} from 'lucide-react';
import { campusStore, UserRole, CampusUser } from '../services/campusStore';
import { SmartCampusStore } from '../smartCampusStore';
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
        // Check if old demo_role exists
        const oldRole = localStorage.getItem('demo_role');
        if (oldRole) {
          const roleMap: Record<string, UserRole> = {
            'student': 'STUDENT',
            'faculty': 'FACULTY',
            'admin': 'ADMIN',
            'canteen': 'CANTEEN',
            'library': 'LIBRARY'
          };
          const resolvedRole = roleMap[oldRole.toLowerCase()] || 'STUDENT';
          const defaultUser = campusStore.switchRole(resolvedRole);
          setCurrentUser(defaultUser);
        } else {
          navigate('/login');
        }
      } else {
        setCurrentUser(user);
      }
    };

    checkAuth();
    return campusStore.subscribe(checkAuth);
  }, [navigate]);

  const handleLogout = () => {
    campusStore.logout();
    SmartCampusStore.logout();
    navigate('/login');
  };

  const handleSwitchRole = (newRole: UserRole) => {
    const switchedUser = campusStore.switchRole(newRole);
    setCurrentUser(switchedUser);
  };

  if (!currentUser) return null;

  const role = currentUser.role;
  const notifications = campusStore.getNotificationsForRole(role);

  const getPortalTitle = () => {
    switch (role) {
      case 'FACULTY': return 'Faculty Portal';
      case 'CANTEEN': return 'Canteen Operations';
      case 'LIBRARY': return 'Library Management';
      case 'ADMIN': return 'Admin Command';
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
              <Link to="/" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#003366] font-extrabold shadow-sm border-2 border-yellow-500">
                SC
              </Link>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg md:text-xl font-black uppercase tracking-tight leading-none">
                    {getPortalTitle()}
                  </h1>
                  <span className="bg-yellow-400 text-[#003366] text-[10px] font-black px-1.5 py-0.2 rounded uppercase">
                    {role}
                  </span>
                </div>
                <p className="text-[10px] text-yellow-300 font-bold tracking-wider">
                  SATHAYE AUTONOMOUS CAMPUS
                </p>
              </div>
            </div>

            {/* Quick Actions & Profile */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              
              {/* Role Switcher Pill for Demo Testing */}
              <div className="hidden lg:flex items-center space-x-1 bg-blue-900/60 p-1 rounded-xl border border-blue-700/50 text-[11px]">
                <span className="text-gray-300 font-bold px-1.5 flex items-center">
                  <RefreshCw size={11} className="mr-1 text-yellow-400" />
                  Role:
                </span>
                {(['STUDENT', 'FACULTY', 'CANTEEN', 'LIBRARY', 'ADMIN'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleSwitchRole(r)}
                    className={`px-2 py-1 rounded-lg font-black transition-all uppercase text-[10px] ${
                      role === r
                        ? 'bg-yellow-400 text-[#003366] shadow-sm'
                        : 'text-gray-300 hover:text-white hover:bg-blue-800/50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Emergency SOS Shortcut */}
              <button
                onClick={() => setIsSosOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1 shadow"
                title="Trigger Emergency SOS"
              >
                <ShieldAlert size={16} />
                <span className="hidden sm:inline">SOS</span>
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="text-gray-300 hover:text-white p-2 relative transition-colors"
                >
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span className="absolute 0 top-1 right-1 bg-yellow-400 text-[#003366] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 text-gray-800 overflow-hidden animate-in fade-in zoom-in-95">
                    <div className="p-3 bg-[#003366] text-white flex justify-between items-center text-xs font-bold">
                      <span>Smart Campus Bulletins</span>
                      <button onClick={() => setShowNotifications(false)} className="text-gray-300 hover:text-white">✕</button>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 text-xs">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-center text-gray-400">No new notices</p>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className="p-3 hover:bg-gray-50">
                            <div className="flex justify-between items-start mb-0.5">
                              <h5 className="font-bold text-gray-900">{n.title}</h5>
                              <span className="text-[10px] text-gray-400">{n.timestamp}</span>
                            </div>
                            <p className="text-gray-600 text-[11px] leading-snug">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Info */}
              <div className="flex items-center space-x-3 border-l border-blue-800 pl-4">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-bold leading-none mb-0.5 text-white">{currentUser.name}</p>
                  <p className="text-[11px] text-blue-300 leading-none">{currentUser.email || currentUser.id}</p>
                </div>
                <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-yellow-400 font-bold border border-yellow-500 overflow-hidden">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name.substring(0, 2).toUpperCase()
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8 flex-grow">
        
        {/* Left Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden sticky top-24">
            
            {/* Profile Summary Card */}
            <div className="p-6 border-b border-gray-100 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-3 border-3 border-yellow-500 overflow-hidden shadow-xs">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={36} className="text-[#003366]" />
                )}
              </div>
              <h2 className="font-extrabold text-gray-900 text-base leading-tight">{currentUser.name}</h2>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mt-0.5">
                {currentUser.department || role}
              </p>
              <span className="text-[10px] font-mono bg-blue-50 text-[#003366] px-2 py-0.5 rounded mt-1.5 font-bold">
                {currentUser.id}
              </span>
            </div>

            {/* Smart Navigation Links */}
            <nav className="p-2 space-y-1 text-xs font-bold text-gray-700">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Active Role Workspace
              </div>

              <div className="flex items-center space-x-3 px-4 py-2.5 bg-blue-50 text-[#003366] rounded-lg font-bold border-l-4 border-[#003366]">
                <Activity size={16} />
                <span>Portal Workspace</span>
              </div>

              <div className="px-3 pt-3 pb-1 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Integrated Campus Services
              </div>

              <Link
                to="/map"
                className="flex items-center space-x-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
              >
                <MapPin size={16} className="text-[#003366]" />
                <span>Interactive 3D Map</span>
              </Link>

              <Link
                to="/canteen"
                className="flex items-center space-x-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
              >
                <Coffee size={16} className="text-yellow-600" />
                <span>Smart Canteen</span>
              </Link>

              <Link
                to="/library"
                className="flex items-center space-x-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
              >
                <BookOpen size={16} className="text-[#003366]" />
                <span>Smart Library</span>
              </Link>

              <Link
                to="/events"
                className="flex items-center space-x-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
              >
                <Calendar size={16} className="text-purple-600" />
                <span>Smart Events</span>
              </Link>

              <Link
                to="/support"
                className="flex items-center space-x-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
              >
                <Wrench size={16} className="text-gray-600" />
                <span>Support & Lost/Found</span>
              </Link>

              <Link
                to="/safety"
                className="flex items-center space-x-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-red-700 rounded-lg transition-colors"
              >
                <ShieldAlert size={16} className="text-red-600" />
                <span>Safety & Medical SOS</span>
              </Link>
            </nav>

            {/* Logout Button */}
            <div className="p-3 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center space-x-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>

          </div>
        </div>

        {/* Right Dashboard Content */}
        <div className="flex-grow space-y-6">
          {role === 'STUDENT' && <StudentPortalView />}
          {role === 'FACULTY' && <FacultyPortalView />}
          {role === 'CANTEEN' && <CanteenPortalView />}
          {role === 'LIBRARY' && <LibraryPortalView />}
          {role === 'ADMIN' && <AdminPortalView />}
        </div>

      </div>

      {/* Floating Global Widgets */}
      <SafetySOSModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
      <AICampusCopilot />
      <AccessibilityToolbar />

    </div>
  );
}

