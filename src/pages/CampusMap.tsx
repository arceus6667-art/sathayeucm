import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Navigation, Layers, Compass, Search, Filter, 
  Accessibility, Building2, Coffee, BookOpen, Clock, 
  ChevronRight, ArrowRight, ShieldCheck, CheckCircle2, Info, Eye
} from 'lucide-react';
import { CAMPUS_LOCATIONS, CampusLocation } from '../smartCampusData';

export function CampusMap() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLocation, setActiveLocation] = useState<CampusLocation | null>(null);
  const [isWheelchairMode, setIsWheelchairMode] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Check URL query parameter ?target=loc-id
  useEffect(() => {
    const targetId = searchParams.get('target');
    if (targetId) {
      const found = CAMPUS_LOCATIONS.find(l => l.id === targetId);
      if (found) {
        setActiveLocation(found);
        setSelectedFloor(found.floor);
        setIsNavigating(true);
      }
    }
  }, [searchParams]);

  const filteredLocations = useMemo(() => {
    return CAMPUS_LOCATIONS.filter(loc => {
      const matchesFloor = selectedFloor === 'all' || loc.floor === selectedFloor;
      const matchesCategory = selectedCategory === 'all' || loc.type === selectedCategory;
      const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.buildingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (loc.roomNumber && loc.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesWheelchair = !isWheelchairMode || loc.isAccessible;
      return matchesFloor && matchesCategory && matchesSearch && matchesWheelchair;
    });
  }, [selectedFloor, selectedCategory, searchQuery, isWheelchairMode]);

  // Turn-by-turn route steps calculation
  const routeSteps = useMemo(() => {
    if (!activeLocation) return [];
    
    const steps = [
      { text: 'Start from Campus Main Gate / Central Quadrangle', distance: '0 m', time: '0 min' },
    ];

    if (activeLocation.buildingId === 'bldg-main') {
      steps.push({ text: 'Head straight through the marble colonnade toward Main Academic Block', distance: '40 m', time: '1 min' });
      if (activeLocation.floor > 0) {
        if (isWheelchairMode) {
          steps.push({ text: 'Take the West Atrium Elevator to Floor ' + activeLocation.floor, distance: '25 m', time: '1 min' });
        } else {
          steps.push({ text: 'Ascend Central Stairwell to Floor ' + activeLocation.floor, distance: '30 m', time: '1.5 min' });
        }
      }
      steps.push({ text: `Arrive at ${activeLocation.name} (${activeLocation.roomNumber || ''})`, distance: '15 m', time: '0.5 min' });
    } else if (activeLocation.buildingId === 'bldg-it') {
      steps.push({ text: 'Walk east past the Botanical Garden to the IT & Self-Finance Wing', distance: '70 m', time: '1.5 min' });
      if (activeLocation.floor > 0) {
        steps.push({ text: isWheelchairMode ? 'Take South Elevator to ' + activeLocation.floorLabel : 'Take IT Wing Staircase to ' + activeLocation.floorLabel, distance: '35 m', time: '1.5 min' });
      }
      steps.push({ text: `Reach ${activeLocation.name}`, distance: '20 m', time: '0.5 min' });
    } else if (activeLocation.buildingId === 'bldg-lib') {
      steps.push({ text: 'Take the shaded tree-lined pathway to Knowledge Resource Center', distance: '60 m', time: '1 min' });
      steps.push({ text: 'Use the step-free entrance ramp to Central Library', distance: '20 m', time: '0.5 min' });
    } else if (activeLocation.buildingId === 'bldg-canteen') {
      steps.push({ text: 'Head past the Sports Ground toward the Cafeteria Pavilion', distance: '85 m', time: '1.5 min' });
      steps.push({ text: 'Enter open-air Student Canteen & Food Counters', distance: '10 m', time: '0.5 min' });
    } else {
      steps.push({ text: `Follow direct campus signage toward ${activeLocation.buildingName}`, distance: '90 m', time: '2 mins' });
      steps.push({ text: `Arrive at ${activeLocation.name}`, distance: '15 m', time: '0.5 min' });
    }

    return steps;
  }, [activeLocation, isWheelchairMode]);

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Top Banner */}
      <div className="bg-[#003366] text-white py-8 border-b-4 border-yellow-500">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-yellow-400 text-xs uppercase font-extrabold tracking-wider mb-1">
                <Compass size={16} />
                <span>Interactive Campus Navigation</span>
              </div>
              <h1 className="text-3xl font-extrabold uppercase tracking-tight">3D Campus Map & Directions</h1>
              <p className="text-sm text-blue-200 mt-1">
                Sathaye College Campus • Real-time indoor & outdoor routing with wheelchair-friendly accessible paths
              </p>
            </div>

            {/* Accessibility / Wheelchair Toggle */}
            <button
              onClick={() => setIsWheelchairMode(!isWheelchairMode)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow ${
                isWheelchairMode
                  ? 'bg-yellow-400 text-[#003366] ring-2 ring-yellow-300'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              <Accessibility size={18} />
              <span>{isWheelchairMode ? 'Wheelchair Route: ACTIVE' : 'Wheelchair-Friendly Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Controls Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search rooms (e.g. 204), labs, library, canteen..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#003366] focus:bg-white"
            />
          </div>

          {/* Floor Filters */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0">
            <span className="text-xs font-bold text-gray-500 mr-1 flex items-center shrink-0">
              <Layers size={14} className="mr-1" /> Floor:
            </span>
            {(['all', 0, 1, 2, 3, 4] as const).map(fl => (
              <button
                key={fl}
                onClick={() => setSelectedFloor(fl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors shrink-0 ${
                  selectedFloor === fl
                    ? 'bg-[#003366] text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {fl === 'all' ? 'All Floors' : fl === 0 ? 'Ground' : `${fl}F`}
              </button>
            ))}
          </div>

          {/* Category Filters */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0">
            <span className="text-xs font-bold text-gray-500 mr-1 flex items-center shrink-0">
              <Filter size={14} className="mr-1" /> Type:
            </span>
            {[
              { id: 'all', label: 'All' },
              { id: 'classroom', label: 'Classrooms' },
              { id: 'lab', label: 'Labs' },
              { id: 'library', label: 'Library' },
              { id: 'canteen', label: 'Canteen' },
              { id: 'medical', label: 'Medical' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-yellow-500 text-[#003366] font-bold'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: 3D Map Canvas & Navigation Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Isometric Canvas */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl shadow-lg border border-slate-700 overflow-hidden relative min-h-[520px] flex flex-col">
            {/* Top Canvas Bar */}
            <div className="bg-slate-800/90 backdrop-blur px-4 py-2.5 flex items-center justify-between border-b border-slate-700 z-10">
              <div className="flex items-center space-x-2 text-xs font-bold text-yellow-400">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live Campus Isometric Plan</span>
              </div>
              <div className="text-xs text-slate-300">
                Click any marker to inspect & navigate
              </div>
            </div>

            {/* Campus SVG Stage with Buildings & Nodes */}
            <div className="flex-1 relative w-full h-full p-4 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 800 600" className="w-full h-full max-h-[500px] select-none">
                <defs>
                  {/* Gradients for 3D buildings */}
                  <linearGradient id="mainBldgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e3a8a" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                  <linearGradient id="itBldgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="#0369a1" />
                  </linearGradient>
                  <linearGradient id="canteenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ea580c" />
                    <stop offset="100%" stopColor="#9a3412" />
                  </linearGradient>
                  <linearGradient id="turfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#15803d" />
                    <stop offset="100%" stopColor="#166534" />
                  </linearGradient>
                  <filter id="dropGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Campus Ground Plane (Isometric Polygon) */}
                <polygon
                  points="400,60 760,240 400,560 40,380"
                  fill="#1e293b"
                  stroke="#334155"
                  strokeWidth="3"
                />

                {/* Pathway Network */}
                <path
                  d="M 400,520 L 400,280 L 580,200 M 400,380 L 220,300 M 400,340 L 520,390"
                  stroke={isWheelchairMode ? "#facc15" : "#64748b"}
                  strokeWidth={isWheelchairMode ? "4" : "3"}
                  strokeDasharray={isWheelchairMode ? "6,4" : "none"}
                  fill="none"
                />

                {/* Building 1: Kashinath Dhuru Auditorium (Top) */}
                <g className="cursor-pointer" onClick={() => setActiveLocation(CAMPUS_LOCATIONS.find(l => l.id === 'loc-auditorium') || null)}>
                  <polygon points="400,100 480,140 400,180 320,140" fill="#334155" stroke="#475569" strokeWidth="2" />
                  <polygon points="320,140 400,180 400,220 320,180" fill="#1e293b" />
                  <polygon points="400,180 480,140 480,180 400,220" fill="#0f172a" />
                  <text x="400" y="145" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">Auditorium</text>
                </g>

                {/* Building 2: Main Academic Block (Left) */}
                <g className="cursor-pointer" onClick={() => setActiveLocation(CAMPUS_LOCATIONS.find(l => l.id === 'loc-room-204') || null)}>
                  <polygon points="260,200 360,250 260,300 160,250" fill="url(#mainBldgGrad)" stroke="#3b82f6" strokeWidth="2" />
                  <polygon points="160,250 260,300 260,380 160,330" fill="#1e3a8a" opacity="0.9" />
                  <polygon points="260,300 360,250 360,330 260,380" fill="#172554" />
                  <text x="260" y="255" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">Main Academic Block</text>
                  <text x="260" y="272" textAnchor="middle" fill="#93c5fd" fontSize="9">Rooms 101-205 • Labs • Admin</text>
                </g>

                {/* Building 3: IT & Self-Finance Wing (Right) */}
                <g className="cursor-pointer" onClick={() => setActiveLocation(CAMPUS_LOCATIONS.find(l => l.id === 'loc-it-lab-1') || null)}>
                  <polygon points="560,180 660,230 560,280 460,230" fill="url(#itBldgGrad)" stroke="#38bdf8" strokeWidth="2" />
                  <polygon points="460,230 560,280 560,360 460,310" fill="#0369a1" opacity="0.9" />
                  <polygon points="560,280 660,230 660,310 560,360" fill="#0c4a6e" />
                  <text x="560" y="235" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">IT & SF Wing</text>
                  <text x="560" y="252" textAnchor="middle" fill="#bae6fd" fontSize="9">IT Lab 1 • Room 402</text>
                </g>

                {/* Building 4: Central Library (Center-Left) */}
                <g className="cursor-pointer" onClick={() => setActiveLocation(CAMPUS_LOCATIONS.find(l => l.id === 'loc-central-lib') || null)}>
                  <polygon points="220,360 300,400 220,440 140,400" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
                  <polygon points="140,400 220,440 220,490 140,450" fill="#334155" />
                  <polygon points="220,440 300,400 300,450 220,490" fill="#1e293b" />
                  <text x="220" y="405" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">Central Library</text>
                </g>

                {/* Building 5: Student Canteen (Center-Right) */}
                <g className="cursor-pointer" onClick={() => setActiveLocation(CAMPUS_LOCATIONS.find(l => l.id === 'loc-canteen') || null)}>
                  <polygon points="480,350 560,390 480,430 400,390" fill="url(#canteenGrad)" stroke="#fb923c" strokeWidth="2" />
                  <polygon points="400,390 480,430 480,470 400,430" fill="#9a3412" />
                  <polygon points="480,430 560,390 560,430 480,470" fill="#7c2d12" />
                  <text x="480" y="395" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">Student Canteen</text>
                </g>

                {/* Facility: Multi-Sport Synthetic Turf (Far Right) */}
                <g className="cursor-pointer" onClick={() => setActiveLocation(CAMPUS_LOCATIONS.find(l => l.id === 'loc-sports-turf') || null)}>
                  <polygon points="650,330 730,370 650,410 570,370" fill="url(#turfGrad)" stroke="#4ade80" strokeWidth="2" />
                  <text x="650" y="375" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Sports Turf</text>
                </g>

                {/* Campus Main Gate Point */}
                <g>
                  <circle cx="400" cy="530" r="10" fill="#eab308" stroke="#ffffff" strokeWidth="3" />
                  <text x="400" y="555" textAnchor="middle" fill="#fef08a" fontSize="11" fontWeight="bold">Campus Main Entrance</text>
                </g>

                {/* Interactive Location Marker Pins */}
                {filteredLocations.map(loc => {
                  const isSelected = activeLocation?.id === loc.id;
                  const cx = 80 + (loc.x * 6.4);
                  const cy = 100 + (loc.y * 4.2);

                  return (
                    <g
                      key={loc.id}
                      className="cursor-pointer transition-transform hover:scale-125"
                      onClick={() => {
                        setActiveLocation(loc);
                        setIsNavigating(true);
                      }}
                    >
                      {/* Active glow pulse */}
                      {isSelected && (
                        <circle cx={cx} cy={cy} r="18" fill="#facc15" opacity="0.3" className="animate-ping" />
                      )}

                      <circle
                        cx={cx}
                        cy={cy}
                        r={isSelected ? "11" : "8"}
                        fill={isSelected ? "#facc15" : loc.type === 'canteen' ? '#fb923c' : loc.type === 'library' ? '#38bdf8' : '#3b82f6'}
                        stroke="#ffffff"
                        strokeWidth="2.5"
                      />

                      {/* Small text label */}
                      <text
                        x={cx}
                        y={cy - 12}
                        textAnchor="middle"
                        fill={isSelected ? '#facc15' : '#ffffff'}
                        fontSize="10"
                        fontWeight="bold"
                        className="drop-shadow"
                      >
                        {loc.name.split(' ')[0]} {loc.roomNumber ? `(${loc.roomNumber})` : ''}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Bottom Status Ticker */}
            <div className="bg-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-300 border-t border-slate-700">
              <span className="flex items-center">
                <ShieldCheck size={14} className="mr-1.5 text-emerald-400" />
                Emergency evacuation gathering zone: Central Quadrangle (Main Gate)
              </span>
              <span className="text-yellow-400 font-bold">
                {isWheelchairMode ? 'Wheelchair step-free paths highlighted in yellow' : 'Standard walking paths active'}
              </span>
            </div>
          </div>

          {/* Right Panel: Selected Destination & Navigation Guide */}
          <div className="space-y-6">
            {activeLocation ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-[#003366] text-white p-5 border-b-4 border-yellow-500">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="bg-yellow-400 text-[#003366] text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                        {activeLocation.type}
                      </span>
                      <h3 className="text-xl font-extrabold mt-1">{activeLocation.name}</h3>
                      <p className="text-xs text-blue-200">
                        {activeLocation.buildingName} • {activeLocation.floorLabel}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-500/30">
                      {activeLocation.currentStatus}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {activeLocation.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Accessibility</span>
                      <span className="font-bold text-gray-800 flex items-center mt-0.5">
                        <Accessibility size={14} className="mr-1 text-blue-600" />
                        {activeLocation.isAccessible ? 'Wheelchair Accessible' : 'Stair Access'}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Elevator</span>
                      <span className="font-bold text-gray-800 flex items-center mt-0.5">
                        <Building2 size={14} className="mr-1 text-yellow-600" />
                        {activeLocation.elevatorNearby ? 'Elevator Nearby' : 'Ground Level'}
                      </span>
                    </div>
                  </div>

                  {/* Turn-by-Turn Navigation Card */}
                  <div className="border border-blue-100 bg-blue-50/60 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-[#003366] flex items-center">
                        <Navigation size={15} className="mr-1.5 text-yellow-600" />
                        Turn-by-Turn Directions
                      </h4>
                      <span className="text-[11px] font-bold text-blue-800 bg-white px-2 py-0.5 rounded shadow-sm">
                        Approx 3 mins walk (140 m)
                      </span>
                    </div>

                    <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-200">
                      {routeSteps.map((step, idx) => (
                        <div key={idx} className="flex items-start space-x-3 relative text-xs">
                          <div className="w-6 h-6 rounded-full bg-white border-2 border-[#003366] text-[#003366] font-bold flex items-center justify-center shrink-0 z-10 text-[10px]">
                            {idx + 1}
                          </div>
                          <div className="flex-1 pt-0.5">
                            <p className="font-medium text-gray-800">{step.text}</p>
                            <span className="text-[10px] text-gray-400">
                              {step.distance} • {step.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contextual Action Buttons */}
                  {activeLocation.type === 'canteen' && (
                    <button
                      onClick={() => navigate('/canteen')}
                      className="w-full bg-[#003366] hover:bg-blue-900 text-yellow-400 font-bold text-xs py-2.5 rounded-xl shadow transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Coffee size={16} />
                      <span>View Canteen Menu & Order Online</span>
                    </button>
                  )}

                  {activeLocation.type === 'library' && (
                    <button
                      onClick={() => navigate('/library')}
                      className="w-full bg-[#003366] hover:bg-blue-900 text-yellow-400 font-bold text-xs py-2.5 rounded-xl shadow transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <BookOpen size={16} />
                      <span>Check Reading Hall Seats & Catalog</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center shadow-sm">
                <MapPin size={48} className="mx-auto text-gray-300 mb-3" />
                <h3 className="font-bold text-gray-800 text-base">Select a Campus Location</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Choose a room, department, library, or canteen from the map or list below to view turn-by-turn directions.
                </p>
              </div>
            )}

            {/* Quick Destinations List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#003366]">
                  Popular Campus Destinations ({filteredLocations.length})
                </h4>
              </div>
              <ul className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                {filteredLocations.map(loc => (
                  <li
                    key={loc.id}
                    onClick={() => {
                      setActiveLocation(loc);
                      setIsNavigating(true);
                    }}
                    className={`p-3.5 hover:bg-blue-50/50 cursor-pointer transition-colors flex items-center justify-between ${
                      activeLocation?.id === loc.id ? 'bg-blue-50 border-l-4 border-[#003366]' : ''
                    }`}
                  >
                    <div>
                      <h5 className="font-bold text-xs text-gray-900">{loc.name}</h5>
                      <p className="text-[11px] text-gray-500">{loc.buildingName} • {loc.floorLabel}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampusMap;
