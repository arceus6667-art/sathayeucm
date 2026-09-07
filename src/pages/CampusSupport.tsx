import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, Wrench, PackageSearch, Plus, MapPin, 
  Clock, CheckCircle2, AlertTriangle, Sparkles, Filter, 
  FileText, ShieldCheck, ChevronRight, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SmartCampusStore } from '../smartCampusStore';
import { CampusTicket, LostFoundItem, CAMPUS_LOCATIONS } from '../smartCampusData';

export function CampusSupport() {
  const navigate = useNavigate();
  const currentUser = SmartCampusStore.getCurrentUser();

  const [activeTab, setActiveTab] = useState<'maintenance' | 'lostfound'>('maintenance');
  const [tickets, setTickets] = useState<CampusTicket[]>([]);
  const [lostFound, setLostFound] = useState<LostFoundItem[]>([]);

  // Issue Reporting Form State
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketCategory, setTicketCategory] = useState<CampusTicket['category']>('Electrical');
  const [ticketLocation, setTicketLocation] = useState(CAMPUS_LOCATIONS[0].id);
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketPriority, setTicketPriority] = useState<CampusTicket['priority']>('Medium');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // Lost & Found Form State
  const [isLfModalOpen, setIsLfModalOpen] = useState(false);
  const [lfType, setLfType] = useState<'lost' | 'found'>('lost');
  const [lfTitle, setLfTitle] = useState('');
  const [lfCategory, setLfCategory] = useState<LostFoundItem['category']>('Electronics');
  const [lfLocation, setLfLocation] = useState('');
  const [lfDesc, setLfDesc] = useState('');
  const [lfSuccess, setLfSuccess] = useState(false);

  const loadData = () => {
    setTickets(SmartCampusStore.getTickets());
    setLostFound(SmartCampusStore.getLostFound());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = (e: any) => {
      if (e.detail?.key?.includes('support') || e.detail?.key?.includes('lost')) {
        loadData();
      }
    };
    window.addEventListener('sathaye_store_updated', handleUpdate);
    return () => window.removeEventListener('sathaye_store_updated', handleUpdate);
  }, []);

  // AI issue auto-classification helper
  const handleDescChange = (text: string) => {
    setTicketDesc(text);
    const lower = text.toLowerCase();
    if (lower.includes('water') || lower.includes('leak') || lower.includes('pipe') || lower.includes('tap')) {
      setTicketCategory('Plumbing');
      setTicketPriority('High');
    } else if (lower.includes('wi-fi') || lower.includes('wifi') || lower.includes('internet') || lower.includes('network')) {
      setTicketCategory('Wi-Fi');
      setTicketPriority('Medium');
    } else if (lower.includes('ac') || lower.includes('air conditioner') || lower.includes('cooling')) {
      setTicketCategory('AC');
      setTicketPriority('High');
    } else if (lower.includes('spark') || lower.includes('short') || lower.includes('smoke') || lower.includes('shock')) {
      setTicketCategory('Electrical');
      setTicketPriority('Emergency');
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketDesc.trim()) return;

    const locObj = CAMPUS_LOCATIONS.find(l => l.id === ticketLocation) || CAMPUS_LOCATIONS[0];

    SmartCampusStore.createTicket({
      category: ticketCategory,
      locationName: `${locObj.name} (${locObj.buildingName})`,
      locationId: locObj.id,
      description: ticketDesc,
      reportedBy: currentUser.name,
      reporterRole: (currentUser.role === 'faculty' ? 'faculty' : currentUser.role === 'admin' ? 'admin' : 'student'),
      priority: ticketPriority
    });

    setTicketDesc('');
    setTicketSuccess(true);
    setTimeout(() => {
      setTicketSuccess(false);
      setIsTicketModalOpen(false);
    }, 1500);
    loadData();
  };

  const handleCreateLostFound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lfTitle.trim() || !lfDesc.trim() || !lfLocation.trim()) return;

    SmartCampusStore.createLostFound({
      type: lfType,
      title: lfTitle,
      category: lfCategory,
      locationFoundOrLost: lfLocation,
      description: lfDesc,
      reportedBy: `${currentUser.name} (${currentUser.role})`,
      contactEmail: currentUser.email,
      photoUrl: lfCategory === 'Electronics' 
        ? 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=400'
        : 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400'
    });

    setLfTitle('');
    setLfDesc('');
    setLfLocation('');
    setLfSuccess(true);
    setTimeout(() => {
      setLfSuccess(false);
      setIsLfModalOpen(false);
    }, 1500);
    loadData();
  };

  const handleClaim = (id: string) => {
    SmartCampusStore.claimLostFound(id);
    loadData();
  };

  const getPriorityBadge = (p: CampusTicket['priority']) => {
    switch (p) {
      case 'Emergency':
        return <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase animate-pulse">Emergency</span>;
      case 'High':
        return <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">High Priority</span>;
      case 'Medium':
        return <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Medium</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Low</span>;
    }
  };

  const getStatusBadge = (s: CampusTicket['status']) => {
    switch (s) {
      case 'Resolved':
        return <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">Resolved ✓</span>;
      case 'In Progress':
        return <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">In Progress</span>;
      case 'Assigned':
        return <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full">Assigned</span>;
      default:
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-1 rounded-full">Reported</span>;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Top Banner */}
      <div className="bg-[#003366] text-white py-8 border-b-4 border-yellow-500">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-yellow-400 text-xs uppercase font-extrabold tracking-wider mb-1">
                <HelpCircle size={16} />
                <span>Sathaye Campus Helpdesk & Support</span>
              </div>
              <h1 className="text-3xl font-extrabold uppercase tracking-tight">Facility Support & Lost and Found</h1>
              <p className="text-sm text-blue-200 mt-1">
                Lodge maintenance tickets, report campus infrastructure faults, and match lost property via AI
              </p>
            </div>

            <div className="flex items-center space-x-3 self-start md:self-auto">
              <button
                onClick={() => setIsTicketModalOpen(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-[#003366] font-extrabold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow flex items-center space-x-1.5 transition-colors"
              >
                <Wrench size={16} />
                <span>+ Report Maintenance Issue</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-gray-200 mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`flex items-center space-x-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'maintenance'
                ? 'border-[#003366] text-[#003366] bg-blue-50/50 rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Wrench size={16} />
            <span>Facility & Maintenance Issues ({tickets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('lostfound')}
            className={`flex items-center space-x-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'lostfound'
                ? 'border-[#003366] text-[#003366] bg-blue-50/50 rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <PackageSearch size={16} />
            <span>AI Lost & Found Hub ({lostFound.length})</span>
          </button>
        </div>

        {/* TAB 1: MAINTENANCE TICKETS */}
        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-[#003366]">
                    Campus Maintenance Activity
                  </h3>
                  <p className="text-xs text-gray-500">Live ticket updates synchronized with Campus Estate Office</p>
                </div>
                <button
                  onClick={() => setIsTicketModalOpen(true)}
                  className="bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors"
                >
                  + New Ticket
                </button>
              </div>

              <ul className="divide-y divide-gray-100">
                {tickets.map(ticket => (
                  <li key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-1.5">
                          <span className="font-mono text-xs font-bold text-gray-500">{ticket.ticketNumber}</span>
                          <span className="bg-blue-100 text-[#003366] font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                            {ticket.category}
                          </span>
                          {getPriorityBadge(ticket.priority)}
                        </div>

                        <h4 className="font-bold text-gray-900 text-base">{ticket.description}</h4>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
                          <span className="flex items-center text-gray-700">
                            <MapPin size={14} className="mr-1 text-red-500" />
                            {ticket.locationName}
                          </span>
                          <span>Reported by: <strong>{ticket.reportedBy}</strong></span>
                          <span>{ticket.reportedAt}</span>
                          {ticket.assignedTechnician && (
                            <span className="text-blue-700 font-bold">
                              Technician: {ticket.assignedTechnician}
                            </span>
                          )}
                        </div>

                        {ticket.resolutionNote && (
                          <div className="mt-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs p-3 rounded-xl flex items-start space-x-2">
                            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold">Resolution Note:</span> {ticket.resolutionNote}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 flex items-center space-x-3">
                        {getStatusBadge(ticket.status)}
                        <button
                          onClick={() => navigate(`/map?target=${ticket.locationId}`)}
                          className="text-[#003366] hover:text-blue-800 text-xs font-bold p-2 hover:bg-blue-50 rounded-lg transition-colors flex items-center"
                          title="Navigate to maintenance site"
                        >
                          <MapPin size={16} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: LOST & FOUND WITH AI MATCHING */}
        {activeTab === 'lostfound' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Campus Lost & Found Registry</h3>
                <p className="text-xs text-gray-500">
                  Visual similarity matching automatically suggests pairing between lost items and security-desk deposits
                </p>
              </div>
              <button
                onClick={() => setIsLfModalOpen(true)}
                className="bg-[#003366] hover:bg-blue-900 text-yellow-400 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow transition-colors"
              >
                + Report Lost or Found Item
              </button>
            </div>

            {/* AI Similarity Highlight Banner */}
            {lostFound.some(l => l.similarityScore && l.similarityScore > 80) && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-orange-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <span className="bg-orange-200 text-orange-900 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                      AI Similarity Match Detected (91% Match)
                    </span>
                    <h4 className="font-extrabold text-sm text-gray-900 mt-1">
                      Potential match between reported Lost Bag and Found Wildcraft Backpack
                    </h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Both records report a Black Wildcraft laptop backpack near the Central Library on Sept 6. Verify contents at the Library Security Desk.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Lost & Found Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lostFound.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                >
                  <div className="h-44 bg-gray-100 relative overflow-hidden">
                    <img src={item.photoUrl} alt={item.title} className="w-full h-full object-cover" />
                    <span
                      className={`absolute top-3 left-3 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow ${
                        item.type === 'found' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                      }`}
                    >
                      {item.type === 'found' ? 'Found on Campus' : 'Reported Lost'}
                    </span>

                    {item.similarityScore && (
                      <span className="absolute bottom-3 right-3 bg-yellow-500 text-[#003366] text-[10px] font-black px-2 py-1 rounded shadow">
                        AI Match: {item.similarityScore}%
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        {item.category}
                      </span>
                      <h4 className="font-bold text-gray-900 text-base leading-snug">{item.title}</h4>
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                      <div className="flex items-center">
                        <MapPin size={13} className="mr-1 text-gray-400" />
                        <span>{item.locationFoundOrLost}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span>{item.date} • {item.time}</span>
                        <span className="font-bold text-gray-700">{item.status}</span>
                      </div>

                      {item.type === 'found' && item.status === 'Open' && (
                        <button
                          onClick={() => handleClaim(item.id)}
                          className="w-full mt-3 bg-[#003366] hover:bg-blue-900 text-yellow-400 font-bold text-xs py-2 rounded-lg transition-colors shadow"
                        >
                          Claim This Item
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-300 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-extrabold text-[#003366]">Report Campus Maintenance Fault</h3>
              <button onClick={() => setIsTicketModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {ticketSuccess ? (
              <div className="py-8 text-center text-emerald-600 space-y-2">
                <CheckCircle2 size={48} className="mx-auto" />
                <h4 className="font-bold text-base">Issue Ticket Logged!</h4>
                <p className="text-xs text-gray-500">Notified the Campus Estate & Admin team.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Campus Location</label>
                  <select
                    value={ticketLocation}
                    onChange={e => setTicketLocation(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:border-[#003366] focus:outline-none"
                  >
                    {CAMPUS_LOCATIONS.map(loc => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} ({loc.buildingName}, {loc.floorLabel})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Category</label>
                    <select
                      value={ticketCategory}
                      onChange={e => setTicketCategory(e.target.value as any)}
                      className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:border-[#003366] focus:outline-none"
                    >
                      <option>Electrical</option>
                      <option>Plumbing</option>
                      <option>Wi-Fi</option>
                      <option>AC</option>
                      <option>Furniture</option>
                      <option>Cleanliness</option>
                      <option>Security</option>
                      <option>Equipment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Priority</label>
                    <select
                      value={ticketPriority}
                      onChange={e => setTicketPriority(e.target.value as any)}
                      className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:border-[#003366] focus:outline-none"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Emergency</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold uppercase text-gray-600">Problem Description</label>
                    <span className="text-[10px] text-blue-600 font-bold flex items-center">
                      <Sparkles size={11} className="mr-1" /> AI Auto-Classifier active
                    </span>
                  </div>
                  <textarea
                    required
                    rows={3}
                    value={ticketDesc}
                    onChange={e => handleDescChange(e.target.value)}
                    placeholder="Describe the issue (e.g. Split AC leaking water, projector loose HDMI connector)..."
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:border-[#003366] focus:outline-none"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsTicketModalOpen(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-2.5 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#003366] hover:bg-blue-900 text-yellow-400 font-bold text-xs py-2.5 rounded-xl transition-colors shadow"
                  >
                    Dispatch Ticket
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Lost & Found Modal */}
      {isLfModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-300 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-extrabold text-[#003366]">Report Lost or Found Item</h3>
              <button onClick={() => setIsLfModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {lfSuccess ? (
              <div className="py-8 text-center text-emerald-600 space-y-2">
                <CheckCircle2 size={48} className="mx-auto" />
                <h4 className="font-bold text-base">Recorded in Registry!</h4>
                <p className="text-xs text-gray-500">AI similarity checks are running automatically.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateLostFound} className="space-y-4">
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setLfType('lost')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      lfType === 'lost' ? 'bg-red-600 text-white shadow' : 'text-gray-600'
                    }`}
                  >
                    I Lost Something
                  </button>
                  <button
                    type="button"
                    onClick={() => setLfType('found')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      lfType === 'found' ? 'bg-emerald-600 text-white shadow' : 'text-gray-600'
                    }`}
                  >
                    I Found Something
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Item Name</label>
                  <input
                    type="text"
                    required
                    value={lfTitle}
                    onChange={e => setLfTitle(e.target.value)}
                    placeholder="e.g. Black Wildcraft Backpack"
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:border-[#003366] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Category</label>
                    <select
                      value={lfCategory}
                      onChange={e => setLfCategory(e.target.value as any)}
                      className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:border-[#003366] focus:outline-none"
                    >
                      <option>Electronics</option>
                      <option>Bags & Wallets</option>
                      <option>ID Cards & Keys</option>
                      <option>Books & Stationery</option>
                      <option>Clothing & Bottles</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Location</label>
                    <input
                      type="text"
                      required
                      value={lfLocation}
                      onChange={e => setLfLocation(e.target.value)}
                      placeholder="e.g. Near Library Desk"
                      className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:border-[#003366] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Details / Unique Marks</label>
                  <textarea
                    required
                    rows={3}
                    value={lfDesc}
                    onChange={e => setLfDesc(e.target.value)}
                    placeholder="Color, brand, stickers, or specific contents..."
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:border-[#003366] focus:outline-none"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsLfModalOpen(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-2.5 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#003366] hover:bg-blue-900 text-yellow-400 font-bold text-xs py-2.5 rounded-xl transition-colors shadow"
                  >
                    Publish to Registry
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

export default CampusSupport;
