import React, { useState } from 'react';
import { 
  ShieldAlert, Radio, AlertTriangle, PhoneCall, 
  CheckCircle2, Bell, Users, ShieldCheck, Flame, X, Send
} from 'lucide-react';
import { campusStore, CampusNotification } from '../../../services/campusStore';

export default function AdminEmergencySecurity() {
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastType, setBroadcastType] = useState<'emergency' | 'academic' | 'event' | 'general'>('emergency');
  const [broadcastTarget, setBroadcastTarget] = useState<'ALL' | 'STUDENT' | 'FACULTY' | 'CANTEEN' | 'LIBRARY'>('ALL');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const [activeAlert, setActiveAlert] = useState<{
    isActive: boolean;
    title: string;
    message: string;
    level: 'CRITICAL' | 'WARNING';
  } | null>(null);

  const notifications = campusStore.getNotifications();
  const emergencyNotifs = notifications.filter(n => n.type === 'emergency');

  const emergencyContacts = [
    { name: 'Gate 1 Security Control Command', phone: '+91 22 2618 3614', ext: '101', role: 'Chief Security Officer' },
    { name: 'Campus Health & First Aid Clinic', phone: '+91 22 2618 3615', ext: '102', role: 'Resident Medical Officer' },
    { name: 'Vile Parle Police Station Control', phone: '112 / +91 22 2618 3550', ext: 'External', role: 'Mumbai Police' },
    { name: 'Dr. RN Cooper Municipal Hospital', phone: '108 / +91 22 2620 7254', ext: 'External', role: 'Emergency Trauma Care' },
    { name: 'Mumbai Fire Brigade (Andheri Division)', phone: '101 / +91 22 2683 2222', ext: 'External', role: 'Fire & Disaster Rescue' }
  ];

  const handleSendEmergencyAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMsg) return;

    campusStore.addNotification({
      title: broadcastTitle,
      message: broadcastMsg,
      type: broadcastType,
      targetRole: broadcastTarget
    });

    if (broadcastType === 'emergency') {
      setActiveAlert({
        isActive: true,
        title: broadcastTitle,
        message: broadcastMsg,
        level: 'CRITICAL'
      });
    }

    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastTitle('');
      setBroadcastMsg('');
    }, 2500);
  };

  const handleDismissAlert = () => {
    setActiveAlert(null);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="bg-red-900 text-white rounded-xl p-6 border-l-4 border-red-500 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-300 uppercase tracking-wider block mb-1">
            Campus Crisis & Safety Desk
          </span>
          <h2 className="text-2xl font-extrabold">Emergency Dispatch & Security Coordination</h2>
          <p className="text-xs text-red-200 mt-0.5">
            Instantaneous mass broadcast dispatch to student mobile apps, campus digital signages, and gate alarms
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 px-3 py-1.5 bg-red-800/80 border border-red-700 rounded-lg text-xs font-bold">
            <Radio size={14} className="animate-ping" />
            <span>Telemetry Link: Active</span>
          </span>
        </div>
      </div>

      {/* Active Red Alert Banner if Triggered */}
      {activeAlert && activeAlert.isActive && (
        <div className="bg-red-600 text-white p-4 rounded-xl shadow-lg border-2 border-red-400 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <ShieldAlert size={28} className="shrink-0 text-white" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-red-800 px-2 py-0.5 rounded">
                ACTIVE RED BROADCAST
              </span>
              <h3 className="text-base font-extrabold mt-0.5">{activeAlert.title}</h3>
              <p className="text-xs text-red-100">{activeAlert.message}</p>
            </div>
          </div>
          <button
            onClick={handleDismissAlert}
            className="px-3 py-1.5 bg-white text-red-700 hover:bg-red-50 rounded-lg text-xs font-bold shrink-0 transition-colors"
          >
            Revoke / Dismiss Alert
          </button>
        </div>
      )}

      {/* Grid: Dispatch Form & Security Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Emergency Broadcast Form */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Broadcast Campus Notification / Red Alert</h3>
              <p className="text-[11px] text-gray-500">Sends high-priority notifications directly to enrolled portal users</p>
            </div>
            {broadcastSent && (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1">
                <CheckCircle2 size={13} />
                <span>Broadcast Dispatched!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSendEmergencyAlert} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Broadcast Type</label>
                <select
                  value={broadcastType}
                  onChange={(e) => setBroadcastType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none"
                >
                  <option value="emergency">🚨 Emergency / Safety SOS</option>
                  <option value="academic">📚 Academic Announcement</option>
                  <option value="event">🎉 Campus Event / Fest Notice</option>
                  <option value="general">ℹ️ General Notice</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Target Audience</label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none"
                >
                  <option value="ALL">Entire Campus (All Roles)</option>
                  <option value="STUDENT">Students Only</option>
                  <option value="FACULTY">Faculty & Staff</option>
                  <option value="CANTEEN">Canteen Crew</option>
                  <option value="LIBRARY">Library Staff</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Alert Headline / Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Unscheduled Power Outage in Science Annex / Weather Advisory"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Detailed Advisory Message</label>
              <textarea
                rows={3}
                required
                placeholder="Specify assembly points, safety procedures, or advisory instructions..."
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-gray-100">
              <span className="text-[11px] text-gray-400">
                Audited action: All broadcasts are logged to the administrative security trail.
              </span>
              <button
                type="submit"
                className={`px-5 py-2 rounded-lg text-xs font-bold text-white transition-all shadow-xs flex items-center gap-1.5 ${
                  broadcastType === 'emergency'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-[#003366] hover:bg-blue-900'
                }`}
              >
                <Send size={13} />
                <span>Publish Broadcast</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Emergency Contacts Hotline */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
          <div className="pb-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Security Control Hotline</h3>
            <p className="text-[11px] text-gray-500">Direct speed-dials for campus duty officers</p>
          </div>

          <div className="space-y-3">
            {emergencyContacts.map((contact, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">{contact.name}</span>
                  <span className="text-[10px] text-blue-900 font-mono font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                    Ext {contact.ext}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">{contact.role}</p>
                <div className="flex items-center gap-1.5 text-[#003366] font-mono font-bold pt-1">
                  <PhoneCall size={12} />
                  <span>{contact.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Historic Emergency Broadcasts Feed */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
        <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">Recent Dispatched Safety Alerts ({emergencyNotifs.length})</h3>
          <span className="text-xs text-gray-400">Archived Broadcasts</span>
        </div>

        <div className="space-y-2.5">
          {emergencyNotifs.length === 0 ? (
            <p className="text-xs text-gray-400 py-4 text-center">No active or historic emergency alerts logged.</p>
          ) : (
            emergencyNotifs.slice(0, 4).map((n) => (
              <div key={n.id} className="p-3 bg-red-50/50 rounded-lg border border-red-200 text-xs flex items-start justify-between">
                <div>
                  <span className="font-bold text-red-900 block">{n.title}</span>
                  <p className="text-red-800 text-[11px] mt-0.5">{n.message}</p>
                  <span className="text-[10px] text-red-500 font-mono mt-1 block">{n.timestamp}</span>
                </div>
                <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-bold text-[10px] uppercase">
                  {n.targetRole}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
