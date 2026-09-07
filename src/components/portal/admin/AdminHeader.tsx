import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, Shield, ShieldAlert, AlertTriangle, 
  Calendar, Clock, UserCheck, Radio, X, Download
} from 'lucide-react';
import { campusStore, CampusNotification } from '../../../services/campusStore';

interface AdminHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenEmergencyModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export default function AdminHeader({
  searchQuery,
  onSearchChange,
  onOpenEmergencyModal,
  onNavigateTab
}: AdminHeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [notifications, setNotifications] = useState<CampusNotification[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const statusInfo = campusStore.getCampusStatus();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
      setCurrentDate(now.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }));
    }, 1000);

    const updateNotifs = () => {
      setNotifications(campusStore.getNotifications());
    };
    updateNotifs();
    const unsubscribe = campusStore.subscribe(updateNotifs);

    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Search and Academic Year */}
      <div className="flex items-center gap-3 w-full md:w-auto flex-1 max-w-xl">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search rooms, assets, complaints, students, faculty..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366] transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-[11px] font-bold text-[#003366] whitespace-nowrap">
          <Calendar size={13} className="text-[#003366]" />
          <span>AY 2026-27</span>
        </div>
      </div>

      {/* Live Clocks, Status, Quick Actions */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
        {/* Date & Time */}
        <div className="hidden lg:flex flex-col items-end text-right pr-2 border-r border-gray-200">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
            <Clock size={12} className="text-gray-400" />
            <span>{currentTime || '09:00:00 AM'}</span>
          </div>
          <span className="text-[10px] text-gray-400 font-medium">{currentDate || 'Today'}</span>
        </div>

        {/* Live Campus Status Badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold ${
          statusInfo.status === 'CRITICAL' 
            ? 'bg-red-50 border-red-200 text-red-700 animate-pulse'
            : statusInfo.status === 'ATTENTION REQUIRED'
            ? 'bg-amber-50 border-amber-200 text-amber-700'
            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            statusInfo.status === 'CRITICAL' ? 'bg-red-600' : statusInfo.status === 'ATTENTION REQUIRED' ? 'bg-amber-500' : 'bg-emerald-600'
          }`} />
          <span className="uppercase text-[11px] tracking-wide">{statusInfo.status}</span>
        </div>

        {/* Export ZIP Codebase Button */}
        <a
          href="/api/export/zip"
          download="sathaye-ucm-complete.zip"
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-amber-300 rounded-lg text-xs font-bold transition-colors shadow-xs"
          title="Download Complete Production ZIP Archive"
        >
          <Download size={14} />
          <span className="hidden sm:inline">Export ZIP</span>
        </a>

        {/* Rapid SOS Dispatch Button */}
        <button
          onClick={onOpenEmergencyModal}
          className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          title="Open Emergency Dispatch Console"
        >
          <Radio size={14} className="animate-pulse" />
          <span className="hidden sm:inline">Emergency Alert</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="p-2 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors relative"
            title="Campus Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
                <span className="text-xs font-bold text-gray-800">Campus Alerts & Notices</span>
                <span className="text-[10px] text-gray-500">{notifications.length} total</span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {notifications.slice(0, 5).map((n) => (
                  <div key={n.id} className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-left text-xs border border-gray-100">
                    <p className="font-semibold text-gray-800 line-clamp-1">{n.title}</p>
                    <p className="text-[11px] text-gray-600 line-clamp-2 mt-0.5">{n.message}</p>
                    <span className="text-[9px] text-gray-400 mt-1 block">{n.timestamp}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 mt-2 border-t border-gray-100 text-center">
                <button 
                  onClick={() => {
                    setShowNotifDropdown(false);
                    onNavigateTab('announcements');
                  }}
                  className="text-xs font-bold text-[#003366] hover:underline"
                >
                  Manage All Announcements →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Administrator Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="w-8 h-8 rounded-lg bg-[#003366] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            AD
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-bold text-gray-900 leading-tight">Admin Desk</span>
            <span className="text-[10px] text-gray-500 font-medium">Principal Secretariat</span>
          </div>
        </div>
      </div>
    </header>
  );
}
