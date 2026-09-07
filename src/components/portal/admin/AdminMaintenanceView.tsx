import React, { useState } from 'react';
import { 
  Wrench, Plus, Search, Filter, CheckCircle2, Clock, 
  AlertTriangle, Shield, Check, Calendar, HardHat, 
  FileText, Activity, Layers, Tag, X
} from 'lucide-react';
import { 
  campusStore, CampusAsset, MaintenanceTicket, 
  CampusTechnician, CampusLocation 
} from '../../../services/campusStore';

export default function AdminMaintenanceView() {
  const [activeTab, setActiveTab] = useState<'workorders' | 'assets' | 'technicians' | 'schedule'>('workorders');
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(campusStore.getMaintenanceTickets());
  const [assets, setAssets] = useState<CampusAsset[]>(campusStore.getAssets());
  const technicians = campusStore.getTechnicians();
  const locations = campusStore.getLocations();

  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketStatusFilter, setTicketStatusFilter] = useState<string>('all');
  const [ticketTradeFilter, setTicketTradeFilter] = useState<string>('all');

  const [assetSearch, setAssetSearch] = useState('');
  const [assetCategoryFilter, setAssetCategoryFilter] = useState<string>('all');

  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  const [showCreateAssetModal, setShowCreateAssetModal] = useState(false);

  // New Ticket State
  const [newTitle, setNewTitle] = useState('');
  const [newAssetId, setNewAssetId] = useState('');
  const [newLocationId, setNewLocationId] = useState('loc-room-204');
  const [newCategory, setNewCategory] = useState<CampusAsset['category']>('AC');
  const [newPriority, setNewPriority] = useState<MaintenanceTicket['priority']>('Medium');
  const [newTechnician, setNewTechnician] = useState(technicians[0]?.name || 'Prakash Gawde');
  const [newEstDate, setNewEstDate] = useState('2026-09-15');
  const [newNotes, setNewNotes] = useState('');

  // New Asset State
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetCat, setNewAssetCat] = useState<CampusAsset['category']>('Projector');
  const [newAssetLoc, setNewAssetLoc] = useState('loc-it-lab-1');
  const [newAssetSerial, setNewAssetSerial] = useState('');
  const [newAssetTeam, setNewAssetTeam] = useState('IT & Hardware');

  const filteredTickets = tickets.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.locationName.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.technician?.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(ticketSearch.toLowerCase());
    const matchStatus = ticketStatusFilter === 'all' || t.status === ticketStatusFilter;
    const matchTrade = ticketTradeFilter === 'all' || t.category === ticketTradeFilter;
    return matchSearch && matchStatus && matchTrade;
  });

  const filteredAssets = assets.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
      a.serialNumber.toLowerCase().includes(assetSearch.toLowerCase()) ||
      a.locationName.toLowerCase().includes(assetSearch.toLowerCase());
    const matchCategory = assetCategoryFilter === 'all' || a.category === assetCategoryFilter;
    return matchSearch && matchCategory;
  });

  const handleUpdateTicketStatus = (ticketId: string, nextStatus: MaintenanceTicket['status']) => {
    campusStore.updateMaintenanceTicket(ticketId, { status: nextStatus }, 'Admin Command Center');
    setTickets(campusStore.getMaintenanceTickets());
  };

  const handleReassignTechnician = (ticketId: string, techName: string) => {
    campusStore.updateMaintenanceTicket(ticketId, { technician: techName }, 'Admin Command Center');
    setTickets(campusStore.getMaintenanceTickets());
  };

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const loc = locations.find(l => l.id === newLocationId);
    const chosenAsset = assets.find(a => a.id === newAssetId);

    campusStore.createMaintenanceTicket({
      title: newTitle,
      assetId: chosenAsset?.id,
      assetName: chosenAsset?.name,
      locationId: newLocationId,
      locationName: loc?.name || 'Main Campus Block',
      category: newCategory,
      priority: newPriority,
      technician: newTechnician,
      status: 'Assigned',
      estimatedCompletion: newEstDate,
      notes: newNotes || 'Routine maintenance work order.',
      reportedBy: 'Admin Operations Desk',
      sparePartsUsed: []
    }, 'Admin Command Center');

    setTickets(campusStore.getMaintenanceTickets());
    setShowCreateTicketModal(false);
    setNewTitle('');
    setNewNotes('');
  };

  const handleCreateAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName) return;

    const loc = locations.find(l => l.id === newAssetLoc);

    campusStore.addAsset({
      name: newAssetName,
      category: newAssetCat,
      locationId: newAssetLoc,
      locationName: loc?.name || 'Main Campus',
      purchaseDate: new Date().toISOString().split('T')[0],
      status: 'Operational',
      lastMaintenanceDate: new Date().toISOString().split('T')[0],
      nextScheduledMaintenance: '2026-12-15',
      assignedTeam: newAssetTeam,
      serialNumber: newAssetSerial || `SAT-${Date.now().toString().slice(-6)}`,
      healthScore: 98
    });

    setAssets(campusStore.getAssets());
    setShowCreateAssetModal(false);
    setNewAssetName('');
    setNewAssetSerial('');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner with Navigation Tabs */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded uppercase tracking-wider">
              Operational Facilities
            </span>
            <h2 className="text-lg font-bold text-gray-900">Smart Maintenance & Campus Asset Registry</h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Operational work order lifecycle, technician dispatch, preventative schedules, and spare parts tracking
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('workorders')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'workorders' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Work Orders ({tickets.length})
            </button>
            <button
              onClick={() => setActiveTab('assets')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'assets' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Assets Registry ({assets.length})
            </button>
            <button
              onClick={() => setActiveTab('technicians')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'technicians' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Staff & Trades
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'schedule' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Preventative Schedule
            </button>
          </div>

          <button
            onClick={() => setShowCreateTicketModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#003366] hover:bg-blue-900 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            <Plus size={14} />
            <span>Create Work Order</span>
          </button>
        </div>
      </div>

      {/* TAB 1: WORK ORDERS & TICKET LIFECYCLE */}
      {activeTab === 'workorders' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search ticket, room, technician..."
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-[#003366]"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto text-xs">
              <span className="text-gray-400 font-bold uppercase text-[10px] mr-1">Status:</span>
              {['all', 'Ticket', 'Assigned', 'Scheduled', 'In Progress', 'Completed', 'Verified'].map((st) => (
                <button
                  key={st}
                  onClick={() => setTicketStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md whitespace-nowrap font-semibold ${
                    ticketStatusFilter === st ? 'bg-[#003366] text-white font-bold' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Work Orders Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Ticket ID & Title</th>
                    <th className="py-3 px-4">Category & Location</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Assigned Staff</th>
                    <th className="py-3 px-4">Lifecycle Status</th>
                    <th className="py-3 px-4">Spare Parts Log</th>
                    <th className="py-3 px-4 text-right">Workflow Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTickets.map((ticket) => {
                    const statusSteps: MaintenanceTicket['status'][] = [
                      'Ticket', 'Assigned', 'Scheduled', 'In Progress', 'Completed', 'Verified'
                    ];
                    const currentIndex = statusSteps.indexOf(ticket.status);
                    const nextStatus = currentIndex < statusSteps.length - 1 ? statusSteps[currentIndex + 1] : null;

                    return (
                      <tr key={ticket.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono text-[10px] font-bold text-blue-900">{ticket.id}</span>
                          <div className="font-bold text-gray-900 mt-0.5">{ticket.title}</div>
                          {ticket.assetName && (
                            <span className="text-[10px] text-gray-500 block">Asset: {ticket.assetName}</span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded font-semibold text-[10px]">
                            {ticket.category}
                          </span>
                          <p className="text-[11px] text-gray-600 mt-1 font-medium">{ticket.locationName}</p>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ticket.priority === 'High' 
                              ? 'bg-red-50 text-red-700 border border-red-200' 
                              : ticket.priority === 'Medium'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-green-50 text-green-700 border border-green-200'
                          }`}>
                            {ticket.priority}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <select
                            value={ticket.technician}
                            onChange={(e) => handleReassignTechnician(ticket.id, e.target.value)}
                            className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none font-medium"
                          >
                            {technicians.map(t => (
                              <option key={t.id} value={t.name}>{t.name} ({t.trade})</option>
                            ))}
                          </select>
                          <span className="text-[10px] text-gray-400 block mt-0.5">Est: {ticket.estimatedCompletion}</span>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                            ticket.status === 'Completed' || ticket.status === 'Verified'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : ticket.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {ticket.status === 'Completed' && <Check size={11} />}
                            <span>{ticket.status}</span>
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          {ticket.sparePartsUsed && ticket.sparePartsUsed.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {ticket.sparePartsUsed.map((part, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px]">
                                  {part}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-[10px]">None logged</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          {nextStatus ? (
                            <button
                              onClick={() => handleUpdateTicketStatus(ticket.id, nextStatus)}
                              className="px-2.5 py-1 bg-[#003366] hover:bg-blue-900 text-white rounded text-[11px] font-bold transition-colors shadow-xs"
                            >
                              Advance to {nextStatus} →
                            </button>
                          ) : (
                            <span className="text-emerald-700 font-bold text-[11px] flex items-center justify-end gap-1">
                              <CheckCircle2 size={13} />
                              <span>Verified & Closed</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ASSETS REGISTRY */}
      {activeTab === 'assets' && (
        <div className="space-y-4">
          <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search asset, serial number, room..."
                value={assetSearch}
                onChange={(e) => setAssetSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-[#003366]"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto text-xs">
              <span className="text-gray-400 font-bold uppercase text-[10px] mr-1">Category:</span>
              {['all', 'Projector', 'AC', 'Computer', 'Laboratory equipment', 'Printer', 'Electrical'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setAssetCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-md whitespace-nowrap font-semibold ${
                    assetCategoryFilter === cat ? 'bg-[#003366] text-white font-bold' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                onClick={() => setShowCreateAssetModal(true)}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md font-bold shrink-0 ml-2"
              >
                + Add Asset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 font-bold">{asset.serialNumber}</span>
                    <h4 className="text-xs font-bold text-gray-900 mt-0.5 line-clamp-1">{asset.name}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    asset.status === 'Operational' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {asset.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-gray-100">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Location:</span>
                    <strong className="text-gray-800">{asset.locationName}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Maintenance Team:</span>
                    <strong className="text-gray-800">{asset.assignedTeam}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-gray-400 text-[10px]">Equipment Health:</span>
                    <div className="flex items-center gap-1.5 font-bold text-gray-900">
                      <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full ${asset.healthScore > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                          style={{ width: `${asset.healthScore}%` }} 
                        />
                      </div>
                      <span>{asset.healthScore}%</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-gray-400 text-[10px] block">Next Service:</span>
                    <span className="font-semibold text-blue-900 font-mono text-[10px]">{asset.nextScheduledMaintenance}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STAFF & TRADES */}
      {activeTab === 'technicians' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {technicians.map((tech) => (
            <div key={tech.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                  <HardHat size={18} className="text-[#003366]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{tech.name}</h4>
                  <span className="text-[11px] text-gray-500 font-medium">{tech.trade} Specialist</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Phone Hotline:</span>
                  <strong className="text-gray-900 font-mono">{tech.phone}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Active Work Orders:</span>
                  <strong className="text-blue-900">{tech.activeTickets} Assigned</strong>
                </div>
                <div className="flex justify-between">
                  <span>Deployment Status:</span>
                  <span className="text-emerald-700 font-bold">{tech.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: PREVENTATIVE SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Autonomous Preventative Servicing Calendar (Q3 AY 2026-27)
              </h3>
              <p className="text-[11px] text-gray-500">Scheduled audits for HVAC gas levels, fire extinguishers, RO water filters, and projector optical lamps</p>
            </div>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-900 font-bold text-xs rounded-md">
              ISO 9001:2026 Certified
            </span>
          </div>

          <div className="space-y-3">
            {[
              { date: '12-Sep-2026', title: 'Main Building Cassette AC Inverter Filters', trade: 'HVAC', assigned: 'Rajesh Shinde', status: 'Upcoming' },
              { date: '14-Sep-2026', title: 'Central Library Heavy Network Duplex Printers', trade: 'IT & Hardware', assigned: 'Santosh Parab', status: 'Upcoming' },
              { date: '20-Oct-2026', title: 'Microbiology CX23 Optical Research Microscopes', trade: 'Lab Maintenance', assigned: 'General Facilities', status: 'Scheduled' },
              { date: '15-Nov-2026', title: 'IT Lab 1 EPSON Interactive Projector Calibration', trade: 'Audio-Visual', assigned: 'IT & Hardware', status: 'Scheduled' }
            ].map((sched, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded border border-gray-200 text-center font-mono text-[11px] font-bold">
                    {sched.date}
                  </div>
                  <div>
                    <span className="font-bold text-gray-900">{sched.title}</span>
                    <p className="text-[11px] text-gray-500">{sched.trade} • Lead: {sched.assigned}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded text-[10px]">
                  {sched.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE WORK ORDER MODAL */}
      {showCreateTicketModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-sm font-bold text-gray-900">Dispatch Maintenance Work Order</h3>
              <button onClick={() => setShowCreateTicketModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Issue / Task Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clean condenser fins and calibrate coolant pressure"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category / Trade</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white"
                  >
                    <option value="AC">HVAC / AC</option>
                    <option value="Projector">Projector / AV</option>
                    <option value="Computer">Computer / Network</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Laboratory equipment">Lab Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Location / Hall</label>
                  <select
                    value={newLocationId}
                    onChange={(e) => setNewLocationId(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white"
                  >
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Assign Staff</label>
                  <select
                    value={newTechnician}
                    onChange={(e) => setNewTechnician(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white"
                  >
                    {technicians.map(t => (
                      <option key={t.id} value={t.name}>{t.name} ({t.trade})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Link Registered Asset (Optional)</label>
                <select
                  value={newAssetId}
                  onChange={(e) => setNewAssetId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white"
                >
                  <option value="">None / General Room Infrastructure</option>
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.serialNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Estimated Completion Date</label>
                <input
                  type="date"
                  value={newEstDate}
                  onChange={(e) => setNewEstDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Work Instructions & Safety Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes for the technician..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white resize-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateTicketModal(false)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#003366] hover:bg-blue-900 text-white rounded-lg font-bold shadow-xs"
                >
                  Dispatch Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ASSET MODAL */}
      {showCreateAssetModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-sm font-bold text-gray-900">Add Equipment to Asset Registry</h3>
              <button onClick={() => setShowCreateAssetModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateAssetSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Asset Brand & Model</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sony VPL-EX570 4200-Lumen Projector"
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Asset Category</label>
                  <select
                    value={newAssetCat}
                    onChange={(e) => setNewAssetCat(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white"
                  >
                    <option value="Projector">Projector</option>
                    <option value="AC">Air Conditioner</option>
                    <option value="Computer">Computer</option>
                    <option value="Printer">Printer</option>
                    <option value="Laboratory equipment">Laboratory Equipment</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Serial Number</label>
                  <input
                    type="text"
                    placeholder="e.g. SN-889104"
                    value={newAssetSerial}
                    onChange={(e) => setNewAssetSerial(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono focus:bg-white uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Assigned Location</label>
                  <select
                    value={newAssetLoc}
                    onChange={(e) => setNewAssetLoc(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white"
                  >
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Service Team</label>
                  <input
                    type="text"
                    value={newAssetTeam}
                    onChange={(e) => setNewAssetTeam(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateAssetModal(false)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#003366] hover:bg-blue-900 text-white rounded-lg font-bold shadow-xs"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
