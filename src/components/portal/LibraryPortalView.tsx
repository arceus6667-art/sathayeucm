import React, { useState, useEffect } from 'react';
import { 
  BookOpen, CheckCircle2, Clock, Search, Plus, 
  Layers, AlertTriangle, Check, UserCheck, ShieldCheck, ArrowRight
} from 'lucide-react';
import { 
  LibraryBook, LibraryBorrowing, LibrarySeatZone, campusStore 
} from '../../services/campusStore';

export default function LibraryPortalView() {
  const [activeTab, setActiveTab] = useState<'requests' | 'catalog' | 'seats' | 'issues'>('requests');
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [borrowings, setBorrowings] = useState<LibraryBorrowing[]>([]);
  const [seatData, setSeatData] = useState<{ total: number; occupied: number; zones: LibrarySeatZone[] }>({
    total: 250,
    occupied: 161,
    zones: []
  });
  const [issues, setIssues] = useState<any[]>([]);

  // New Book state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newDept, setNewDept] = useState('B.Sc. IT');
  const [newShelf, setNewShelf] = useState('Rack IT-05 / Shelf A');
  const [newCopies, setNewCopies] = useState('5');

  useEffect(() => {
    const update = () => {
      setBooks(campusStore.getLibraryBooks());
      setBorrowings(campusStore.getLibraryBorrowings());
      setSeatData(campusStore.getLibrarySeatStatus());
      setIssues(campusStore.getLibraryIssues());
    };
    update();
    return campusStore.subscribe(update);
  }, []);

  const handleApproveBorrow = (borrowId: string) => {
    campusStore.approveBookBorrow(borrowId);
  };

  const handleReturnBorrow = (borrowId: string) => {
    campusStore.returnBook(borrowId);
  };

  const handleResolveIssue = (issueId: string) => {
    campusStore.resolveLibraryIssue(issueId);
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    campusStore.addLibraryBook({
      title: newTitle,
      author: newAuthor || 'Sathaye Academic Press',
      isbn: `978-81-${Math.floor(1000000 + Math.random() * 9000000)}`,
      department: newDept,
      totalCopies: Number(newCopies) || 5,
      availableCopies: Number(newCopies) || 5,
      shelfLocation: newShelf,
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300',
      tags: [newDept, 'Reference', 'Semester IV']
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewAuthor('');
  };

  const pendingRequests = borrowings.filter(b => b.status === 'REQUESTED');
  const activeIssued = borrowings.filter(b => b.status === 'ISSUED');

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="bg-[#003366] text-white rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-l-4 border-yellow-500 shadow-sm">
        <div>
          <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider block mb-1">
            Knowledge Resource Operations
          </span>
          <h2 className="text-2xl font-extrabold">Sathaye Library Management Console</h2>
          <p className="text-xs text-blue-200">Terminal ID: LIB-DESK-01 • 85,000+ Volumes Repository</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'requests' ? 'bg-yellow-500 text-[#003366] shadow' : 'bg-blue-900/80 text-white hover:bg-blue-800'
            }`}
          >
            Borrow Requests ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'catalog' ? 'bg-yellow-500 text-[#003366] shadow' : 'bg-blue-900/80 text-white hover:bg-blue-800'
            }`}
          >
            OPAC Catalog ({books.length})
          </button>
          <button
            onClick={() => setActiveTab('seats')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'seats' ? 'bg-yellow-500 text-[#003366] shadow' : 'bg-blue-900/80 text-white hover:bg-blue-800'
            }`}
          >
            Reading Radar
          </button>
          <button
            onClick={() => setActiveTab('issues')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'issues' ? 'bg-yellow-500 text-[#003366] shadow' : 'bg-blue-900/80 text-white hover:bg-blue-800'
            }`}
          >
            Issues Desk ({issues.length})
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs text-center">
          <Clock size={24} className="mx-auto mb-1 text-yellow-600" />
          <h3 className="text-2xl font-extrabold text-gray-900">{pendingRequests.length}</h3>
          <p className="text-xs text-gray-500 font-bold uppercase">Pending Issues</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs text-center">
          <BookOpen size={24} className="mx-auto mb-1 text-[#003366]" />
          <h3 className="text-2xl font-extrabold text-gray-900">{activeIssued.length}</h3>
          <p className="text-xs text-gray-500 font-bold uppercase">Books In Circulation</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs text-center">
          <Layers size={24} className="mx-auto mb-1 text-green-600" />
          <h3 className="text-2xl font-extrabold text-gray-900">{seatData.total - seatData.occupied}</h3>
          <p className="text-xs text-gray-500 font-bold uppercase">Seats Free</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs text-center">
          <AlertTriangle size={24} className="mx-auto mb-1 text-red-500" />
          <h3 className="text-2xl font-extrabold text-gray-900">{issues.filter(i => i.status !== 'Resolved').length}</h3>
          <p className="text-xs text-gray-500 font-bold uppercase">Open Tickets</p>
        </div>
      </div>

      {/* TAB 1: BORROW REQUESTS */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-extrabold text-[#003366] uppercase tracking-wide text-sm">
              Student Circulation Desk & Issue Approvals
            </h3>
            <span className="text-xs text-gray-500 font-bold">Standard 14-day borrowing cycle</span>
          </div>

          <div className="divide-y divide-gray-100">
            {borrowings.map((b) => (
              <div key={b.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900 text-base">{b.bookTitle}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                      b.status === 'REQUESTED' ? 'bg-yellow-100 text-yellow-800' :
                      b.status === 'ISSUED' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Student: <strong>{b.studentName}</strong> (ID: {b.studentId}) • Requested: {b.issuedDate} • Return Due: <strong className="text-red-600">{b.dueDate}</strong>
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {b.status === 'REQUESTED' && (
                    <button
                      onClick={() => handleApproveBorrow(b.id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow flex items-center"
                    >
                      <Check size={14} className="mr-1" /> Approve & Issue
                    </button>
                  )}

                  {b.status === 'ISSUED' && (
                    <button
                      onClick={() => handleReturnBorrow(b.id)}
                      className="px-4 py-2 bg-[#003366] hover:bg-blue-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow flex items-center"
                    >
                      <CheckCircle2 size={14} className="mr-1" /> Mark Returned
                    </button>
                  )}

                  {b.status === 'RETURNED' && (
                    <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded">
                      Shelved Back
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CATALOG MANAGEMENT */}
      {activeTab === 'catalog' && (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-[#003366] uppercase tracking-wide text-base">OPAC Inventory Catalog</h3>
              <p className="text-xs text-gray-500">Manage shelf allocations, copy counts, and subject tagging</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#003366] hover:bg-blue-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow flex items-center"
            >
              <Plus size={14} className="mr-1" /> Add New Volume
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-[11px]">
                <tr>
                  <th className="p-3">Title & Author</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Shelf Location</th>
                  <th className="p-3">Available / Total</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                {books.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-bold text-sm text-gray-900">{b.title}</div>
                      <div className="text-gray-500 text-[11px]">{b.author} • ISBN {b.isbn}</div>
                    </td>
                    <td className="p-3">
                      <span className="bg-blue-50 text-[#003366] px-2 py-0.5 rounded font-bold">{b.department}</span>
                    </td>
                    <td className="p-3 font-mono font-bold text-[#003366]">{b.shelfLocation}</td>
                    <td className="p-3">
                      <span className={`font-bold ${b.availableCopies > 0 ? 'text-green-700' : 'text-red-600'}`}>
                        {b.availableCopies} / {b.totalCopies}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          const newShelf = prompt("Update shelf code:", b.shelfLocation);
                          if (newShelf) campusStore.updateBookShelf(b.id, newShelf);
                        }}
                        className="text-xs font-bold text-blue-700 hover:underline"
                      >
                        Edit Shelf
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: READING SEATS RADAR */}
      {activeTab === 'seats' && (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-[#003366] uppercase tracking-wide text-base">Reading Hall Occupancy Management</h3>
              <p className="text-xs text-gray-500">Simulate or calibrate optical occupancy counts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {seatData.zones.map((zone, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                <h4 className="font-bold text-gray-900 text-sm">{zone.name}</h4>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Occupied: <strong>{zone.occupied}</strong></span>
                  <span>Total Capacity: <strong>{zone.total}</strong></span>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => campusStore.updateReadingZoneOccupancy(zone.name, Math.max(0, zone.occupied - 5))}
                    className="flex-1 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 rounded text-xs font-bold text-gray-700"
                  >
                    -5 Students
                  </button>
                  <button
                    onClick={() => campusStore.updateReadingZoneOccupancy(zone.name, Math.min(zone.total, zone.occupied + 5))}
                    className="flex-1 py-1.5 bg-[#003366] hover:bg-blue-800 text-white rounded text-xs font-bold"
                  >
                    +5 Students
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LIBRARY ISSUES DESK */}
      {activeTab === 'issues' && (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-extrabold text-[#003366] uppercase tracking-wide text-sm">
              Student Reported Library Issues
            </h3>
            <span className="text-xs text-gray-500">Shared with Central Campus Admin</span>
          </div>

          <div className="divide-y divide-gray-100">
            {issues.map((iss) => (
              <div key={iss.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-gray-900 text-sm">{iss.title}</h4>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                      iss.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {iss.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{iss.description}</p>
                  <p className="text-[11px] text-gray-400 mt-1">Reported by: {iss.studentName}</p>
                </div>

                {iss.status !== 'Resolved' && (
                  <button
                    onClick={() => handleResolveIssue(iss.id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold uppercase shadow"
                  >
                    Resolve Ticket
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Volume Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border-t-4 border-[#003366]">
            <h3 className="text-lg font-bold text-[#003366] mb-3 uppercase">Catalog New Book Volume</h3>
            <form onSubmit={handleAddBook} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Book Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence: A Modern Approach"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Author</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stuart Russell and Peter Norvig"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                  >
                    <option value="B.Sc. IT">B.Sc. IT</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Economics">Economics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Total Copies</label>
                  <input
                    type="number"
                    required
                    value={newCopies}
                    onChange={(e) => setNewCopies(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Shelf Code</label>
                <input
                  type="text"
                  required
                  value={newShelf}
                  onChange={(e) => setNewShelf(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#003366] hover:bg-blue-800 rounded-lg uppercase"
                >
                  Add to OPAC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
