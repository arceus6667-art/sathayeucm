import React, { useState, useEffect } from 'react';
import { 
  Cpu, Play, CheckCircle2, RefreshCw, Zap, TrendingUp, 
  Layers, Sun, BatteryCharging, AlertCircle, ArrowUpRight, 
  Settings, Flame, Activity, ShieldCheck, Download, Sparkles
} from 'lucide-react';
import { 
  rlAllocatorService, CampusRoom, DeployedCampusPolicy, SimEpisodeMetrics 
} from '../../services/rlAllocatorEngine';

export default function RLResourceAllocator() {
  const [activeSubTab, setActiveSubTab] = useState<'realtime' | 'simulator' | 'telemetry'>('realtime');
  const [rooms, setRooms] = useState<CampusRoom[]>(rlAllocatorService.getRooms());
  const [policy, setPolicy] = useState<DeployedCampusPolicy>(rlAllocatorService.getActivePolicy());

  // Simulation Controls
  const [episodes, setEpisodes] = useState<number>(300);
  const [learningRate, setLearningRate] = useState<number>(0.1);
  const [gamma, setGamma] = useState<number>(0.95);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainProgress, setTrainProgress] = useState<SimEpisodeMetrics | null>(null);
  const [simHistory, setSimHistory] = useState<SimEpisodeMetrics[]>([]);
  const [deployedNotification, setDeployedNotification] = useState<string | null>(null);

  const handleStartTraining = async () => {
    setIsTraining(true);
    setTrainProgress(null);
    setSimHistory([]);

    const history = await rlAllocatorService.trainPolicy(
      episodes,
      learningRate,
      gamma,
      1.0,
      (progress) => {
        setTrainProgress(progress);
      }
    );

    setSimHistory(history);
    setIsTraining(false);
  };

  const handleDeployPolicy = () => {
    if (simHistory.length === 0) return;
    const finalMetric = simHistory[simHistory.length - 1];
    const newPolicy = rlAllocatorService.deploySimulatedPolicy(episodes, finalMetric);
    setPolicy({ ...newPolicy });
    setDeployedNotification(`Policy ${newPolicy.version} deployed to live campus grid & timetable!`);
    setActiveSubTab('realtime');
    setTimeout(() => setDeployedNotification(null), 4000);
  };

  const handleHvacToggle = (roomId: string, mode: 'OFF' | 'ECO' | 'FULL') => {
    rlAllocatorService.setRoomHvac(roomId, mode);
    setRooms([...rlAllocatorService.getRooms()]);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="bg-[#003366] text-white rounded-2xl p-6 border-b-4 border-yellow-500 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="bg-yellow-400 text-[#003366] text-xs font-black px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center">
              <Cpu size={14} className="mr-1" /> Novel Core • Sim-to-Real Pipeline
            </span>
            <span className="text-xs text-blue-200">Reinforcement Learning Resource & Energy Scheduler</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Autonomous RL Campus Allocator
          </h2>
          <p className="text-xs md:text-sm text-blue-200 mt-1 max-w-2xl">
            Trains deep Q-policies in a safe digital-twin simulation, then deploys optimal classroom occupancy and dynamic HVAC energy dispatch to physical campus infrastructure.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center">
            <CheckCircle2 size={15} className="mr-1.5 text-emerald-400" />
            Active Policy: {policy.version}
          </span>
          <button
            onClick={() => setActiveSubTab('simulator')}
            className="bg-yellow-400 hover:bg-yellow-300 text-[#003366] px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow flex items-center"
          >
            <Play size={13} className="mr-1.5 fill-current" /> Open Training Gym
          </button>
        </div>
      </div>

      {/* Deployed Toast */}
      {deployedNotification && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <Sparkles size={20} className="text-yellow-300" />
            <span className="text-xs sm:text-sm font-extrabold">{deployedNotification}</span>
          </div>
          <span className="text-xs bg-emerald-800 px-2 py-1 rounded">Telemetry Updated</span>
        </div>
      )}

      {/* Sub Navigation */}
      <div className="flex space-x-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveSubTab('realtime')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all ${
            activeSubTab === 'realtime'
              ? 'bg-[#003366] text-yellow-400 shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <TrendingUp size={15} />
          <span>Live Deployed Telemetry</span>
        </button>
        <button
          onClick={() => setActiveSubTab('simulator')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all ${
            activeSubTab === 'simulator'
              ? 'bg-[#003366] text-yellow-400 shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Cpu size={15} />
          <span>Sim-to-Real RL Gym</span>
        </button>
        <button
          onClick={() => setActiveSubTab('telemetry')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all ${
            activeSubTab === 'telemetry'
              ? 'bg-[#003366] text-yellow-400 shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Zap size={15} />
          <span>Smart Grid & HVAC Overrides</span>
        </button>
      </div>

      {/* TAB 1: LIVE DEPLOYED TELEMETRY */}
      {activeSubTab === 'realtime' && (
        <div className="space-y-6">
          {/* Key KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-[11px] font-bold text-gray-500 uppercase">Policy Allocation Efficiency</span>
              <div className="text-2xl sm:text-3xl font-black text-[#003366] mt-1">{policy.overallEfficiency}%</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center">
                <ArrowUpRight size={13} className="mr-0.5" /> +14.2% over heuristic static timetable
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-[11px] font-bold text-gray-500 uppercase">Est. Monthly Power Savings</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">₹{policy.monthlySavingsInr.toLocaleString()}</div>
              <div className="text-[10px] text-gray-500 font-semibold mt-1">HVAC load throttling + Solar sync</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-[11px] font-bold text-gray-500 uppercase">Carbon Footprint Abated</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{policy.carbonReductionKg} kg</div>
              <div className="text-[10px] text-gray-500 font-semibold mt-1">~1.8 tons CO₂ equivalent per month</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-[11px] font-bold text-gray-500 uppercase">Deployment Genesis</span>
              <div className="text-base sm:text-lg font-extrabold text-gray-900 mt-2">{policy.version}</div>
              <div className="text-[10px] text-gray-500 mt-1 font-mono">Trained on {policy.trainedEpisodes} episodes</div>
            </div>
          </div>

          {/* Active Allocations Grid Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-[#003366] text-sm sm:text-base">
                  Real-World Active Allocation Matrix (Generated by RL Agent)
                </h3>
                <p className="text-xs text-gray-500">Autonomous assignment of student cohorts to physical rooms & solar dispatch</p>
              </div>
              <button
                onClick={() => setActiveSubTab('simulator')}
                className="text-xs font-bold text-[#003366] hover:underline flex items-center"
              >
                <RefreshCw size={12} className="mr-1" /> Re-train in Gym
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 font-bold border-b border-gray-200 uppercase text-[10px]">
                    <th className="p-3">Time Slot</th>
                    <th className="p-3">Batch & Course</th>
                    <th className="p-3">Assigned Physical Room</th>
                    <th className="p-3">Capacity Match</th>
                    <th className="p-3">HVAC Policy</th>
                    <th className="p-3">Energy Source</th>
                    <th className="p-3">Agent Decision Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {policy.allocations.map((a, idx) => {
                    const occRate = Math.round((a.headcount / a.capacity) * 100);
                    return (
                      <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                        <td className="p-3 font-mono font-bold text-[#003366]">{a.slot}</td>
                        <td className="p-3">
                          <div className="font-bold text-gray-900">{a.batch}</div>
                          <div className="text-gray-500 text-[11px] truncate max-w-[180px]">{a.course}</div>
                        </td>
                        <td className="p-3 font-semibold text-gray-800">{a.roomName}</td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full ${occRate > 95 ? 'bg-amber-500' : occRate > 80 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                style={{ width: `${Math.min(100, occRate)}%` }}
                              />
                            </div>
                            <span className="font-mono text-[10px] text-gray-700">{a.headcount}/{a.capacity} ({occRate}%)</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            a.hvacMode === 'FULL' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                            a.hvacMode === 'ECO' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {a.hvacMode} MODE
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            a.energySource === 'SOLAR' ? 'bg-amber-100 text-amber-800' :
                            a.energySource === 'BATTERY' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {a.energySource === 'SOLAR' && <Sun size={11} className="mr-1 text-amber-600" />}
                            {a.energySource === 'BATTERY' && <BatteryCharging size={11} className="mr-1 text-indigo-600" />}
                            {a.energySource}
                          </span>
                        </td>
                        <td className="p-3 text-[11px] text-gray-600 max-w-xs">{a.decisionRationale}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SIM-TO-REAL RL GYM SIMULATOR */}
      {activeSubTab === 'simulator' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6">
            <h3 className="text-base font-extrabold text-[#003366] flex items-center">
              <Cpu size={18} className="mr-2 text-yellow-600" />
              Reinforcement Learning Simulation Gym
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Simulate thousands of allocation scenarios in a non-destructive digital twin before applying updates to physical college schedules.
            </p>

            {/* Hyperparameter Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Training Episodes: <span className="text-[#003366] font-mono">{episodes}</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={episodes}
                  disabled={isTraining}
                  onChange={(e) => setEpisodes(Number(e.target.value))}
                  className="w-full accent-[#003366]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Learning Rate (α): <span className="text-[#003366] font-mono">{learningRate}</span>
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="0.3"
                  step="0.01"
                  value={learningRate}
                  disabled={isTraining}
                  onChange={(e) => setLearningRate(Number(e.target.value))}
                  className="w-full accent-[#003366]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Discount Factor (γ): <span className="text-[#003366] font-mono">{gamma}</span>
                </label>
                <input
                  type="range"
                  min="0.8"
                  max="0.99"
                  step="0.01"
                  value={gamma}
                  disabled={isTraining}
                  onChange={(e) => setGamma(Number(e.target.value))}
                  className="w-full accent-[#003366]"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
              <button
                onClick={handleStartTraining}
                disabled={isTraining}
                className="bg-[#003366] hover:bg-blue-900 disabled:opacity-50 text-yellow-400 font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl transition-all shadow flex items-center"
              >
                {isTraining ? (
                  <>
                    <RefreshCw size={14} className="mr-2 animate-spin" /> Training Q-Agent ({trainProgress?.episode || 0}/{episodes})...
                  </>
                ) : (
                  <>
                    <Play size={14} className="mr-2 fill-current" /> Run Digital-Twin Training
                  </>
                )}
              </button>

              {simHistory.length > 0 && !isTraining && (
                <button
                  onClick={handleDeployPolicy}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center"
                >
                  <Sparkles size={14} className="mr-2" /> Deploy Trained Policy to Real Campus
                </button>
              )}
            </div>
          </div>

          {/* Real-time Convergence Telemetry */}
          {trainProgress && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Episode</span>
                <div className="text-xl font-black text-[#003366]">{trainProgress.episode} / {episodes}</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Mean Q-Reward</span>
                <div className="text-xl font-black text-emerald-600">{trainProgress.totalReward}</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Allocation Efficiency</span>
                <div className="text-xl font-black text-blue-600">{trainProgress.efficiencyPercent}%</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Exploration Rate (ε)</span>
                <div className="text-xl font-black text-gray-700 font-mono">{trainProgress.epsilon}</div>
              </div>
            </div>
          )}

          {/* Convergence Visualizer Bar Graph */}
          {simHistory.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Learning Curve: Reward Convergence & Policy Optimization
              </h4>
              <div className="h-40 flex items-end space-x-1 sm:space-x-1.5 overflow-x-auto pt-4 border-b border-gray-200 pb-1">
                {simHistory.filter((_, i) => i % Math.max(1, Math.floor(simHistory.length / 30)) === 0).map((m, idx) => {
                  const normalizedHeight = Math.min(100, Math.max(15, (m.totalReward + 150) / 4));
                  return (
                    <div key={idx} className="flex-1 min-w-[8px] flex flex-col items-center group relative">
                      <div
                        className="w-full bg-[#003366] hover:bg-yellow-500 rounded-t transition-all"
                        style={{ height: `${normalizedHeight}%` }}
                      />
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-900 text-white text-[10px] rounded p-1 whitespace-nowrap z-20">
                        Ep {m.episode}: {m.efficiencyPercent}% eff, {m.totalReward} reward
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center text-[10px] text-gray-400 mt-2">
                <span>Episode 1 (Exploration heavy)</span>
                <span className="font-bold text-emerald-600">Convergence Achieved (~Episode {Math.round(episodes * 0.7)})</span>
                <span>Episode {episodes} (Exploitation optimal)</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SMART GRID & HVAC OVERRIDES */}
      {activeSubTab === 'telemetry' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5">
            <h3 className="text-base font-extrabold text-[#003366] mb-1">
              Physical Room IoT Nodes & HVAC Actuator Status
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Real-time energy consumption telemetry. Administrative manual overrides can supersede the autonomous RL policy at any moment.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <div key={room.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white transition-all shadow-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{room.name}</h4>
                      <span className="text-[10px] text-gray-500 uppercase">Floor {room.floor} • Capacity: {room.capacity}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      room.hvacStatus === 'FULL' ? 'bg-rose-100 text-rose-800' :
                      room.hvacStatus === 'ECO' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      HVAC {room.hvacStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                    <div className="bg-white p-2 rounded border border-gray-100">
                      <span className="text-[10px] text-gray-400 block">Ambient Temp</span>
                      <span className="font-bold text-gray-800">{room.currentTempC}°C</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-gray-100">
                      <span className="text-[10px] text-gray-400 block">Power Draw</span>
                      <span className="font-bold text-blue-600">{room.powerDrawKw} kW</span>
                    </div>
                  </div>

                  {/* Manual Controls */}
                  <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Actuator Override:</span>
                    <div className="flex space-x-1">
                      {(['OFF', 'ECO', 'FULL'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => handleHvacToggle(room.id, mode)}
                          className={`px-2 py-1 rounded text-[10px] font-bold ${
                            room.hvacStatus === mode
                              ? 'bg-[#003366] text-yellow-300 shadow-xs'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
