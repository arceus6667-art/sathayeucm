import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Users, Clock, Tag, Check, 
  Sparkles, Navigation, ArrowRight, Share2, Ticket, QrCode
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CampusEvent, campusStore } from '../services/campusStore';

export default function Events() {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(new Set());
  const [activePassEvent, setActivePassEvent] = useState<CampusEvent | null>(null);

  useEffect(() => {
    const update = () => {
      setEvents(campusStore.getCampusEvents());
    };
    update();
    return campusStore.subscribe(update);
  }, []);

  const categories = ['All', 'Cultural', 'Technical', 'Academic', 'Sports', 'Workshop'];

  const filteredEvents = events.filter(ev => {
    if (selectedCategory === 'All') return true;
    return ev.category === selectedCategory;
  });

  const handleRegister = (event: CampusEvent) => {
    const success = campusStore.registerForEvent(event.id);
    if (success) {
      setRegisteredEventIds(prev => new Set(prev).add(event.id));
      setActivePassEvent(event);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-16">
      
      {/* Banner */}
      <div className="bg-[#003366] text-white py-8 border-b-4 border-yellow-500 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="bg-yellow-500 text-[#003366] text-xs font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                Campus Pulse
              </span>
              <span className="text-xs text-blue-200">Autonomous Fests, Hackathons & Seminars</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight">
              Smart Events & Cultural Fests
            </h1>
            <p className="text-xs md:text-sm text-gray-300 mt-1">
              One-click registrations, dynamic venue wayfinding, and digital student entry passes.
            </p>
          </div>

          <div className="flex space-x-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                  selectedCategory === cat
                    ? 'bg-yellow-500 text-[#003366] shadow'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((ev) => {
            const isRegistered = registeredEventIds.has(ev.id);
            return (
              <div
                key={ev.id}
                className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden hover:border-[#003366] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img src={ev.image} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-3 left-3 bg-[#003366]/90 text-yellow-400 text-xs font-bold px-2.5 py-1 rounded backdrop-blur-xs uppercase tracking-wider">
                      {ev.category}
                    </span>
                    <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded backdrop-blur-xs flex items-center">
                      <Users size={12} className="mr-1 text-yellow-400" /> {ev.registeredCount} / {ev.capacity} Joined
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-gray-500">
                      <Calendar size={14} className="text-[#003366]" />
                      <span>{ev.date}</span>
                      <span>•</span>
                      <Clock size={14} className="text-[#003366]" />
                      <span>{ev.time}</span>
                    </div>

                    <h3 className="font-extrabold text-gray-900 text-lg leading-snug">{ev.title}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{ev.description}</p>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-gray-500">Venue:</span>
                      <Link
                        to={`/map?target=${ev.venueLocationId}`}
                        className="font-bold text-[#003366] hover:underline flex items-center"
                      >
                        <MapPin size={12} className="mr-1 text-red-500" /> {ev.venueName}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-gray-100 mt-2">
                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400 font-medium">Host: {ev.department}</span>

                    {isRegistered ? (
                      <button
                        onClick={() => setActivePassEvent(ev)}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors shadow-xs flex items-center"
                      >
                        <Ticket size={14} className="mr-1.5" /> View Pass
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegister(ev)}
                        className="bg-[#003366] hover:bg-blue-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors shadow-xs flex items-center"
                      >
                        <span>Register Free</span>
                        <ArrowRight size={14} className="ml-1" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Digital Event Pass Modal */}
      {activePassEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border-2 border-yellow-500 animate-in zoom-in-95">
            
            {/* Pass Header */}
            <div className="bg-[#003366] text-white p-5 text-center relative">
              <h3 className="font-extrabold text-lg uppercase tracking-wider text-yellow-400">Digital Entry Pass</h3>
              <p className="text-xs text-blue-200">Sathaye College Campus Event</p>
            </div>

            <div className="p-6 space-y-4 text-center">
              <div>
                <h4 className="font-extrabold text-gray-900 text-base">{activePassEvent.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{activePassEvent.date} • {activePassEvent.time}</p>
                <p className="text-xs font-bold text-[#003366] mt-1">{activePassEvent.venueName}</p>
              </div>

              {/* Simulated QR Code */}
              <div className="w-36 h-36 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl mx-auto flex flex-col items-center justify-center p-3">
                <QrCode size={90} className="text-[#003366]" />
                <span className="text-[9px] font-bold text-gray-400 uppercase mt-1">Scan at Auditorium Gate</span>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-xs text-yellow-900 text-left">
                <p className="font-bold">Student: Aarav Mehta (B.Sc. IT)</p>
                <p className="text-[11px] text-gray-600">ID: DEMO-STU-2026-001 • Pass Validated</p>
              </div>

              <div className="flex space-x-2 pt-2">
                <Link
                  to={`/map?target=${activePassEvent.venueLocationId}`}
                  onClick={() => setActivePassEvent(null)}
                  className="flex-1 py-2.5 bg-[#003366] text-white rounded-lg font-bold text-xs uppercase tracking-wider text-center"
                >
                  Venue Route
                </Link>
                <button
                  onClick={() => setActivePassEvent(null)}
                  className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-bold text-xs uppercase"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
