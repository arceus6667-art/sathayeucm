import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, Zap, Droplets, Clock, 
  Layers, Users, Calendar, Activity, Coffee, BookOpen, Car, ArrowUpRight
} from 'lucide-react';
import { campusStore } from '../../../services/campusStore';

export default function AdminAnalyticsView() {
  const [timeframe, setTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Yearly'>('Daily');

  // Hourly occupancy trend data (8 AM to 6 PM)
  const hourlyOccupancy = [
    { hour: '08:00', percent: 35, students: 1820 },
    { hour: '09:00', percent: 68, students: 3540 },
    { hour: '10:00', percent: 84, students: 4380 },
    { hour: '11:00', percent: 89, students: 4650 },
    { hour: '12:00', percent: 92, students: 4820 }, // Lunch peak
    { hour: '13:00', percent: 85, students: 4450 },
    { hour: '14:00', percent: 76, students: 3980 },
    { hour: '15:00', percent: 62, students: 3250 },
    { hour: '16:00', percent: 45, students: 2350 },
    { hour: '17:00', percent: 25, students: 1300 },
  ];

  const buildingUtilization = [
    { name: 'Main Academic Heritage Block', utilization: 88, classrooms: 24, activeNow: 21 },
    { name: 'Science & Research Complex', utilization: 79, classrooms: 18, activeNow: 14 },
    { name: 'Knowledge Resource Library', utilization: 64, classrooms: 6, activeNow: 4 },
    { name: 'Management Studies Wing', utilization: 82, classrooms: 12, activeNow: 10 },
    { name: 'Central Canteen & Student Plaza', utilization: 95, classrooms: 2, activeNow: 2 },
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner with Timeframe Selectors */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 text-[10px] font-bold rounded uppercase tracking-wider">
              Institutional Intelligence
            </span>
            <h2 className="text-lg font-bold text-gray-900">Campus Analytics & Resource Telemetry</h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time utilization metrics, energy consumption, green campus offset, and facility crowd dynamics
          </p>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          {(['Daily', 'Weekly', 'Monthly', 'Yearly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                timeframe === t ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Telemetry Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase">Classroom Use</span>
            <Layers size={14} className="text-blue-600" />
          </div>
          <h4 className="text-xl font-extrabold text-gray-900">81.4%</h4>
          <span className="text-[10px] text-emerald-700 font-bold block">+3.2% vs yesterday</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase">Lab Utilization</span>
            <Activity size={14} className="text-indigo-600" />
          </div>
          <h4 className="text-xl font-extrabold text-gray-900">69.8%</h4>
          <span className="text-[10px] text-gray-500 font-medium block">14 / 20 Labs Active</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase">Energy Grid</span>
            <Zap size={14} className="text-amber-500" />
          </div>
          <h4 className="text-xl font-extrabold text-gray-900">1,420 <span className="text-xs font-semibold text-gray-500">kWh</span></h4>
          <span className="text-[10px] text-emerald-700 font-bold block">410 kWh Solar</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase">Water Flow</span>
            <Droplets size={14} className="text-blue-500" />
          </div>
          <h4 className="text-xl font-extrabold text-gray-900">86.4 <span className="text-xs font-semibold text-gray-500">kL</span></h4>
          <span className="text-[10px] text-blue-700 font-medium block">Recycled: 24.2 kL</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase">Grievance MTTR</span>
            <Clock size={14} className="text-emerald-600" />
          </div>
          <h4 className="text-xl font-extrabold text-gray-900">4.2 <span className="text-xs font-semibold text-gray-500">hrs</span></h4>
          <span className="text-[10px] text-emerald-700 font-bold block">94% within SLA</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase">Parking Load</span>
            <Car size={14} className="text-slate-600" />
          </div>
          <h4 className="text-xl font-extrabold text-gray-900">82.0%</h4>
          <span className="text-[10px] text-amber-700 font-bold block">18 Bays Open</span>
        </div>
      </div>

      {/* Main Visual SVG Charts: Campus Occupancy Trend & Canteen/Library Volumes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Occupancy Trend Curve */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Campus Density & Crowd Flow Curve</h3>
              <p className="text-[11px] text-gray-500">Hourly head-count aggregation across all 6 campus security turnstiles ({timeframe})</p>
            </div>
            <span className="text-xs font-bold text-[#003366]">Peak: 4,820 Students (12:00 PM)</span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-60 flex items-end justify-between gap-2 pt-4 px-2">
            {hourlyOccupancy.map((item, idx) => {
              const heightPercent = (item.percent / 100) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded font-mono pointer-events-none whitespace-nowrap z-20">
                    {item.students} students ({item.percent}%)
                  </div>

                  <div className="w-full bg-slate-100 rounded-t-md h-48 flex items-end overflow-hidden">
                    <div 
                      className={`w-full transition-all duration-500 rounded-t-md ${
                        item.percent > 85 ? 'bg-amber-500' : 'bg-[#003366]'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono rotate-45 sm:rotate-0 mt-1">{item.hour}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#003366]" /> Normal Session Flow</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500" /> Lunch Peak Rush</span>
            </div>
            <span className="text-gray-400 font-mono text-[11px]">Turnstile Data Stream: Verified</span>
          </div>
        </div>

        {/* Building Utilization Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
          <div className="pb-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Building Space Efficiency</h3>
            <p className="text-[11px] text-gray-500">Classroom and hall utilization percentage</p>
          </div>

          <div className="space-y-4">
            {buildingUtilization.map((bldg, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800 line-clamp-1">{bldg.name}</span>
                  <span className="font-bold text-blue-900 font-mono">{bldg.utilization}%</span>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full ${bldg.utilization > 85 ? 'bg-amber-500' : 'bg-[#003366]'}`}
                    style={{ width: `${bldg.utilization}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>{bldg.activeNow} / {bldg.classrooms} halls active</span>
                  <span>Optimal Threshold</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Canteen & Library Ancillary Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Canteen Crowd Dynamics */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Coffee size={16} className="text-yellow-600" />
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Canteen Order Velocity</h4>
            </div>
            <span className="text-xs font-bold text-emerald-700">1,240 Total Tokens Today</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <span className="text-[10px] text-gray-400 block">Avg Kitchen Prep</span>
              <strong className="text-base text-gray-900">5.8 mins</strong>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <span className="text-[10px] text-gray-400 block">Peak Token Wait</span>
              <strong className="text-base text-amber-700">8.2 mins</strong>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <span className="text-[10px] text-gray-400 block">Digital Payments</span>
              <strong className="text-base text-blue-900">92% UPI</strong>
            </div>
          </div>
        </div>

        {/* Library Circulation Velocity */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-[#003366]" />
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Knowledge Resource Circulation</h4>
            </div>
            <span className="text-xs font-bold text-blue-900">850 Daily Visitors</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <span className="text-[10px] text-gray-400 block">Books Issued Today</span>
              <strong className="text-base text-gray-900">142 vols</strong>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <span className="text-[10px] text-gray-400 block">Reading Hall Seating</span>
              <strong className="text-base text-emerald-700">64% Full</strong>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <span className="text-[10px] text-gray-400 block">Digital Repos Access</span>
              <strong className="text-base text-indigo-900">410 downloads</strong>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
