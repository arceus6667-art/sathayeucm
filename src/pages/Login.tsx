import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Key, User, Eye, EyeOff, ShieldCheck, Coffee, BookOpen, UserCheck, Shield, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';
import { campusStore, UserRole } from '../services/campusStore';
import { SmartCampusStore } from '../smartCampusStore';

const DEMO_FACULTY_LIST = [
  { dept: 'Mathematics', id: 'math.faculty01', pass: 'Math@Sathaye2026!', name: 'Prof. S. R. Joshi' },
  { dept: 'Physics', id: 'physics.faculty01', pass: 'Phys@Sathaye2026!', name: 'Dr. A. V. Kulkarni' },
  { dept: 'Chemistry', id: 'chem.faculty01', pass: 'Chem@Sathaye2026!', name: 'Dr. R. M. Date' },
  { dept: 'Microbiology', id: 'micro.faculty01', pass: 'Micro@Sathaye2026!', name: 'Dr. Neeta Deshmukh' },
  { dept: 'English', id: 'english.faculty01', pass: 'Eng@Sathaye2026!', name: 'Prof. Sunita Patil' },
  { dept: 'Economics', id: 'eco.faculty01', pass: 'Eco@Sathaye2026!', name: 'Dr. V. N. Bapat' },
  { dept: 'Psychology', id: 'psych.faculty01', pass: 'Psych@Sathaye2026!', name: 'Dr. Medha Dixit' },
  { dept: 'Commerce', id: 'commerce.faculty01', pass: 'Comm@Sathaye2026!', name: 'Prof. K. G. Shah' },
  { dept: 'Accountancy', id: 'accounts.faculty01', pass: 'Accts@Sathaye2026!', name: 'Prof. R. T. Mehta' },
  { dept: 'B.Sc. IT', id: 'it.faculty01', pass: 'IT@Sathaye2026!', name: 'Prof. Rohan Desai' },
];

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showFacultyList, setShowFacultyList] = useState(false);

  // Clear existing session on login page load
  useEffect(() => {
    localStorage.removeItem('demo_role');
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // 1. Try real login via CampusStore
      const res = campusStore.login(username.trim(), password.trim());
      if (res.success && res.user) {
        localStorage.setItem('demo_role', res.user.role.toLowerCase());
        SmartCampusStore.setCurrentUser(res.user as any);
        navigate('/portal');
        return;
      }

      // 2. Fallback check for legacy demo roles
      let role: UserRole | null = null;
      const u = username.trim().toLowerCase();
      const p = password.trim();

      if (
        (u === 'demo.student' && (p === 'DemoStudent@123' || p === 'student')) ||
        u === 'aarav.mehta' ||
        u === 'student'
      ) {
        role = 'STUDENT';
      } else if (
        u.includes('faculty') ||
        u === 'demo-fac-001' ||
        u === 'faculty'
      ) {
        role = 'FACULTY';
      } else if (
        (u === 'demo.admin' && (p === 'DemoAdmin@123' || p === 'admin')) ||
        u === 'admin'
      ) {
        role = 'ADMIN';
      } else if (
        (u === 'canteen@123' && (p === 'Canteen@1234' || p === 'canteen')) ||
        u === 'canteen'
      ) {
        role = 'CANTEEN';
      } else if (
        (u === 'librarymanagement@123' && (p === 'library@123' || p === 'library')) ||
        u === 'library'
      ) {
        role = 'LIBRARY';
      }

      if (role) {
        localStorage.setItem('demo_role', role);
        const switched = campusStore.switchRole(role);
        SmartCampusStore.setCurrentUser(switched as any);
        navigate('/portal');
      } else {
        setError(res.error || 'Invalid username or password. Please use the demo accounts below.');
        setIsLoading(false);
      }
    }, 500);
  };

  const selectFaculty = (fac: typeof DEMO_FACULTY_LIST[0]) => {
    setUsername(fac.id);
    setPassword(fac.pass);
    setError('');
  };

  const autofill = (r: UserRole) => {
    setError('');
    if (r === 'STUDENT') {
      setUsername('demo.student');
      setPassword('DemoStudent@123');
    } else if (r === 'FACULTY') {
      setUsername('math.faculty01');
      setPassword('Math@Sathaye2026!');
    } else if (r === 'ADMIN') {
      setUsername('demo.admin');
      setPassword('DemoAdmin@123');
    } else if (r === 'CANTEEN') {
      setUsername('canteen@123');
      setPassword('Canteen@1234');
    } else if (r === 'LIBRARY') {
      setUsername('librarymanagement@123');
      setPassword('library@123');
    }
  };

  const quickEnter = (r: UserRole) => {
    localStorage.setItem('demo_role', r);
    const switched = campusStore.switchRole(r);
    SmartCampusStore.setCurrentUser(switched as any);
    navigate('/portal');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <Link to="/" className="w-16 h-16 bg-[#003366] text-white rounded-full flex items-center justify-center font-bold text-2xl border-4 border-yellow-500 shadow-md">
            SC
          </Link>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-[#003366] uppercase tracking-tight">
          Smart Campus Portal
        </h2>
        <div className="flex items-center justify-center mt-2">
          <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider flex items-center shadow-xs border border-yellow-300">
            <ShieldCheck size={14} className="mr-1 text-[#003366]" /> Sathaye Autonomous RBAC System
          </span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 relative">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-xl border-t-4 border-yellow-500 sm:px-10 border border-gray-200">
          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
                <p className="text-xs text-red-700 font-bold">{error}</p>
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Username / College ID</label>
              <div className="relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-lg focus:ring-[#003366] focus:border-[#003366] p-2.5 border bg-gray-50"
                  placeholder="e.g. demo.student or canteen@123"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
              <div className="relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-lg focus:ring-[#003366] focus:border-[#003366] p-2.5 border bg-gray-50"
                  placeholder="Enter password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#003366] focus:ring-[#003366] border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-700 font-medium">
                  Remember terminal
                </label>
              </div>

              <div className="text-xs">
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Please contact Sathaye College Admin Desk at Ext. 101 for password assistance."); }} className="font-bold text-[#003366] hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-xs font-bold text-white uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003366] ${isLoading ? 'bg-blue-800 cursor-not-allowed opacity-90' : 'bg-[#003366] hover:bg-blue-800'}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating Session...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4 text-yellow-400" /> Sign In to Portal
                  </>
                )}
              </button>
            </div>
            
            {/* Quick 1-Click Role Switcher */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-2 text-center">
                Instant 1-Click Demo Login
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => quickEnter('STUDENT')}
                  className="p-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center justify-center space-x-1"
                >
                  <User size={12} className="text-[#003366]" />
                  <span>Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => quickEnter('FACULTY')}
                  className="p-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center justify-center space-x-1"
                >
                  <UserCheck size={12} className="text-[#003366]" />
                  <span>Faculty</span>
                </button>

                <button
                  type="button"
                  onClick={() => quickEnter('CANTEEN')}
                  className="p-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 bg-gray-50 hover:bg-yellow-50 hover:border-yellow-300 transition-colors flex items-center justify-center space-x-1"
                >
                  <Coffee size={12} className="text-yellow-600" />
                  <span>Canteen</span>
                </button>

                <button
                  type="button"
                  onClick={() => quickEnter('LIBRARY')}
                  className="p-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center justify-center space-x-1"
                >
                  <BookOpen size={12} className="text-[#003366]" />
                  <span>Library</span>
                </button>

                <button
                  type="button"
                  onClick={() => quickEnter('ADMIN')}
                  className="p-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 bg-gray-50 hover:bg-purple-50 hover:border-purple-300 transition-colors flex items-center justify-center space-x-1 col-span-2 sm:col-span-1"
                >
                  <Shield size={12} className="text-purple-600" />
                  <span>Admin</span>
                </button>
              </div>

              {/* Autofill credential helper */}
              <div className="mt-3 text-center">
                <span className="text-[10px] text-gray-400">
                  Or autofill form: 
                  <button type="button" onClick={() => autofill('CANTEEN')} className="text-blue-700 font-bold ml-1 hover:underline">Canteen</button> •
                  <button type="button" onClick={() => autofill('LIBRARY')} className="text-blue-700 font-bold ml-1 hover:underline">Library</button> •
                  <button type="button" onClick={() => autofill('FACULTY')} className="text-blue-700 font-bold ml-1 hover:underline">Faculty</button>
                </span>
              </div>

              {/* 10 Faculty Demo Accounts Drawer */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowFacultyList(!showFacultyList)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-[#003366] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                >
                  <span className="flex items-center">
                    <GraduationCap size={14} className="mr-1.5 text-yellow-600" />
                    10 Demo Faculty Accounts (Click to Fill)
                  </span>
                  {showFacultyList ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {showFacultyList && (
                  <div className="mt-2 space-y-1.5 max-h-52 overflow-y-auto pr-1 text-left">
                    {DEMO_FACULTY_LIST.map((fac, idx) => (
                      <button
                        key={fac.id}
                        type="button"
                        onClick={() => selectFaculty(fac)}
                        className="w-full p-2 text-left bg-gray-50 hover:bg-yellow-50 hover:border-yellow-300 border border-gray-200 rounded-md transition-all flex justify-between items-center group"
                      >
                        <div>
                          <div className="flex items-center space-x-1">
                            <span className="text-[10px] font-black bg-[#003366] text-white px-1.5 py-0.2 rounded">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <span className="text-xs font-bold text-gray-900 group-hover:text-[#003366]">
                              {fac.dept}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500">{fac.name} • {fac.id}</p>
                        </div>
                        <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-600">
                          {fac.pass}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="fixed bottom-0 left-0 right-0 h-64 bg-[#003366] z-0 overflow-hidden pointer-events-none" style={{ clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0% 100%)' }}>
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center"></div>
      </div>
    </div>
  );
}
