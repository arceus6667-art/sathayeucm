import React, { useState } from 'react';
import { 
  Briefcase, Users, Building2, ChevronRight, CheckCircle2, 
  Sparkles, GraduationCap, ShieldCheck, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { campusStore } from '../services/campusStore';
import StudentPlacementView from '../components/placement/StudentPlacementView';
import RecruiterView from '../components/placement/RecruiterView';

export default function PlacementPortal() {
  const currentUser = campusStore.getCurrentUser();
  const [activeRoleView, setActiveRoleView] = useState<'student' | 'recruiter'>(
    currentUser?.role === 'ADMIN' ? 'recruiter' : 'student'
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-16">
      
      {/* Header Bar */}
      <div className="bg-[#003366] text-white py-6 border-b-4 border-yellow-500 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Link to="/portal" className="text-yellow-400 hover:text-yellow-300 text-xs font-bold flex items-center">
                  <ArrowLeft size={13} className="mr-1" /> Back to Portal
                </Link>
                <span className="text-blue-300 text-xs">•</span>
                <span className="text-xs text-blue-200">Sathaye Autonomous Placement & Training Cell</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight">
                Corporate Placements & Career Hub
              </h1>
              <p className="text-xs md:text-sm text-blue-200 mt-1">
                Direct recruiting pipeline: JD filter engine, auto-shortlisting, 1-click scheduling, and AI career recommendations.
              </p>
            </div>

            {/* View Switcher Toggle */}
            <div className="bg-[#002244] p-1 rounded-xl border border-yellow-500/30 flex items-center space-x-1 shrink-0">
              <button
                onClick={() => setActiveRoleView('student')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 transition-all ${
                  activeRoleView === 'student'
                    ? 'bg-yellow-400 text-[#003366] shadow-xs'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <GraduationCap size={14} />
                <span>Student View</span>
              </button>

              <button
                onClick={() => setActiveRoleView('recruiter')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 transition-all ${
                  activeRoleView === 'recruiter'
                    ? 'bg-yellow-400 text-[#003366] shadow-xs'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Building2 size={14} />
                <span>Recruiter Desk</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeRoleView === 'student' ? (
          <StudentPlacementView />
        ) : (
          <RecruiterView />
        )}
      </main>
    </div>
  );
}
