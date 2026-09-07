import React, { useState } from 'react';
import { 
  FileText, Download, Printer, Calendar, Filter, 
  CheckCircle2, Layers, BarChart, Zap, BookOpen, Coffee, Wrench
} from 'lucide-react';
import { campusStore } from '../../../services/campusStore';

type ReportType = 
  | 'attendance' 
  | 'facility' 
  | 'complaints' 
  | 'sustainability' 
  | 'library' 
  | 'canteen';

export default function AdminReportsView() {
  const [selectedReport, setSelectedReport] = useState<ReportType>('attendance');
  const [dateRange, setDateRange] = useState('Current Academic Term (AY 2026-27)');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const reportList = [
    { id: 'attendance', name: 'Student & Faculty Attendance Audit', icon: FileText, desc: 'Aggregated biometric & turnstile attendance percentages' },
    { id: 'facility', name: 'Classroom & Space Utilization Report', icon: Layers, desc: 'Peak occupancy, seat efficiency, and hall scheduling metrics' },
    { id: 'complaints', name: 'Grievance & Maintenance SLA Report', icon: Wrench, desc: 'Breakdown of reported issues, resolution MTTR, and technician performance' },
    { id: 'sustainability', name: 'Energy, Water & Green Campus Report', icon: Zap, desc: 'Grid consumption, rooftop solar offsets, and rainwater harvesting flow' },
    { id: 'library', name: 'Knowledge Resource Circulation Report', icon: BookOpen, desc: 'Book loans, overdue fees collected, and digital catalog downloads' },
    { id: 'canteen', name: 'Smart Canteen Financial Reconciliation', icon: Coffee, desc: 'Token turnover, sales volume, UPI reconciliation, and kitchen velocity' }
  ];

  // Generate Sample Report Data dynamically based on current campusStore
  const renderReportContent = () => {
    switch (selectedReport) {
      case 'attendance':
        return [
          { dept: 'BSc Information Technology', totalStudents: 680, avgAttendance: '94.2%', facultyPresent: '100%', remarks: 'Exemplary' },
          { dept: 'BSc Pure Sciences (Physics/Chem)', totalStudents: 1420, avgAttendance: '89.6%', facultyPresent: '98.5%', remarks: 'Satisfactory' },
          { dept: 'BCom Financial Markets', totalStudents: 1840, avgAttendance: '91.8%', facultyPresent: '99.0%', remarks: 'Satisfactory' },
          { dept: 'BA Mass Media & Comm (BAMMC)', totalStudents: 920, avgAttendance: '88.4%', facultyPresent: '97.2%', remarks: 'Satisfactory' },
          { dept: 'Management Studies (BMS)', totalStudents: 380, avgAttendance: '95.1%', facultyPresent: '100%', remarks: 'Exemplary' }
        ];

      case 'facility':
        return [
          { facility: 'Main Academic Heritage Block', capacity: 2400, peakOccupancy: '92%', avgDailyHours: '9.5 hrs', status: 'Optimal' },
          { facility: 'Science & Research Complex', capacity: 1800, peakOccupancy: '86%', avgDailyHours: '8.2 hrs', status: 'Optimal' },
          { facility: 'Knowledge Resource Library Hall', capacity: 250, peakOccupancy: '78%', avgDailyHours: '11.0 hrs', status: 'High Demand' },
          { facility: 'Auditorium Central Theatre', capacity: 650, peakOccupancy: '65%', avgDailyHours: '4.0 hrs', status: 'Event Specific' },
          { facility: 'Management Annex Lecture Halls', capacity: 500, peakOccupancy: '89%', avgDailyHours: '7.8 hrs', status: 'Optimal' }
        ];

      case 'complaints':
        const issues = campusStore.getCampusIssues();
        return issues.map(i => ({
          id: i.id,
          title: i.title,
          category: i.category,
          location: i.locationName,
          priority: i.priority,
          status: i.status,
          date: i.createdAt
        }));

      case 'sustainability':
        return [
          { resource: 'Main Power Grid Influx', meter: 'MTR-GRID-01', dailyQty: '1,420 kWh', solarOffset: '410 kWh (28.8%)', netCarbonSaved: '328 kg CO2e' },
          { resource: 'Municipal Potable Water', meter: 'WTR-MAIN-04', dailyQty: '86.4 kL', solarOffset: 'Rainwater: 24 kL', netCarbonSaved: 'Self-sustaining' },
          { resource: 'Solid Waste Compost Plant', meter: 'WST-BIO-02', dailyQty: '180 kg', solarOffset: '100% Organic Manure', netCarbonSaved: 'Zero Landfill' }
        ];

      case 'library':
        return [
          { code: 'LIB-CAT-01', title: 'Books in Circulation', value: '12,450 volumes', metric: '100% Digitized (KOHA)' },
          { code: 'LIB-LOAN-02', title: 'Active Borrowings', value: '412 on loan', metric: '14-day cycle' },
          { code: 'LIB-OVER-03', title: 'Overdue Volumes', value: '18 items', metric: 'Automated Reminders sent' },
          { code: 'LIB-READ-04', title: 'Reading Hall Visitors', value: '850 daily', metric: 'Seating: 64% utilized' }
        ];

      case 'canteen':
        const orders = campusStore.getOrders();
        const total = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        return [
          { metric: 'Gross Food & Beverage Turnover', figure: `₹${total.toLocaleString()}`, status: 'Reconciled via UPI Gateway' },
          { metric: 'Total Orders / Tokens Generated', figure: `${orders.length} tokens`, status: '100% token tracking' },
          { metric: 'Average Meal Preparation Time', figure: '5.8 minutes', status: 'Within 8-min standard SLA' },
          { metric: 'Highest Selling Item', figure: 'Masala Dosa (148 units)', status: 'Kitchen stock refreshed' }
        ];
    }
  };

  // Download CSV export
  const handleDownloadCSV = () => {
    const data = renderReportContent();
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).map(v => `"${v}"`).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Sathey_Campus_${selectedReport}_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentData = renderReportContent();

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-[10px] font-bold rounded uppercase tracking-wider">
              Autonomous College Audits
            </span>
            <h2 className="text-lg font-bold text-gray-900">Administrative Reports & Regulatory Exports</h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Export compliant audit summaries for NAAC, Autonomous Governing Body, and Institutional Secretariat
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#003366] hover:bg-blue-900 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            <Download size={14} />
            <span>Export CSV Dataset</span>
          </button>
        </div>
      </div>

      {/* Report Selection Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {reportList.map((rep) => {
          const Icon = rep.icon;
          const isSelected = selectedReport === rep.id;
          return (
            <button
              key={rep.id}
              onClick={() => setSelectedReport(rep.id as ReportType)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-blue-50/70 border-[#003366] ring-1 ring-[#003366] shadow-xs'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon size={16} className={isSelected ? 'text-[#003366]' : 'text-gray-400'} />
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#003366]" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 leading-tight">{rep.name}</h4>
                <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{rep.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Report Display & Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">
                {reportList.find(r => r.id === selectedReport)?.name}
              </h3>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-800 font-bold rounded">
                Verified Ledger
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Period: {dateRange} • Autonomous Institutional Code: SC-MUM-2026
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 font-bold uppercase text-[10px]">Filter:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-gray-700 focus:outline-none"
            >
              <option value="all">All Campus Sectors</option>
              <option value="it">IT & CS</option>
              <option value="science">Pure Sciences</option>
              <option value="commerce">Commerce</option>
              <option value="arts">Arts & Media</option>
            </select>
          </div>
        </div>

        {/* Dynamic Table Render */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                {currentData.length > 0 && Object.keys(currentData[0]).map((key) => (
                  <th key={key} className="py-3 px-4 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                  {Object.values(row).map((val, cellIdx) => (
                    <td key={cellIdx} className="py-3 px-4 font-medium text-gray-800">
                      {String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <span>Official seal: Sathaye College Autonomous Academic Examination & Operations Cell</span>
          <span>System Generated: {new Date().toLocaleDateString('en-IN')}</span>
        </div>
      </div>

    </div>
  );
}
