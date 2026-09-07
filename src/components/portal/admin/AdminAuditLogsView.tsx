import React, { useState } from 'react';
import { 
  ShieldCheck, Search, Filter, Clock, UserCheck, 
  ArrowRight, FileCheck, Layers
} from 'lucide-react';
import { campusStore, AdminAuditLog } from '../../../services/campusStore';

export default function AdminAuditLogsView() {
  const [logs] = useState<AdminAuditLog[]>(campusStore.getAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    const matchSearch = log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.newValue && log.newValue.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchEntity = entityFilter === 'all' || log.entityType.toLowerCase() === entityFilter.toLowerCase();
    return matchSearch && matchEntity;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-bold rounded uppercase tracking-wider">
              Governance Compliance
            </span>
            <h2 className="text-lg font-bold text-gray-900">Administrative Security & System Audit Trail</h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Immutable chronicle of administrative status changes, technician dispatches, emergency alerts, and user updates
          </p>
        </div>

        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-mono font-bold">
          {logs.length} Recorded Entries
        </span>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search audit trail by actor, action, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-[#003366]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto text-xs">
          <span className="text-gray-400 font-bold uppercase text-[10px] mr-1">Entity:</span>
          {['all', 'ISSUE', 'TICKET', 'USER', 'CAMPUS_ALERT'].map((e) => (
            <button
              key={e}
              onClick={() => setEntityFilter(e)}
              className={`px-3 py-1 rounded-md font-semibold whitespace-nowrap transition-colors ${
                entityFilter === e
                  ? 'bg-[#003366] text-white font-bold'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Entity & ID</th>
                <th className="py-3 px-4">Action Taken</th>
                <th className="py-3 px-4">Previous Value</th>
                <th className="py-3 px-4">New Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3 px-4 text-gray-500 font-mono text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="py-3 px-4 font-bold text-gray-900">
                    {log.actorName}
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] font-mono font-bold">
                      {log.entityType}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono block mt-0.5">{log.entityId}</span>
                  </td>

                  <td className="py-3 px-4 font-semibold text-blue-900">
                    {log.action}
                  </td>

                  <td className="py-3 px-4 text-gray-500 font-mono text-[11px]">
                    {log.previousValue || '—'}
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-emerald-800 font-bold">
                    {log.newValue || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
