import React, { useState, useEffect } from 'react';
import { 
  Video, ShieldAlert, AlertTriangle, CheckCircle2, Eye, 
  Radio, Bell, MapPin, Zap, UserCheck, ShieldCheck, Flame, RefreshCw
} from 'lucide-react';
import { campusStore } from '../../services/campusStore';

export interface CCTVFeed {
  id: string;
  name: string;
  location: string;
  streamStatus: 'ONLINE' | 'OFFLINE' | 'WARNING';
  fps: number;
  anomalyDetected: boolean;
  anomalyType?: 'UNAUTHORIZED_ENTRY' | 'LOITERING_NIGHT' | 'CROWD_SURGE' | 'NORMAL';
  anomalySeverity?: 'CRITICAL' | 'MEDIUM' | 'LOW';
  anomalyDescription?: string;
  detectedAt?: string;
  peopleCount: number;
  bgGradient: string;
}

export const INITIAL_FEEDS: CCTVFeed[] = [
  {
    id: 'cam-01',
    name: 'CAM 01 • Main Entrance Gate 1',
    location: 'Campus Perimeter & Turnstiles',
    streamStatus: 'ONLINE',
    fps: 30,
    anomalyDetected: false,
    anomalyType: 'NORMAL',
    peopleCount: 8,
    bgGradient: 'from-slate-900 via-slate-800 to-indigo-950'
  },
  {
    id: 'cam-02',
    name: 'CAM 02 • Central Quadrangle Lawn',
    location: 'Open Assembly Zone',
    streamStatus: 'ONLINE',
    fps: 25,
    anomalyDetected: true,
    anomalyType: 'CROWD_SURGE',
    anomalySeverity: 'MEDIUM',
    anomalyDescription: 'Crowd gathering density spiked to 64 persons (Anomaly threshold > 50)',
    detectedAt: '3 mins ago',
    peopleCount: 64,
    bgGradient: 'from-zinc-900 via-stone-800 to-slate-900'
  },
  {
    id: 'cam-03',
    name: 'CAM 03 • Server Room & Network Core (Restricted)',
    location: 'Ground Floor Admin Annex',
    streamStatus: 'WARNING',
    fps: 30,
    anomalyDetected: true,
    anomalyType: 'UNAUTHORIZED_ENTRY',
    anomalySeverity: 'CRITICAL',
    anomalyDescription: 'Unauthorized perimeter breach after designated access hours. Zero RFID badge presented.',
    detectedAt: 'Just now',
    peopleCount: 1,
    bgGradient: 'from-red-950 via-slate-900 to-zinc-950'
  },
  {
    id: 'cam-04',
    name: 'CAM 04 • Library 2nd Floor Corridor',
    location: 'Academic Reading Hall',
    streamStatus: 'ONLINE',
    fps: 28,
    anomalyDetected: false,
    anomalyType: 'NORMAL',
    peopleCount: 12,
    bgGradient: 'from-slate-900 via-blue-950 to-neutral-900'
  },
  {
    id: 'cam-05',
    name: 'CAM 05 • Canteen Token Queue',
    location: 'Dining Hall Service Counter',
    streamStatus: 'ONLINE',
    fps: 30,
    anomalyDetected: false,
    anomalyType: 'NORMAL',
    peopleCount: 14,
    bgGradient: 'from-neutral-900 via-slate-800 to-zinc-900'
  }
];

