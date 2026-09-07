import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, Search, Layers, Clock, CheckCircle2, 
  AlertTriangle, Navigation, BookmarkPlus, ArrowRight, UserCheck, Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  LibraryBook, LibraryBorrowing, LibrarySeatZone, campusStore 
} from '../services/campusStore';

export default function Library() {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [borrowings, setBorrowings] = useState<LibraryBorrowing[]>([]);
  const [seatData, setSeatData] = useState<{ total: number; occupied: number; zones: LibrarySeatZone[] }>({
    total: 250,
    occupied: 161,
    zones: []
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [requestedBookId, setRequestedBookId] = useState<string | null>(null);

  // Issue reporting state
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const [issueSubmitted, setIssueSubmitted] = useState(false);

  useEffect(() => {
    const updateData = () => {
      setBooks(campusStore.getLibraryBooks());
      setSeatData(campusStore.getLibrarySeatStatus());
      const user = campusStore.getCurrentUser();
      if (user) {
        setBorrowings(campusStore.getBorrowingsForStudent(user.id));
      }
    };

    updateData();
    return campusStore.subscribe(updateData);
  }, []);

  const departments = ['All', 'B.Sc. IT', 'Mathematics', 'Physics', 'Chemistry', 'Economics'];

  const filteredBooks = useMemo(() => {
    return books.filter(b => {
      const matchDept = selectedDept === 'All' || b.department === selectedDept;
      const matchSearch = !searchQuery.trim() || 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.isbn.includes(searchQuery) ||
        b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchDept && matchSearch;
    });
  }, [books, selectedDept, searchQuery]);

  const handleBorrowRequest = (book: LibraryBook) => {
    campusStore.requestBookBorrow(book.id);
    setRequestedBookId(book.id);
    setTimeout(() => setRequestedBookId(null), 3000);
  };

  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    const user = campusStore.getCurrentUser();
    campusStore.reportLibraryIssue({
      studentId: user?.id || 'stu-001',
      studentName: user?.name || 'Aarav Mehta',
      title: issueTitle,
      description: issueDesc,
      status: 'Reported'
    });
    setIssueSubmitted(true);
    setTimeout(() => {
      setIssueSubmitted(false);
      setShowIssueModal(false);
      setIssueTitle('');
      setIssueDesc('');
    }, 2000);
  };

  const availableSeatsCount = seatData.total - seatData.occupied;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-16">
      
      {/* Header Banner */}
      <div className="bg-[#003366] text-white py-8 border-b-4 border-yellow-500 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="bg-yellow-500 text-[#003366] text-xs font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                Digital Resource Center
              </span>
              <span className="text-xs text-blue-200">85,000+ Titles • Online OPAC Catalog</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight">
              Sathaye Central Library
            </h1>
            <p className="text-xs md:text-sm text-gray-300 mt-1">
              Automated book borrowing, real-time reading hall occupancy, and e-resource repository.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/map?target=loc-library-central"
              className="inline-flex items-center bg-blue-900/80 hover:bg-blue-800 text-yellow-400 border border-blue-700 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors"
            >
              <Navigation size={14} className="mr-1.5" /> Navigate to Library
            </Link>

            <button
              onClick={() => setShowIssueModal(true)}
              className="bg-yellow-500 hover:bg-yellow-400 text-[#003366] font-bold text-xs uppercase px-3.5 py-2 rounded-lg transition-colors shadow"
            >
              Report Library Issue
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Live Seat Occupancy Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-100 gap-4 mb-6">
            <div>
              <h3 className="font-extrabold text-[#003366] uppercase tracking-wide text-base flex items-center">
                <Layers size={18} className="mr-2 text-yellow-500" /> Live Seat Occupancy Radar
              </h3>
              <p className="text-xs text-gray-500">Autonomous sensor counts across study halls</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-600 mr-1.5 animate-pulse"></span>
                {availableSeatsCount} Seats Available ({Math.round((availableSeatsCount / seatData.total) * 100)}% Open)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {seatData.zones.map((zone, idx) => {
              const free = zone.total - zone.occupied;
              const pct = Math.round((zone.occupied / zone.total) * 100);
              return (
                <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm text-gray-800">{zone.name}</h4>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{free} open</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full ${pct > 80 ? 'bg-red-500' : pct > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-500 font-medium">
                    <span>{zone.occupied} / {zone.total} occupied</span>
                    <span className="font-bold text-gray-700">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Student Active Borrowing Shelf */}
        {borrowings.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 border-l-4 border-yellow-500">
            <h3 className="font-extrabold text-[#003366] uppercase tracking-wide text-sm mb-4 flex items-center">
              <BookOpen size={18} className="mr-2 text-yellow-600" /> My Borrowed Volumes & Due Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {borrowings.map((b) => (
                <div key={b.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{b.bookTitle}</h4>
                    <p className="text-xs text-gray-500">Issued: {b.issuedDate} • Return Due: <strong className="text-red-700">{b.dueDate}</strong></p>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded uppercase ${
                    b.status === 'ISSUED' ? 'bg-blue-100 text-blue-800' :
                    b.status === 'REQUESTED' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Book Catalog Search & Shelf Navigation */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by title, author, USIT subject or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003366]"
              />
            </div>

            {/* Department Filter */}
            <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                    selectedDept === dept
                      ? 'bg-[#003366] text-yellow-400 shadow-xs'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Book Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => {
              const isRequested = requestedBookId === book.id;
              return (
                <div
                  key={book.id}
                  className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden hover:border-[#003366] transition-all flex flex-col justify-between"
                >
                  <div className="p-5 flex gap-4">
                    <div className="w-20 h-28 bg-gray-100 rounded-md overflow-hidden shrink-0 shadow-xs border border-gray-200">
                      <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded uppercase">
                          {book.department}
                        </span>
                        <h4 className="font-bold text-gray-900 text-sm mt-1.5 line-clamp-2 leading-snug">{book.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">by {book.author}</p>
                      </div>

                      <div className="mt-2 text-xs">
                        <span className="text-[10px] text-gray-400 block">Location</span>
                        <strong className="text-[#003366] text-xs">{book.shelfLocation}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-600 font-medium">
                      <strong>{book.availableCopies}</strong> of {book.totalCopies} available
                    </span>

                    {isRequested ? (
                      <span className="text-xs font-bold text-green-700 flex items-center">
                        <Check size={14} className="mr-1" /> Requested!
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBorrowRequest(book)}
                        disabled={book.availableCopies === 0}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors shadow-xs ${
                          book.availableCopies > 0
                            ? 'bg-[#003366] hover:bg-blue-800 text-white'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Request Borrow
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Report Library Issue Modal (Canonical sync with Admin) */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border-t-4 border-yellow-500 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-[#003366] mb-1 uppercase">Report Library Issue</h3>
            <p className="text-xs text-gray-500 mb-4">Reports are synced directly to Library Desk and Admin Maintenance Command.</p>

            {issueSubmitted ? (
              <div className="py-6 text-center text-green-700 font-bold space-y-2">
                <CheckCircle2 size={40} className="mx-auto" />
                <p>Library issue logged successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleReportIssue} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Issue Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Missing book volume / damaged AC unit"
                    value={issueTitle}
                    onChange={(e) => setIssueTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003366]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Details & Shelf Rack</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe specific rack, shelf number, or book title..."
                    value={issueDesc}
                    onChange={(e) => setIssueDesc(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003366]"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowIssueModal(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-[#003366] hover:bg-blue-800 rounded-lg uppercase shadow"
                  >
                    Submit Ticket
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
