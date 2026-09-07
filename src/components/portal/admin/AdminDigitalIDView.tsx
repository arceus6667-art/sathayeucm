import React, { useState } from 'react';
import { 
  QrCode, ShieldCheck, ShieldAlert, CheckCircle2, 
  XCircle, Scan, User, GraduationCap, Building2, Check, RefreshCw
} from 'lucide-react';
import { campusStore, DigitalCampusID } from '../../../services/campusStore';

export default function AdminDigitalIDView() {
  const [tokenInput, setTokenInput] = useState('SAT-QR-0412-2026-TOKEN');
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    digitalId?: DigitalCampusID;
    message: string;
  } | null>(null);

  const sampleTokens = [
    { label: 'Rohan Sharma (Student)', token: 'SAT-QR-0412-2026-TOKEN' },
    { label: 'Prof. Shailesh Kulkarni (Faculty)', token: 'SAT-QR-FAC-01-TOKEN' },
    { label: 'Priya Iyer (Student)', token: 'SAT-QR-1190-2026-TOKEN' },
    { label: 'Expired / Forged Badge Test', token: 'SAT-QR-FORGED-BADGE' },
  ];

  const handleVerify = (tToVerify?: string) => {
    const token = tToVerify || tokenInput;
    const res = campusStore.verifyDigitalId(token);
    setVerificationResult(res);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-[10px] font-bold rounded uppercase tracking-wider">
              Cryptographic Credential System
            </span>
            <h2 className="text-lg font-bold text-gray-900">Digital Campus ID & Gate Verification Scanner</h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Validate physical turnstile entry tokens, library circulation rights, and restricted lab privileges
          </p>
        </div>

        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-emerald-200">
          <ShieldCheck size={14} />
          <span>PKI Public Key Active</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: QR Verification Scanner Console */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Turnstile Scanner & Access Validator</h3>
            <p className="text-[11px] text-gray-500">Scan QR token or test with pre-registered student/faculty badges</p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-700">Scan QR Token / Badge Hash</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Enter QR token hash..."
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono focus:bg-white focus:outline-none"
              />
              <button
                onClick={() => handleVerify()}
                className="px-5 py-2 bg-[#003366] hover:bg-blue-900 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Scan size={14} />
                <span>Verify Badge</span>
              </button>
            </div>
          </div>

          {/* Quick Demo Token Buttons */}
          <div className="space-y-2 pt-1">
            <span className="text-[10px] font-bold uppercase text-gray-400 block">Quick Demo Tokens</span>
            <div className="flex flex-wrap gap-2">
              {sampleTokens.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTokenInput(item.token);
                    handleVerify(item.token);
                  }}
                  className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors text-left"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Verification Result Output */}
          {verificationResult && (
            <div className={`p-5 rounded-xl border transition-all ${
              verificationResult.valid 
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950' 
                : 'bg-red-50/70 border-red-300 text-red-950'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {verificationResult.valid ? (
                    <CheckCircle2 size={24} className="text-emerald-600" />
                  ) : (
                    <XCircle size={24} className="text-red-600" />
                  )}
                  <div>
                    <h4 className="text-sm font-extrabold uppercase tracking-wide">
                      {verificationResult.valid ? 'IDENTITY AUTHENTICATED' : 'ACCESS DENIED / INVALID CREDENTIAL'}
                    </h4>
                    <p className="text-xs opacity-90">{verificationResult.message}</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/80 font-bold">
                  {verificationResult.valid ? 'PASS' : 'FAIL'}
                </span>
              </div>

              {verificationResult.valid && verificationResult.digitalId && (
                <div className="mt-4 pt-4 border-t border-emerald-200/60 space-y-3 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="bg-white/80 p-2 rounded-lg">
                      <span className="text-[10px] text-gray-500 block">Name</span>
                      <strong className="text-gray-900">{verificationResult.digitalId.name}</strong>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg">
                      <span className="text-[10px] text-gray-500 block">Role</span>
                      <strong className="text-gray-900 uppercase">{verificationResult.digitalId.role}</strong>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg">
                      <span className="text-[10px] text-gray-500 block">PRN / ID</span>
                      <strong className="text-gray-900 font-mono">{verificationResult.digitalId.prn}</strong>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg">
                      <span className="text-[10px] text-gray-500 block">Validity</span>
                      <strong className="text-emerald-700">{verificationResult.digitalId.validThrough}</strong>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-gray-600 uppercase block mb-1.5">
                      Sector Access Verification Matrix
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="p-2 bg-white/80 rounded-lg text-center">
                        <span className="text-[10px] text-gray-500 block">Campus Turnstiles</span>
                        <strong className="text-emerald-700 text-xs">AUTHORIZED</strong>
                      </div>
                      <div className="p-2 bg-white/80 rounded-lg text-center">
                        <span className="text-[10px] text-gray-500 block">Central Library</span>
                        <strong className={verificationResult.digitalId.permissions.libraryAccess ? 'text-emerald-700 text-xs' : 'text-red-600 text-xs'}>
                          {verificationResult.digitalId.permissions.libraryAccess ? 'AUTHORIZED' : 'RESTRICTED'}
                        </strong>
                      </div>
                      <div className="p-2 bg-white/80 rounded-lg text-center">
                        <span className="text-[10px] text-gray-500 block">Science & IT Labs</span>
                        <strong className={verificationResult.digitalId.permissions.labAccess ? 'text-emerald-700 text-xs' : 'text-red-600 text-xs'}>
                          {verificationResult.digitalId.permissions.labAccess ? 'AUTHORIZED' : 'RESTRICTED'}
                        </strong>
                      </div>
                      <div className="p-2 bg-white/80 rounded-lg text-center">
                        <span className="text-[10px] text-gray-500 block">Event & Sports Grounds</span>
                        <strong className={verificationResult.digitalId.permissions.eventsAccess ? 'text-emerald-700 text-xs' : 'text-red-600 text-xs'}>
                          {verificationResult.digitalId.permissions.eventsAccess ? 'AUTHORIZED' : 'RESTRICTED'}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Physical Digital ID Badge Visual Preview */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
          <div className="pb-2 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Smart Sathey Autonomous ID Badge
            </h3>
            <p className="text-[10px] text-gray-500">Standard card format issued to students & faculty</p>
          </div>

          {/* Card Mockup */}
          <div className="bg-gradient-to-br from-[#003366] via-blue-900 to-indigo-950 text-white rounded-2xl p-5 shadow-lg border border-blue-400/30 space-y-4 relative overflow-hidden">
            {/* Hologram Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-blue-700/50 pb-3">
              <div>
                <span className="text-[9px] font-bold text-yellow-400 uppercase tracking-wider block">
                  Sathaye College (Autonomous)
                </span>
                <span className="text-[11px] font-extrabold text-white">Vile Parle East, Mumbai</span>
              </div>
              <div className="w-7 h-7 rounded-md bg-yellow-500 text-[#003366] flex items-center justify-center font-black text-xs">
                SC
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-blue-100 text-[#003366] flex items-center justify-center font-extrabold text-xl shadow-inner shrink-0">
                {verificationResult?.digitalId?.name ? verificationResult.digitalId.name.slice(0, 2) : 'RS'}
              </div>
              <div className="min-w-0">
                <span className="text-[9px] text-blue-200 uppercase tracking-wider font-bold">
                  {verificationResult?.digitalId?.role || 'STUDENT'}
                </span>
                <h4 className="text-sm font-extrabold text-white line-clamp-1">
                  {verificationResult?.digitalId?.name || 'Rohan Sharma'}
                </h4>
                <p className="text-[10px] text-blue-200 line-clamp-1">
                  {verificationResult?.digitalId?.department || 'Information Technology'}
                </p>
                <span className="text-[10px] font-mono text-yellow-300 font-bold block mt-0.5">
                  PRN: {verificationResult?.digitalId?.prn || 'sathey.2026.0412'}
                </span>
              </div>
            </div>

            {/* QR Code Simulation */}
            <div className="bg-white p-3 rounded-xl flex items-center justify-between text-[#003366]">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-gray-500 block">SECURE QR SIGNATURE</span>
                <span className="text-[10px] font-bold text-[#003366]">VALID THRU: JUNE 2027</span>
                <span className="text-[8px] text-gray-400 block font-mono">SHA-256 ENCRYPTED</span>
              </div>
              <div className="p-1 bg-white border border-gray-200 rounded">
                <QrCode size={40} className="text-gray-900" />
              </div>
            </div>

            <div className="flex items-center justify-between text-[9px] text-blue-300 pt-1 border-t border-blue-800/60 font-mono">
              <span>CARD CHIP ID: 9812-4412</span>
              <span>EMERGENCY: +91 22 2618 3614</span>
            </div>
          </div>

          <div className="text-[11px] text-gray-500 space-y-1 pt-1">
            <p>• Turnstile tap initiates millisecond cryptographic handshake.</p>
            <p>• Revocable instantly from the user management directory.</p>
          </div>
        </div>

      </div>

    </div>
  );
}
