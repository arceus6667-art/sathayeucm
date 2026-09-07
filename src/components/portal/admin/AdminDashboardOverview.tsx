import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, Users, GraduationCap, 
  Layers, MapPin, Wrench, Calendar, Radio, ArrowUpRight, 
  Clock, CheckCircle2, ChevronRight, Activity, Zap, Droplets, 
  Trash2, Coffee, BookOpen, ExternalLink, QrCode, FileText, 
  Flame, Check
} from 'lucide-react';
import { 
  campusStore, CampusBuilding, CampusLocation, CampusIssue, 
  AdminAuditLog, CampusEvent 
} from '../../../services/campusStore';

interface AdminDashboardOverviewProps {
  onNavigateTab: (tab: string) => void;
  onSelectBuildingForMap?: (bldgId: string) => void;
}

export default function AdminDashboardOverview({
  onNavigateTab,
  onSelectBuildingForMap
}: AdminDashboardOverviewProps) {
  const statusInfo = campusStore.getCampusStatus();
  const buildings = campusStore.getBuildings();
  const locations = campusStore.getLocations();
  const issues = campusStore.getCampusIssues();
  const events = campusStore.getEvents();
  const auditLogs = campusStore.getAuditLogs();
  const assets = campusStore.getAssets();

  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('bldg-main');
  const [showOccupancyHeatmap, setShowOccupancyHeatmap] = useState<boolean>(true);
  const [showMaintenancePins, setShowMaintenancePins] = useState<boolean>(true);

  const selectedBuilding = buildings.find(b => b.id === selectedBuildingId) || buildings[0];
  const buildingRooms = locations.filter(l => l.buildingId === selectedBuildingId);
  const pendingIssues = issues.filter(i => i.status !== 'Resolved');

  // Quick action to assign technician or resolve from overview
  const handleQuickResolve = (issueId: string) => {
    campusStore.updateIssueWorkflow(issueId, { status: 'Resolved' }, 'Admin Command Center');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOP OPERATIONAL KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Campus Status */}
        <div className="col-span-2 bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Campus Status</span>
            <span className={`w-2.5 h-2.5 rounded-full ${
              statusInfo.status === 'CRITICAL' ? 'bg-red-500 animate-ping' : statusInfo.status === 'ATTENTION REQUIRED' ? 'bg-amber-500' : 'bg-emerald-500'
            }`} />
          </div>
          <div className="my-2">
            <h3 className={`text-xl font-extrabold ${
              statusInfo.status === 'CRITICAL' ? 'text-red-700' : statusInfo.status === 'ATTENTION REQUIRED' ? 'text-amber-700' : 'text-emerald-700'
            }`}>
              {statusInfo.status}
            </h3>
            <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{statusInfo.reason}</p>
          </div>
          <div className="flex items-center justify-between text-[10px] text-gray-400 border-t border-gray-100 pt-2">
            <span>Security: <strong className="text-gray-700">{statusInfo.securityStatus}</strong></span>
            <button onClick={() => onNavigateTab('safety')} className="text-[#003366] font-bold hover:underline">
              Inspect →
            </button>
          </div>
        </div>

        {/* Enrolled Students */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Students</span>
            <GraduationCap size={15} className="text-blue-600" />
          </div>
          <div className="my-1">
            <h4 className="text-xl font-extrabold text-gray-900">{statusInfo.studentCount.toLocaleString()}</h4>
            <span className="text-[10px] text-emerald-600 font-bold">98.2% Present</span>
          </div>
          <button onClick={() => onNavigateTab('users')} className="text-[10px] text-left text-gray-400 hover:text-[#003366] font-semibold border-t border-gray-50 pt-1">
            View Directory
          </button>
        </div>

        {/* Teaching Faculty */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Faculty</span>
            <Users size={15} className="text-indigo-600" />
          </div>
          <div className="my-1">
            <h4 className="text-xl font-extrabold text-gray-900">{statusInfo.facultyCount}</h4>
            <span className="text-[10px] text-gray-500 font-medium">10 Departments</span>
          </div>
          <button onClick={() => onNavigateTab('operations')} className="text-[10px] text-left text-gray-400 hover:text-[#003366] font-semibold border-t border-gray-50 pt-1">
            Faculty List
          </button>
        </div>

        {/* Active Classes */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Classes Live</span>
            <Activity size={15} className="text-emerald-600" />
          </div>
          <div className="my-1">
            <h4 className="text-xl font-extrabold text-gray-900">{statusInfo.activeClassesCount}</h4>
            <span className="text-[10px] text-emerald-700 font-bold">Period 3 Ongoing</span>
          </div>
          <button onClick={() => onNavigateTab('operations')} className="text-[10px] text-left text-gray-400 hover:text-[#003366] font-semibold border-t border-gray-50 pt-1">
            Timetable
          </button>
        </div>

        {/* Campus Occupancy */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Occupancy</span>
            <Layers size={15} className="text-amber-600" />
          </div>
          <div className="my-1">
            <h4 className="text-xl font-extrabold text-gray-900">{statusInfo.occupancyPercent}%</h4>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1 overflow-hidden">
              <div 
                className={`h-1.5 rounded-full ${statusInfo.occupancyPercent > 85 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                style={{ width: `${statusInfo.occupancyPercent}%` }}
              />
            </div>
          </div>
          <span className="text-[9px] text-gray-400 pt-1">Peak: 12:30 PM</span>
        </div>

        {/* Open Complaints */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Complaints</span>
            <Wrench size={15} className={pendingIssues.length > 0 ? 'text-amber-600' : 'text-gray-400'} />
          </div>
          <div className="my-1">
            <h4 className="text-xl font-extrabold text-gray-900">{pendingIssues.length}</h4>
            <span className={`text-[10px] font-bold ${pendingIssues.length > 3 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {pendingIssues.filter(i => i.priority === 'High').length} High Priority
            </span>
          </div>
          <button onClick={() => onNavigateTab('complaints')} className="text-[10px] text-left text-gray-400 hover:text-[#003366] font-semibold border-t border-gray-50 pt-1">
            Manage Queue
          </button>
        </div>

        {/* Active Events */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Events</span>
            <Calendar size={15} className="text-purple-600" />
          </div>
          <div className="my-1">
            <h4 className="text-xl font-extrabold text-gray-900">{events.length}</h4>
            <span className="text-[10px] text-purple-600 font-bold">1 Flagship Fest</span>
          </div>
          <button onClick={() => onNavigateTab('operations')} className="text-[10px] text-left text-gray-400 hover:text-[#003366] font-semibold border-t border-gray-50 pt-1">
            Events Calendar
          </button>
        </div>
      </div>

      {/* 2. MAIN INTERACTIVE 2D CAMPUS MAP INTEGRATION */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#003366] text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                Interactive Control Matrix
              </span>
              <h3 className="text-base font-bold text-gray-900">Campus Spatial Map & Occupancy Monitor</h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Select building zones to audit real-time class status, maintenance flags, and physical accessibility.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <label className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showOccupancyHeatmap}
                onChange={(e) => setShowOccupancyHeatmap(e.target.checked)}
                className="rounded text-[#003366] focus:ring-0"
              />
              <span>Occupancy Overlay</span>
            </label>

            <label className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showMaintenancePins}
                onChange={(e) => setShowMaintenancePins(e.target.checked)}
                className="rounded text-[#003366] focus:ring-0"
              />
              <span>Maintenance Flags</span>
            </label>

            <button
              onClick={() => onNavigateTab('map')}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#003366] text-white hover:bg-blue-900 rounded-lg text-xs font-bold transition-colors"
            >
              <span>Full Screen 2D Map</span>
              <ExternalLink size={12} />
            </button>
          </div>
        </div>

        {/* Building Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {buildings.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBuildingId(b.id)}
              className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                selectedBuildingId === b.id
                  ? 'bg-[#003366] text-white border-[#003366] shadow-xs'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
              <span>{b.name}</span>
              <span className="text-[10px] opacity-75 font-normal">({b.code})</span>
            </button>
          ))}
        </div>

        {/* Visual Campus Interactive SVG Floorplan / Sector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
          {/* Isometric Campus Canvas Visualizer */}
          <div className="lg:col-span-2 relative bg-slate-900 rounded-xl p-4 min-h-[300px] flex flex-col justify-between overflow-hidden border border-slate-800">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }} />

            {/* Top Canvas Bar */}
            <div className="relative z-10 flex items-center justify-between text-white/80 text-xs">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-yellow-400" />
                <span className="font-bold text-white">{selectedBuilding.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">
                  {selectedBuilding.floors.length} Floors
                </span>
              </div>
              <div className="text-[11px] text-slate-300">
                {selectedBuilding.hasElevator ? 'Elevator: Yes' : 'Elevator: No'} • {selectedBuilding.hasRamp ? 'Ramp: Yes' : 'Stairs Only'}
              </div>
            </div>

            {/* Interactive Building Blocks Visual Simulation */}
            <div className="relative z-10 my-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {buildingRooms.slice(0, 6).map((room) => {
                const roomIssues = issues.filter(i => i.locationId === room.id && i.status !== 'Resolved');
                const hasIssue = roomIssues.length > 0;
                
                return (
                  <div
                    key={room.id}
                    className={`p-3 rounded-lg border transition-all text-left relative ${
                      room.status === 'occupied'
                        ? 'bg-amber-950/40 border-amber-500/40 text-amber-100'
                        : room.status === 'maintenance'
                        ? 'bg-red-950/40 border-red-500/40 text-red-100'
                        : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-blue-400'
                    }`}
                  >
                    {showMaintenancePins && hasIssue && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-red-600 text-white rounded text-[9px] font-bold flex items-center gap-0.5">
                        <Wrench size={10} />
                        <span>Issue</span>
                      </span>
                    )}

                    <div className="text-[10px] text-slate-400 font-mono">{room.code} • Floor {room.floorNumber}</div>
                    <div className="text-xs font-bold text-white line-clamp-1 mt-0.5">{room.name}</div>
                    <div className="flex items-center justify-between text-[10px] text-slate-300 mt-2">
                      <span>Cap: {room.capacity} seats</span>
                      <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] uppercase ${
                        room.status === 'available' ? 'bg-emerald-900/60 text-emerald-300' : 'bg-amber-900/60 text-amber-300'
                      }`}>
                        {room.status}
                      </span>
                    </div>

                    {showOccupancyHeatmap && (
                      <div className="w-full bg-slate-700 h-1 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="h-1 bg-yellow-400 rounded-full" 
                          style={{ width: `${room.status === 'occupied' ? 85 : 15}%` }} 
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Status bar */}
            <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span className="line-clamp-1">{selectedBuilding.description}</span>
              <span className="font-mono text-white/90">Autonomous Vile Parle Campus</span>
            </div>
          </div>

          {/* Building Inspection Sidebar */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Building Facilities</h4>
                <span className="text-[11px] font-bold text-[#003366]">{buildingRooms.length} Registered Rooms</span>
              </div>

              <div className="mt-3 space-y-2 max-h-52 overflow-y-auto">
                {buildingRooms.map((r) => (
                  <div key={r.id} className="p-2 bg-white rounded-lg border border-gray-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-800">{r.name}</span>
                      <p className="text-[10px] text-gray-500">{r.department} • Cap: {r.capacity}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.status === 'available' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Accessibility Ramp:</span>
                <strong className="text-gray-900">{selectedBuilding.hasRamp ? 'Compliant' : 'Non-compliant'}</strong>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>High-Speed Wi-Fi:</span>
                <strong className="text-emerald-700 font-bold">Active (1 Gbps Fiber)</strong>
              </div>
              <button
                onClick={() => onNavigateTab('operations')}
                className="w-full py-2 bg-white hover:bg-gray-100 text-[#003366] border border-gray-300 rounded-lg text-xs font-bold transition-colors"
              >
                Modify Room Inventory →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. LOWER SECTIONS: PENDING ISSUES, AUDIT LOGS, OPERATIONAL METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Pending Support Issues & Work Orders */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Pending Issues & Grievances</h3>
              <p className="text-[11px] text-gray-500">Facility, IT, and electrical tickets awaiting resolution</p>
            </div>
            <button
              onClick={() => onNavigateTab('complaints')}
              className="text-xs font-bold text-[#003366] hover:underline"
            >
              All ({pendingIssues.length}) →
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingIssues.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">
                <CheckCircle2 size={24} className="mx-auto text-emerald-500 mb-1" />
                <span>All reported grievances resolved!</span>
              </div>
            ) : (
              pendingIssues.slice(0, 4).map((issue) => (
                <div key={issue.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-gray-900 line-clamp-1">{issue.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      issue.priority === 'High' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {issue.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 line-clamp-2">{issue.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-gray-200/60">
                    <span>{issue.locationName}</span>
                    <button
                      onClick={() => handleQuickResolve(issue.id)}
                      className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold flex items-center gap-1"
                    >
                      <Check size={11} />
                      <span>Mark Resolved</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Middle Column: Recent Activity & Audit Logs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Campus Administrative Audit Feed</h3>
              <p className="text-[11px] text-gray-500">Immutable system logs and operational actions</p>
            </div>
            <button
              onClick={() => onNavigateTab('audit')}
              className="text-xs font-bold text-[#003366] hover:underline"
            >
              Full Log →
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="flex items-start gap-3 text-xs pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-[#003366] mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 line-clamp-1">{log.actorName}</span>
                    <span className="text-[10px] text-gray-400 font-mono shrink-0">{log.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 font-mono text-emerald-800">{log.action}</p>
                  <p className="text-[10px] text-gray-500 line-clamp-1">{log.newValue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Operational Metrics & Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Resource Consumption & Green Campus</h3>
              <p className="text-[11px] text-gray-500">Live utility telemetry across campus infrastructure</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/60">
                <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold">
                  <Zap size={14} className="text-amber-600" />
                  <span>Energy</span>
                </div>
                <div className="mt-1">
                  <span className="text-lg font-extrabold text-gray-900">{statusInfo.energyKWh}</span>
                  <span className="text-[10px] text-gray-500 ml-1">kWh</span>
                </div>
                <span className="text-[9px] text-emerald-700 font-bold block mt-0.5">410 kWh Solar Offset</span>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200/60">
                <div className="flex items-center gap-1.5 text-blue-800 text-xs font-bold">
                  <Droplets size={14} className="text-blue-600" />
                  <span>Water</span>
                </div>
                <div className="mt-1">
                  <span className="text-lg font-extrabold text-gray-900">{statusInfo.waterKL}</span>
                  <span className="text-[10px] text-gray-500 ml-1">kL</span>
                </div>
                <span className="text-[9px] text-blue-600 font-medium block mt-0.5">Harvesting Active</span>
              </div>
            </div>

            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Coffee size={14} className="text-yellow-600" />
                <span className="font-semibold text-gray-700">Cafeteria Token Load</span>
              </div>
              <strong className="text-gray-900">High (Peak Lunch)</strong>
            </div>

            <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-[#003366]" />
                <span className="font-semibold text-gray-700">Library Reading Seating</span>
              </div>
              <strong className="text-gray-900">161 / 250 Occupied</strong>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="pt-3 border-t border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Administrative Short-Cuts
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigateTab('digital-id')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
              >
                <QrCode size={13} />
                <span>Verify ID Badge</span>
              </button>
              <button
                onClick={() => onNavigateTab('reports')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
              >
                <FileText size={13} />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
