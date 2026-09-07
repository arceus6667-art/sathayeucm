import React, { useState, useMemo } from 'react';
import { 
  MapPin, Layers, Building2, Search, Filter, 
  Accessibility, CheckCircle2, AlertCircle, Wrench, Plus, 
  Eye, Edit2, ShieldAlert, ArrowRight, X
} from 'lucide-react';
import { campusStore, CampusBuilding, CampusLocation, CampusIssue } from '../../../services/campusStore';

export default function AdminCampusMap() {
  const buildings = campusStore.getBuildings();
  const [locations, setLocations] = useState<CampusLocation[]>(campusStore.getLocations());
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('bldg-main');
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLocation, setActiveLocation] = useState<CampusLocation | null>(null);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);

  // New room form state
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomCode, setNewRoomCode] = useState('');
  const [newRoomType, setNewRoomType] = useState<CampusLocation['type']>('classroom');
  const [newRoomCapacity, setNewRoomCapacity] = useState(60);
  const [newRoomDepartment, setNewRoomDepartment] = useState('Information Technology');
  const [newRoomFloor, setNewRoomFloor] = useState(1);
  const [newRoomAccessible, setNewRoomAccessible] = useState(true);
  const [newRoomDesc, setNewRoomDesc] = useState('');

  const issues = campusStore.getCampusIssues();

  const selectedBuilding = buildings.find(b => b.id === selectedBuildingId) || buildings[0];

  const filteredLocations = useMemo(() => {
    return locations.filter(loc => {
      const matchBldg = loc.buildingId === selectedBuildingId;
      const matchFloor = selectedFloor === 'all' || loc.floorNumber === selectedFloor;
      const matchType = selectedType === 'all' || loc.type === selectedType;
      const matchSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.department?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchBldg && matchFloor && matchType && matchSearch;
    });
  }, [locations, selectedBuildingId, selectedFloor, selectedType, searchQuery]);

  const handleToggleStatus = (locId: string, currentStatus: CampusLocation['status']) => {
    const nextStatus: CampusLocation['status'] = 
      currentStatus === 'available' ? 'occupied' : currentStatus === 'occupied' ? 'maintenance' : 'available';
    campusStore.updateLocation(locId, { status: nextStatus });
    setLocations(campusStore.getLocations());
    if (activeLocation?.id === locId) {
      setActiveLocation(prev => prev ? { ...prev, status: nextStatus } : null);
    }
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName || !newRoomCode) return;

    const created = campusStore.addLocation({
      name: newRoomName,
      code: newRoomCode,
      type: newRoomType,
      buildingId: selectedBuildingId,
      buildingName: selectedBuilding.name,
      floorNumber: Number(newRoomFloor),
      floorLabel: `Floor ${newRoomFloor}`,
      x: 300,
      y: 300,
      capacity: Number(newRoomCapacity),
      department: newRoomDepartment,
      isAccessible: newRoomAccessible,
      description: newRoomDesc || 'Newly commissioned educational facility room.',
      status: 'available'
    });

    setLocations(campusStore.getLocations());
    setShowAddRoomModal(false);
    setNewRoomName('');
    setNewRoomCode('');
    setActiveLocation(created);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Campus Spatial Map & Room Administration</h2>
          <p className="text-xs text-gray-500">Live operational room control, occupancy override, and facility accessibility audit</p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search rooms, labs, auditoriums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-[#003366]"
            />
          </div>
          <button
            onClick={() => setShowAddRoomModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#003366] hover:bg-blue-900 text-white rounded-lg text-xs font-bold transition-colors shadow-xs shrink-0"
          >
            <Plus size={14} />
            <span>Add Facility Room</span>
          </button>
        </div>
      </div>

      {/* Building Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {buildings.map((b) => (
          <button
            key={b.id}
            onClick={() => {
              setSelectedBuildingId(b.id);
              setSelectedFloor('all');
            }}
            className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
              selectedBuildingId === b.id
                ? 'bg-[#003366] text-white border-[#003366] shadow-xs'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
            <span>{b.name}</span>
          </button>
        ))}
      </div>

      {/* Main Map Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Isometric Spatial Sector View */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Floor & Type Filter Bar */}
          <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-gray-400 font-bold uppercase text-[10px] mr-1">Floor:</span>
              <button
                onClick={() => setSelectedFloor('all')}
                className={`px-2.5 py-1 rounded-md font-bold ${
                  selectedFloor === 'all' ? 'bg-[#003366] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Floors
              </button>
              {selectedBuilding.floors.map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFloor(f)}
                  className={`px-2.5 py-1 rounded-md font-bold ${
                    selectedFloor === f ? 'bg-[#003366] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Floor {f}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <span className="text-gray-400 font-bold uppercase text-[10px] mr-1">Type:</span>
              {['all', 'classroom', 'lab', 'library', 'canteen'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-2 py-0.5 rounded capitalize font-semibold ${
                    selectedType === t ? 'bg-blue-100 text-[#003366] font-bold' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Room Grid / Spatial Layout */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-500 pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-[#003366]" />
                <span className="font-bold text-gray-900">{selectedBuilding.name}</span>
                <span className="text-gray-400">• {filteredLocations.length} locations rendered</span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Available</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> In Session</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Maintenance</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredLocations.map((loc) => {
                const roomIssues = issues.filter(i => i.locationId === loc.id && i.status !== 'Resolved');
                const isSelected = activeLocation?.id === loc.id;

                return (
                  <div
                    key={loc.id}
                    onClick={() => setActiveLocation(loc)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected 
                        ? 'border-[#003366] ring-2 ring-[#003366]/20 bg-blue-50/40 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs'
                    }`}
                  >
                    {roomIssues.length > 0 && (
                      <span className="absolute top-3 right-3 px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[9px] font-bold flex items-center gap-0.5">
                        <Wrench size={10} />
                        <span>Issue ({roomIssues.length})</span>
                      </span>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                      <span>{loc.code}</span>
                      <span>Floor {loc.floorNumber}</span>
                    </div>

                    <h4 className="text-xs font-bold text-gray-900 mt-1 line-clamp-1">{loc.name}</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">{loc.department || 'General Academic'}</p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 text-[10px]">
                      <span className="text-gray-600 font-semibold">Cap: {loc.capacity} seats</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(loc.id, loc.status);
                        }}
                        className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider transition-colors ${
                          loc.status === 'available'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : loc.status === 'occupied'
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            : 'bg-red-50 text-red-700 hover:bg-red-100'
                        }`}
                        title="Click to toggle status"
                      >
                        {loc.status}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Room Inspector & Override Controls */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100">
              Facility Room Inspector
            </h3>

            {activeLocation ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-mono">{activeLocation.code}</span>
                  <h4 className="text-sm font-bold text-gray-900">{activeLocation.name}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{activeLocation.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <span className="text-[10px] text-gray-400">Department</span>
                    <p className="font-bold text-gray-800">{activeLocation.department}</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <span className="text-[10px] text-gray-400">Seating Capacity</span>
                    <p className="font-bold text-gray-800">{activeLocation.capacity} Seats</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Floor Level:</span>
                    <strong className="text-gray-900">Floor {activeLocation.floorNumber}</strong>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Wheelchair Accessibility:</span>
                    <span className={`font-bold ${activeLocation.isAccessible ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {activeLocation.isAccessible ? 'Accessible (Ramp/Lift)' : 'Stairs Only'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Current Status:</span>
                    <span className="font-bold uppercase text-blue-900">{activeLocation.status}</span>
                  </div>
                </div>

                {/* Status Override Buttons */}
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">
                    Administrative Override
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => {
                        campusStore.updateLocation(activeLocation.id, { status: 'available' });
                        setLocations(campusStore.getLocations());
                        setActiveLocation(prev => prev ? { ...prev, status: 'available' } : null);
                      }}
                      className="px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded font-bold text-[11px]"
                    >
                      Available
                    </button>
                    <button
                      onClick={() => {
                        campusStore.updateLocation(activeLocation.id, { status: 'occupied' });
                        setLocations(campusStore.getLocations());
                        setActiveLocation(prev => prev ? { ...prev, status: 'occupied' } : null);
                      }}
                      className="px-2 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded font-bold text-[11px]"
                    >
                      In Session
                    </button>
                    <button
                      onClick={() => {
                        campusStore.updateLocation(activeLocation.id, { status: 'maintenance' });
                        setLocations(campusStore.getLocations());
                        setActiveLocation(prev => prev ? { ...prev, status: 'maintenance' } : null);
                      }}
                      className="px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-800 rounded font-bold text-[11px]"
                    >
                      Maintenance
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 text-xs">
                <MapPin size={24} className="mx-auto text-gray-300 mb-2" />
                <span>Select a room from the grid to inspect equipment, view issues, or override availability.</span>
              </div>
            )}
          </div>

          {/* Building Accessibility Matrix */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
              <Accessibility size={15} className="text-[#003366]" />
              <span>Campus Accessibility Audit</span>
            </h4>
            <p className="text-[11px] text-gray-500">
              Sathaye College autonomous accessibility guidelines require ramp and elevator parity across all lecture blocks.
            </p>
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-gray-600">
                <span>Elevator Service:</span>
                <strong className={selectedBuilding.hasElevator ? 'text-emerald-700' : 'text-gray-400'}>
                  {selectedBuilding.hasElevator ? 'Operational' : 'None'}
                </strong>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Entrance Ramp:</span>
                <strong className={selectedBuilding.hasRamp ? 'text-emerald-700' : 'text-gray-400'}>
                  {selectedBuilding.hasRamp ? 'Wheelchair Ready' : 'None'}
                </strong>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Add Facility Room Modal */}
      {showAddRoomModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-sm font-bold text-gray-900">Register New Campus Facility</h3>
              <button onClick={() => setShowAddRoomModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Room / Lab Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Room 305 - Data Science Lab"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Room Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. R-305"
                    value={newRoomCode}
                    onChange={(e) => setNewRoomCode(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Room Type</label>
                  <select
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none"
                  >
                    <option value="classroom">Classroom</option>
                    <option value="lab">Laboratory</option>
                    <option value="auditorium">Auditorium / Hall</option>
                    <option value="library">Library / Reading</option>
                    <option value="office">Department Office</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Floor Level</label>
                  <select
                    value={newRoomFloor}
                    onChange={(e) => setNewRoomFloor(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none"
                  >
                    {selectedBuilding.floors.map(f => (
                      <option key={f} value={f}>Floor {f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    min="1"
                    value={newRoomCapacity}
                    onChange={(e) => setNewRoomCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  placeholder="e.g. Information Technology"
                  value={newRoomDepartment}
                  onChange={(e) => setNewRoomDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="accCheck"
                  checked={newRoomAccessible}
                  onChange={(e) => setNewRoomAccessible(e.target.checked)}
                  className="rounded text-[#003366]"
                />
                <label htmlFor="accCheck" className="text-gray-700 font-semibold cursor-pointer">
                  Wheelchair Accessible (Elevator / Ramp available)
                </label>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#003366] hover:bg-blue-900 text-white rounded-lg font-bold"
                >
                  Save Facility Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
