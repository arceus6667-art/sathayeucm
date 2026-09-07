import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, Filter, BookCheck, Clock, MapPin, 
  CheckCircle2, AlertTriangle, Layers, Bookmark, Download, 
  HelpCircle, Sparkles, User, ChevronRight, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SmartCampusStore } from '../smartCampusStore';
import { LibraryBook, LibraryBorrowRecord, LibrarySeat, LibraryRequestOrIssue } from '../smartCampusData';

export function SmartLibrary() {
  const navigate = useNavigate();
  const currentUser = SmartCampusStore.getCurrentUser();

  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [borrowings, setBorrowings] = useState<LibraryBorrowRecord[]>([]);
  const [seats, setSeats] = useState<LibrarySeat[]>([]);
  const [issues, setIssues] = useState<LibraryRequestOrIssue[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'catalog' | 'seats' | 'mybooks' | 'request'>('catalog');
  const [selectedFloor, setSelectedFloor] = useState<1 | 2>(1);

  // Modal for new request/complaint
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestType, setRequestType] = useState<LibraryRequestOrIssue['type']>('Book Purchase Request');
  const [requestTitle, setRequestTitle] = useState('');
  const [requestDesc, setRequestDesc] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);

  const loadData = () => {
    setBooks(SmartCampusStore.getLibraryBooks());
    setBorrowings(SmartCampusStore.getLibraryBorrowings());
    setSeats(SmartCampusStore.getLibrarySeats());
    setIssues(SmartCampusStore.getLibraryIssues());
  };

  useEffect(() => {
    loadData();
    const handleStoreUpdate = (e: any) => {
      if (e.detail?.key?.includes('library')) {
        loadData();
      }
    };
    window.addEventListener('sathaye_store_updated', handleStoreUpdate);
    return () => window.removeEventListener('sathaye_store_updated', handleStoreUpdate);
  }, []);

  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.isbn.includes(searchQuery);
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const myActiveLoans = borrowings.filter(
    b => b.userId === currentUser.id && b.status === 'Issued'
  );

  const handleBorrow = (bookId: string) => {
    const success = SmartCampusStore.borrowBook(currentUser, bookId);
    if (success) {
      loadData();
    }
  };

  const handleReturn = (borrowingId: string) => {
    SmartCampusStore.returnBook(borrowingId);
    loadData();
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestTitle.trim() || !requestDesc.trim()) return;

    SmartCampusStore.submitLibraryIssue({
      type: requestType,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: (currentUser.role === 'faculty' ? 'faculty' : 'student'),
      title: requestTitle,
      description: requestDesc
    });

    setRequestTitle('');
    setRequestDesc('');
    setRequestSuccess(true);
    setTimeout(() => {
      setRequestSuccess(false);
      setIsRequestModalOpen(false);
    }, 1500);
    loadData();
  };

  const floorSeats = seats.filter(s => s.floor === selectedFloor);
  const availableSeatCount = floorSeats.filter(s => s.status === 'Available').length;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Top Banner */}
      <div className="bg-[#003366] text-white py-8 border-b-4 border-yellow-500">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-yellow-400 text-xs uppercase font-extrabold tracking-wider mb-1">
                <BookOpen size={16} />
                <span>Sathaye Knowledge Resource Center</span>
              </div>
              <h1 className="text-3xl font-extrabold uppercase tracking-tight">Smart Digital Library & Study Hall</h1>
              <p className="text-sm text-blue-200 mt-1">
                Access 85,000+ books, check real-time reading hall seat occupancy, borrow titles, and submit purchase requests
              </p>
            </div>

            <div className="flex items-center space-x-3 self-start md:self-auto">
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider px-3.5 py-2.5 rounded-xl border border-white/20 transition-colors"
              >
                + Book Request / Complaint
              </button>
              <button
                onClick={() => navigate('/map?target=loc-central-lib')}
                className="bg-yellow-500 hover:bg-yellow-600 text-[#003366] font-extrabold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow flex items-center space-x-1.5 transition-colors"
              >
                <MapPin size={16} />
                <span>Navigate to Library</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-gray-200 mb-6 overflow-x-auto pb-1">
          {[
            { id: 'catalog', label: 'Book Catalog & Search', icon: BookOpen },
            { id: 'seats', label: `Reading Hall Live Seats (${availableSeatCount} Free)`, icon: Layers },
            { id: 'mybooks', label: `My Issued Books (${myActiveLoans.length})`, icon: Bookmark },
            { id: 'request', label: 'My Requests & Issues', icon: HelpCircle }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
                  isActive
                    ? 'border-[#003366] text-[#003366] bg-blue-50/50 rounded-t-lg'
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-[#003366]' : 'text-gray-400'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: BOOK CATALOG */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            {/* Search & Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
              <div className="relative flex-1 max-w-md">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by title, author, subject, or ISBN..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#003366] focus:bg-white"
                />
              </div>

              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
                <span className="text-xs font-bold text-gray-500 mr-1 flex items-center shrink-0">
                  <Filter size={14} className="mr-1" /> Category:
                </span>
                {['All', 'Computer Science', 'Mathematics', 'Physics'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-[#003366] text-white font-bold'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Recommendation Banner for Student */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#003366] text-yellow-400 flex items-center justify-center font-bold">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#003366]">
                    AI Recommended for Semester IV IT
                  </h4>
                  <p className="text-xs text-gray-600">
                    Based on your enrolled subjects (Software Engineering & Core Java), check out "Clean Code" and "Effective Java".
                  </p>
                </div>
              </div>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map(book => {
                const isAvailable = book.availableCopies > 0;
                const isAlreadyBorrowed = borrowings.some(
                  b => b.userId === currentUser.id && b.bookId === book.id && b.status === 'Issued'
                );

                return (
                  <div
                    key={book.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                  >
                    <div className="p-5 flex space-x-4">
                      <div className="w-24 h-32 shrink-0 rounded-lg overflow-hidden shadow border border-gray-200 bg-gray-100">
                        <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase">
                            {book.category}
                          </span>
                          <h4 className="font-bold text-gray-900 text-sm mt-1 leading-snug">{book.title}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>
                        </div>

                        <div className="mt-2 text-[11px] text-gray-500">
                          <span className="block font-medium text-gray-700">Shelf: {book.shelfLocation}</span>
                          <span className="text-gray-400">ISBN: {book.isbn}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Availability</span>
                        <span className={`font-extrabold ${isAvailable ? 'text-emerald-600' : 'text-red-500'}`}>
                          {isAvailable ? `${book.availableCopies} of ${book.totalCopies} Copies Left` : 'Currently Out of Stock'}
                        </span>
                      </div>

                      {isAlreadyBorrowed ? (
                        <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-lg">
                          Issued to You
                        </span>
                      ) : (
                        <button
                          onClick={() => handleBorrow(book.id)}
                          disabled={!isAvailable}
                          className="bg-[#003366] hover:bg-blue-900 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition-colors shadow"
                        >
                          Borrow Book
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: READING HALL SEATS */}
        {activeTab === 'seats' && (
          <div className="space-y-6">
            {/* Floor Selection & Stats Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-[#003366]">Reading Hall Live Occupancy Map</h3>
                <p className="text-xs text-gray-500">
                  Floor {selectedFloor} • Live sensor & desk terminal updates • Silent study zone
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setSelectedFloor(1)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      selectedFloor === 1 ? 'bg-[#003366] text-white shadow' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Floor 1 (Main Hall)
                  </button>
                  <button
                    onClick={() => setSelectedFloor(2)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      selectedFloor === 2 ? 'bg-[#003366] text-white shadow' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Floor 2 (Research & Pods)
                  </button>
                </div>

                <div className="flex items-center space-x-3 text-xs pl-4 border-l border-gray-200">
                  <span className="flex items-center text-emerald-700 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5"></span> Available
                  </span>
                  <span className="flex items-center text-gray-500 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400 mr-1.5"></span> Occupied
                  </span>
                  <span className="flex items-center text-yellow-600 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 mr-1.5"></span> Reserved
                  </span>
                </div>
              </div>
            </div>

            {/* Live Seating Grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {floorSeats.map(seat => {
                  const isAvail = seat.status === 'Available';
                  const isOcc = seat.status === 'Occupied';

                  return (
                    <div
                      key={seat.id}
                      className={`p-3.5 rounded-xl border text-center transition-all ${
                        isAvail
                          ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900 hover:shadow-md'
                          : isOcc
                          ? 'bg-red-50/60 border-red-200 text-red-800 opacity-60'
                          : 'bg-yellow-50 border-yellow-300 text-yellow-800'
                      }`}
                    >
                      <div className="text-xs font-extrabold">{seat.seatNumber}</div>
                      <span className="text-[10px] block mt-0.5 font-medium">{seat.section}</span>
                      <span
                        className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-2 ${
                          isAvail
                            ? 'bg-emerald-500 text-white'
                            : isOcc
                            ? 'bg-red-500 text-white'
                            : 'bg-yellow-500 text-[#003366]'
                        }`}
                      >
                        {seat.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MY ISSUED BOOKS */}
        {activeTab === 'mybooks' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#003366]">
                Active Borrowings for {currentUser.name}
              </h3>
              <span className="text-xs text-gray-500">Maximum limit: 3 books concurrently</span>
            </div>

            {myActiveLoans.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <BookOpen size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-bold text-gray-700">No active books borrowed right now.</p>
                <p className="text-xs text-gray-500 mt-1">Browse the catalog above and borrow books for research or study.</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {myActiveLoans.map(loan => (
                  <div
                    key={loan.id}
                    className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{loan.bookTitle}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Issued on: {loan.borrowedDate} • Due Date:{' '}
                        <span className="font-bold text-red-600">{loan.dueDate}</span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                        Active Loan
                      </span>
                      <button
                        onClick={() => handleReturn(loan.id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-[#003366] font-bold text-xs px-3.5 py-1.5 rounded-lg shadow transition-colors"
                      >
                        Return to Library
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MY REQUESTS & ISSUES */}
        {activeTab === 'request' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Submitted Book Requests & Complaints</h3>
                <p className="text-xs text-gray-500">Track purchase recommendations and library maintenance tickets</p>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="bg-[#003366] hover:bg-blue-900 text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl transition-colors shadow"
              >
                + New Request
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {issues.map(iss => (
                  <li key={iss.id} className="p-5 hover:bg-gray-50 flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded uppercase">
                          {iss.type}
                        </span>
                        <span className="text-xs text-gray-400">{iss.createdAt}</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm">{iss.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{iss.description}</p>
                      {iss.librarianNotes && (
                        <div className="mt-2 text-xs bg-yellow-50 border border-yellow-200 text-yellow-800 p-2 rounded-lg">
                          <span className="font-bold">Librarian Note:</span> {iss.librarianNotes}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        iss.status === 'Approved / In Procure'
                          ? 'bg-emerald-100 text-emerald-700'
                          : iss.status === 'Resolved'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {iss.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Book Request / Complaint Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-300 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-extrabold text-[#003366]">Submit Library Request</h3>
              <button onClick={() => setIsRequestModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {requestSuccess ? (
              <div className="py-8 text-center text-emerald-600 space-y-2">
                <CheckCircle2 size={48} className="mx-auto" />
                <h4 className="font-bold text-base">Request Submitted!</h4>
                <p className="text-xs text-gray-500">Shared directly with Central Library and Campus Admin.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Request Type</label>
                  <select
                    value={requestType}
                    onChange={e => setRequestType(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:border-[#003366] focus:outline-none"
                  >
                    <option>Book Purchase Request</option>
                    <option>Missing Book Issue</option>
                    <option>Damaged Book</option>
                    <option>Facility Complaint</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Title / Book Name</label>
                  <input
                    type="text"
                    required
                    value={requestTitle}
                    onChange={e => setRequestTitle(e.target.value)}
                    placeholder="e.g. Designing Data-Intensive Applications"
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:border-[#003366] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Description / Edition</label>
                  <textarea
                    required
                    rows={3}
                    value={requestDesc}
                    onChange={e => setRequestDesc(e.target.value)}
                    placeholder="Provide author, edition, or specific room details..."
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:border-[#003366] focus:outline-none"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRequestModalOpen(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-2.5 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#003366] hover:bg-blue-900 text-yellow-400 font-bold text-xs py-2.5 rounded-xl transition-colors shadow"
                  >
                    Submit Request
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
