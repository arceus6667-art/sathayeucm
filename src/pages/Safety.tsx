import React, { useState } from 'react';
import { 
  ShieldAlert, Phone, HeartPulse, Flame, MapPin, 
  CheckCircle2, AlertTriangle, FileText, ChevronRight, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { EMERGENCY_CONTACTS } from '../services/campusStore';
import SafetySOSModal from '../components/SafetySOSModal';
import CCTVAnomalyDetector from '../components/safety/CCTVAnomalyDetector';

export default function Safety() {
  const [isSosOpen, setIsSosOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-16">
      
      {/* Banner */}
      <div className="bg-red-700 text-white py-8 border-b-4 border-yellow-500 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="bg-yellow-400 text-red-900 text-xs font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                24x7 Campus Security
              </span>
              <span className="text-xs text-red-100">Disaster Management & Zero-Tolerance Anti-Ragging</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight">
              Safety, Medical & SOS Hub
            </h1>
            <p className="text-xs md:text-sm text-red-100 mt-1">
              Immediate response protocols, resident physician access, and verified evacuation waypoints.
            </p>
          </div>

          <button
            onClick={() => setIsSosOpen(true)}
            className="bg-white text-red-700 hover:bg-red-50 font-black text-sm uppercase px-6 py-3 rounded-xl transition-all shadow-lg flex items-center space-x-2 border-2 border-red-200"
          >
            <ShieldAlert size={20} className="animate-pulse text-red-600" />
            <span>OPEN EMERGENCY SOS</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Real-time CCTV AI Anomaly Detection Hub */}
        <CCTVAnomalyDetector />

        {/* Speed-dial Helplines */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-extrabold text-[#003366] uppercase tracking-wide text-base mb-4 flex items-center">
            <Phone size={18} className="mr-2 text-red-600" /> 24/7 Dedicated Campus Helplines
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EMERGENCY_CONTACTS.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl border border-gray-200 hover:border-red-500 transition-colors bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{c.title}</h4>
                  <p className="text-xs text-gray-500">{c.dept}</p>
                  <span className="text-xs font-extrabold text-red-600 block mt-1">{c.phone}</span>
                </div>
                <a
                  href={`tel:${c.phone.replace(/[^0-9+]/g, '')}`}
                  className="w-10 h-10 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center shrink-0"
                >
                  <Phone size={18} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Evacuation and Assembly Point Map Navigators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-3">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-xl flex items-center justify-center">
              <MapPin size={24} />
            </div>
            <h4 className="font-bold text-gray-900 text-base">Designated Assembly Zone</h4>
            <p className="text-xs text-gray-600">Central Quadrangle open lawn area. Capacity: 3,000 students during drills.</p>
            <Link
              to="/map?target=loc-washroom-accessible"
              className="inline-flex items-center text-xs font-bold text-[#003366] hover:underline"
            >
              <span>View On Campus Map</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-3">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
              <HeartPulse size={24} />
            </div>
            <h4 className="font-bold text-gray-900 text-base">Health & First Aid Center</h4>
            <p className="text-xs text-gray-600">Ground floor next to Admin office. Full-time nurse and oxygen concentrator on site.</p>
            <Link
              to="/map?target=loc-medical-room"
              className="inline-flex items-center text-xs font-bold text-[#003366] hover:underline"
            >
              <span>View Clinic Route</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-3">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-800 rounded-xl flex items-center justify-center">
              <Flame size={24} />
            </div>
            <h4 className="font-bold text-gray-900 text-base">Fire Safety Extinguishers</h4>
            <p className="text-xs text-gray-600">ABC-dry powder and CO2 fire canisters installed beside every staircase landing on floors 0-4.</p>
            <Link
              to="/map"
              className="inline-flex items-center text-xs font-bold text-[#003366] hover:underline"
            >
              <span>Safety Blueprint</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Anti-Ragging Guidelines & Internal Complaints Committee */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <ShieldCheck size={26} className="text-green-600" />
            <div>
              <h3 className="font-extrabold text-[#003366] uppercase tracking-wide text-base">
                Zero Tolerance Anti-Ragging & Women's Safety Cell
              </h3>
              <p className="text-xs text-gray-500">UGC Regulations & Maharashtra Prohibition of Ragging Act</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
              <h5 className="font-bold text-gray-900">Anti-Ragging Squad (Autonomous)</h5>
              <p>Comprises senior faculty members, police liaison officer, and student welfare representatives.</p>
              <p className="font-bold text-red-600">Confidential Email: antiragging@sathaye.edu.in</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
              <h5 className="font-bold text-gray-900">Internal Complaints Committee (ICC)</h5>
              <p>Provides redressal mechanism against gender harassment with strictly protected identities.</p>
              <p className="font-bold text-red-600">Helpline: +91-22-2614-2200 (Ext. 104)</p>
            </div>
          </div>
        </div>

      </div>

      <SafetySOSModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
    </div>
  );
}
