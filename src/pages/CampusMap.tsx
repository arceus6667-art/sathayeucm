import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, Navigation, Layers, Search, Filter, 
  Accessibility, Building2, Coffee, BookOpen, Clock, 
  ChevronRight, ArrowRight, ShieldCheck, CheckCircle2, Info, 
  ZoomIn, ZoomOut, RotateCcw, AlertTriangle, Compass, Check, 
  Move, Wrench, Edit3, Save, X, Calendar, User, Wifi, Tv, Wind, FileText, CheckCircle
} from 'lucide-react';
import { 
  CAMPUS_FLOORS, 
  CampusMapFloor, 
  CampusMapMarker, 
  campusMapService, 
  MAP_NODES,
  MapGraphNode
} from '../services/mapStore';
import { campusStore } from '../services/campusStore';
import { timetableService } from '../services/timetableStore';

export function CampusMap() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Floor Selection: -1=All, 0=Ground, 1=1st, 2=2nd, 3=3rd
  const [activeFloorId, setActiveFloorId] = useState<number>(-1);
  const [markers, setMarkers] = useState<CampusMapMarker[]>(campusMapService.getMarkers());
  const [selectedMarker, setSelectedMarker] = useState<CampusMapMarker | null>(null);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [wheelchairOnly, setWheelchairOnly] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Routing Engine State
  const [startNodeId, setStartNodeId] = useState<string>('n-gate');
  const [targetNodeId, setTargetNodeId] = useState<string>('');
  const [isRoutingActive, setIsRoutingActive] = useState(false);
  const [routeResult, setRouteResult] = useState<{
    path: MapGraphNode[];
    totalDistance: number;
    steps: Array<{ floor: number; instruction: string; distanceMeters: number }>;
  } | null>(null);

  // Admin Map Mode State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminEditModal, setShowAdminEditModal] = useState(false);
  const [editingRoomData, setEditingRoomData] = useState<Partial<CampusMapMarker>>({});
  const [adminSaveSuccess, setAdminSaveSuccess] = useState(false);

  // Subscribe to marker and timetable changes
  useEffect(() => {
    const unsubMap = campusMapService.subscribe(() => {
      setMarkers(campusMapService.getMarkers());
    });
    const unsubTimetable = timetableService.subscribe(() => {
      // Re-trigger occupancy calculation
      setMarkers([...campusMapService.getMarkers()]);
    });
    return () => {
      unsubMap();
      unsubTimetable();
    };
  }, []);

  // Check URL query parameter ?target=marker-id or ?floor=X or ?admin=true
  useEffect(() => {
    const target = searchParams.get('target');
    const floorParam = searchParams.get('floor');
    const adminParam = searchParams.get('admin');

    if (adminParam === 'true') {
      setIsAdminMode(true);
    }

    if (floorParam !== null) {
      const f = parseInt(floorParam, 10);
      if (!isNaN(f)) setActiveFloorId(f);
    }

    if (target) {
      const found = markers.find(m => m.id === target || m.roomNumber?.toLowerCase() === target.toLowerCase());
      if (found) {
        setSelectedMarker(found);
        setActiveFloorId(found.floor);
        // Find closest map node to target
        const matchingNode = MAP_NODES.find(n => n.name.toLowerCase().includes(found.name.toLowerCase()) || n.id.includes(found.id));
        if (matchingNode) {
          setTargetNodeId(matchingNode.id);
        }
      }
    }
  }, [searchParams, markers]);

  // Handle floor switch zoom presets
  const activeFloor = useMemo(() => {
    return CAMPUS_FLOORS.find(f => f.id === activeFloorId) || CAMPUS_FLOORS[0];
  }, [activeFloorId]);

  const handleFloorChange = (floorId: number) => {
    setActiveFloorId(floorId);
    setPanOffset({ x: 0, y: 0 });
    setZoomLevel(floorId === -1 ? 1 : 1.35);
  };

  // Helper to determine real-time status of a marker
  const getMarkerStatus = (marker: CampusMapMarker): 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'INACTIVE' => {
    if (marker.isInactive) return 'INACTIVE';
    if (marker.isMaintenance) return 'MAINTENANCE';
    if (marker.roomNumber) {
      const liveState = timetableService.getRoomState(marker.roomNumber);
      if (liveState.status === 'OCCUPIED') return 'OCCUPIED';
      if (liveState.status === 'MAINTENANCE') return 'MAINTENANCE';
      if (liveState.status === 'INACTIVE') return 'INACTIVE';
    }
    return 'AVAILABLE';
  };

  // Filtered Markers for map surface
  const filteredMarkers = useMemo(() => {
    return markers.filter(m => {
      const matchesFloor = activeFloorId === -1 || m.floor === activeFloorId;
      const matchesCat = selectedCategory === 'ALL' || m.category === selectedCategory;
      const matchesSearch = !searchQuery.trim() || 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.roomNumber && m.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.department && m.department.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesAccessibility = !wheelchairOnly || m.isAccessible;
      return matchesFloor && matchesCat && matchesSearch && matchesAccessibility;
    });
  }, [markers, activeFloorId, selectedCategory, searchQuery, wheelchairOnly]);

  // Search Results for dropdown
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return markers.filter(m => 
      (m.roomNumber && m.roomNumber.toLowerCase().includes(q)) ||
      m.name.toLowerCase().includes(q) ||
      (m.department && m.department.toLowerCase().includes(q)) ||
      m.category.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [markers, searchQuery]);

  // Update route calculation
  useEffect(() => {
    if (isRoutingActive && startNodeId && targetNodeId) {
      const result = campusMapService.calculateRoute(startNodeId, targetNodeId, wheelchairOnly);
      setRouteResult(result);
    } else {
      setRouteResult(null);
    }
  }, [isRoutingActive, startNodeId, targetNodeId, wheelchairOnly]);

  // Pan interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Start route to marker
  const handleNavigateToMarker = (marker: CampusMapMarker) => {
    const node = MAP_NODES.find(n => n.floor === marker.floor && (n.name.toLowerCase().includes(marker.name.toLowerCase()) || n.id.includes(marker.id)))
      || MAP_NODES.find(n => n.floor === marker.floor)
      || MAP_NODES[0];
    
    setTargetNodeId(node.id);
    setIsRoutingActive(true);
  };

  // Select room and center viewport
  const handleSelectRoom = (marker: CampusMapMarker) => {
    setSelectedMarker(marker);
    if (activeFloorId !== -1 && activeFloorId !== marker.floor) {
      handleFloorChange(marker.floor);
    }
    setIsSearchDropdownOpen(false);
  };

  // Live schedule & class info for selected marker
  const selectedRoomDetails = useMemo(() => {
    if (!selectedMarker?.roomNumber) return null;
    const roomNum = selectedMarker.roomNumber;
    const roomState = timetableService.getRoomState(roomNum);
    const dayOfWeek = new Date().getDay() || 1;
    const todayEntries = timetableService.getEntries().filter(
      e => e.room.toLowerCase() === roomNum.toLowerCase() && e.day_of_week === dayOfWeek
    ).sort((a, b) => a.start_time.localeCompare(b.start_time));

    const status = getMarkerStatus(selectedMarker);

    return {
      status,
      current: roomState.currentClass,
      next: roomState.nextClass,
      todayEntries
    };
  }, [selectedMarker]);

  // Admin Mode: Open edit modal
  const handleOpenAdminEdit = (marker: CampusMapMarker) => {
    setEditingRoomData({ ...marker });
    setShowAdminEditModal(true);
  };

  // Admin Mode: Save changes
  const handleSaveAdminEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoomData.id) return;
    campusMapService.addOrUpdateMarker(editingRoomData as CampusMapMarker);
    if (selectedMarker?.id === editingRoomData.id) {
      setSelectedMarker(editingRoomData as CampusMapMarker);
    }
    setAdminSaveSuccess(true);
    setTimeout(() => {
      setAdminSaveSuccess(false);
      setShowAdminEditModal(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* 1. TOP HEADER & ACCESSIBILITY CONTROLS */}
      <header className="bg-[#003366] text-white border-b border-blue-900 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#003366] font-extrabold text-xs">
              SC
            </div>
            <div>
              <span className="font-bold text-sm sm:text-base tracking-tight">Sathaye 2D Campus Master Blueprint</span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold bg-amber-400 text-slate-900 rounded uppercase">
                Real Floor Plan Model
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          {/* Admin Map Mode Toggle */}
          <button
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              isAdminMode 
                ? 'bg-amber-400 text-slate-900 shadow-sm ring-2 ring-amber-300' 
                : 'bg-blue-900/70 text-blue-200 hover:bg-blue-800'
            }`}
          >
            <Wrench size={14} />
            <span>{isAdminMode ? 'Admin Mode ON' : 'Admin Mode'}</span>
          </button>

          {/* Wheelchair Accessibility Filter */}
          <button
            onClick={() => setWheelchairOnly(!wheelchairOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
              wheelchairOnly 
                ? 'bg-emerald-500 text-white shadow' 
                : 'bg-blue-900/60 text-blue-200 hover:bg-blue-800'
            }`}
            title="Show only verified wheelchair accessible routes and rooms"
          >
            <Accessibility size={15} />
            <span className="hidden sm:inline">Wheelchair Paths</span>
          </button>
          
          <Link
            to="/portal"
            className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-[#003366] rounded-lg text-xs font-bold transition-colors"
          >
            Portal
          </Link>
        </div>
      </header>

      {/* 2. MAIN MAP SHELL */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left Side Control & Search Panel */}
        <div className="w-full lg:w-80 xl:w-96 bg-white border-r border-gray-200 flex flex-col z-20 shadow-sm max-h-[35vh] lg:max-h-none overflow-y-auto">
          
          {/* FLOOR MAP UX: SELECTABLE FLOOR TABS */}
          <div className="p-3 bg-slate-50 border-b border-gray-200">
            <label className="block text-[11px] font-bold uppercase text-gray-500 tracking-wider mb-1.5">
              Select Campus Level
            </label>
            <div className="grid grid-cols-5 gap-1">
              {CAMPUS_FLOORS.map(f => (
                <button
                  key={f.id}
                  onClick={() => handleFloorChange(f.id)}
                  className={`py-2 px-1 text-[11px] font-black rounded-lg transition-all text-center ${
                    activeFloorId === f.id
                      ? 'bg-[#003366] text-white shadow-sm'
                      : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  <div>{f.code}</div>
                  <div className="text-[9px] font-medium opacity-80 truncate">{f.name.split(' ')[0]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* MAP SEARCH: SEARCH BAR WITH AUTOCOMPLETE */}
          <div className="p-3 border-b border-gray-200 space-y-2 relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchDropdownOpen(true);
                }}
                placeholder="Search classrooms (204), dept, labs, library..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2" />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchDropdownOpen(false);
                  }}
                  className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Instant Search Results Dropdown */}
            {isSearchDropdownOpen && searchResults.length > 0 && (
              <div className="absolute left-3 right-3 top-11 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-72 overflow-y-auto divide-y divide-gray-100">
                {searchResults.map(result => {
                  const status = getMarkerStatus(result);
                  return (
                    <div key={result.id} className="p-2.5 hover:bg-blue-50/50 flex items-center justify-between text-xs">
                      <div className="pr-2">
                        <div className="font-bold text-gray-900 flex items-center gap-1.5">
                          <span>{result.roomNumber ? `Room ${result.roomNumber}` : result.name}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' :
                            status === 'OCCUPIED' ? 'bg-rose-100 text-rose-800' :
                            status === 'MAINTENANCE' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {status}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Floor {result.floor === 0 ? 'Ground' : result.floor} • {result.department || result.category}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleSelectRoom(result)}
                          className="px-2 py-1 bg-[#003366] text-white rounded text-[10px] font-bold hover:bg-blue-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            handleSelectRoom(result);
                            handleNavigateToMarker(result);
                          }}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-[10px] font-bold hover:bg-gray-200"
                        >
                          Navigate
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Category Quick Filter Chips */}
            <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-[10px]">
              {['ALL', 'ACADEMIC', 'LAB', 'LIBRARY', 'CANTEEN', 'FACILITY', 'ADMIN'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 rounded font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-100 text-[#003366]'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Wayfinding Routing Block */}
          <div className="p-3 border-b border-gray-200 bg-blue-50/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-900 flex items-center space-x-1">
                <Navigation size={13} className="text-[#003366]" />
                <span>Multi-Floor Wayfinding</span>
              </span>
              <button
                onClick={() => setIsRoutingActive(!isRoutingActive)}
                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  isRoutingActive ? 'bg-rose-100 text-rose-700' : 'bg-[#003366] text-white'
                }`}
              >
                {isRoutingActive ? 'Clear Route' : 'Find Route'}
              </button>
            </div>

            {isRoutingActive && (
              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Starting Point</label>
                  <select
                    value={startNodeId}
                    onChange={(e) => setStartNodeId(e.target.value)}
                    className="w-full mt-0.5 p-1.5 bg-white border border-gray-300 rounded text-xs font-medium"
                  >
                    {MAP_NODES.map(n => (
                      <option key={n.id} value={n.id}>
                        Floor {n.floor === 0 ? 'G' : n.floor}: {n.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Destination</label>
                  <select
                    value={targetNodeId}
                    onChange={(e) => setTargetNodeId(e.target.value)}
                    className="w-full mt-0.5 p-1.5 bg-white border border-gray-300 rounded text-xs font-medium"
                  >
                    <option value="">Select destination room...</option>
                    {MAP_NODES.map(n => (
                      <option key={n.id} value={n.id}>
                        Floor {n.floor === 0 ? 'G' : n.floor}: {n.name}
                      </option>
                    ))}
                  </select>
                </div>

                {routeResult && routeResult.steps.length > 0 && (
                  <div className="mt-2.5 p-2 bg-white rounded-lg border border-blue-200 shadow-xs">
                    <div className="text-[11px] font-bold text-[#003366] mb-1.5 flex justify-between">
                      <span>Total Walk: ~{routeResult.totalDistance}m</span>
                      <span>{wheelchairOnly ? 'Elevator Friendly' : 'Stairs & Ramp'}</span>
                    </div>
                    <ol className="space-y-1 text-[10px] text-gray-700">
                      {routeResult.steps.map((st, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <span className="w-3.5 h-3.5 rounded-full bg-blue-100 text-[#003366] flex-shrink-0 flex items-center justify-center font-bold text-[8px] mt-0.5">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-semibold text-gray-900">Floor {st.floor === 0 ? 'G' : st.floor}:</span> {st.instruction}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Filtered Rooms List */}
          <div className="p-3 flex-1 overflow-y-auto">
            <div className="text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-2 flex justify-between items-center">
              <span>Campus Locations ({filteredMarkers.length})</span>
              <span className="text-[9px] text-gray-400">Click room to inspect</span>
            </div>
            <div className="space-y-1.5">
              {filteredMarkers.map(m => {
                const status = getMarkerStatus(m);
                const isSelected = selectedMarker?.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => handleSelectRoom(m)}
                    className={`p-2 rounded-lg cursor-pointer transition-all border text-left flex items-start justify-between ${
                      isSelected
                        ? 'bg-blue-50 border-blue-400 shadow-xs'
                        : 'bg-white hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex-1 pr-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-xs text-gray-900 leading-tight">
                          {m.name}
                        </span>
                        {m.roomNumber && (
                          <span className="px-1.5 py-0.2 bg-gray-100 text-gray-700 rounded text-[9px] font-mono font-bold">
                            {m.roomNumber}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        Floor {m.floor === 0 ? 'Ground' : m.floor} • {m.department || m.category}
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-1">
                      {/* Status dot */}
                      <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold uppercase ${
                        status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' :
                        status === 'OCCUPIED' ? 'bg-rose-100 text-rose-800' :
                        status === 'MAINTENANCE' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {status}
                      </span>
                      {m.isAccessible && (
                        <span title="Wheelchair Accessible" className="text-emerald-600">
                          <Accessibility size={11} />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Center: 2D Floor Plan Canvas Viewport with Pan & Zoom */}
        <div 
          className="flex-1 bg-slate-900 relative overflow-hidden flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          
          {/* Zoom & Reset Floating Controls */}
          <div className="absolute top-4 right-4 z-30 flex flex-col space-y-2 bg-white/95 backdrop-blur rounded-xl p-1.5 shadow-lg border border-gray-200">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 3))}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={18} />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={18} />
            </button>
            <button
              onClick={() => { setZoomLevel(1); setPanOffset({ x: 0, y: 0 }); }}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
              title="Reset View"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          {/* Blueprint Title Badge & Status Legend */}
          <div className="absolute top-4 left-4 z-30 bg-slate-900/90 backdrop-blur border border-slate-700 text-white p-2.5 rounded-xl text-xs shadow-md space-y-1.5">
            <div>
              <div className="font-bold text-amber-400">{activeFloor.name}</div>
              <div className="text-[10px] text-slate-300">{activeFloor.description}</div>
            </div>

            {/* Status Legend */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-700 text-[9px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Occupied</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Maintenance</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Selected</span>
            </div>
          </div>

          {/* Master Transform Container */}
          <div 
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
              transformOrigin: 'center center'
            }}
            className="relative max-w-full max-h-full flex items-center justify-center"
          >
            {/* Master Campus Architectural Floor Plan Image */}
            <div className="relative inline-block shadow-2xl rounded-lg overflow-hidden border-2 border-slate-700 bg-white">
              <img
                src="/campus-floor-plan.png"
                alt="Sathaye College Campus Master Floor Plan"
                className="w-[920px] max-w-none h-auto block select-none pointer-events-none"
                draggable={false}
              />

              {/* Responsive SVG Overlay for Quadrant Highlights & Route Lines */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {/* Active Floor Quadrant Highlight */}
                {activeFloorId !== -1 && (
                  <rect
                    x={activeFloor.quadrant.minX}
                    y={activeFloor.quadrant.minY}
                    width={activeFloor.quadrant.maxX - activeFloor.quadrant.minX}
                    height={activeFloor.quadrant.maxY - activeFloor.quadrant.minY}
                    fill="rgba(56, 189, 248, 0.05)"
                    stroke="#38bdf8"
                    strokeWidth="0.6"
                    strokeDasharray="1.5, 1"
                    className="animate-pulse"
                  />
                )}

                {/* Drawn Route Polyline */}
                {routeResult && routeResult.path.length > 1 && (
                  <polyline
                    points={routeResult.path.map(p => `${p.xPercent},${p.yPercent}`).join(' ')}
                    fill="none"
                    stroke="#e11d48"
                    strokeWidth="1.2"
                    strokeDasharray="2, 1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Graph Node Route Dots */}
                {routeResult && routeResult.path.map((node, i) => (
                  <circle
                    key={node.id}
                    cx={node.xPercent}
                    cy={node.yPercent}
                    r={i === 0 || i === routeResult.path.length - 1 ? 1.8 : 0.9}
                    fill={i === 0 ? '#10b981' : i === routeResult.path.length - 1 ? '#e11d48' : '#38bdf8'}
                    stroke="#ffffff"
                    strokeWidth="0.4"
                  />
                ))}
              </svg>

              {/* 4. INTERACTIVE MAP OVERLAY: TRANSPARENT HOTSPOT ZONES & PIN BADGES */}
              {filteredMarkers.map(m => {
                const isSelected = selectedMarker?.id === m.id;
                const status = getMarkerStatus(m);

                // Color mappings:
                // GREEN: Available, RED: Occupied, YELLOW: Maintenance, BLUE: Selected, GRAY: Inactive
                let statusBg = 'bg-emerald-500';
                let statusBorder = 'border-emerald-400';
                let hotspotBoxBg = 'bg-emerald-500/15 hover:bg-emerald-500/30';
                let hotspotBoxBorder = 'border-emerald-500/50';

                if (isSelected) {
                  statusBg = 'bg-blue-600';
                  statusBorder = 'border-blue-300 ring-2 ring-blue-400';
                  hotspotBoxBg = 'bg-blue-600/30';
                  hotspotBoxBorder = 'border-blue-500';
                } else if (status === 'OCCUPIED') {
                  statusBg = 'bg-rose-600';
                  statusBorder = 'border-rose-400';
                  hotspotBoxBg = 'bg-rose-600/15 hover:bg-rose-600/30';
                  hotspotBoxBorder = 'border-rose-500/50';
                } else if (status === 'MAINTENANCE') {
                  statusBg = 'bg-amber-500';
                  statusBorder = 'border-amber-300';
                  hotspotBoxBg = 'bg-amber-500/20 hover:bg-amber-500/35';
                  hotspotBoxBorder = 'border-amber-500/60';
                } else if (status === 'INACTIVE') {
                  statusBg = 'bg-gray-500';
                  statusBorder = 'border-gray-400';
                  hotspotBoxBg = 'bg-gray-500/15';
                  hotspotBoxBorder = 'border-gray-500/40';
                }

                const width = m.widthPercent || 7;
                const height = m.heightPercent || 6;

                return (
                  <React.Fragment key={m.id}>
                    {/* Transparent Clickable Bounding Box Hotspot Zone */}
                    <div
                      style={{
                        left: `${m.xPercent - width / 2}%`,
                        top: `${m.yPercent - height / 2}%`,
                        width: `${width}%`,
                        height: `${height}%`
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectRoom(m);
                      }}
                      title={`${m.name} (${status}) - Click to inspect`}
                      className={`absolute rounded cursor-pointer transition-all border ${hotspotBoxBg} ${hotspotBoxBorder} ${
                        isSelected ? 'border-2 ring-2 ring-blue-400/80 z-25' : 'hover:scale-105 z-10'
                      }`}
                    />

                    {/* Interactive Marker Pin & Room Number Badge */}
                    <div
                      style={{ left: `${m.xPercent}%`, top: `${m.yPercent}%` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectRoom(m);
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all z-20 pointer-events-auto ${
                        isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                      }`}
                    >
                      {/* Status indicator pin badge */}
                      <div className={`w-5 h-5 rounded-full shadow-md flex items-center justify-center text-white border-2 border-white ${statusBg} ${statusBorder}`}>
                        {m.category === 'LIBRARY' ? <BookOpen size={9} /> :
                         m.category === 'CANTEEN' ? <Coffee size={9} /> :
                         m.category === 'LAB' ? <Building2 size={9} /> : <MapPin size={9} />}
                      </div>

                      {/* Room Number pill */}
                      <div className={`absolute top-full mt-0.5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-extrabold px-1.5 py-0.2 rounded shadow-sm text-white ${
                        isSelected ? 'bg-blue-900' : 'bg-slate-900/90'
                      }`}>
                        {m.roomNumber || m.name.split(' ')[0]}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* 6. MAP DETAIL DRAWER (RIGHT-SIDE DRAWER OR MOBILE BOTTOM SHEET) */}
          {selectedMarker && (
            <div className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl border-l border-gray-200 p-5 z-40 overflow-y-auto animate-in slide-in-from-right duration-200 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between pb-3 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        selectedRoomDetails?.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' :
                        selectedRoomDetails?.status === 'OCCUPIED' ? 'bg-rose-100 text-rose-800' :
                        selectedRoomDetails?.status === 'MAINTENANCE' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedRoomDetails?.status}
                      </span>
                      <span className="text-[10px] text-gray-500 font-bold uppercase">
                        Floor {selectedMarker.floor === 0 ? 'Ground' : selectedMarker.floor}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-gray-900 mt-1">
                      {selectedMarker.roomNumber ? `Room ${selectedMarker.roomNumber}` : selectedMarker.name}
                    </h3>
                    <p className="text-xs text-gray-600 font-medium">
                      {selectedMarker.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    {isAdminMode && (
                      <button
                        onClick={() => handleOpenAdminEdit(selectedMarker)}
                        title="Admin: Edit Room Details & Maintenance"
                        className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg border border-amber-200 text-xs font-bold"
                      >
                        <Edit3 size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedMarker(null)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Core Specifications Box */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Department</span>
                    <div className="font-semibold text-gray-900 truncate mt-0.5">
                      {selectedMarker.department || 'General Campus'}
                    </div>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Seating Capacity</span>
                    <div className="font-semibold text-gray-900 mt-0.5">
                      {selectedMarker.capacity ? `${selectedMarker.capacity} Students` : 'Standard (60)'}
                    </div>
                  </div>
                </div>

                {/* Equipment Badges */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Room Equipment & Facilities
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {selectedMarker.hasProjector && (
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-semibold border border-blue-200 flex items-center gap-1">
                        <Tv size={12} /> Projector & Screen
                      </span>
                    )}
                    {selectedMarker.hasAc && (
                      <span className="px-2 py-1 bg-sky-50 text-sky-700 rounded-md font-semibold border border-sky-200 flex items-center gap-1">
                        <Wind size={12} /> Air Conditioned
                      </span>
                    )}
                    {selectedMarker.hasWifi && (
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md font-semibold border border-purple-200 flex items-center gap-1">
                        <Wifi size={12} /> Campus High-Speed Wi-Fi
                      </span>
                    )}
                    {selectedMarker.hasWhiteboard && (
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md font-semibold border border-emerald-200 flex items-center gap-1">
                        <Check size={12} /> Interactive Whiteboard
                      </span>
                    )}
                    {selectedMarker.isAccessible && (
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md font-semibold border border-emerald-200 flex items-center gap-1">
                        <Accessibility size={12} /> Wheelchair Access
                      </span>
                    )}
                  </div>
                </div>

                {/* Live Current Class & Next Class Cards */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Live Class Status
                  </span>
                  
                  {/* Current Class */}
                  <div className={`p-3 rounded-xl border text-xs ${
                    selectedRoomDetails?.current 
                      ? 'bg-rose-50/70 border-rose-200 text-rose-950' 
                      : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  }`}>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase mb-1">
                      <span>Current Slot</span>
                      <span>{selectedRoomDetails?.current ? 'In Progress' : 'Hall Free'}</span>
                    </div>
                    {selectedRoomDetails?.current ? (
                      <div className="space-y-0.5">
                        <div className="font-bold text-sm text-gray-900">{selectedRoomDetails.current.subject}</div>
                        <div className="text-gray-600 font-medium">Faculty: {selectedRoomDetails.current.faculty}</div>
                        <div className="text-[11px] text-rose-700 font-mono font-bold">
                          {selectedRoomDetails.current.startTime} - {selectedRoomDetails.current.endTime} • {selectedRoomDetails.current.division}
                          {selectedRoomDetails.current.remainingMinutes > 0 && (
                            <span className="ml-2 font-sans text-[10px] text-rose-600">
                              ({selectedRoomDetails.current.remainingMinutes}m left)
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-emerald-800 font-medium">
                        No lecture in session. Classroom is open and available.
                      </div>
                    )}
                  </div>

                  {/* Next Class */}
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-0.5">
                    <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">
                      Upcoming Next Lecture
                    </div>
                    {selectedRoomDetails?.next ? (
                      <div>
                        <div className="font-bold text-gray-900">{selectedRoomDetails.next.subject}</div>
                        <div className="text-gray-600 font-medium">Faculty: {selectedRoomDetails.next.faculty}</div>
                        <div className="text-[11px] text-[#003366] font-mono font-bold">
                          Starts at {selectedRoomDetails.next.startTime} (until {selectedRoomDetails.next.endTime})
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500">No further scheduled lectures for today.</div>
                    )}
                  </div>
                </div>

                {/* Today's Complete Room Schedule */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Today's Full Schedule
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {selectedRoomDetails?.todayEntries.length || 0} Lectures
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 text-xs">
                    {selectedRoomDetails && selectedRoomDetails.todayEntries.length > 0 ? (
                      selectedRoomDetails.todayEntries.map((e, idx) => (
                        <div key={idx} className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                          <div>
                            <div className="font-bold text-gray-900 text-[11px]">{e.subjectCode} — {e.subject}</div>
                            <div className="text-[10px] text-gray-500">{e.faculty} • {e.division}</div>
                          </div>
                          <div className="text-right font-mono text-[10px] font-bold text-[#003366]">
                            {e.start_time} - {e.end_time}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-400 text-xs">No scheduled lectures today.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <button
                  onClick={() => handleNavigateToMarker(selectedMarker)}
                  className="w-full py-2.5 bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                >
                  <Navigation size={14} />
                  <span>Navigate To Room</span>
                </button>

                {selectedMarker.roomNumber && (
                  <Link
                    to={`/portal?tab=timetable&room=${selectedMarker.roomNumber}`}
                    className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Calendar size={13} />
                    <span>View Room Timetable</span>
                  </Link>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 7. ADMIN MAP MODE: INLINE METADATA & MAINTENANCE MODAL */}
      {showAdminEditModal && editingRoomData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Admin Room Configuration & Maintenance
                </h3>
                <p className="text-xs text-gray-500">
                  Update spatial room metadata, capacity, department assignment, and maintenance flags.
                </p>
              </div>
              <button 
                onClick={() => setShowAdminEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {adminSaveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Room configuration updated and synced to database!</span>
              </div>
            )}

            <form onSubmit={handleSaveAdminEdit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Room Number</label>
                  <input
                    type="text"
                    value={editingRoomData.roomNumber || ''}
                    onChange={(e) => setEditingRoomData({ ...editingRoomData, roomNumber: e.target.value })}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Location Title</label>
                  <input
                    type="text"
                    value={editingRoomData.name || ''}
                    onChange={(e) => setEditingRoomData({ ...editingRoomData, name: e.target.value })}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={editingRoomData.department || ''}
                    onChange={(e) => setEditingRoomData({ ...editingRoomData, department: e.target.value })}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    value={editingRoomData.capacity || 60}
                    onChange={(e) => setEditingRoomData({ ...editingRoomData, capacity: Number(e.target.value) })}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg font-bold"
                  />
                </div>
              </div>

              {/* Maintenance & Active Overrides */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                <span className="font-bold text-amber-900 text-[11px] block">Operational Flags</span>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-800">
                    <input
                      type="checkbox"
                      checked={editingRoomData.isMaintenance || false}
                      onChange={(e) => setEditingRoomData({ ...editingRoomData, isMaintenance: e.target.checked })}
                      className="rounded text-amber-600 focus:ring-0"
                    />
                    <span>Maintenance Mode (Yellow)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-800">
                    <input
                      type="checkbox"
                      checked={editingRoomData.isInactive || false}
                      onChange={(e) => setEditingRoomData({ ...editingRoomData, isInactive: e.target.checked })}
                      className="rounded text-gray-600 focus:ring-0"
                    />
                    <span>Room Inactive (Gray)</span>
                  </label>
                </div>
              </div>

              {/* Equipment Checkboxes */}
              <div className="space-y-1.5">
                <span className="font-bold text-gray-700 text-[11px] block">Facility Equipment</span>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                    <input
                      type="checkbox"
                      checked={editingRoomData.hasProjector || false}
                      onChange={(e) => setEditingRoomData({ ...editingRoomData, hasProjector: e.target.checked })}
                      className="rounded text-[#003366] focus:ring-0"
                    />
                    <span>Projector & AV Screen</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                    <input
                      type="checkbox"
                      checked={editingRoomData.hasAc || false}
                      onChange={(e) => setEditingRoomData({ ...editingRoomData, hasAc: e.target.checked })}
                      className="rounded text-[#003366] focus:ring-0"
                    />
                    <span>Air Conditioning</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                    <input
                      type="checkbox"
                      checked={editingRoomData.hasWifi || false}
                      onChange={(e) => setEditingRoomData({ ...editingRoomData, hasWifi: e.target.checked })}
                      className="rounded text-[#003366] focus:ring-0"
                    />
                    <span>Wi-Fi Coverage</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                    <input
                      type="checkbox"
                      checked={editingRoomData.hasWhiteboard || false}
                      onChange={(e) => setEditingRoomData({ ...editingRoomData, hasWhiteboard: e.target.checked })}
                      className="rounded text-[#003366] focus:ring-0"
                    />
                    <span>Interactive Whiteboard</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAdminEditModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#003366] hover:bg-blue-900 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Save size={14} />
                  <span>Save Room Configuration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
export default CampusMap;
