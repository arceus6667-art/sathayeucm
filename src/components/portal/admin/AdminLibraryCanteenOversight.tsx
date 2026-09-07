import React, { useState } from 'react';
import { 
  Coffee, BookOpen, Clock, AlertTriangle, CheckCircle2, 
  Search, ToggleLeft, ToggleRight, DollarSign, Users, 
  Layers, Bell, RefreshCw, Eye
} from 'lucide-react';
import { campusStore, MenuItem, LibraryBook } from '../../../services/campusStore';

export default function AdminLibraryCanteenOversight() {
  const [activeTab, setActiveTab] = useState<'canteen' | 'library'>('canteen');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(campusStore.getMenuItems());
  const [books, setBooks] = useState<LibraryBook[]>(campusStore.getBooks());
  const orders = campusStore.getOrders();
  const activeOrders = orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');

  const [menuSearch, setMenuSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');

  // Toggle canteen menu item availability
  const handleToggleItemStock = (itemId: string, currentAvail: boolean) => {
    campusStore.updateMenuItem(itemId, { isAvailable: !currentAvail });
    setMenuItems(campusStore.getMenuItems());
  };

  // Remind overdue borrower
  const handleSendOverdueReminder = (bookTitle: string, studentId: string) => {
    campusStore.addNotification({
      title: 'Library Overdue Book Return Reminder',
      message: `The borrowed volume "${bookTitle}" is overdue. Please return it to the counter to avoid daily late fines.`,
      type: 'library',
      targetRole: 'STUDENT'
    });
    alert(`Automated return notice dispatched to student ${studentId}.`);
  };

  const filteredMenu = menuItems.filter(m => 
    m.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
    m.category.toLowerCase().includes(menuSearch.toLowerCase())
  );

  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
    b.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
    b.department.toLowerCase().includes(bookSearch.toLowerCase()) ||
    b.isbn.toLowerCase().includes(bookSearch.toLowerCase())
  );

  // Overdue sample records
  const overdueList = [
    { id: 'BOR-101', student: 'Rohan Sharma (FY-BSc)', studentId: 'sathey.2026.0412', book: 'Engineering Mathematics Vol II', due: '02-Sep-2026', daysOverdue: 4, fine: 40 },
    { id: 'BOR-104', student: 'Priya Iyer (TY-BMS)', studentId: 'sathey.2024.1190', book: 'Principles of Modern Marketing', due: '03-Sep-2026', daysOverdue: 3, fine: 30 },
    { id: 'BOR-108', student: 'Aditya Kadam (SY-BCom)', studentId: 'sathey.2025.0883', book: 'Corporate Financial Accounting', due: '04-Sep-2026', daysOverdue: 2, fine: 20 },
  ];

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-900 text-[10px] font-bold rounded uppercase tracking-wider">
              Ancillary Operations
            </span>
            <h2 className="text-lg font-bold text-gray-900">Library & Canteen Operational Oversight</h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time book inventories, overdue borrowing recovery, canteen live menu switches, and financial token tally
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('canteen')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'canteen' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Coffee size={14} className="text-yellow-600" />
            <span>Smart Canteen Desk</span>
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'library' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen size={14} className="text-[#003366]" />
            <span>Smart Library Desk</span>
          </button>
        </div>
      </div>

      {/* 1. CANTEEN OVERSIGHT TAB */}
      {activeTab === 'canteen' && (
        <div className="space-y-6">
          
          {/* Canteen KPI Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-gray-400 block">Today's Revenue</span>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">₹{totalRevenue.toLocaleString()}</h3>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">Digital & Cash Reconciled</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-gray-400 block">Kitchen Queue Load</span>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{activeOrders.length} Tokens</h3>
              <span className="text-[10px] text-amber-700 font-bold block mt-0.5">Avg Prep: 6 Mins</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-gray-400 block">Menu Items Active</span>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">
                {menuItems.filter(m => m.isAvailable).length} / {menuItems.length}
              </h3>
              <span className="text-[10px] text-blue-700 font-medium block mt-0.5">Fast-moving items stocked</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-gray-400 block">Cafeteria Seating Density</span>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">88%</h3>
              <span className="text-[10px] text-amber-700 font-bold block mt-0.5">Peak Lunch Hour</span>
            </div>
          </div>

          {/* Menu Availability Switcher & Live Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Menu Items Stock Toggle (Left 2 Cols) */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Cafeteria Menu Item Availability Overrides</h3>
                  <p className="text-[11px] text-gray-500">Enable or disable items instantly if kitchen runs out of ingredients</p>
                </div>
                <div className="relative w-full sm:w-60">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search snacks, beverages..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredMenu.map((item) => (
                  <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-900">{item.name}</span>
                      <p className="text-[11px] text-gray-500 font-mono">₹{item.price} • {item.category}</p>
                    </div>

                    <button
                      onClick={() => handleToggleItemStock(item.id, item.isAvailable)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                        item.isAvailable
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {item.isAvailable ? 'In Stock' : 'Sold Out'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Live Orders Feed (Right Col) */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
              <div className="pb-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900">Live Kitchen Token Stream</h3>
                <p className="text-[11px] text-gray-500">Orders currently placed by students</p>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-blue-900">{order.tokenNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.status === 'READY' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-700 font-medium">
                      {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 pt-1 border-t border-gray-200/60">
                      <span>Customer: {order.studentName}</span>
                      <strong>₹{order.totalAmount}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. LIBRARY OVERSIGHT TAB */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          
          {/* Library KPI Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-gray-400 block">Catalogued Books</span>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">12,450</h3>
              <span className="text-[10px] text-blue-700 font-bold block mt-0.5">KOHA ILMS Synced</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-gray-400 block">Overdue Borrowings</span>
              <h3 className="text-2xl font-extrabold text-amber-700 mt-1">{overdueList.length} Volumes</h3>
              <span className="text-[10px] text-red-600 font-bold block mt-0.5">Automated Reminders Ready</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-gray-400 block">Reading Hall Occupancy</span>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">161 / 250</h3>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">89 Seats Available</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-gray-400 block">Digital Journal Downloads</span>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">412</h3>
              <span className="text-[10px] text-indigo-700 font-bold block mt-0.5">N-LIST & Shodhganga</span>
            </div>
          </div>

          {/* Overdue Recovery List */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Overdue Volume Recovery & Automated Fine Notice</h3>
                <p className="text-[11px] text-gray-500">Students with book loans exceeding 14-day autonomous loan duration</p>
              </div>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded font-bold text-xs">
                Overdue Rate: 1.4% (Nominal)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase">
                  <tr>
                    <th className="py-3 px-4">Student & PRN</th>
                    <th className="py-3 px-4">Book Title</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Days Overdue</th>
                    <th className="py-3 px-4">Fine Accrued</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {overdueList.map((rec) => (
                    <tr key={rec.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900 block">{rec.student}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{rec.studentId}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-800">{rec.book}</td>
                      <td className="py-3 px-4 text-gray-600 font-mono">{rec.due}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-bold text-[10px]">
                          {rec.daysOverdue} Days
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">₹{rec.fine}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleSendOverdueReminder(rec.book, rec.studentId)}
                          className="px-3 py-1 bg-[#003366] hover:bg-blue-900 text-white rounded text-[11px] font-bold"
                        >
                          Send Reminder
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Book Catalog Quick Audit */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Knowledge Resource Catalog Snapshot</h3>
                <p className="text-[11px] text-gray-500">Live book copy counts and shelf availability</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search catalog by title, author, dept..."
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredBooks.slice(0, 6).map((b) => (
                <div key={b.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs space-y-2">
                  <div>
                    <span className="text-[10px] text-gray-400 font-mono">{b.isbn}</span>
                    <h4 className="font-bold text-gray-900 line-clamp-1">{b.title}</h4>
                    <p className="text-[11px] text-gray-600">{b.author}</p>
                  </div>
                  <div className="flex justify-between items-center text-[10px] pt-2 border-t border-gray-200/60">
                    <span className="text-gray-500">{b.shelfLocation}</span>
                    <strong className="text-blue-900">{b.availableCopies} of {b.totalCopies} Available</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
