import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, Award, CheckCircle2, Copy, 
  Download, ExternalLink, Key, Layers 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { merkleVaultService, VerifiableCredential } from '../../services/merkleVault';
import { campusStore } from '../../services/campusStore';

export default function StudentCredentialVault() {
  const currentUser = campusStore.getCurrentUser();
  const credentials = merkleVaultService.getCredentialsForStudent(currentUser?.id || 'usr-student-1');
  const publishedRoot = merkleVaultService.publishedCollegeRoot;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 font-sans">
      
      {/* Top Banner */}
      <div className="bg-[#002244] text-white p-4 rounded-xl border-l-4 border-yellow-500 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-yellow-300 bg-yellow-900/60 px-2 py-0.5 rounded uppercase">
              Blockchain Merkle Vault
            </span>
            <span className="text-[11px] text-blue-200">Verifiable Academic Records</span>
          </div>
          <h3 className="text-base font-extrabold mt-1">Sathaye Cryptographic Credential Vault</h3>
          <p className="text-xs text-blue-200 mt-0.5">
            Degrees and attendance compliance cryptographically signed with zero tampering.
          </p>
        </div>

        <Link
          to="/vault"
          className="bg-yellow-400 hover:bg-yellow-300 text-[#003366] text-xs font-black uppercase px-3.5 py-1.5 rounded-lg transition-colors shadow flex items-center shrink-0"
        >
          <ExternalLink size={12} className="mr-1.5" /> Full Public Verifier
        </Link>
      </div>

      {/* Merkle Root Display */}
      <div className="bg-gray-100 p-3 rounded-xl border border-gray-200 flex items-center justify-between text-[11px]">
        <div className="flex items-center space-x-2 truncate max-w-lg">
          <Lock size={13} className="text-[#003366] shrink-0" />
          <span className="font-bold text-gray-700 shrink-0">College Root Hash:</span>
          <span className="font-mono text-gray-600 truncate">{publishedRoot}</span>
        </div>
        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded shrink-0">
          Root Immutable
        </span>
      </div>

      {/* Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {credentials.map(cred => (
          <div key={cred.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-2 hover:border-yellow-400 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-black uppercase bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded">
                  {cred.type}
                </span>
                <h4 className="font-bold text-xs sm:text-sm text-[#003366] mt-1">{cred.title}</h4>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center">
                <CheckCircle2 size={11} className="mr-1" /> Verified
              </span>
            </div>

            <div className="text-[11px] text-gray-600 flex justify-between">
              <span>Score: <strong className="text-gray-900">{cred.gradeOrScore}</strong></span>
              <span className="font-mono text-[10px] text-gray-400">Issued: {cred.issuedAt}</span>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] font-mono">
              <span className="truncate max-w-[200px] text-gray-500">Hash: {cred.leafHash}</span>
              <button
                onClick={() => handleCopy(cred.leafHash, cred.id)}
                className="text-[#003366] hover:underline font-bold font-sans flex items-center"
              >
                <Copy size={10} className="mr-0.5" />
                {copiedId === cred.id ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
