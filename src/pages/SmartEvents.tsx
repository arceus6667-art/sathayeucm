import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Users, QrCode, Sparkles, Filter, 
  CheckCircle2, ArrowRight, Share2, Tag, ChevronRight, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SmartCampusStore } from '../smartCampusStore';
import { SmartEvent } from '../smartCampusData';

export function SmartEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<SmartEvent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEventForQr, setSelectedEventForQr] = useState<SmartEvent | null>(null);

  const loadEvents = () => {
    setEvents(SmartCampusStore.getEvents());
  };

  useEffect(() => {
    loadEvents();
    const handleUpdate = (e: any) => {
      if (e.detail?.key?.includes('events')) {
        loadEvents();
      }
    };
    window.addEventListener('sathaye_store_updated', handleUpdate);
    return () => window.removeEventListener('sathaye_store_updated', handleUpdate);
  }, []);

  const handleRegister = (eventId: string) => {
    SmartCampusStore.toggleEventRegistration(eventId);
    loadEvents();
  };

  const filteredEvents = events.filter(evt => {
    if (selectedCategory === 'All') return true;
    return evt.category === selectedCategory;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Banner */}
      <div className="bg-[#003366] text-white py-8 border-b-4 border-yellow-500">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-yellow-400 text-xs uppercase font-extrabold tracking-wider mb-1">
                <Calendar size={16} />
                <span>What's Happening at Sathaye College</span>
              </div>
              <h1 className="text-3xl font-extrabold uppercase tracking-tight">Campus Events & Registrations</h1>
              <p className="text-sm text-blue-200 mt-1">
                Annual cultural fests, 24-hr hackathons, tech bootcamps, and inter-collegiate championships
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 mb-6">
          {['All', 'Cultural', 'Hackathon', 'Workshop', 'Sports'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#003366] text-white shadow'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredEvents.map(evt => {
            const pct = Math.round((evt.registeredCount / evt.capacity) * 100);

            return (
              <div
                key={evt.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="h-52 relative overflow-hidden bg-gray-100">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  <span className="absolute top-3 left-3 bg-yellow-500 text-[#003366] text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider shadow">
                    {evt.category}
                  </span>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-xs font-bold text-yellow-300 block mb-0.5">{evt.date} • {evt.time}</span>
                    <h3 className="text-lg font-extrabold leading-snug drop-shadow">{evt.title}</h3>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center text-xs text-gray-600 mb-2">
                      <MapPin size={14} className="mr-1 text-red-500 shrink-0" />
                      <span className="font-semibold">{evt.venue}</span>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed mb-4">
                      {evt.description}
                    </p>

                    <div className="text-xs text-gray-500 mb-2 flex justify-between items-center">
                      <span>Organizer: <strong className="text-gray-800">{evt.organizer}</strong></span>
                      <span className="font-bold text-gray-700">{evt.registeredCount} / {evt.capacity} Registered</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 transition-all duration-500"
                        style={{ width: `${Math.min(100, pct)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => navigate(`/map?target=${evt.locationId}`)}
                      className="text-[#003366] hover:text-blue-800 text-xs font-bold uppercase tracking-wider flex items-center"
                    >
                      <MapPin size={14} className="mr-1" />
                      <span>Navigate to Venue</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      {evt.isRegistered && (
                        <button
                          onClick={() => setSelectedEventForQr(evt)}
                          className="bg-blue-50 text-[#003366] hover:bg-blue-100 font-bold text-xs px-3 py-2 rounded-xl border border-blue-200 flex items-center space-x-1"
                        >
                          <QrCode size={14} />
                          <span>QR Pass</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleRegister(evt.id)}
                        className={`font-bold text-xs px-4 py-2 rounded-xl transition-all shadow ${
                          evt.isRegistered
                            ? 'bg-emerald-600 hover:bg-red-600 text-white'
                            : 'bg-[#003366] hover:bg-blue-900 text-yellow-400'
                        }`}
                      >
                        {evt.isRegistered ? 'Registered ✓ (Click to Cancel)' : 'Register Now'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Code Pass Modal */}
      {selectedEventForQr && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border-2 border-yellow-500 text-center animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] uppercase font-extrabold text-[#003366] bg-blue-50 px-2 py-0.5 rounded">
                Official Campus Entry Pass
              </span>
              <button onClick={() => setSelectedEventForQr(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <h3 className="font-extrabold text-base text-gray-900 leading-tight">
              {selectedEventForQr.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {selectedEventForQr.date} • {selectedEventForQr.venue}
            </p>

            <div className="my-6 p-4 bg-gray-50 rounded-2xl border border-gray-200 inline-block">
              <div className="w-44 h-44 bg-white p-3 rounded-xl border border-gray-200 flex flex-col items-center justify-center shadow-inner">
                <QrCode size={120} className="text-[#003366]" />
                <span className="text-[9px] font-mono text-gray-400 mt-2">
                  {selectedEventForQr.qrCode || 'SATHAYE-EVT-PASS'}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-5">
              Show this QR code at the registration desk for instant entry.
            </p>

            <button
              onClick={() => setSelectedEventForQr(null)}
              className="w-full bg-[#003366] text-yellow-400 font-bold text-xs py-2.5 rounded-xl shadow"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