export default function CCTVAnomalyDetector() {
  const [feeds, setFeeds] = useState<CCTVFeed[]>(INITIAL_FEEDS);
  const [selectedFeedId, setSelectedFeedId] = useState<string>('cam-03');
  const [dispatchedIncidents, setDispatchedIncidents] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  const activeFeed = feeds.find(f => f.id === selectedFeedId) || feeds[0];

  const handleDispatchSecurity = (feed: CCTVFeed) => {
    setDispatchedIncidents(prev => ({ ...prev, [feed.id]: true }));
    
    // Push urgent emergency dispatch to campusStore
    campusStore.addNotification({
      title: `SECURITY DISPATCHED: ${feed.name}`,
      message: `Emergency response unit dispatched to ${feed.location}. Anomaly: ${feed.anomalyDescription}`,
      type: 'emergency',
      targetRole: 'ALL'
    });

    setFeedback(`Security Guard Unit #2 dispatched to ${feed.location}! Gate siren acknowledged.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border-l-4 border-red-500 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-red-600 text-white text-xs font-black px-2.5 py-0.5 rounded uppercase flex items-center">
              <Radio size={12} className="mr-1 animate-pulse" /> Live AI Vision Surveillance
            </span>
            <span className="text-xs text-red-200">Campus CCTV Edge Anomaly Detection</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Automated Campus Safety & Anomaly Command Hub
          </h2>
          <p className="text-xs text-gray-300 mt-0.5">
            Edge neural networks monitor camera feeds 24x7 for unauthorized entry, nocturnal loitering, and sudden crowd surge anomalies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-red-500/20 text-red-300 border border-red-500/40 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center">
            <ShieldAlert size={14} className="mr-1.5 text-red-400" />
            2 Active Security Anomalies
          </span>
        </div>
      </div>

      {feedback && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow flex items-center">
          <CheckCircle2 size={16} className="mr-2 text-yellow-300" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main CCTV Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Interactive Feed Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Live Camera Nodes (5 Active)</h3>
          <div className="space-y-2">
            {feeds.map(feed => {
              const isDispatched = dispatchedIncidents[feed.id];
              return (
                <div
                  key={feed.id}
                  onClick={() => setSelectedFeedId(feed.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedFeedId === feed.id
                      ? 'bg-slate-900 text-white border-yellow-500 shadow-md ring-1 ring-yellow-400/50'
                      : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-800'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className={`w-2 h-2 rounded-full ${feed.streamStatus === 'ONLINE' ? 'bg-emerald-500' : 'bg-red-500 animate-ping'}`} />
                        <h4 className="font-bold text-xs leading-tight">{feed.name}</h4>
                      </div>
                      <p className={`text-[10px] mt-0.5 ${selectedFeedId === feed.id ? 'text-gray-300' : 'text-gray-500'}`}>
                        {feed.location}
                      </p>
                    </div>

                    {feed.anomalyDetected && (
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                        feed.anomalySeverity === 'CRITICAL' ? 'bg-red-600 text-white animate-pulse' : 'bg-amber-500 text-slate-900'
                      }`}>
                        {feed.anomalyType}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="font-mono text-gray-400">{feed.fps} FPS • {feed.peopleCount} detected</span>
                    {isDispatched && (
                      <span className="text-emerald-400 font-bold flex items-center">
                        <CheckCircle2 size={10} className="mr-0.5" /> Unit Dispatched
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Large Active Stream Inspector & AI Vision Overlay */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
            
            {/* Camera Header Bar */}
            <div className="p-3 bg-slate-900/90 border-b border-slate-800 text-white flex justify-between items-center text-xs">
              <div className="flex items-center space-x-2">
                <Video size={15} className="text-red-400" />
                <span className="font-bold">{activeFeed.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">REC [H.265/1080p]</span>
              </div>
              <div className="flex items-center space-x-2 font-mono text-[10px] text-slate-300">
                <span>{new Date().toLocaleTimeString()}</span>
                <span className="text-emerald-400 font-bold">● LIVE</span>
              </div>
            </div>

            {/* Simulated Live Viewport with AI Bounding Boxes */}
            <div className={`relative h-72 sm:h-80 bg-gradient-to-br ${activeFeed.bgGradient} flex items-center justify-center p-4 select-none overflow-hidden`}>
              
              {/* Grid scanning effect */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

              {/* Live HUD Overlay */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                AI Vision Model: YOLO-Campus-v8 | Inference: 14ms
              </div>

              {/* Anomaly Bounding Box in Center if Anomaly Detected */}
              {activeFeed.anomalyDetected ? (
                <div className="relative border-2 border-red-500 rounded-lg p-6 bg-red-950/30 backdrop-blur-xs text-center animate-pulse max-w-sm">
                  <div className="absolute -top-3 left-3 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
                    ALERT: {activeFeed.anomalyType} (98.4% Confidence)
                  </div>
                  <AlertTriangle size={32} className="mx-auto text-red-400 mb-1" />
                  <div className="text-xs font-extrabold text-white">{activeFeed.anomalyDescription}</div>
                  <div className="text-[10px] font-mono text-red-200 mt-1">Detected: {activeFeed.detectedAt}</div>
                </div>
              ) : (
                <div className="border border-emerald-500/40 rounded-lg p-5 bg-emerald-950/20 backdrop-blur-xs text-center max-w-xs">
                  <ShieldCheck size={28} className="mx-auto text-emerald-400 mb-1" />
                  <div className="text-xs font-bold text-emerald-200">Zero Security Anomalies</div>
                  <p className="text-[10px] text-gray-300 mt-0.5">Normal human movement flow within standard safety parameters.</p>
                </div>
              )}

              {/* Watermark */}
              <div className="absolute bottom-3 right-3 text-[10px] font-mono text-white/40">
                SATHAYE AUTONOMOUS • SECURITY TELEMETRY
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="text-slate-300">
                <span className="font-bold text-white block">Location: {activeFeed.location}</span>
                <span className="text-[11px] text-slate-400">Headcount in frame: {activeFeed.peopleCount} individuals</span>
              </div>

              {activeFeed.anomalyDetected && (
                <button
                  onClick={() => handleDispatchSecurity(activeFeed)}
                  disabled={dispatchedIncidents[activeFeed.id]}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-emerald-700 text-white font-extrabold text-xs uppercase px-4 py-2 rounded-xl transition-all shadow-lg flex items-center justify-center shrink-0"
                >
                  {dispatchedIncidents[activeFeed.id] ? (
                    <>
                      <CheckCircle2 size={14} className="mr-1.5" /> Unit Dispatched
                    </>
                  ) : (
                    <>
                      <ShieldAlert size={14} className="mr-1.5" /> Dispatch Emergency Security
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
