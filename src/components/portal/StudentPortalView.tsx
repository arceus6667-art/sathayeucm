import React, { useState } from 'react';
import { 
  BookOpen, Clock, Calendar, FileText, CheckCircle2, 
  Download, ArrowRight, Bell, AlertTriangle, Coffee, MapPin, User
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { campusStore } from '../../services/campusStore';

export default function StudentPortalView() {
  const [activeSubTab, setActiveSubTab] = useState<'courses' | 'grades' | 'timetable' | 'activity'>('courses');
  const user = campusStore.getCurrentUser();
  const timetable = campusStore.getTimetable();
  const canteenOrders = user ? campusStore.getOrdersForStudent(user.id) : [];
  const borrowings = user ? campusStore.getBorrowingsForStudent(user.id) : [];
  const nextClass = campusStore.getNextClass();

  const courses = [
    { name: 'Core Java', code: 'USIT401', credits: 2, attendance: '88%', faculty: 'Prof. S. Rane', room: 'IT Lab 1' },
    { name: 'Introduction to Embedded Systems', code: 'USIT402', credits: 2, attendance: '82%', faculty: 'Dr. Priya Sharma', room: 'Room 204' },
    { name: 'Computer Oriented Statistical Techniques', code: 'USIT403', credits: 2, attendance: '94%', faculty: 'Prof. K. Mehta', room: 'Room 204' },
    { name: 'Software Engineering', code: 'USIT404', credits: 2, attendance: '90%', faculty: 'Dr. Priya Sharma', room: 'Room 402' }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Student Academic Status Card */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 border-l-4 border-yellow-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded uppercase">
              Autonomous B.Sc. IT • Semester IV
            </span>
            <span className="text-xs text-gray-500 font-mono">Roll: IT-2026-01</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#003366]">{user?.name || 'Aarav Mehta'}</h2>
          <p className="text-xs text-gray-500 mt-0.5">Sathaye College (Autonomous) • PRN: 20240164009821</p>
        </div>

        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-extrabold text-xs border border-green-300 flex items-center shrink-0">
          <CheckCircle2 size={16} className="mr-1.5" /> Good Academic Standing
        </div>
      </div>

      {/* Next Class Alert Banner */}
      {nextClass && (
        <div className="bg-[#003366] text-white p-5 rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-400 text-[#003366] flex items-center justify-center font-extrabold text-lg shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <span className="text-xs text-yellow-300 font-bold uppercase tracking-wider block">Upcoming Class</span>
              <h3 className="text-base font-bold">{nextClass.subject} ({nextClass.subjectCode})</h3>
              <p className="text-xs text-blue-200">
                {nextClass.startTime} - {nextClass.endTime} • {nextClass.facultyName} • {nextClass.room}
              </p>
            </div>
          </div>

          <Link
            to={`/map?target=${nextClass.roomId}`}
            className="bg-yellow-500 hover:bg-yellow-400 text-[#003366] text-xs font-extrabold uppercase px-4 py-2.5 rounded-lg transition-colors shadow flex items-center"
          >
            <MapPin size={14} className="mr-1.5 text-red-700" /> Navigate to Room
          </Link>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 pb-3">
        {[
          { id: 'courses', label: 'My Courses & Attendance', icon: BookOpen },
          { id: 'timetable', label: 'Timetable', icon: Calendar },
          { id: 'grades', label: 'Results & Marksheets', icon: FileText },
          { id: 'activity', label: 'Campus Activity', icon: Coffee },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                activeSubTab === tab.id
                  ? 'bg-[#003366] text-yellow-400 shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: COURSES */}
      {activeSubTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-extrabold text-[#003366] uppercase text-sm">Active Semester IV Subjects</h3>
              <span className="text-xs font-bold text-green-700">Avg. 88.5% Att.</span>
            </div>
            <div className="divide-y divide-gray-100">
              {courses.map((course, idx) => (
                <div key={idx} className="p-4 hover:bg-gray-50 flex justify-between items-center transition-colors">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{course.name}</h4>
                    <p className="text-xs text-gray-500">{course.code} • {course.faculty} • {course.room}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded bg-green-100 text-green-700">
                      {course.attendance}
                    </span>
                    <span className="block text-[10px] text-gray-400 mt-0.5">{course.credits} Credits</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 flex items-center justify-between hover:border-[#003366] transition-colors cursor-pointer group">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-50 text-[#003366] rounded-xl flex items-center justify-center mr-4 group-hover:bg-[#003366] group-hover:text-white transition-colors">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base">Semester III Autonomous Marksheet</h4>
                  <p className="text-xs text-gray-500 uppercase">SGPI: 9.35 • Grade: O (Outstanding)</p>
                </div>
              </div>
              <Download className="text-gray-400 group-hover:text-[#003366]" />
            </div>

            {/* Quick Links into Smart Campus Features */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/canteen"
                className="p-4 bg-white rounded-xl border border-gray-200 hover:border-yellow-500 shadow-xs block group transition-colors"
              >
                <Coffee size={20} className="text-yellow-600 mb-2" />
                <h5 className="font-bold text-sm text-gray-900 group-hover:text-[#003366]">Smart Canteen</h5>
                <p className="text-xs text-gray-400">Order lunch or snacks</p>
              </Link>

              <Link
                to="/library"
                className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-500 shadow-xs block group transition-colors"
              >
                <BookOpen size={20} className="text-[#003366] mb-2" />
                <h5 className="font-bold text-sm text-gray-900 group-hover:text-[#003366]">Smart Library</h5>
                <p className="text-xs text-gray-400">Search books & seats</p>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: TIMETABLE */}
      {activeSubTab === 'timetable' && (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 space-y-4">
          <h3 className="font-extrabold text-[#003366] uppercase text-sm">My Class Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {timetable.map((t) => (
              <div key={t.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded uppercase">
                      {t.day}
                    </span>
                    <h4 className="font-bold text-gray-900 text-sm mt-1">{t.subject}</h4>
                    <p className="text-xs text-gray-500">{t.subjectCode} • {t.facultyName}</p>
                  </div>
                  <span className="text-xs font-bold text-[#003366] bg-white px-2 py-1 rounded border border-gray-200">
                    {t.startTime} - {t.endTime}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-xs">
                  <span className="text-gray-600 flex items-center">
                    <MapPin size={12} className="mr-1 text-red-500" /> {t.room} ({t.floor})
                  </span>
                  <Link to={`/map?target=${t.roomId}`} className="text-[#003366] font-bold hover:underline">
                    Map Route
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: GRADES */}
      {activeSubTab === 'grades' && (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 space-y-4">
          <h3 className="font-extrabold text-[#003366] uppercase text-sm">Academic Performance Record</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-xs font-bold uppercase text-gray-400">Cumulative GPA</span>
              <h4 className="text-3xl font-black text-[#003366] mt-1">9.42</h4>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-xs font-bold uppercase text-gray-400">Earned Credits</span>
              <h4 className="text-3xl font-black text-green-700 mt-1">64 / 120</h4>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-xs font-bold uppercase text-gray-400">Standing</span>
              <h4 className="text-3xl font-black text-yellow-600 mt-1">Rank #3</h4>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: CAMPUS ACTIVITY */}
      {activeSubTab === 'activity' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 space-y-4">
            <h4 className="font-bold text-[#003366] text-sm uppercase">Canteen Orders History</h4>
            {canteenOrders.length === 0 ? (
              <p className="text-xs text-gray-400">No orders placed today.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {canteenOrders.map((o) => (
                  <div key={o.id} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-gray-900 block">Token #{o.tokenNumber}</span>
                      <span className="text-gray-500">{o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</span>
                    </div>
                    <span className="font-bold px-2 py-0.5 rounded bg-green-50 text-green-700 uppercase text-[10px]">
                      {o.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 space-y-4">
            <h4 className="font-bold text-[#003366] text-sm uppercase">Library Borrowings</h4>
            {borrowings.length === 0 ? (
              <p className="text-xs text-gray-400">No books currently checked out.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {borrowings.map((b) => (
                  <div key={b.id} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-gray-900 block">{b.bookTitle}</span>
                      <span className="text-gray-500">Return due: {b.dueDate}</span>
                    </div>
                    <span className="font-bold px-2 py-0.5 rounded bg-blue-50 text-[#003366] uppercase text-[10px]">
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
