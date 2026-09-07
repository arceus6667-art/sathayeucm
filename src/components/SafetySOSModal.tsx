import { useState, useEffect } from 'react';
import { AlertTriangle, Phone, ShieldAlert, MapPin, X, Check, ArrowRight, HeartPulse, Flame } from 'lucide-react';
import { EMERGENCY_CONTACTS, campusStore } from '../services/campusStore';
import { Link } from 'react-router-dom';

interface SafetySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SafetySOSModal({ isOpen, onClose }: SafetySOSModalProps) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [dispatched, setDispatched] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Room 204 (Main Building, 2nd Floor)');
  const [geoCoordinates, setGeoCoordinates] = useState<string | null>('19.1028° N, 72.8459° E (Sathaye Campus)');
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          setGeoCoordinates(`${lat}° N, ${lng}° E`);
          setIsLocating(false);
        },
        () => {
          // Default to Sathaye College Vile Parle coordinates
          setGeoCoordinates('19.1028° N, 72.8459° E (Sathaye Vile Parle East)');
          setIsLocating(false);
        },
        { timeout: 5000 }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setDispatched(true);
      setCountdown(null);
      // Register in campus notifications with exact geo-coordinates
      campusStore.addNotification({
        title: '🚨 EMERGENCY SOS DISPATCHED WITH GPS',
        message: `Security & Medical team alerted! Location: ${selectedLocation} | Coordinates: ${geoCoordinates || '19.1028° N, 72.8459° E'}`,
        type: 'emergency',
        targetRole: 'ALL'
      });
    }
    return () => clearTimeout(timer);
  }, [countdown, selectedLocation, geoCoordinates]);

  if (!isOpen) return null;

  const startCountdown = () => {
    setDispatched(false);
    setCountdown(3);
  };

  const cancelCountdown = () => {
    setCountdown(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border-2 border-red-500 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-red-600 text-white p-5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-full animate-pulse">
              <ShieldAlert size={26} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold uppercase tracking-wide">Campus Safety & SOS</h2>
              <p className="text-xs text-red-100">Sathaye College Emergency Response System</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Main SOS Trigger */}
          <div className="text-center bg-red-50 p-6 rounded-xl border border-red-200">
            {dispatched ? (
              <div className="space-y-3 animate-in fade-in">
                <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Check size={36} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Emergency Alert Dispatched!</h3>
                <p className="text-sm text-gray-600">
                  Campus Security & Duty Medical Officer have been notified with your location ({selectedLocation}). Keep your phone line clear.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => setDispatched(false)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-lg uppercase tracking-wider"
                  >
                    Reset Alert
                  </button>
                </div>
              </div>
            ) : countdown !== null ? (
              <div className="space-y-3">
                <p className="text-sm font-bold text-red-700 uppercase tracking-wider">Sending Emergency Signal In</p>
                <div className="text-6xl font-black text-red-600 animate-ping">{countdown}</div>
                <button 
                  onClick={cancelCountdown}
                  className="px-6 py-2 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-lg uppercase tracking-wider shadow"
                >
                  Abort Alert
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-red-700 font-bold uppercase tracking-wider mb-1">One-Touch Security Broadcast</p>
                  <p className="text-xs text-gray-600">Press button below in case of immediate danger, medical crisis, or ragging.</p>
                </div>
                <button
                  onClick={startCountdown}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold text-lg uppercase tracking-widest shadow-lg shadow-red-600/30 transition-all transform active:scale-95 flex items-center justify-center space-x-2"
                >
                  <AlertTriangle size={24} />
                  <span>TRIGGER CAMPUS SOS</span>
                </button>
                <div className="flex flex-col items-center justify-center text-xs text-gray-500 space-y-1">
                  <div className="flex items-center space-x-1">
                    <MapPin size={14} className="text-red-500" />
                    <span>Current: <strong>{selectedLocation}</strong></span>
                  </div>
                  {geoCoordinates && (
                    <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      🛰️ GPS: {geoCoordinates}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Speed Dial Emergency Directory */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Direct Speed-Dial Helplines</h3>
            <div className="space-y-2">
              {EMERGENCY_CONTACTS.map((c) => (
                <a
                  key={c.id}
                  href={`tel:${c.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-[#003366] hover:bg-blue-50/50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 group-hover:bg-[#003366] group-hover:text-white transition-colors">
                      {c.id === 'sos-med' ? <HeartPulse size={18} /> : c.id === 'sos-fire' ? <Flame size={18} /> : <Phone size={18} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#003366] leading-tight">{c.title}</h4>
                      <p className="text-xs text-gray-500">{c.dept} • {c.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-red-600 group-hover:text-[#003366] block">{c.phone}</span>
                    <span className="text-[10px] text-green-700 font-bold bg-green-100 px-1.5 py-0.5 rounded">24x7</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Evacuation & Medical Links */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link
              to="/map?target=loc-medical-room"
              onClick={onClose}
              className="p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 text-center block transition-colors group"
            >
              <HeartPulse size={20} className="mx-auto text-red-600 mb-1" />
              <p className="text-xs font-bold text-gray-900 group-hover:text-[#003366]">Medical Room Route</p>
              <p className="text-[10px] text-gray-500">Ground Floor Wing</p>
            </Link>

            <Link
              to="/map?target=loc-washroom-accessible"
              onClick={onClose}
              className="p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 text-center block transition-colors group"
            >
              <MapPin size={20} className="mx-auto text-blue-600 mb-1" />
              <p className="text-xs font-bold text-gray-900 group-hover:text-[#003366]">Assembly Point</p>
              <p className="text-[10px] text-gray-500">Central Quadrangle</p>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
