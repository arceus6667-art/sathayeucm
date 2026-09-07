import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, Calendar, CheckSquare, Clock, 
  Upload, FileText, Bell, Check, Plus, AlertCircle, MapPin, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { campusStore, TimetableEntry } from '../../services/campusStore';

interface StudentRosterItem {
  id: string;
  name: string;
  rollNo: string;
  present: boolean;
}

export default function FacultyPortalView() {
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'timetable' | 'assignments' | 'resources'>('overview');
  const user = campusStore.getCurrentUser();
  const timetable = campusStore.getTimetable();

  // Faculty's lectures
  const facultyLectures = timetable.filter(t => t.facultyId === 'fac-001' || t.facultyName.includes('Sharma'));

  // Attendance State
  const [selectedCourseCode, setSelectedCourseCode] = useState('USIT404');
  const [studentsRoster, setStudentsRoster] = useState<StudentRosterItem[]>([
    { id: 's1', name: 'Aarav Mehta', rollNo: 'IT-2026-01', present: true },
    { id: 's2', name: 'Riya Kulkarni', rollNo: 'IT-2026-02', present: true },
    { id: 's3', name: 'Sneha Patel', rollNo: 'IT-2026-03', present: false },
    { id: 's4', name: 'Aditya Deshmukh', rollNo: 'IT-2026-04', present: true },
    { id: 's5', name: 'Tanvi Shinde', rollNo: 'IT-2026-05', present: true },
    { id: 's6', name: 'Yash Jadhav', rollNo: 'IT-2026-06', present: true },
    { id: 's7', name: 'Ananya Joshi', rollNo: 'IT-2026-07', present: false },
    { id: 's8', name: 'Pranav Sawant', rollNo: 'IT-2026-08', present: true }
  ]);
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  // Assignment Creation State
  const [assignments, setAssignments] = useState([
    { id: 'asg-1', title: 'Agile Sprint Planning Document', course: 'Software Engineering (USIT404)', deadline: '15 Oct 2026', submitted: 42, total: 48 },
    { id: 'asg-2', title: 'Object-Oriented Design Patterns', course: 'Core Java (USIT401)', deadline: '20 Oct 2026', submitted: 38, total: 48 },
  ]);
  const [newAsgTitle, setNewAsgTitle] = useState('');
  const [newAsgCourse, setNewAsgCourse] = useState('Software Engineering (USIT404)');
  const [newAsgDeadline, setNewAsgDeadline] = useState('2026-10-25');
  const [showAsgModal, setShowAsgModal] = useState(false);

  // Resources State
  const [resources, setResources] = useState([
    { id: 'res-1', title: 'Unit 3: Microservices & Cloud Architecture Slides.pdf', course: 'USIT404', size: '4.2 MB', date: 'Yesterday' },
    { id: 'res-2', title: 'Java Generics & Concurrency Code Examples.zip', course: 'USIT401', size: '1.8 MB', date: '3 days ago' },
  ]);
  const [newResTitle, setNewResTitle] = useState('');

  const toggleStudent = (id: string) => {
    setStudentsRoster(prev => prev.map(s => s.id === id ? { ...s, present: !s.present } : s));
  };

  const handleSaveAttendance = () => {
    const presentCount = studentsRoster.filter(s => s.present).length;
    setAttendanceSaved(true);
    campusStore.addNotification({
      title: `Attendance Submitted for ${selectedCourseCode}`,
      message: `${presentCount} / ${studentsRoster.length} students marked present on ${new Date().toLocaleDateString()}.`,
      type: 'attendance',
      targetRole: 'STUDENT'
    });
    setTimeout(() => setAttendanceSaved(false), 3000);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgTitle) return;
    setAssignments(prev => [
      ...prev,
      {
        id: `asg-${Date.now()}`,
        title: newAsgTitle,
        course: newAsgCourse,
        deadline: newAsgDeadline,
        submitted: 0,
        total: 48
      }
    ]);
    setShowAsgModal(false);
    setNewAsgTitle('');
  };

  const handleUploadResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResTitle) return;
    setResources(prev => [
      {
        id: `res-${Date.now()}`,
        title: newResTitle.endsWith('.pdf') ? newResTitle : `${newResTitle}.pdf`,
        course: 'USIT404',
        size: '2.5 MB',
        date: 'Just now'
      },
      ...prev
    ]);
    setNewResTitle('');
  };

  return (
    <div className="space-y-6">
      
      {/* Sub-nav Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Faculty Overview', icon: BookOpen },
          { id: 'attendance', label: 'Attendance Entry', icon: CheckSquare },
          { id: 'timetable', label: 'My Lecture Schedule', icon: Calendar },
          { id: 'assignments', label: 'Assignments', icon: FileText },
          { id: 'resources', label: 'Course Resources', icon: Upload },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                activeTab === tab.id
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

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 border-l-4 border-[#003366] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#003366]">Dr. Priya Sharma • Faculty Portal</h2>
              <p className="text-xs text-gray-600">Department of Computer Science & Information Technology • Sathaye Autonomous</p>
            </div>
            <button
              onClick={() => setActiveTab('attendance')}
              className="bg-[#003366] hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow flex items-center"
            >
              <CheckSquare size={14} className="mr-1.5" /> Mark Today's Attendance
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs text-center">
              <Users size={28} className="mx-auto mb-2 text-[#003366]" />
              <h3 className="text-3xl font-extrabold text-gray-900">145</h3>
              <p className="text-xs text-gray-500 font-bold uppercase">Total Enrolled</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs text-center">
              <BookOpen size={28} className="mx-auto mb-2 text-[#003366]" />
              <h3 className="text-3xl font-extrabold text-gray-900">3</h3>
              <p className="text-xs text-gray-500 font-bold uppercase">Assigned Courses</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs text-center">
              <Calendar size={28} className="mx-auto mb-2 text-[#003366]" />
              <h3 className="text-3xl font-extrabold text-gray-900">12</h3>
              <p className="text-xs text-gray-500 font-bold uppercase">Weekly Lectures</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs text-center">
              <Clock size={28} className="mx-auto mb-2 text-green-600" />
              <h3 className="text-3xl font-extrabold text-gray-900">92%</h3>
              <p className="text-xs text-gray-500 font-bold uppercase">Avg. Attendance</p>
            </div>
          </div>

          {/* Today's Lectures */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-[#003366] uppercase text-sm">Today's Scheduled Sessions</h3>
              <button onClick={() => setActiveTab('timetable')} className="text-xs font-bold text-blue-700 hover:underline">
                View Full Week
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {facultyLectures.map((entry) => (
                <div key={entry.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-50 text-[#003366] px-3 py-2 rounded-lg text-center border border-blue-200">
                      <span className="block text-[10px] font-bold text-gray-500 uppercase">Time</span>
                      <span className="block text-xs font-extrabold">{entry.startTime}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{entry.subject} ({entry.subjectCode})</h4>
                      <p className="text-xs text-gray-500">
                        {entry.department} • {entry.room} ({entry.floor})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Link
                      to={`/map?target=${entry.roomId}`}
                      className="text-xs text-[#003366] hover:underline flex items-center font-bold"
                    >
                      <MapPin size={12} className="mr-1 text-red-500" /> Room Route
                    </Link>
                    <button
                      onClick={() => setActiveTab('attendance')}
                      className="text-xs font-bold px-3 py-1 bg-[#003366] hover:bg-blue-800 text-white rounded shadow-xs"
                    >
                      Enter Attendance
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE ENTRY */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-4">
            <div>
              <h3 className="font-extrabold text-[#003366] uppercase tracking-wide text-base">
                Autonomous Attendance Entry Register
              </h3>
              <p className="text-xs text-gray-500">Session Date: {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={selectedCourseCode}
                onChange={(e) => setSelectedCourseCode(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold bg-gray-50 text-[#003366]"
              >
                <option value="USIT404">USIT404: Software Engineering</option>
                <option value="USIT401">USIT401: Core Java</option>
                <option value="USIT402">USIT402: Embedded Systems</option>
              </select>

              <button
                onClick={handleSaveAttendance}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-extrabold uppercase tracking-wider shadow flex items-center"
              >
                <Check size={14} className="mr-1.5" /> Save Attendance
              </button>
            </div>
          </div>

          {attendanceSaved && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs font-bold rounded-lg flex items-center">
              <CheckSquare size={16} className="mr-2 text-green-600" />
              Attendance successfully registered in central college database & synced with student portal!
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-[11px]">
                <tr>
                  <th className="p-3">Roll No</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Quick Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                {studentsRoster.map((st) => (
                  <tr key={st.id} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-[#003366]">{st.rollNo}</td>
                    <td className="p-3 text-sm">{st.name}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        st.present ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {st.present ? 'Present' : 'Absent'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => toggleStudent(st.id)}
                        className={`px-3 py-1 rounded font-bold text-xs transition-colors ${
                          st.present
                            ? 'bg-red-50 hover:bg-red-100 text-red-600'
                            : 'bg-green-50 hover:bg-green-100 text-green-600'
                        }`}
                      >
                        Mark {st.present ? 'Absent' : 'Present'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TIMETABLE */}
      {activeTab === 'timetable' && (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-[#003366] uppercase tracking-wide text-base">Weekly Teaching Schedule</h3>
              <p className="text-xs text-gray-500">Autonomous Semester IV (AY 2026-27)</p>
            </div>
            <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
              Full Faculty Load: 12 Hours
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facultyLectures.map((entry) => (
              <div key={entry.id} className="p-4 rounded-xl border border-gray-200 hover:border-[#003366] transition-colors bg-gray-50/50 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-blue-100 text-[#003366] px-2 py-0.5 rounded">
                      {entry.day}
                    </span>
                    <h4 className="font-bold text-gray-900 text-sm mt-1">{entry.subject}</h4>
                    <p className="text-xs text-gray-500">{entry.subjectCode} • {entry.department}</p>
                  </div>
                  <span className="text-xs font-extrabold text-[#003366] bg-white px-2 py-1 rounded border border-gray-200">
                    {entry.startTime} - {entry.endTime}
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-xs">
                  <span className="text-gray-600 flex items-center">
                    <MapPin size={12} className="mr-1 text-red-500" /> {entry.room} ({entry.building})
                  </span>
                  <Link
                    to={`/map?target=${entry.roomId}`}
                    className="text-xs font-bold text-[#003366] hover:underline"
                  >
                    View Room in Campus Map
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-[#003366] uppercase tracking-wide text-base">Course Assignments</h3>
              <p className="text-xs text-gray-500">Track submissions and continuous evaluation grades</p>
            </div>
            <button
              onClick={() => setShowAsgModal(true)}
              className="px-4 py-2 bg-[#003366] hover:bg-blue-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow flex items-center"
            >
              <Plus size={14} className="mr-1" /> Create Assignment
            </button>
          </div>

          <div className="space-y-3">
            {assignments.map((asg) => (
              <div key={asg.id} className="p-4 rounded-xl border border-gray-200 hover:border-[#003366] transition-colors flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{asg.title}</h4>
                  <p className="text-xs text-gray-500">{asg.course} • Deadline: <strong className="text-red-600">{asg.deadline}</strong></p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200 block mb-1">
                    {asg.submitted} / {asg.total} Submitted
                  </span>
                  <button className="text-[11px] text-blue-700 font-bold hover:underline">
                    Grade Submissions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: RESOURCES */}
      {activeTab === 'resources' && (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-[#003366] uppercase tracking-wide text-base">Digital Learning Repository</h3>
              <p className="text-xs text-gray-500">Share lecture notes, question banks, and slides with students</p>
            </div>
          </div>

          {/* Quick upload input */}
          <form onSubmit={handleUploadResource} className="flex gap-3">
            <input
              type="text"
              placeholder="e.g. Unit 4: Microservices Architecture Notes"
              value={newResTitle}
              onChange={(e) => setNewResTitle(e.target.value)}
              className="flex-grow px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003366]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#003366] hover:bg-blue-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow flex items-center"
            >
              <Upload size={14} className="mr-1.5" /> Publish PDF
            </button>
          </form>

          <div className="divide-y divide-gray-100">
            {resources.map((res) => (
              <div key={res.id} className="py-3 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">{res.title}</h5>
                    <p className="text-xs text-gray-400">{res.course} • {res.size} • Published {res.date}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded">
                  Live on Student App
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Assignment Modal */}
      {showAsgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border-t-4 border-[#003366]">
            <h3 className="text-lg font-bold text-[#003366] mb-3 uppercase">Create Course Assignment</h3>
            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Pattern Implementation"
                  value={newAsgTitle}
                  onChange={(e) => setNewAsgTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Course</label>
                <select
                  value={newAsgCourse}
                  onChange={(e) => setNewAsgCourse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                >
                  <option value="Software Engineering (USIT404)">Software Engineering (USIT404)</option>
                  <option value="Core Java (USIT401)">Core Java (USIT401)</option>
                  <option value="Embedded Systems (USIT402)">Embedded Systems (USIT402)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Submission Deadline</label>
                <input
                  type="date"
                  required
                  value={newAsgDeadline}
                  onChange={(e) => setNewAsgDeadline(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAsgModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#003366] hover:bg-blue-800 rounded-lg uppercase"
                >
                  Publish to Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
