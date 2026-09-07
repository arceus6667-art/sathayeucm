import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, MapPin, Wrench, AlertCircle, Building2, 
  Users, Coffee, ShieldAlert, BarChart3, FileText, QrCode, 
  Clock, Bell, Radio, X, Calendar, Cpu, Video
} from 'lucide-react';
import { campusStore } from '../../services/campusStore';
import AdminHeader from './admin/AdminHeader';
import AdminDashboardOverview from './admin/AdminDashboardOverview';
import AdminCampusMap from './admin/AdminCampusMap';
import AdminMaintenanceView from './admin/AdminMaintenanceView';
import AdminComplaintsView from './admin/AdminComplaintsView';
import AdminCampusOperations from './admin/AdminCampusOperations';
import AdminUserManagement from './admin/AdminUserManagement';
import AdminLibraryCanteenOversight from './admin/AdminLibraryCanteenOversight';
import AdminEmergencySecurity from './admin/AdminEmergencySecurity';
import AdminAnalyticsView from './admin/AdminAnalyticsView';
import AdminReportsView from './admin/AdminReportsView';
import AdminDigitalIDView from './admin/AdminDigitalIDView';
import AdminAuditLogsView from './admin/AdminAuditLogsView';
import AdminTimetableView from './admin/AdminTimetableView';
import RLResourceAllocator from '../rl/RLResourceAllocator';
import CCTVAnomalyDetector from '../safety/CCTVAnomalyDetector';

export type AdminTab = 
  | 'overview' 
  | 'rl-allocator'
  | 'cctv-anomaly'
  | 'map' 
  | 'timetable'
  | 'maintenance' 
  | 'complaints' 
  | 'operations' 
  | 'users' 
  | 'oversight' 
  | 'safety' 
  | 'analytics' 
  | 'reports' 
  | 'digital-id' 
  | 'audit';

export default function AdminPortalView() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyTitle, setEmergencyTitle] = useState('');
  const [emergencyMsg, setEmergencyMsg] = useState('');
  const [emergencySent, setEmergencySent] = useState(false);

  // Auto-subscribe to campusStore
  useEffect(() => {
    const handleUpdate = () => {
      // triggers re-render on state change
    };
    return campusStore.subscribe(handleUpdate);
  }, []);

  const handleTriggerEmergency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emergencyTitle || !emergencyMsg) return;

    campusStore.addNotification({
      title: emergencyTitle,
      message: emergencyMsg,
      type: 'emergency',
      targetRole: 'ALL'
    });

    setEmergencySent(true);
    setTimeout(() => {
      setEmergencySent(false);
      setShowEmergencyModal(false);
      setEmergencyTitle('');
      setEmergencyMsg('');
    }, 2000);
  };

  const navTabs = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
    { id: 'rl-allocator', label: 'RL Sim-to-Real Allocator', icon: Cpu },
    { id: 'cctv-anomaly', label: 'CCTV Vision & Anomaly', icon: Video },
    { id: 'map', label: 'Campus Map', icon: MapPin },
    { id: 'timetable', label: 'Timetable Manager', icon: Calendar },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'complaints', label: 'Complaints', icon: AlertCircle },
    { id: 'operations', label: 'Operations', icon: Building2 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'oversight', label: 'Canteen & Library', icon: Coffee },
    { id: 'safety', label: 'Safety & SOS', icon: ShieldAlert },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'digital-id', label: 'Digital ID', icon: QrCode },
    { id: 'audit', label: 'Audit Trail', icon: Clock },
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. TOP BAR */}
      <AdminHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenEmergencyModal={() => setShowEmergencyModal(true)}
        onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
      />

      {/* 2. ADMIN NAVIGATION TABS */}
      <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`px-3 py-2 rounded-lg font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#003366] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-yellow-400' : 'text-gray-400'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. DYNAMIC TAB CONTENT */}
      <div>
        {activeTab === 'overview' && (
          <AdminDashboardOverview 
            onNavigateTab={(tab) => setActiveTab(tab as AdminTab)} 
            onOpenEmergencyModal={() => setShowEmergencyModal(true)} 
          />
        )}

        {activeTab === 'rl-allocator' && <RLResourceAllocator />}
        {activeTab === 'cctv-anomaly' && <CCTVAnomalyDetector />}

        {activeTab === 'map' && <AdminCampusMap />}
        {activeTab === 'timetable' && (
          <AdminTimetableView onNavigateToRoomMap={(roomNum) => setActiveTab('map')} />
        )}
        {activeTab === 'maintenance' && <AdminMaintenanceView />}
        {activeTab === 'complaints' && <AdminComplaintsView />}
        {activeTab === 'operations' && <AdminCampusOperations />}
        {activeTab === 'users' && <AdminUserManagement />}
        {activeTab === 'oversight' && <AdminLibraryCanteenOversight />}
        {activeTab === 'safety' && <AdminEmergencySecurity />}
        {activeTab === 'analytics' && <AdminAnalyticsView />}
        {activeTab === 'reports' && <AdminReportsView />}
        {activeTab === 'digital-id' && <AdminDigitalIDView />}
        {activeTab === 'audit' && <AdminAuditLogsView />}
      </div>

      {/* EMERGENCY RAPID DISPATCH MODAL */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 border-red-500 animate-in fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-red-600">
                <ShieldAlert size={22} className="animate-pulse" />
                <h3 className="text-base font-extrabold text-gray-900">Campus Rapid Red Alert Dispatch</h3>
              </div>
              <button 
                onClick={() => setShowEmergencyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {emergencySent ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto animate-ping">
                  <Radio size={24} />
                </div>
                <h4 className="text-sm font-bold text-gray-900">High-Priority Alert Broadcasted!</h4>
                <p className="text-xs text-gray-500">Notice sent to all student, faculty, and security devices.</p>
              </div>
            ) : (
              <form onSubmit={handleTriggerEmergency} className="space-y-3 text-xs">
                <p className="text-gray-600 text-[11px]">
                  Dispatch an immediate red warning banner across student portals, staff dashboards, and security desks.
                </p>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Emergency Alert Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Science Annex Evacuation / Heavy Rain Advisory"
                    value={emergencyTitle}
                    onChange={(e) => setEmergencyTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-red-50/50 border border-red-200 rounded-lg text-xs font-semibold focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Safety Instructions & Guidance</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Assemble at Gate 1 quadrangle. Follow security marshal instructions."
                    value={emergencyMsg}
                    onChange={(e) => setEmergencyMsg(e.target.value)}
                    className="w-full px-3 py-2 bg-red-50/50 border border-red-200 rounded-lg text-xs focus:bg-white focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEmergencyModal(false)}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
                  >
                    <Radio size={14} className="animate-pulse" />
                    <span>Trigger Campus Red Alert</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
