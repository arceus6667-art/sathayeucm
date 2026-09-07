import React, { useState } from 'react';
import { 
  ShieldAlert, Phone, MapPin, HeartPulse, Flame, 
  AlertTriangle, CheckCircle2, Shield, Users, ArrowRight, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CAMPUS_EMERGENCY_CONTACTS } from '../smartCampusData';

export function CampusSafety() {
  const navigate = useNavigate();
  const [isSosActive, setIsSosActive] = useState(false);
  const [sosConfirmed, setSosConfirmed] = useState(false);

  const handleTriggerSos = () => {
    setIsSosActive(true);
  };

  const handleConfirmSos = () => {
    setSosConfirmed(true);
    setTimeout(() => {
      setSosConfirmed(false);
      setIsSosActive(false);
    }, 3500);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Red Alert Safety Banner */}
      <div className="bg-[#8B0000] text-white py-8 border-b-4 border-yellow-500">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-yellow-400 text-xs uppercase font-extrabold tracking-wider mb-1">
                <ShieldAlert size={16} />
                <span>24x7 Sathaye Campus Security & Health Post</span>
              </div>
              <h1 className="text-3xl font-extrabold uppercase tracking-tight">Campus Safety, Health & SOS</h1>
              <p className="text-sm text-red-100 mt-1">
                Emergency response hotlines, evacuation maps, health center support, and women's safety helplines
              </p>
            </div>

            {/* Quick SOS Trigger Button */}
            <button
              onClick={handleTriggerSos}
              className="bg-yellow-400 hover:bg-yellow-500 text-red-950 font-black text-xs uppercase tracking-widest px-6 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-pulse self-start md:self-auto transition-transform active:scale-95"
            >
              <AlertTriangle size={18} />
              <span>TRIGGER CAMPUS SOS</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Emergency Contacts Grid */}
        <div className="mb-10">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#003366] mb-4 flex items-center">
            <Phone size={16} className="mr-2 text-red-600" />
            Direct Campus Emergency Hotlines
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CAMPUS_EMERGENCY_CONTACTS.map((contact, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 flex flex-col justify-between hover:border-red-400 transition-colors"
              >
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                    {contact.available}
                  </span>
                  <h4 className="font-extrabold text-gray-900 text-base mt-2">{contact.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <MapPin size={12} className="mr-1 text-gray-400" />
                    {contact.location}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-black text-red-700">{contact.phone}</span>
                  <a
                    href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                    className="bg-red-50 hover:bg-red-100 text-red-700 p-2 rounded-xl transition-colors"
                    title="Call Now"
                  >
                    <Phone size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Facilities & Evacuation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Medical Center & Health Post */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-[#003366] text-white p-5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center">
                  <HeartPulse size={22} />
                </div>
                <div>
                  <h4 className="font-extrabold text-base">Campus Health & First Aid Center</h4>
                  <p className="text-xs text-blue-200">Main Academic Building • Room G-04 (Ground Floor)</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-3 text-xs text-gray-600">
              <p>
                Equipped with primary first-aid equipment, automated external defibrillator (AED), oxygen cylinders, and dedicated stretchers.
              </p>
              <ul className="space-y-1.5 list-disc list-inside font-medium text-gray-700">
                <li>Resident Doctor & Nurse available Monday to Saturday (08:30 AM - 05:30 PM)</li>
                <li>Free over-the-counter emergency medications for students and staff</li>
                <li>Direct ambulance tie-up with Nanavati Super Speciality Hospital, Vile Parle</li>
              </ul>

              <button
                onClick={() => navigate('/map?target=loc-medical')}
                className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-[#003366] font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center space-x-1.5"
              >
                <MapPin size={15} />
                <span>Show Medical Post on Campus Map</span>
              </button>
            </div>
          </div>

          {/* Fire Safety & Evacuation */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center">
                  <Flame size={22} />
                </div>
                <div>
                  <h4 className="font-extrabold text-base">Fire Safety & Emergency Evacuation</h4>
                  <p className="text-xs text-slate-400">Emergency Assembly Point: Central Quadrangle</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-3 text-xs text-gray-600">
              <p>
                Sathaye College follows national building code safety standards with pressurized stairwells and dual external fire escapes.
              </p>
              <ul className="space-y-1.5 list-disc list-inside font-medium text-gray-700">
                <li>CO2 and ABC dry powder extinguishers placed outside every laboratory & lecture wing</li>
                <li>Illuminated emergency exit route signs with battery backup in all corridors</li>
                <li>Quarterly emergency mock drills conducted in association with Mumbai Fire Brigade</li>
              </ul>

              <button
                onClick={() => navigate('/map?target=loc-room-204')}
                className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center space-x-1.5"
              >
                <MapPin size={15} />
                <span>View Emergency Gathering Assembly Area</span>
              </button>
            </div>
          </div>
        </div>

        {/* Women's Safety & Anti-Ragging */}
        <div className="bg-gradient-to-r from-blue-900 to-[#003366] text-white rounded-2xl p-6 shadow-md border-2 border-yellow-500">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="bg-yellow-400 text-[#003366] text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                Zero Tolerance Policy
              </span>
              <h3 className="text-xl font-extrabold">Women's Development Cell & Anti-Ragging Squad</h3>
              <p className="text-xs text-blue-200 max-w-2xl leading-relaxed">
                Ragging is strictly prohibited on campus under the Maharashtra Prohibition of Ragging Act, 1999. Any incident can be anonymously reported online or directly to the Principal's grievance cell.
              </p>
            </div>

            <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-center shrink-0">
              <span className="text-[10px] text-yellow-300 font-bold uppercase block">Helpline 24x7</span>
              <span className="text-lg font-black tracking-wider block mt-0.5">1800-180-5522</span>
              <span className="text-[10px] text-blue-200">UGC National Anti-Ragging</span>
            </div>
          </div>
        </div>
      </div>

      {/* SOS Trigger Confirmation Modal */}
      {isSosActive && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-4 border-red-600 text-center animate-in fade-in zoom-in-95">
            {sosConfirmed ? (
              <div className="py-6 space-y-3">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto animate-ping">
                  <ShieldAlert size={36} />
                </div>
                <h3 className="text-2xl font-black text-red-700 uppercase tracking-tight">SOS DISPATCHED!</h3>
                <p className="text-xs text-gray-700">
                  Campus Security Desk and resident medical officers have received your simulated emergency distress broadcast.
                </p>
                <p className="text-[11px] font-bold text-gray-500">Security ETA: Under 90 seconds</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle size={36} />
                </div>
                <h3 className="text-xl font-black text-gray-900 uppercase">Emergency Campus SOS</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Are you in immediate physical distress or reporting a serious medical emergency on Sathaye Campus? This will notify Security, Estate Office, and Medical Post.
                </p>

                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => setIsSosActive(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-3 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmSos}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black text-xs py-3 rounded-xl transition-colors shadow-lg"
                  >
                    YES, DISPATCH SOS
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
