import React, { useState } from 'react';
import { 
  Building2, GraduationCap, Calendar, Clock, 
  CheckCircle2, Plus, AlertCircle, Edit, Trash2, 
  Users, Layers, X, Check, Eye
} from 'lucide-react';
import { campusStore, CampusEvent, CampusLocation } from '../../../services/campusStore';

export default function AdminCampusOperations() {
  const [subTab, setSubTab] = useState<'departments' | 'rooms' | 'timetable' | 'events'>('departments');
  const [events, setEvents] = useState<CampusEvent[]>(campusStore.getEvents());
  const [locations, setLocations] = useState<CampusLocation[]>(campusStore.getLocations());

  // New Event Form State
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('2026-09-20');
  const [eventTime, setEventTime] = useState('10:00 AM');
  const [eventVenue, setEventVenue] = useState('Auditorium Hall');
  const [eventCategory, setEventCategory] = useState<'cultural' | 'sports' | 'academic' | 'hackathon' | 'workshop'>('academic');
  const [eventDesc, setEventDesc] = useState('');

  // Department metadata for Sathaye Autonomous
  const departments = [
    { name: 'Computer Science & Information Technology', facultyCount: 22, studentsCount: 680, hod: 'Prof. S. R. Kulkarni', wing: 'East Science Wing' },
    { name: 'Pure & Applied Science (Physics, Chem, Bio)', facultyCount: 48, studentsCount: 1420, hod: 'Dr. M. V. Joshi', wing: 'Science Complex' },
    { name: 'Commerce & Financial Markets', facultyCount: 54, studentsCount: 1840, hod: 'Prof. A. N. Deshpande', wing: 'Main Heritage Block' },
    { name: 'Arts & Mass Media (BAMMC & Psychology)', facultyCount: 36, studentsCount: 920, hod: 'Dr. N. G. Patil', wing: 'South Humanities Annex' },
    { name: 'Management Studies (BMS & BAF)', facultyCount: 25, studentsCount: 380, hod: 'Dr. R. B. Mehta', wing: 'Management Complex' }
  ];

  // Active Timetable Schedules
  const activeSchedules = [
    { period: 'Period 1 (08:00 - 08:50)', subject: 'Distributed Cloud Computing', room: 'IT Lab 1', faculty: 'Prof. Shailesh Kulkarni', batch: 'TY-BSc-IT' },
    { period: 'Period 2 (08:55 - 09:45)', subject: 'Advanced Corporate Accounting', room: 'Room 102', faculty: 'Dr. Anand Deshpande', batch: 'SY-BCom-A' },
    { period: 'Period 3 (09:50 - 10:40)', subject: 'Organic Spectroscopy', room: 'Chemistry Lab', faculty: 'Dr. Meera Joshi', batch: 'MSc-Chem-I' },
    { period: 'Period 4 (11:00 - 11:50)', subject: 'Brand Communication & PR', room: 'Seminar Hall', faculty: 'Prof. Neha Patil', batch: 'TY-BAMMC' },
    { period: 'Period 5 (11:55 - 12:45)', subject: 'Financial Econometrics', room: 'Room 204', faculty: 'Dr. Rajesh Mehta', batch: 'TY-BMS' }
  ];

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle) return;

    campusStore.createEvent({
      title: eventTitle,
      date: eventDate,
      time: eventTime,
      location: eventVenue,
      venue: eventVenue,
      category: eventCategory,
      description: eventDesc || 'Official autonomous college event.',
      registrationOpen: true,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      capacity: 250,
      status: 'APPROVED',
      organizer: 'College Student Council'
    });

    setEvents(campusStore.getEvents());
    setShowEventModal(false);
    setEventTitle('');
    setEventDesc('');
  };

  const handleUpdateEventStatus = (eventId: string, status: CampusEvent['status']) => {
    campusStore.updateEvent(eventId, { status });
    setEvents(campusStore.getEvents());
  };

  const handleToggleRoomStatus = (locId: string, currentStatus: CampusLocation['status']) => {
    const nextStatus = currentStatus === 'available' ? 'occupied' : currentStatus === 'occupied' ? 'maintenance' : 'available';
    campusStore.updateLocation(locId, { status: nextStatus });
    setLocations(campusStore.getLocations());
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner with Sub-tabs */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-[10px] font-bold rounded uppercase tracking-wider">
              Autonomous Governance
            </span>
            <h2 className="text-lg font-bold text-gray-900">Campus Operations Desk</h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Academic departments, active classroom timetables, room status control, and college event approvals
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setSubTab('departments')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              subTab === 'departments' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Departments
          </button>
          <button
            onClick={() => setSubTab('rooms')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              subTab === 'rooms' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Rooms ({locations.length})
          </button>
          <button
            onClick={() => setSubTab('timetable')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              subTab === 'timetable' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Live Timetable
          </button>
          <button
            onClick={() => setSubTab('events')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              subTab === 'events' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Events Calendar ({events.length})
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: DEPARTMENTS */}
      {subTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#003366] flex items-center justify-center font-bold">
                  <GraduationCap size={18} />
                </div>
                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  Autonomous Block
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 leading-snug">{dept.name}</h3>
                <p className="text-[11px] text-gray-500 mt-1">Head of Dept: <strong className="text-gray-800">{dept.hod}</strong></p>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">{dept.wing}</p>
              </div>

              <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <span className="text-[10px] text-gray-400 block">Faculty Members</span>
                  <strong className="text-gray-900">{dept.facultyCount} Professors</strong>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <span className="text-[10px] text-gray-400 block">Enrolled Students</span>
                  <strong className="text-gray-900">{dept.studentsCount} Students</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 2: ROOM MANAGEMENT */}
      {subTab === 'rooms' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between text-xs">
            <span className="font-bold text-gray-700">Room Inventory & Capacity Oversight</span>
            <span className="text-gray-500">{locations.length} total educational rooms</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Room Code & Name</th>
                  <th className="py-3 px-4">Building & Floor</th>
                  <th className="py-3 px-4">Type & Department</th>
                  <th className="py-3 px-4">Seating Capacity</th>
                  <th className="py-3 px-4">Accessibility</th>
                  <th className="py-3 px-4 text-right">Availability Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {locations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] font-bold text-[#003366]">{loc.code}</span>
                      <div className="font-bold text-gray-900">{loc.name}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-gray-800 font-medium">{loc.buildingName}</span>
                      <p className="text-[10px] text-gray-400">Floor {loc.floorNumber}</p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 bg-gray-100 rounded text-[10px] font-semibold">
                        {loc.type}
                      </span>
                      <p className="text-[10px] text-gray-500 mt-0.5">{loc.department || 'General'}</p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-gray-800">{loc.capacity} seats</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        loc.isAccessible ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {loc.isAccessible ? 'Wheelchair Ready' : 'Stairs Only'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleRoomStatus(loc.id, loc.status)}
                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                          loc.status === 'available'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : loc.status === 'occupied'
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                            : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {loc.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: TIMETABLE & ACTIVE CLASSES */}
      {subTab === 'timetable' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Active Classroom Timetable & Lectures (Today)</h3>
              <p className="text-[11px] text-gray-500">Live lecture monitoring across academic lecture blocks</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-md">
              42 Concurrent Sessions
            </span>
          </div>

          <div className="space-y-3">
            {activeSchedules.map((sched, idx) => (
              <div key={idx} className="p-3.5 bg-gray-50 rounded-lg border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded border border-gray-200 text-center font-mono text-[11px] font-bold text-[#003366]">
                    <Clock size={14} className="mx-auto mb-0.5 text-gray-400" />
                    <span>{sched.period.split(' ')[0]}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{sched.subject}</h4>
                    <p className="text-[11px] text-gray-600 mt-0.5">Faculty: <strong className="text-gray-800">{sched.faculty}</strong> • Batch: <span className="font-mono text-blue-900 font-semibold">{sched.batch}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-900 rounded font-mono font-bold text-[11px]">
                      {sched.room}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">Session Live</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: EVENT MANAGEMENT */}
      {subTab === 'events' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between text-xs">
            <div>
              <h3 className="font-bold text-gray-900">Campus Events Approval Desk</h3>
              <p className="text-gray-500 text-[11px]">Review, sanction venues, or cancel college fests and workshops</p>
            </div>
            <button
              onClick={() => setShowEventModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#003366] hover:bg-blue-900 text-white rounded-lg font-bold"
            >
              <Plus size={14} />
              <span>Create Event</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((ev) => (
              <div key={ev.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-bold uppercase">
                    {ev.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ev.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {ev.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-900">{ev.title}</h4>
                  <p className="text-[11px] text-gray-600 mt-1 line-clamp-2">{ev.description}</p>
                </div>

                <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <strong className="text-gray-800">{ev.date} at {ev.time}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Venue:</span>
                    <strong className="text-gray-800">{ev.venue}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Registrations:</span>
                    <strong className="text-blue-900">{ev.registeredCount} / {ev.capacity}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  {ev.status === 'PENDING' ? (
                    <button
                      onClick={() => handleUpdateEventStatus(ev.id, 'APPROVED')}
                      className="w-full py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold"
                    >
                      Approve Event
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateEventStatus(ev.id, 'CANCELLED')}
                      className="text-red-600 hover:underline font-bold text-[11px]"
                    >
                      Cancel Event
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-200 animate-in fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Schedule Campus Event</h3>
              <button onClick={() => setShowEventModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Utsav 2026 - Annual Cultural Fest"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Venue</label>
                  <input
                    type="text"
                    value={eventVenue}
                    onChange={(e) => setEventVenue(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white"
                  >
                    <option value="cultural">Cultural Fest</option>
                    <option value="hackathon">Hackathon / Tech</option>
                    <option value="sports">Sports Tournament</option>
                    <option value="workshop">Academic Workshop</option>
                    <option value="academic">Academic Seminar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description & Guidelines</label>
                <textarea
                  rows={3}
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white resize-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#003366] hover:bg-blue-900 text-white rounded-lg font-bold shadow-xs"
                >
                  Sanction & Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
