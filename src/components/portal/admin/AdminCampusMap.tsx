import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  MapPin, Layers, Building2, Search, Filter, 
  Accessibility, CheckCircle2, AlertCircle, Wrench, Plus, 
  Eye, Edit2, ShieldAlert, ArrowRight, X, Trash2, Save, RotateCcw,
  Check, AlertTriangle, Navigation
} from 'lucide-react';
import { 
  CAMPUS_FLOORS, 
  CampusMapMarker, 
  campusMapService, 
  MAP_NODES,
  MAP_EDGES 
} from '../../../services/mapStore';

export default function AdminCampusMap() {
  const [markers, setMarkers] = useState<CampusMapMarker[]>(campusMapService.getMarkers());
  const [selectedFloorId, setSelectedFloorId] = useState<number>(0); // 0=Ground by default
  const [selectedMarker, setSelectedMarker] = useState<CampusMapMarker | null>(null);
  
  // Placement / Edit mode
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMarker, setEditingMarker] = useState<Partial<CampusMapMarker>>({
    floor: 0,
    category: 'ACADEMIC',
    isAccessible: true,
    isVerified: true
  });
  const [clickToPlaceMode, setClickToPlaceMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Subscribe to changes
  useEffect(() => {
    const unsub = campusMapService.subscribe(() => {
      setMarkers(campusMapService.getMarkers());
    });
    return unsub;
  }, []);

  const activeFloor = useMemo(() => {
    return CAMPUS_FLOORS.find(f => f.id === selectedFloorId) || CAMPUS_FLOORS[1];
  }, [selectedFloorId]);

  const floorMarkers = useMemo(() => {
    if (selectedFloorId === -1) return markers;
    return markers.filter(m => m.floor === selectedFloorId);
  }, [markers, selectedFloorId]);

  // Click on map image to capture (xPercent, yPercent)
  const handleMapImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (clickToPlaceMode) {
      setEditingMarker({
        id: 'm-' + Date.now(),
        name: 'New Campus Marker',
        roomNumber: '',
        floor: selectedFloorId === -1 ? 0 : selectedFloorId,
        category: 'ACADEMIC',
        xPercent: Math.round(x * 10) / 10,
        yPercent: Math.round(y * 10) / 10,
        isAccessible: true,
        isVerified: true
      });
      setIsEditModalOpen(true);
      setClickToPlaceMode(false);
    }
  };

  const handleSaveMarker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMarker.name) return;

    const markerToSave: CampusMapMarker = {
      id: editingMarker.id || 'm-' + Date.now(),
      name: editingMarker.name,
      roomNumber: editingMarker.roomNumber,
      department: editingMarker.department,
      category: editingMarker.category || 'ACADEMIC',
      floor: editingMarker.floor !== undefined ? editingMarker.floor : 0,
      xPercent: editingMarker.xPercent || 50,
      yPercent: editingMarker.yPercent || 50,
      isAccessible: Boolean(editingMarker.isAccessible),
      isVerified: Boolean(editingMarker.isVerified),
      capacity: editingMarker.capacity,
      hasAc: editingMarker.hasAc,
      hasProjector: editingMarker.hasProjector,
      notes: editingMarker.notes
    };

    campusMapService.addOrUpdateMarker(markerToSave);
    setIsEditModalOpen(false);
    setSelectedMarker(markerToSave);
    setStatusMessage(`Saved marker: ${markerToSave.name}`);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleDeleteMarker = (id: string) => {
    campusMapService.deleteMarker(id);
    setSelectedMarker(null);
    setIsEditModalOpen(false);
    setStatusMessage('Marker removed from architectural floor plan.');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const toggleVerification = (marker: CampusMapMarker) => {
    const updated = { ...marker, isVerified: !marker.isVerified };
    campusMapService.addOrUpdateMarker(updated);
    setSelectedMarker(updated);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#003366] text-white text-[10px] font-bold rounded uppercase tracking-wider">
              Spatial Management
            </span>
            <h2 className="text-lg font-bold text-gray-900">2D Campus Architectural Map Admin</h2>
          </div>
          <p className="text-xs text-gray-500">
            Edit room pins, accessibility validation, coordinate anchors & wayfinding corridors over the official college floor plan.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setClickToPlaceMode(!clickToPlaceMode)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm ${
              clickToPlaceMode
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-[#003366] text-white hover:bg-[#002244]'
            }`}
          >
            <Plus size={15} />
            <span>{clickToPlaceMode ? 'Click Map to Place...' : 'Add Marker to Map'}</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-lg flex items-center space-x-2">
          <CheckCircle2 size={16} />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Map Visualizer */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl p-4 border border-slate-700 shadow-sm flex flex-col">
          
          {/* Floor Toolbar */}
          <div className="flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
              {CAMPUS_FLOORS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFloorId(f.id)}
                  className={`px-3 py-1.5 rounded text-[11px] font-bold transition-colors ${
                    selectedFloorId === f.id
                      ? 'bg-amber-400 text-slate-900 font-extrabold shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {f.code}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-slate-300">
              {clickToPlaceMode ? (
                <span className="text-amber-400 font-bold animate-pulse">
                  Targeting: Click anywhere on the plan to anchor a coordinate
                </span>
              ) : (
                <span>Click any pin to edit metadata</span>
              )}
            </div>
          </div>

          {/* Master Image Canvas Container */}
          <div 
            onClick={handleMapImageClick}
            className={`relative rounded-lg overflow-hidden border border-slate-700 select-none bg-white ${
              clickToPlaceMode ? 'cursor-crosshair ring-2 ring-amber-400' : 'cursor-default'
            }`}
          >
            <img
              src="/Screenshot%202026-09-07%20114708.png"
              alt="Campus Master Floor Plan"
              className="w-full h-auto block select-none pointer-events-none"
              draggable={false}
            />

            {/* SVG Overlay for Quadrant & Connecting Graph */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {selectedFloorId !== -1 && (
                <rect
                  x={activeFloor.quadrant.minX}
                  y={activeFloor.quadrant.minY}
                  width={activeFloor.quadrant.maxX - activeFloor.quadrant.minX}
                  height={activeFloor.quadrant.maxY - activeFloor.quadrant.minY}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="0.75"
                  strokeDasharray="2, 1"
                />
              )}

              {/* Wayfinding Edges */}
              {MAP_EDGES.map((e, idx) => {
                const n1 = MAP_NODES.find(n => n.id === e.fromNodeId);
                const n2 = MAP_NODES.find(n => n.id === e.toNodeId);
                if (!n1 || !n2) return null;
                // Only render if both on current floor (or if all floors)
                if (selectedFloorId !== -1 && (n1.floor !== selectedFloorId || n2.floor !== selectedFloorId)) return null;
                return (
                  <line
                    key={idx}
                    x1={n1.xPercent}
                    y1={n1.yPercent}
                    x2={n2.xPercent}
                    y2={n2.yPercent}
                    stroke={e.isAccessible ? '#10b981' : '#f59e0b'}
                    strokeWidth="0.5"
                    strokeDasharray={e.isVertical ? '1, 1' : 'none'}
                  />
                );
              })}
            </svg>

            {/* Marker Pins */}
            {floorMarkers.map(m => {
              const isSelected = selectedMarker?.id === m.id;
              return (
                <div
                  key={m.id}
                  style={{ left: `${m.xPercent}%`, top: `${m.yPercent}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMarker(m);
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform ${
                    isSelected ? 'scale-125 z-20' : 'hover:scale-110'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 border-white text-white text-[10px] shadow ${
                    m.isVerified ? 'bg-[#003366]' : 'bg-amber-600'
                  }`}>
                    {m.isVerified ? '✓' : '?'}
                  </div>
                  <div className="absolute top-full mt-0.5 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[8px] font-bold px-1 rounded whitespace-nowrap">
                    {m.roomNumber || m.name.split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>Showing {floorMarkers.length} rooms & points on Floor: {activeFloor.name}</span>
            <span className="flex items-center space-x-3">
              <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-[#003366] border border-white"></span><span>Verified</span></span>
              <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span><span>Needs Verification</span></span>
            </span>
          </div>

        </div>

        {/* Right Col: Selected Room Details & Editor */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="font-bold text-gray-900 text-sm">Marker Properties</h3>
              {selectedMarker && (
                <button
                  onClick={() => {
                    setEditingMarker(selectedMarker);
                    setIsEditModalOpen(true);
                  }}
                  className="px-2.5 py-1 text-xs font-bold text-[#003366] bg-blue-50 rounded hover:bg-blue-100 flex items-center space-x-1"
                >
                  <Edit2 size={12} />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {selectedMarker ? (
              <div className="space-y-3.5 text-xs text-gray-700">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400">Room Name</label>
                  <div className="font-bold text-gray-900 text-sm">{selectedMarker.name}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Room Code</label>
                    <div className="font-mono font-bold text-[#003366]">{selectedMarker.roomNumber || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Floor</label>
                    <div>Floor {selectedMarker.floor === 0 ? 'Ground' : selectedMarker.floor}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Category</label>
                    <div>{selectedMarker.category}</div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Department</label>
                    <div className="truncate">{selectedMarker.department || 'General'}</div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span>Coordinates</span>
                    <span className="font-mono text-gray-500">X: {selectedMarker.xPercent}% • Y: {selectedMarker.yPercent}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Wheelchair Accessible</span>
                    <span className={selectedMarker.isAccessible ? 'text-emerald-700 font-bold' : 'text-gray-500'}>
                      {selectedMarker.isAccessible ? 'Yes (Elevator Route)' : 'No (Stairs Only)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Architectural Status</span>
                    <button
                      onClick={() => toggleVerification(selectedMarker)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        selectedMarker.isVerified 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {selectedMarker.isVerified ? '✓ Verified by Admin' : '⚠️ Mark as Verified'}
                    </button>
                  </div>
                </div>

                {selectedMarker.notes && (
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Field Notes</label>
                    <p className="text-gray-600 bg-amber-50/50 p-2 rounded border border-amber-200/50">{selectedMarker.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400">
                <MapPin size={32} className="mx-auto mb-2 opacity-30" />
                <p>Select a marker pin from the blueprint to inspect and modify its attributes.</p>
              </div>
            )}
          </div>

          {selectedMarker && (
            <div className="pt-4 border-t border-gray-100 flex items-center space-x-2">
              <button
                onClick={() => handleDeleteMarker(selectedMarker.id)}
                className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Trash2 size={13} />
                <span>Delete Marker</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Edit Marker Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="font-bold text-gray-900 text-base">
                {editingMarker.id ? 'Edit Campus Marker' : 'New Marker Anchor'}
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveMarker} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Room or Facility Name</label>
                <input
                  type="text"
                  required
                  value={editingMarker.name || ''}
                  onChange={(e) => setEditingMarker(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Smart Classroom 204"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#003366]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Room Number / Code</label>
                  <input
                    type="text"
                    value={editingMarker.roomNumber || ''}
                    onChange={(e) => setEditingMarker(prev => ({ ...prev, roomNumber: e.target.value }))}
                    placeholder="e.g. 204"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Floor Level</label>
                  <select
                    value={editingMarker.floor ?? 0}
                    onChange={(e) => setEditingMarker(prev => ({ ...prev, floor: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  >
                    <option value={0}>Ground Floor</option>
                    <option value={1}>1st Floor</option>
                    <option value={2}>2nd Floor</option>
                    <option value={3}>3rd Floor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={editingMarker.category || 'ACADEMIC'}
                    onChange={(e) => setEditingMarker(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  >
                    <option value="ACADEMIC">Academic Classroom</option>
                    <option value="LAB">Laboratory</option>
                    <option value="LIBRARY">Library / Reading Hall</option>
                    <option value="CANTEEN">Canteen / Cafeteria</option>
                    <option value="ADMIN">Administrative Office</option>
                    <option value="FACILITY">Auditorium / Facility</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={editingMarker.department || ''}
                    onChange={(e) => setEditingMarker(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="e.g. Information Technology"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Normalized X Coordinate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={editingMarker.xPercent ?? 50}
                    onChange={(e) => setEditingMarker(prev => ({ ...prev, xPercent: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Normalized Y Coordinate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={editingMarker.yPercent ?? 50}
                    onChange={(e) => setEditingMarker(prev => ({ ...prev, yPercent: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingMarker.isAccessible ?? true}
                    onChange={(e) => setEditingMarker(prev => ({ ...prev, isAccessible: e.target.checked }))}
                    className="rounded text-[#003366]"
                  />
                  <span className="font-semibold text-gray-700">Wheelchair Accessible</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingMarker.isVerified ?? true}
                    onChange={(e) => setEditingMarker(prev => ({ ...prev, isVerified: e.target.checked }))}
                    className="rounded text-[#003366]"
                  />
                  <span className="font-semibold text-gray-700">Architecturally Verified</span>
                </label>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Notes / Accessibility Details</label>
                <textarea
                  rows={2}
                  value={editingMarker.notes || ''}
                  onChange={(e) => setEditingMarker(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="e.g. Elevator access via West corridor, interactive smart board equipped"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#003366] text-white rounded-lg hover:bg-[#002244] shadow"
                >
                  Save Marker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
