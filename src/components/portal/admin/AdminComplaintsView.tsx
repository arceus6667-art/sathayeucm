import React, { useState } from 'react';
import { 
  AlertCircle, CheckCircle2, Wrench, Search, Filter, 
  UserCheck, ShieldCheck, Clock, Check, X, MessageSquare, 
  Layers, Package, AlertTriangle, Eye, ArrowRight
} from 'lucide-react';
import { 
  campusStore, CampusIssue, LostFoundItem, 
  CampusTechnician, CampusBuilding 
} from '../../../services/campusStore';

export default function AdminComplaintsView() {
  const [activeSection, setActiveSection] = useState<'grievances' | 'lostfound'>('grievances');
  const [issues, setIssues] = useState<CampusIssue[]>(campusStore.getCampusIssues());
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>(campusStore.getLostFoundItems());
  const technicians = campusStore.getTechnicians();
  const buildings = campusStore.getBuildings();

  // Filters state for Grievances
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [buildingFilter, setBuildingFilter] = useState<string>('all');

  // Selected Issue for Modal / Drawer
  const [selectedIssue, setSelectedIssue] = useState<CampusIssue | null>(null);
  const [internalNote, setInternalNote] = useState('');

  // Selected Lost & Found Item for verification
  const [selectedLostItem, setSelectedLostItem] = useState<LostFoundItem | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');

  const filteredIssues = issues.filter((issue) => {
    const matchSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.reportedByName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
    const matchCat = categoryFilter === 'all' || issue.category === categoryFilter;
    const matchBldg = buildingFilter === 'all' || issue.locationId?.includes(buildingFilter);

    return matchSearch && matchStatus && matchPriority && matchCat && matchBldg;
  });

  const handleUpdateStatus = (issueId: string, newStatus: CampusIssue['status']) => {
    campusStore.updateIssueWorkflow(issueId, { status: newStatus }, 'Admin Grievance Desk');
    setIssues(campusStore.getCampusIssues());
    if (selectedIssue?.id === issueId) {
      setSelectedIssue(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleAssignTech = (issueId: string, techName: string) => {
    campusStore.updateIssueWorkflow(issueId, { assignedTo: techName, status: 'In Progress' }, 'Admin Grievance Desk');
    setIssues(campusStore.getCampusIssues());
    if (selectedIssue?.id === issueId) {
      setSelectedIssue(prev => prev ? { ...prev, assignedTo: techName, status: 'In Progress' } : null);
    }
  };

  const handleUpdatePriority = (issueId: string, priority: CampusIssue['priority']) => {
    campusStore.updateIssueWorkflow(issueId, { priority }, 'Admin Grievance Desk');
    setIssues(campusStore.getCampusIssues());
    if (selectedIssue?.id === issueId) {
      setSelectedIssue(prev => prev ? { ...prev, priority } : null);
    }
  };

  const handleAddNote = (issueId: string) => {
    if (!internalNote) return;
    campusStore.updateIssueWorkflow(issueId, { note: internalNote }, 'Admin Grievance Desk');
    setIssues(campusStore.getCampusIssues());
    setInternalNote('');
    alert('Internal note added to complaint audit log.');
  };

  // Lost & Found Verification
  const handleVerifyClaim = (approved: boolean) => {
    if (!selectedLostItem) return;
    campusStore.verifyLostFoundClaim(
      selectedLostItem.id, 
      approved, 
      verificationNotes || (approved ? 'Claim proof matched physical item' : 'Claim proof rejected due to lack of details'),
      'Admin Operations Desk'
    );
    setLostFoundItems(campusStore.getLostFoundItems());
    setSelectedLostItem(null);
    setVerificationNotes('');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header & Section Tabs */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-red-100 text-red-900 text-[10px] font-bold rounded uppercase tracking-wider">
              Student & Campus Support
            </span>
            <h2 className="text-lg font-bold text-gray-900">Complaint & Grievance Administration</h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Full complaint lifecycle management, technician dispatching, and Lost & Found claim verification
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveSection('grievances')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeSection === 'grievances' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Complaints Queue ({issues.filter(i => i.status !== 'Resolved').length})
          </button>
          <button
            onClick={() => setActiveSection('lostfound')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeSection === 'lostfound' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Lost & Found Claims ({lostFoundItems.filter(i => i.status === 'OPEN').length})
          </button>
        </div>
      </div>

      {/* SECTION 1: GRIEVANCES WORKFLOW */}
      {activeSection === 'grievances' && (
        <div className="space-y-4">
          
          {/* Multi-Filters Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, student name, location, keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-[#003366]"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto text-xs">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="Reported">Reported</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none"
                >
                  <option value="all">All Priorities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Emergency">Emergency</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="IT / Network">IT / Network</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Cleanliness">Cleanliness</option>
                </select>

                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setPriorityFilter('all');
                    setCategoryFilter('all');
                    setBuildingFilter('all');
                  }}
                  className="px-3 py-1.5 text-gray-500 hover:text-gray-900 text-xs font-semibold whitespace-nowrap"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Grievances Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Grievance Title & Reported By</th>
                    <th className="py-3 px-4">Category & Location</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Assigned Technician</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredIssues.map((issue) => (
                    <tr key={issue.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900 block">{issue.title}</span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
                          <span>Reported by:</span>
                          <strong className="text-gray-700">{issue.reportedByName}</strong>
                          <span className="px-1 py-0.2 bg-gray-100 rounded text-[9px] font-bold uppercase">
                            {issue.reportedByRole}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] font-semibold">
                          {issue.category}
                        </span>
                        <p className="text-[11px] text-gray-600 mt-0.5 font-medium">{issue.locationName}</p>
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={issue.priority}
                          onChange={(e) => handleUpdatePriority(issue.id, e.target.value as any)}
                          className={`text-[10px] font-bold rounded px-2 py-1 border focus:outline-none uppercase ${
                            issue.priority === 'High' || issue.priority === 'Emergency'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : issue.priority === 'Medium'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-green-50 text-green-700 border-green-200'
                          }`}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Emergency">Emergency</option>
                        </select>
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={issue.assignedTo || ''}
                          onChange={(e) => handleAssignTech(issue.id, e.target.value)}
                          className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none font-medium text-gray-700"
                        >
                          <option value="">Unassigned</option>
                          {technicians.map(t => (
                            <option key={t.id} value={t.name}>{t.name} ({t.trade})</option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={issue.status}
                          onChange={(e) => handleUpdateStatus(issue.id, e.target.value as any)}
                          className={`text-[10px] font-bold rounded px-2.5 py-1 border focus:outline-none uppercase ${
                            issue.status === 'Resolved'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : issue.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <option value="Reported">Reported</option>
                          <option value="Assigned">Assigned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedIssue(issue)}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-[#003366] hover:text-white text-gray-700 rounded text-[11px] font-bold transition-colors"
                        >
                          Inspect & Notes →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: LOST & FOUND CLAIMS VERIFICATION */}
      {activeSection === 'lostfound' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between text-xs">
            <p className="text-gray-600">
              Items found across campus are held at Gate 1 Security. Student claims require administrative verification against lost item reports before release.
            </p>
            <span className="font-bold text-[#003366] shrink-0">
              {lostFoundItems.length} Registered Items
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lostFoundItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.type === 'FOUND' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {item.type}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">{item.id}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.status === 'RESOLVED' ? 'bg-gray-100 text-gray-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {item.status}
                  </span>
                </div>

                {item.imageUrl && (
                  <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-2">{item.description}</p>
                </div>

                <div className="pt-2 border-t border-gray-100 text-[10px] text-gray-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <strong className="text-gray-700">{item.location}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Reported By:</span>
                    <strong className="text-gray-700">{item.reportedBy}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  {item.status === 'OPEN' ? (
                    <button
                      onClick={() => setSelectedLostItem(item)}
                      className="w-full py-1.5 bg-[#003366] hover:bg-blue-900 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Verify & Approve Claim
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 size={13} />
                      <span>Claim Approved & Released</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INSPECT ISSUE DRAWER / MODAL */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-gray-200 animate-in fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-mono text-gray-400 font-bold">{selectedIssue.id}</span>
                <h3 className="text-sm font-bold text-gray-900">{selectedIssue.title}</h3>
              </div>
              <button onClick={() => setSelectedIssue(null)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-[10px] text-gray-400 block font-bold uppercase">Grievance Description</span>
                <p className="text-gray-800 mt-1">{selectedIssue.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-gray-50 rounded-lg">
                  <span className="text-[10px] text-gray-400 block">Reported By</span>
                  <strong className="text-gray-900">{selectedIssue.reportedByName}</strong>
                  <span className="text-[10px] text-gray-500 block">Role: {selectedIssue.reportedByRole}</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-lg">
                  <span className="text-[10px] text-gray-400 block">Location</span>
                  <strong className="text-gray-900">{selectedIssue.locationName}</strong>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Add Internal Administrative Note</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Electrician scheduled for after lunch hour."
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none"
                  />
                  <button
                    onClick={() => handleAddNote(selectedIssue.id)}
                    className="px-3 py-1.5 bg-[#003366] text-white rounded-lg font-bold"
                  >
                    Post Note
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => handleUpdateStatus(selectedIssue.id, 'Resolved')}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold"
              >
                Mark Resolved Now
              </button>
              <button
                onClick={() => setSelectedIssue(null)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VERIFY CLAIM MODAL */}
      {selectedLostItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-200 animate-in fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Verify Lost & Found Ownership</h3>
              <button onClick={() => setSelectedLostItem(null)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            <div className="text-xs space-y-2">
              <p className="font-bold text-gray-900">{selectedLostItem.title}</p>
              <p className="text-gray-600">{selectedLostItem.description}</p>
              <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-[11px]">
                <span>Held at: <strong>{selectedLostItem.location}</strong></span>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Claim Verification Proof / Notes</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Student provided matching student ID and described internal contents of the bag correctly."
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleVerifyClaim(false)}
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold"
              >
                Reject Claim
              </button>
              <button
                onClick={() => handleVerifyClaim(true)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                Approve & Release Item
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
