import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, Clock, BookOpen, User, MapPin, Plus, 
  CheckCircle2, AlertTriangle, AlertCircle, Trash2, 
  Copy, Edit2, Download, Filter, RefreshCw, Send, 
  Layers, ShieldAlert, Check, X, ArrowRight, Eye, 
  ChevronDown, ExternalLink, HelpCircle
} from 'lucide-react';
import { 
  timetableService, 
  TimetableEntry, 
  AcademicRoom, 
  DEPARTMENTS_24, 
  PROGRAMS_24, 
  FACULTY_10, 
  TimetableConflict, 
  TimetableAuditRecord 
} from '../../../services/timetableStore';

interface AdminTimetableViewProps {
  onNavigateToRoomMap?: (roomNumber: string) => void;
}

export default function AdminTimetableView({ onNavigateToRoomMap }: AdminTimetableViewProps) {
  // Master state
  const [entries, setEntries] = useState<TimetableEntry[]>(timetableService.getEntries());
  const [rooms] = useState<AcademicRoom[]>(timetableService.getRooms());
  const [auditLogs, setAuditLogs] = useState<TimetableAuditRecord[]>(timetableService.getAuditHistory());

  // View state: 'grid' (Matrix) or 'list' (Dense Table)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filters
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedProgram, setSelectedProgram] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('ALL');
  const [selectedRoom, setSelectedRoom] = useState<string>('ALL');
  const [selectedDay, setSelectedDay] = useState<number>(0); // 0=All, 1=Mon, 2=Tue...
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState('');

  // Modals
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showRelocateModal, setShowRelocateModal] = useState(false);
  const [relocateEntry, setRelocateEntry] = useState<TimetableEntry | null>(null);
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [relocateReason, setRelocateReason] = useState('Room capacity upgrade');
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Entry Form state
  const [formData, setFormData] = useState({
    academic_year: '2025-2026',
    semester: 4,
    department: 'Information Technology',
    program: 'B.Sc. Information Technology',
    year: 'SY' as 'FY' | 'SY' | 'TY',
    division: 'SY B.Sc. IT Div A',
    batch: '',
    subject: '',
    subjectCode: '',
    faculty: FACULTY_10[0].name,
    facultyEmail: FACULTY_10[0].email,
    room: '204',
    floor: 2,
    day_of_week: 1,
    start_time: '08:00',
    end_time: '09:00',
    effective_from: '2026-01-05',
    effective_until: '2026-05-15',
    status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED'
  });

  // Real-time conflict feedback inside modal
  const [formConflicts, setFormConflicts] = useState<TimetableConflict[]>([]);

  // Subscribe to timetable updates
  useEffect(() => {
    const unsub = timetableService.subscribe(() => {
      setEntries(timetableService.getEntries());
      setAuditLogs(timetableService.getAuditHistory());
    });
    return unsub;
  }, []);

  // Compute live conflicts whenever form changes
  useEffect(() => {
    if (!showEntryModal) return;
    const conflicts = timetableService.detectConflicts({
      id: editingEntryId || undefined,
      day_of_week: formData.day_of_week,
      start_time: formData.start_time,
      end_time: formData.end_time,
      room: formData.room,
      faculty: formData.faculty,
      division: formData.division,
      batch: formData.batch,
      subject: formData.subject
    });
    setFormConflicts(conflicts);
  }, [formData, showEntryModal, editingEntryId]);

  // Filtered Entries
  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      if (selectedDept !== 'ALL' && e.department !== selectedDept) return false;
      if (selectedProgram !== 'ALL' && e.program !== selectedProgram) return false;
      if (selectedYear !== 'ALL' && e.year !== selectedYear) return false;
      if (selectedDivision !== 'ALL' && !e.division.toLowerCase().includes(selectedDivision.toLowerCase())) return false;
      if (selectedFaculty !== 'ALL' && e.faculty !== selectedFaculty) return false;
      if (selectedRoom !== 'ALL' && e.room.toLowerCase() !== selectedRoom.toLowerCase()) return false;
      if (selectedDay !== 0 && e.day_of_week !== selectedDay) return false;
      if (selectedStatus !== 'ALL' && e.status !== selectedStatus) return false;
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        return (
          e.subject.toLowerCase().includes(q) ||
          e.subjectCode.toLowerCase().includes(q) ||
          e.faculty.toLowerCase().includes(q) ||
          e.room.toLowerCase().includes(q) ||
          e.division.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [entries, selectedDept, selectedProgram, selectedYear, selectedDivision, selectedFaculty, selectedRoom, selectedDay, selectedStatus, searchFilter]);

  // Statistics
  const stats = useMemo(() => {
    const now = new Date();
    let currentDay = now.getDay();
    if (currentDay === 0) currentDay = 1;
    const hours = now.getHours().toString().padStart(2, '0');
    const mins = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${hours}:${mins}`;

    const total = entries.length;
    const published = entries.filter(e => e.status === 'PUBLISHED').length;
    const drafts = entries.filter(e => e.status === 'DRAFT').length;
    const todayClasses = entries.filter(e => e.day_of_week === currentDay && e.status === 'PUBLISHED');
    const currentlyActive = todayClasses.filter(e => currentTime >= e.start_time && currentTime < e.end_time);

    // Distinct occupied rooms right now
    const occupiedRooms = new Set(currentlyActive.map(e => e.room.toLowerCase()));
    const roomUtil = Math.round((occupiedRooms.size / 48) * 100);

    return {
      total,
      published,
      drafts,
      todayTotal: todayClasses.length,
      currentlyActive: currentlyActive.length,
      occupiedRoomsCount: occupiedRooms.size,
      roomUtil
    };
  }, [entries]);

  // Day columns for Matrix
  const DAYS = [
    { num: 1, name: 'Monday', short: 'Mon' },
    { num: 2, name: 'Tuesday', short: 'Tue' },
    { num: 3, name: 'Wednesday', short: 'Wed' },
    { num: 4, name: 'Thursday', short: 'Thu' },
    { num: 5, name: 'Friday', short: 'Fri' },
    { num: 6, name: 'Saturday', short: 'Sat' },
  ];

  // Time slots for Grid
  const TIME_SLOTS = [
    { start: '07:30', end: '08:20', label: 'Period 1 (07:30 - 08:20)' },
    { start: '08:20', end: '09:10', label: 'Period 2 (08:20 - 09:10)' },
    { start: '09:15', end: '10:05', label: 'Period 3 (09:15 - 10:05)' },
    { start: '10:10', end: '11:00', label: 'Period 4 (10:10 - 11:00)' },
    { start: '11:15', end: '12:05', label: 'Period 5 (11:15 - 12:05)' },
    { start: '12:10', end: '13:00', label: 'Period 6 (12:10 - 13:00)' },
    { start: '13:30', end: '14:20', label: 'Period 7 (13:30 - 14:20)' },
    { start: '14:25', end: '15:15', label: 'Period 8 (14:25 - 15:15)' },
    { start: '15:20', end: '16:10', label: 'Period 9 (15:20 - 16:10)' },
    { start: '16:15', end: '17:05', label: 'Period 10 (16:15 - 17:05)' }
  ];

  // Handlers
  const handleOpenCreateModal = (day = 1, startTime = '08:00', endTime = '09:00') => {
    setEditingEntryId(null);
    setFormData({
      academic_year: '2025-2026',
      semester: 4,
      department: selectedDept !== 'ALL' ? selectedDept : 'Information Technology',
      program: selectedProgram !== 'ALL' ? selectedProgram : 'B.Sc. Information Technology',
      year: (selectedYear !== 'ALL' ? selectedYear : 'SY') as any,
      division: selectedDivision !== 'ALL' ? selectedDivision : 'SY B.Sc. IT Div A',
      batch: '',
      subject: '',
      subjectCode: '',
      faculty: selectedFaculty !== 'ALL' ? selectedFaculty : FACULTY_10[0].name,
      facultyEmail: FACULTY_10[0].email,
      room: selectedRoom !== 'ALL' ? selectedRoom : '204',
      floor: 2,
      day_of_week: day,
      start_time: startTime,
      end_time: endTime,
      effective_from: '2026-01-05',
      effective_until: '2026-05-15',
      status: 'PUBLISHED'
    });
    setShowEntryModal(true);
  };

  const handleOpenEditModal = (entry: TimetableEntry) => {
    setEditingEntryId(entry.id);
    setFormData({
      academic_year: entry.academic_year,
      semester: entry.semester,
      department: entry.department,
      program: entry.program,
      year: entry.year,
      division: entry.division,
      batch: entry.batch || '',
      subject: entry.subject,
      subjectCode: entry.subjectCode,
      faculty: entry.faculty,
      facultyEmail: entry.facultyEmail,
      room: entry.room,
      floor: entry.floor,
      day_of_week: entry.day_of_week,
      start_time: entry.start_time,
      end_time: entry.end_time,
      effective_from: entry.effective_from,
      effective_until: entry.effective_until,
      status: entry.status === 'ARCHIVED' ? 'DRAFT' : entry.status
    });
    setShowEntryModal(true);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (formConflicts.length > 0) {
      setFeedbackMsg({ type: 'error', text: `Scheduling Conflict: ${formConflicts[0].message}` });
      return;
    }

    if (editingEntryId) {
      const res = timetableService.updateEntry(editingEntryId, formData);
      if (res.success) {
        setFeedbackMsg({ type: 'success', text: `Class slot for ${formData.subject} updated successfully.` });
        setShowEntryModal(false);
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'Failed to update entry' });
      }
    } else {
      const res = timetableService.createEntry(formData);
      if (res.success) {
        setFeedbackMsg({ type: 'success', text: `Class slot for ${formData.subject} created successfully.` });
        setShowEntryModal(false);
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'Failed to create entry' });
      }
    }
  };

  const handleDeleteEntry = (id: string, subject: string) => {
    if (window.confirm(`Are you sure you want to delete the timetable slot for "${subject}"?`)) {
      timetableService.deleteEntry(id);
      setFeedbackMsg({ type: 'success', text: `Deleted timetable slot for "${subject}".` });
    }
  };

  const handleDuplicateEntry = (id: string) => {
    const res = timetableService.duplicateEntry(id);
    if (res.success) {
      setFeedbackMsg({ type: 'success', text: 'Slot duplicated to subsequent day as Draft.' });
    } else {
      setFeedbackMsg({ type: 'error', text: res.error || 'Failed to duplicate entry due to conflict.' });
    }
  };

  const handleOpenRelocateModal = (entry: TimetableEntry) => {
    setRelocateEntry(entry);
    setNewRoomNumber('');
    setRelocateReason('Room capacity upgrade & smart board requirement');
    setShowRelocateModal(true);
  };

  const handleConfirmRelocate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!relocateEntry || !newRoomNumber) return;

    const res = timetableService.changeRoom(relocateEntry.id, newRoomNumber, relocateReason);
    if (res.success) {
      setFeedbackMsg({ type: 'success', text: `Relocated from Room ${relocateEntry.room} to Room ${newRoomNumber}. Notification broadcasted.` });
      setShowRelocateModal(false);
      setRelocateEntry(null);
    } else {
      setFeedbackMsg({ type: 'error', text: res.error || 'Room relocation failed.' });
    }
  };

  const handlePublishAllDrafts = () => {
    const res = timetableService.publishTimetable(selectedDivision !== 'ALL' ? selectedDivision : undefined);
    setFeedbackMsg({ type: 'success', text: `Successfully published ${res.publishedCount} draft schedule slots.` });
    setShowPublishModal(false);
  };

  const handleExportCSV = () => {
    const dayNames = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const header = 'Day,Start Time,End Time,Subject Code,Subject Name,Faculty,Room,Floor,Division,Batch,Status\n';
    const rows = filteredEntries.map(e => 
      `"${dayNames[e.day_of_week]}","${e.start_time}","${e.end_time}","${e.subjectCode}","${e.subject}","${e.faculty}","${e.room}","${e.floor}","${e.division}","${e.batch || ''}","${e.status}"`
    ).join('\n');
    
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Sathaye_Timetable_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. TOP HEADER & EXECUTIVE STATS */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#003366] text-white text-[10px] font-bold rounded uppercase tracking-wider">
                Autonomous Academic Governance
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded flex items-center gap-1">
                <CheckCircle2 size={10} /> Conflict Prevention Engine Active
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-1">Master Academic Timetable Management System</h2>
            <p className="text-xs text-gray-500">
              Database-backed schedule matrix with multi-entity conflict validation (Room, Faculty, Division), real-time occupancy synchronization, and instant room change broadcasting.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleOpenCreateModal()}
              className="px-3 py-2 bg-[#003366] text-white hover:bg-blue-900 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus size={14} />
              <span>New Class Slot</span>
            </button>

            <button
              onClick={() => setShowPublishModal(true)}
              className="px-3 py-2 bg-emerald-700 text-white hover:bg-emerald-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Send size={14} />
              <span>Validate & Publish ({stats.drafts})</span>
            </button>

            <button
              onClick={() => setShowAuditModal(true)}
              className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Clock size={14} />
              <span>Audit Trail</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Download size={14} />
              <span>CSV</span>
            </button>

            {/* View Mode Toggle */}
            <div className="bg-gray-100 p-0.5 rounded-lg flex items-center">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-all ${
                  viewMode === 'grid' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Weekly Matrix
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-all ${
                  viewMode === 'list' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Detailed Table
              </button>
            </div>
          </div>
        </div>

        {/* Status Notification Toast */}
        {feedbackMsg && (
          <div className={`p-3 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
            feedbackMsg.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}>
            <div className="flex items-center gap-2">
              {feedbackMsg.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-600" /> : <AlertTriangle size={16} className="text-rose-600" />}
              <span>{feedbackMsg.text}</span>
            </div>
            <button onClick={() => setFeedbackMsg(null)} className="text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          </div>
        )}

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Scheduled Slots</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">{stats.total}</div>
            <div className="text-[10px] text-slate-500 mt-1">{stats.published} Published • {stats.drafts} Drafts</div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Today's Lectures</div>
            <div className="text-xl font-black text-blue-900 mt-0.5">{stats.todayTotal}</div>
            <div className="text-[10px] text-blue-600 mt-1">Across Monday–Saturday cycles</div>
          </div>

          <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Currently In Session</div>
            <div className="text-xl font-black text-emerald-900 mt-0.5">{stats.currentlyActive}</div>
            <div className="text-[10px] text-emerald-600 mt-1">Calculated via real-time clock</div>
          </div>

          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
            <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Campus Room Utilization</div>
            <div className="text-xl font-black text-amber-900 mt-0.5">{stats.roomUtil}%</div>
            <div className="text-[10px] text-amber-700 mt-1">{stats.occupiedRoomsCount} of 48 active rooms occupied</div>
          </div>
        </div>
      </div>

      {/* 2. ADVANCED MULTI-ENTITY FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
            <Filter size={14} className="text-[#003366]" />
            <span>Academic Filters (24 Departments & 48 Classrooms)</span>
          </div>
          {(selectedDept !== 'ALL' || selectedProgram !== 'ALL' || selectedYear !== 'ALL' || selectedDivision !== 'ALL' || selectedFaculty !== 'ALL' || selectedRoom !== 'ALL' || selectedDay !== 0 || selectedStatus !== 'ALL' || searchFilter) && (
            <button
              onClick={() => {
                setSelectedDept('ALL');
                setSelectedProgram('ALL');
                setSelectedYear('ALL');
                setSelectedDivision('ALL');
                setSelectedFaculty('ALL');
                setSelectedRoom('ALL');
                setSelectedDay(0);
                setSelectedStatus('ALL');
                setSearchFilter('');
              }}
              className="text-[11px] text-[#003366] hover:underline font-semibold"
            >
              Reset All Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
          {/* Dept */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800"
            >
              <option value="ALL">All Departments (24)</option>
              {DEPARTMENTS_24.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Program */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1">Program</label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800"
            >
              <option value="ALL">All Programs (24)</option>
              {PROGRAMS_24.map(p => (
                <option key={p.id} value={p.name}>{p.code}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800"
            >
              <option value="ALL">All Years</option>
              <option value="FY">FY (First Year)</option>
              <option value="SY">SY (Second Year)</option>
              <option value="TY">TY (Third Year)</option>
            </select>
          </div>

          {/* Division */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1">Division</label>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800"
            >
              <option value="ALL">All Divisions</option>
              <option value="Div A">Division A</option>
              <option value="Div B">Division B</option>
              <option value="Div C">Division C</option>
            </select>
          </div>

          {/* Faculty */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1">Faculty</label>
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800"
            >
              <option value="ALL">All Faculty (10)</option>
              {FACULTY_10.map(f => (
                <option key={f.id} value={f.name}>{f.name}</option>
              ))}
            </select>
          </div>

          {/* Room */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1">Room</label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800"
            >
              <option value="ALL">All Rooms (48)</option>
              {rooms.map(r => (
                <option key={r.id} value={r.roomNumber}>Room {r.roomNumber} (F{r.floor})</option>
              ))}
            </select>
          </div>

          {/* Day */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1">Day</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(Number(e.target.value))}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800"
            >
              <option value={0}>All Days</option>
              {DAYS.map(d => (
                <option key={d.num} value={d.num}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800"
            >
              <option value="ALL">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>

        {/* Text Search Input */}
        <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by subject code, subject title, faculty name, or room number..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder:text-gray-400"
          />
          <span className="text-[11px] text-gray-400 whitespace-nowrap font-medium">
            Showing {filteredEntries.length} entries
          </span>
        </div>
      </div>

      {/* 3. TIMETABLE SCHEDULE BUILDER MATRIX (WEEKLY GRID VIEW) */}
      {viewMode === 'grid' ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-[#003366]" />
              <span className="text-xs font-bold text-gray-800">Weekly Lecture Matrix (Monday – Saturday)</span>
            </div>
            <span className="text-[11px] text-gray-500">
              Hover slot for quick actions • Click slot to edit or relocate room
            </span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[950px]">
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-100 text-xs font-bold text-gray-700 text-center">
                <div className="p-2.5 border-r border-gray-200 text-gray-500 uppercase tracking-wider text-[10px]">
                  Time Period
                </div>
                {DAYS.map(day => (
                  <div key={day.num} className="p-2.5 border-r border-gray-200 last:border-r-0">
                    <div className="font-bold text-[#003366]">{day.name}</div>
                    <div className="text-[10px] text-gray-400 font-normal">
                      {entries.filter(e => e.day_of_week === day.num).length} classes
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slot Rows */}
              {TIME_SLOTS.map((slot, sIdx) => (
                <div key={slot.start} className={`grid grid-cols-7 border-b border-gray-100 text-xs ${sIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  {/* Time label column */}
                  <div className="p-2 border-r border-gray-200 flex flex-col justify-center text-center bg-gray-50">
                    <span className="font-bold text-gray-800 text-[11px]">{slot.start} - {slot.end}</span>
                    <span className="text-[9px] text-gray-400">P{sIdx + 1}</span>
                  </div>

                  {/* 6 Day Columns */}
                  {DAYS.map(day => {
                    // Find slots matching this day and time window
                    const matchingSlots = filteredEntries.filter(e => {
                      if (e.day_of_week !== day.num) return false;
                      return (e.start_time < slot.end && e.end_time > slot.start);
                    });

                    return (
                      <div 
                        key={day.num} 
                        className="p-1.5 border-r border-gray-200 last:border-r-0 min-h-[85px] flex flex-col gap-1.5 relative group"
                      >
                        {matchingSlots.length > 0 ? (
                          matchingSlots.map(entry => {
                            const isDraft = entry.status === 'DRAFT';
                            return (
                              <div
                                key={entry.id}
                                className={`p-2 rounded-lg border text-left transition-all shadow-xs relative overflow-hidden ${
                                  isDraft 
                                    ? 'bg-amber-50/80 border-amber-300 text-amber-950' 
                                    : 'bg-blue-50/80 border-blue-200 text-blue-950 hover:border-blue-400'
                                }`}
                              >
                                {isDraft && (
                                  <div className="absolute top-1 right-1 px-1 py-0.2 bg-amber-200 text-amber-900 text-[8px] font-bold rounded uppercase">
                                    Draft
                                  </div>
                                )}

                                <div className="font-bold text-[11px] leading-tight flex items-center justify-between">
                                  <span>{entry.subjectCode}</span>
                                  <span className="text-[9px] text-gray-500 font-mono">{entry.start_time}-{entry.end_time}</span>
                                </div>
                                <div className="text-[10px] text-gray-700 font-medium truncate mt-0.5" title={entry.subject}>
                                  {entry.subject}
                                </div>

                                <div className="flex items-center gap-1 text-[9px] text-gray-600 mt-1">
                                  <User size={10} className="shrink-0 text-blue-700" />
                                  <span className="truncate">{entry.faculty}</span>
                                </div>

                                <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-200/60 text-[9px]">
                                  <button
                                    onClick={() => onNavigateToRoomMap ? onNavigateToRoomMap(entry.room) : undefined}
                                    className="flex items-center gap-0.5 font-bold text-[#003366] hover:underline"
                                  >
                                    <MapPin size={9} />
                                    <span>Rm {entry.room} (F{entry.floor})</span>
                                  </button>
                                  <span className="text-gray-500 font-medium truncate max-w-[80px]">
                                    {entry.batch ? entry.batch : entry.division.split(' ')[0]}
                                  </span>
                                </div>

                                {/* Quick Hover Action Menu */}
                                <div className="mt-1.5 flex items-center gap-1 pt-1 border-t border-gray-200/50">
                                  <button
                                    onClick={() => handleOpenEditModal(entry)}
                                    title="Edit Slot Details"
                                    className="p-1 bg-white hover:bg-gray-100 rounded text-gray-600 hover:text-blue-700 border border-gray-200"
                                  >
                                    <Edit2 size={10} />
                                  </button>
                                  <button
                                    onClick={() => handleOpenRelocateModal(entry)}
                                    title="Relocate Room (Broadcast Notice)"
                                    className="p-1 bg-white hover:bg-gray-100 rounded text-amber-700 border border-gray-200"
                                  >
                                    <MapPin size={10} />
                                  </button>
                                  <button
                                    onClick={() => handleDuplicateEntry(entry.id)}
                                    title="Duplicate Slot"
                                    className="p-1 bg-white hover:bg-gray-100 rounded text-gray-600 hover:text-emerald-700 border border-gray-200"
                                  >
                                    <Copy size={10} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEntry(entry.id, entry.subject)}
                                    title="Delete Slot"
                                    className="p-1 bg-white hover:bg-gray-100 rounded text-rose-600 hover:text-rose-800 border border-gray-200"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <button
                            onClick={() => handleOpenCreateModal(day.num, slot.start, slot.end)}
                            className="w-full h-full rounded border border-dashed border-gray-200 hover:border-[#003366] hover:bg-blue-50/30 text-gray-300 hover:text-[#003366] flex flex-col items-center justify-center transition-all opacity-0 group-hover:opacity-100 p-1"
                          >
                            <Plus size={12} />
                            <span className="text-[9px] font-bold">Assign Slot</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* 4. NON-DRAG DETAILED TABLE VIEW (DENSE) */
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Day & Time</th>
                  <th className="p-3">Subject & Code</th>
                  <th className="p-3">Faculty Member</th>
                  <th className="p-3">Room & Floor</th>
                  <th className="p-3">Class & Division</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEntries.map(entry => {
                  const dayName = DAYS.find(d => d.num === entry.day_of_week)?.name || 'Monday';
                  return (
                    <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-gray-900">{dayName}</div>
                        <div className="text-[11px] text-gray-500">{entry.start_time} - {entry.end_time}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-gray-900">{entry.subjectCode}</div>
                        <div className="text-[11px] text-gray-600 truncate max-w-xs">{entry.subject}</div>
                        <div className="text-[10px] text-gray-400">{entry.department}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-gray-800">{entry.faculty}</div>
                        <div className="text-[10px] text-gray-400">{entry.facultyEmail}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-[#003366]">Room {entry.room}</div>
                        <div className="text-[10px] text-gray-500">Floor {entry.floor === 0 ? 'Ground' : entry.floor}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-gray-800">{entry.division}</div>
                        <div className="text-[10px] text-gray-500">{entry.year} • Sem {entry.semester} {entry.batch ? `(${entry.batch})` : ''}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          entry.status === 'PUBLISHED' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {entry.status}
                        </span>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenRelocateModal(entry)}
                            title="Relocate Room"
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg border border-amber-200"
                          >
                            <MapPin size={12} />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(entry)}
                            title="Edit"
                            className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg border border-gray-200"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDuplicateEntry(entry.id)}
                            title="Duplicate"
                            className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg border border-gray-200"
                          >
                            <Copy size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteEntry(entry.id, entry.subject)}
                            title="Delete"
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. CREATE / EDIT TIMETABLE SLOT MODAL (WITH REAL-TIME CONFLICT PREVENTER) */}
      {showEntryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-2xl w-full p-6 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {editingEntryId ? 'Edit Scheduled Timetable Slot' : 'Create New Timetable Entry'}
                </h3>
                <p className="text-xs text-gray-500">
                  Backend conflict detection validates room, faculty, and division availability automatically.
                </p>
              </div>
              <button 
                onClick={() => setShowEntryModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* REAL-TIME CONFLICT ALERT BOX */}
            {formConflicts.length > 0 && (
              <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl space-y-1 text-xs text-rose-900">
                <div className="flex items-center gap-2 font-bold text-rose-800">
                  <AlertTriangle size={16} />
                  <span>Scheduling Conflict Detected ({formConflicts.length})</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-rose-700 font-medium pl-1">
                  {formConflicts.map((c, i) => (
                    <li key={i}>{c.message}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSaveEntry} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Subject Code */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subject Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IT401, PHY201, MAT301"
                    value={formData.subjectCode}
                    onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg font-mono font-bold"
                  />
                </div>

                {/* Subject Title */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subject Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Advanced Operating Systems"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    {DEPARTMENTS_24.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                {/* Program */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Academic Program</label>
                  <select
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    {PROGRAMS_24.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Faculty */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Assign Faculty *</label>
                  <select
                    value={formData.faculty}
                    onChange={(e) => {
                      const selected = FACULTY_10.find(f => f.name === e.target.value);
                      setFormData({ 
                        ...formData, 
                        faculty: e.target.value,
                        facultyEmail: selected?.email || ''
                      });
                    }}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg font-semibold"
                  >
                    {FACULTY_10.map(f => (
                      <option key={f.id} value={f.name}>{f.name} ({f.department})</option>
                    ))}
                  </select>
                </div>

                {/* Room */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Classroom / Lab *</label>
                  <select
                    value={formData.room}
                    onChange={(e) => {
                      const foundRoom = rooms.find(r => r.roomNumber.toLowerCase() === e.target.value.toLowerCase());
                      setFormData({ 
                        ...formData, 
                        room: e.target.value,
                        floor: foundRoom ? foundRoom.floor : formData.floor
                      });
                    }}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg font-bold text-[#003366]"
                  >
                    {rooms.map(r => (
                      <option key={r.id} value={r.roomNumber}>
                        Room {r.roomNumber} ({r.name} • Floor {r.floor === 0 ? 'Ground' : r.floor})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Division & Batch */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Division</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SY B.Sc. IT Div A"
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Batch (Optional)</label>
                  <input
                    type="text"
                    placeholder="Leave empty for all, or B1, B2, B3"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                  />
                </div>

                {/* Day of Week */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Day of Week</label>
                  <select
                    value={formData.day_of_week}
                    onChange={(e) => setFormData({ ...formData, day_of_week: Number(e.target.value) })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg font-bold"
                  >
                    {DAYS.map(d => (
                      <option key={d.num} value={d.num}>{d.name}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Publication Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg font-bold"
                  >
                    <option value="PUBLISHED">Published (Immediately visible)</option>
                    <option value="DRAFT">Draft (Admin review only)</option>
                  </select>
                </div>

                {/* Start Time */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Start Time (24h)</label>
                  <input
                    type="time"
                    required
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg font-mono font-bold"
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">End Time (24h)</label>
                  <input
                    type="time"
                    required
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowEntryModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formConflicts.length > 0}
                  className={`px-5 py-2 rounded-lg font-bold text-white transition-all flex items-center gap-1.5 shadow-xs ${
                    formConflicts.length > 0 
                      ? 'bg-gray-400 cursor-not-allowed opacity-60' 
                      : 'bg-[#003366] hover:bg-blue-900'
                  }`}
                >
                  <Check size={16} />
                  <span>{editingEntryId ? 'Update Slot' : 'Save Timetable Slot'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. ROOM RELOCATION MODAL (ROOM CHANGE WORKFLOW) */}
      {showRelocateModal && relocateEntry && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Relocate Classroom / Lab</h3>
                <p className="text-xs text-gray-500">
                  Updates spatial map assignment and dispatches notification alerts to affected students and faculty.
                </p>
              </div>
              <button onClick={() => setShowRelocateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-xs text-blue-950">
              <div className="font-bold">{relocateEntry.subjectCode} — {relocateEntry.subject}</div>
              <div>Faculty: {relocateEntry.faculty} • Division: {relocateEntry.division}</div>
              <div>Current Location: <span className="font-bold text-rose-700">Room {relocateEntry.room}</span> (Floor {relocateEntry.floor})</div>
              <div>Schedule: {relocateEntry.start_time} - {relocateEntry.end_time}</div>
            </div>

            <form onSubmit={handleConfirmRelocate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">New Target Room *</label>
                <select
                  required
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg font-bold text-[#003366]"
                >
                  <option value="">Select Available Target Room...</option>
                  {rooms.filter(r => r.roomNumber !== relocateEntry.room).map(r => (
                    <option key={r.id} value={r.roomNumber}>
                      Room {r.roomNumber} ({r.name} • Floor {r.floor === 0 ? 'Ground' : r.floor} • Capacity {r.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Reason for Relocation *</label>
                <input
                  type="text"
                  required
                  value={relocateReason}
                  onChange={(e) => setRelocateReason(e.target.value)}
                  placeholder="e.g. Projector maintenance, Air conditioning issue, Capacity expansion"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowRelocateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newRoomNumber}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Send size={14} />
                  <span>Execute Relocation & Notify</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. PUBLISHING WIZARD MODAL */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Publish Timetable Schedules</h3>
              <button onClick={() => setShowPublishModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-600">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <CheckCircle2 size={16} />
                  <span>Ready for Publication</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  There are currently <span className="font-bold">{stats.drafts} draft entries</span> in the scheduling queue. Publishing makes them live to student mobile views, faculty desks, and spatial room monitors.
                </p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1 text-[11px]">
                <div className="font-bold text-gray-800">Target Scope:</div>
                <div>{selectedDivision !== 'ALL' ? `Division: ${selectedDivision}` : 'All 24 Academic Departments & Programs'}</div>
                <div>Academic Year: 2025-2026 (Semester IV)</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 text-xs">
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handlePublishAllDrafts}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
              >
                <Check size={16} />
                <span>Confirm & Publish Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. AUDIT TRAIL MODAL */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-3xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Timetable Change Audit History</h3>
                <p className="text-xs text-gray-500">Immutable ledger recording who changed what, when, and previous values.</p>
              </div>
              <button onClick={() => setShowAuditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
              {auditLogs.length === 0 ? (
                <div className="p-8 text-center text-gray-400">No modifications logged yet.</div>
              ) : (
                auditLogs.map(log => (
                  <div key={log.id} className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.action === 'CREATE' ? 'bg-blue-100 text-blue-900' :
                        log.action === 'ROOM_CHANGE' ? 'bg-amber-100 text-amber-900' :
                        log.action === 'PUBLISH' ? 'bg-emerald-100 text-emerald-900' :
                        log.action === 'DELETE' ? 'bg-rose-100 text-rose-900' : 'bg-purple-100 text-purple-900'
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {new Date(log.timestamp).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="font-semibold text-gray-800">{log.description}</div>
                    <div className="text-[10px] text-gray-500 flex items-center gap-1">
                      <User size={10} />
                      <span>Author: {log.adminEmail}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowAuditModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
