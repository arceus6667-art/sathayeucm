import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, Award, FileCheck, CheckCircle2, 
  AlertTriangle, Copy, Download, QrCode, Search, ExternalLink, 
  ArrowLeft, Key, Layers, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  merkleVaultService, VerifiableCredential, MerkleTreeEngine 
} from '../services/merkleVault';
import { campusStore } from '../services/campusStore';

export default function CredentialVault() {
  const currentUser = campusStore.getCurrentUser();
  const credentials = merkleVaultService.getCredentialsForStudent(currentUser?.id || 'usr-student-1');
  const publishedRoot = merkleVaultService.publishedCollegeRoot;

  // Selected Credential for detailed inspect modal
  const [selectedCred, setSelectedCred] = useState<VerifiableCredential | null>(credentials[0] || null);

  // Verification Input
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<{
    tested: boolean;
    isValid: boolean;
    credential?: VerifiableCredential;
    reason: string;
  } | null>(null);

  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2500);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyInput.trim()) return;

    const res = merkleVaultService.verifyCredentialHash(verifyInput.trim());
    setVerifyResult({
      tested: true,
      isValid: res.isValid,
      credential: res.credential,
      reason: res.reason
    });
  };

  const downloadJsonCredential = (cred: VerifiableCredential) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cred, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sathaye-credential-${cred.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-16">
      
      {/* Header Banner */}
      <div className="bg-[#003366] text-white py-6 border-b-4 border-yellow-500 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Link to="/portal" className="text-yellow-400 hover:text-yellow-300 text-xs font-bold flex items-center">
                  <ArrowLeft size={13} className="mr-1" /> Back to Portal
                </Link>
                <span className="text-blue-300 text-xs">•</span>
                <span className="text-xs text-blue-200">Cryptographic Proofs & Verifiable Credentials</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight">
                Blockchain-Based Credential Vault
              </h1>
              <p className="text-xs md:text-sm text-blue-200 mt-1">
                Tamper-proof academic degrees, marksheet logs, and 75%+ attendance records anchored to Sathaye College's cryptographic Merkle Tree.
              </p>
            </div>

            {/* Published Merkle Root Badge */}
            <div className="bg-[#002244] p-3 rounded-xl border border-yellow-500/40 shrink-0 text-left max-w-sm">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-yellow-400">
                <span className="flex items-center"><Lock size={12} className="mr-1" /> Published College Merkle Root</span>
                <span className="text-emerald-400">LIVE</span>
              </div>
              <div className="font-mono text-[10px] text-gray-300 truncate mt-1 bg-black/40 p-1.5 rounded">
                {publishedRoot}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* PUBLIC VERIFICATION BAR */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5">
          <div className="max-w-3xl">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#003366] flex items-center">
              <ShieldCheck size={16} className="mr-2 text-emerald-600" />
              Instant Public Credential Verifier (For Recruiters & Universities)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Paste any student leaf hash, signature, or credential ID to mathematically verify authenticity against the Sathaye College Published Merkle Root. Zero intermediary calls needed.
            </p>

            <form onSubmit={handleVerify} className="mt-3 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Paste Credential ID (e.g. cred-deg-01) or Leaf Hash (0x...)"
                  value={verifyInput}
                  onChange={e => setVerifyInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl font-mono focus:border-[#003366] focus:outline-hidden"
                />
              </div>
              <button
                type="submit"
                className="bg-[#003366] hover:bg-blue-900 text-yellow-400 font-extrabold text-xs uppercase px-5 py-2 rounded-xl transition-all shadow-xs flex items-center justify-center shrink-0"
              >
                Verify Against Root
              </button>
            </form>

            {/* Verification Result Feedback */}
            {verifyResult && (
              <div className={`mt-3 p-4 rounded-xl border text-xs ${
                verifyResult.isValid
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}>
                <div className="flex items-start space-x-2">
                  {verifyResult.isValid ? (
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-extrabold uppercase tracking-wider text-[11px] block">
                      {verifyResult.isValid ? 'CRYPTOGRAPHICALLY AUTHENTICATED' : 'VERIFICATION FAILED'}
                    </span>
                    <p className="text-xs mt-0.5">{verifyResult.reason}</p>
                    {verifyResult.credential && (
                      <div className="mt-2 pt-2 border-t border-emerald-200 text-[11px] font-sans">
                        <strong>Subject:</strong> {verifyResult.credential.title} | <strong>Candidate:</strong> {verifyResult.credential.studentName} | <strong>Grade:</strong> {verifyResult.credential.gradeOrScore}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* VAULT CREDENTIALS CARDS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#003366] flex items-center">
              <Award size={16} className="mr-2 text-yellow-600" />
              Verified Digital Credentials In Student Vault
            </h3>
            <span className="text-xs font-mono text-gray-500">{credentials.length} Cryptographic Assets</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {credentials.map(cred => (
              <div
                key={cred.id}
                className="bg-white rounded-2xl border border-gray-200 hover:border-yellow-500 p-5 shadow-xs transition-all space-y-4 relative overflow-hidden"
              >
                {/* Visual Seal Watermark */}
                <div className="absolute right-4 top-4 opacity-10 pointer-events-none">
                  <ShieldCheck size={90} className="text-[#003366]" />
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      cred.type === 'DEGREE' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      cred.type === 'MARKSHEET' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                      cred.type === 'ATTENDANCE' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                      'bg-purple-100 text-purple-900 border border-purple-300'
                    }`}>
                      {cred.type}
                    </span>
                    <h4 className="font-extrabold text-sm sm:text-base text-[#003366] mt-1.5">{cred.title}</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">{cred.issuer}</p>
                  </div>

                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md shrink-0 flex items-center">
                    <CheckCircle2 size={13} className="mr-1" /> {cred.status}
                  </span>
                </div>

                {/* Credential Data Score */}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Evaluation Standing</span>
                    <strong className="text-sm text-gray-900 font-extrabold">{cred.gradeOrScore}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Issue Date</span>
                    <span className="font-mono text-xs text-gray-700">{cred.issuedAt}</span>
                  </div>
                </div>

                {/* Merkle Leaf Hash snippet */}
                <div className="text-[10px] font-mono text-gray-500 bg-gray-100 p-2 rounded-lg flex items-center justify-between">
                  <span className="truncate max-w-[240px]">Leaf: {cred.leafHash}</span>
                  <button
                    onClick={() => handleCopy(cred.leafHash, cred.id)}
                    className="text-[#003366] hover:text-blue-700 font-bold ml-2 shrink-0 flex items-center"
                  >
                    <Copy size={11} className="mr-0.5" />
                    {copiedHash === cred.id ? 'Copied' : 'Copy'}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-xs">
                  <button
                    onClick={() => setSelectedCred(cred)}
                    className="text-[#003366] hover:underline font-bold text-xs flex items-center"
                  >
                    <Layers size={13} className="mr-1 text-yellow-600" />
                    Inspect Merkle Proof Path
                  </button>

                  <button
                    onClick={() => downloadJsonCredential(cred)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 py-1 rounded-lg text-xs flex items-center"
                  >
                    <Download size={12} className="mr-1" />
                    JSON Asset
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* MODAL: MERKLE TREE PROOF INSPECTOR */}
      {selectedCred && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs font-sans">
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded">
                  Merkle Audit Path Explorer
                </span>
                <h3 className="text-base font-extrabold text-[#003366] mt-1">{selectedCred.title}</h3>
                <p className="text-[11px] text-gray-500">Candidate: {selectedCred.studentName}</p>
              </div>
              <button onClick={() => setSelectedCred(null)} className="text-gray-400 hover:text-gray-600 font-bold text-base">
                ✕
              </button>
            </div>

            {/* Leaf Hash Node */}
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-[10px] font-bold text-blue-900 uppercase block">1. Credential Leaf Hash [H_0]</span>
              <p className="font-mono text-[11px] text-[#003366] break-all mt-0.5">{selectedCred.leafHash}</p>
            </div>

            {/* Proof Sibling Steps */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">
                2. Cryptographic Sibling Proof Chain (Up to Root)
              </span>
              {selectedCred.merkleProof.map((step, idx) => (
                <div key={idx} className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between font-mono text-[10px]">
                  <span className="text-gray-500">Layer {idx + 1} ({step.position.toUpperCase()} SIBLING)</span>
                  <span className="text-gray-800 truncate max-w-[260px]">{step.hash}</span>
                </div>
              ))}
            </div>

            {/* Published Root Target */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300">
              <div className="flex justify-between items-center text-[10px] font-bold text-emerald-900 uppercase">
                <span>3. College Published Merkle Root</span>
                <span className="bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded">Verified Match</span>
              </div>
              <p className="font-mono text-[11px] text-emerald-800 break-all mt-0.5">{publishedRoot}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCred(null)}
                className="bg-[#003366] text-white px-4 py-2 rounded-xl text-xs font-bold"
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
