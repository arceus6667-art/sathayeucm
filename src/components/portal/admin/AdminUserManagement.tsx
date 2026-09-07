import React, { useState } from 'react';
import { 
  Users, Search, Filter, ShieldCheck, UserCheck, 
  CheckCircle2, XCircle, Edit, Eye, UserPlus, X, Mail
} from 'lucide-react';
import { campusStore, CampusUser, UserRole } from '../../../services/campusStore';

export default function AdminUserManagement() {
  const [users, setUsers] = useState<CampusUser[]>(campusStore.getAllUsers());
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<CampusUser | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.prn?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRole && matchSearch;
  });

  const handleUpdateRole = (userId: string, newRole: UserRole) => {
    campusStore.updateUser(userId, { role: newRole });
    setUsers(campusStore.getAllUsers());
    if (selectedUser?.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, role: newRole } : null);
    }
  };

  const handleToggleStatus = (userId: string, currentStatus: CampusUser['status']) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    campusStore.updateUser(userId, { status: nextStatus });
    setUsers(campusStore.getAllUsers());
    if (selectedUser?.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, status: nextStatus } : null);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold rounded uppercase tracking-wider">
              Identity & Access Management
            </span>
            <h2 className="text-lg font-bold text-gray-900">Campus User Directory & Permissions</h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Directory of enrolled students, certified faculty, canteen staff, and library administrators
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
          <span className="px-2.5 py-1 bg-gray-100 rounded-lg">
            Total Users: <strong>{users.length}</strong>
          </span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, PRN, email, dept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-[#003366]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto text-xs">
          <span className="text-gray-400 font-bold uppercase text-[10px] mr-1">Role:</span>
          {['all', 'STUDENT', 'FACULTY', 'CANTEEN', 'LIBRARY', 'ADMIN'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1 rounded-md font-semibold whitespace-nowrap transition-colors ${
                roleFilter === r
                  ? 'bg-[#003366] text-white font-bold'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">User Details & PRN</th>
                <th className="py-3 px-4">Department / Program</th>
                <th className="py-3 px-4">System Role</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#003366] text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                        {user.name.slice(0, 2)}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 block">{user.name}</span>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                          <span>{user.prn || user.username || user.id}</span>
                          <span>•</span>
                          <span className="text-gray-400">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-800">{user.department || 'General Campus'}</span>
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value as UserRole)}
                      className={`text-[10px] font-bold rounded px-2 py-1 border focus:outline-none uppercase ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : user.role === 'FACULTY'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : user.role === 'CANTEEN'
                          ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                          : user.role === 'LIBRARY'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      <option value="STUDENT">STUDENT</option>
                      <option value="FACULTY">FACULTY</option>
                      <option value="CANTEEN">CANTEEN</option>
                      <option value="LIBRARY">LIBRARY</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleStatus(user.id, user.status)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                        user.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                    >
                      {user.status || 'ACTIVE'}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px] font-bold"
                    >
                      Inspect Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* USER INSPECT MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-200 animate-in fade-in space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#003366] text-white flex items-center justify-center font-bold text-sm">
                  {selectedUser.name.slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{selectedUser.name}</h3>
                  <span className="text-[10px] text-gray-500 font-mono">{selectedUser.email}</span>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-gray-50 rounded-lg">
                  <span className="text-[10px] text-gray-400 block">Institutional PRN</span>
                  <strong className="text-gray-900 font-mono">{selectedUser.prn || 'N/A'}</strong>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-lg">
                  <span className="text-[10px] text-gray-400 block">Department</span>
                  <strong className="text-gray-900">{selectedUser.department || 'Autonomous Campus'}</strong>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1.5">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Active Access Permissions</span>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-bold text-[10px]">Turnstiles 1-6</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-bold text-[10px]">Central Library</span>
                  <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded font-bold text-[10px]">IT & Science Labs</span>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded font-bold text-[10px]">Canteen Wallet</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-1.5 bg-[#003366] text-white rounded-lg font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
