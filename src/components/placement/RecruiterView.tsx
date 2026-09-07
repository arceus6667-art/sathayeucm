import React, { useState, useEffect } from 'react';
import { 
  Building2, PlusCircle, Users, CheckCircle2, Calendar, 
  Clock, MapPin, Search, Filter, Sparkles, Send, X, Video
} from 'lucide-react';
import { 
  placementStore, PlacementJob, JobApplication, InterviewSchedule 
} from '../../services/placementStore';

export default function RecruiterView() {
  const [jobs, setJobs] = useState<PlacementJob[]>(placementStore.getJobs());
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const [applications, setApplications] = useState<JobApplication[]>(placementStore.getApplications());
  const [interviews, setInterviews] = useState<InterviewSchedule[]>(placementStore.getInterviews());

  // Post JD Modal
  const [showPostModal, setShowPostModal] = useState(false);
  const [companyName, setCompanyName] = useState('Google Cloud / Alphabet');
  const [roleTitle, setRoleTitle] = useState('Cloud Solutions Associate');
  const [packageCtc, setPackageCtc] = useState('14.0 - 18.5 LPA');
  const [location, setLocation] = useState('Mumbai / Bangalore');
  const [minCgpa, setMinCgpa] = useState<number>(7.5);
  const [branches, setBranches] = useState('B.Sc. IT, B.Sc. CS, M.Sc. Data Science');
  const [skills, setSkills] = useState('Python, Cloud Infrastructure, Docker, Linux, SQL');
  const [description, setDescription] = useState('Architecting scalable enterprise cloud services on GCP with Kubernetes and serverless.');
  const [deadline, setDeadline] = useState('2026-10-05');

  // Schedule Interview Modal
  const [scheduleApp, setScheduleApp] = useState<JobApplication | null>(null);
  const [intDate, setIntDate] = useState('2026-09-15');
  const [intTime, setIntTime] = useState('11:00 AM - 12:00 PM');
  const [intMode, setIntMode] = useState<'IN_PERSON' | 'VIRTUAL'>('IN_PERSON');
  const [intVenue, setIntVenue] = useState('Placement Interview Lab 204');
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      setJobs(placementStore.getJobs());
      setApplications(placementStore.getApplications());
      setInterviews(placementStore.getInterviews());
    };
    return placementStore.subscribe(update);
  }, []);

  const activeJob = jobs.find(j => j.id === selectedJobId) || jobs[0];
  const jobApplications = applications.filter(a => a.jobId === activeJob?.id);

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !roleTitle) return;

    placementStore.postJob({
      company: companyName,
      role: roleTitle,
      packageCtc,
      location,
      minCgpa,
      eligibleBranches: branches.split(',').map(b => b.trim()),
      requiredSkills: skills.split(',').map(s => s.trim()),
      description,
      deadline,
      rounds: ['Online Coding Round', 'Technical Assessment', 'Leadership & Culture']
    });

    setShowPostModal(false);
    setStatusFeedback(`New drive for ${companyName} successfully posted!`);
    setTimeout(() => setStatusFeedback(null), 3000);
  };

  const handleAutoShortlist = () => {
    if (!activeJob) return;
    const count = placementStore.autoShortlistCandidates(activeJob.id, 75);
    setStatusFeedback(`Auto-shortlist complete: ${count} qualified candidates promoted to SHORTLISTED!`);
    setTimeout(() => setStatusFeedback(null), 4000);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleApp) return;

    placementStore.scheduleInterview(scheduleApp.id, intDate, intTime, intMode, intVenue);
    setScheduleApp(null);
    setStatusFeedback(`Interview invitation dispatched to ${scheduleApp.studentName}!`);
    setTimeout(() => setStatusFeedback(null), 3500);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Recruiter Header Bar */}
      <div className="bg-[#002244] text-white p-5 rounded-2xl border-l-4 border-yellow-500 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-yellow-400 text-[#003366] text-xs font-black px-2 py-0.5 rounded uppercase">
              Recruiter & Industry Desk
            </span>
            <span className="text-xs text-blue-200">Sathaye Autonomous Placement Management</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Corporate Recruitment Portal</h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Post JDs, filter student talent by autonomous CGPA/branch cutoffs, auto-shortlist, and schedule interviews in 1-click.
          </p>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          className="bg-yellow-400 hover:bg-yellow-300 text-[#003366] font-black text-xs uppercase px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center shrink-0"
        >
          <PlusCircle size={15} className="mr-1.5" /> Post New Job Description
        </button>
      </div>

      {statusFeedback && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow flex items-center">
          <CheckCircle2 size={16} className="mr-2 text-yellow-300" />
          <span>{statusFeedback}</span>
        </div>
      )}

      {/* Main Grid: Job Selector & Applications Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Drives List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Campus Drives</h3>
          <div className="space-y-2">
            {jobs.map(job => (
              <div
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedJobId === job.id
                    ? 'bg-[#003366] text-white border-[#003366] shadow-md'
                    : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm leading-tight">{job.company}</h4>
                    <p className={`text-xs mt-0.5 ${selectedJobId === job.id ? 'text-yellow-300' : 'text-gray-500'}`}>
                      {job.role}
                    </p>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                    selectedJobId === job.id ? 'bg-yellow-400 text-[#003366]' : 'bg-green-100 text-green-800'
                  }`}>
                    {job.packageCtc}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className={selectedJobId === job.id ? 'text-blue-200' : 'text-gray-500'}>
                    Cutoff: <strong className={selectedJobId === job.id ? 'text-white' : 'text-gray-800'}>{job.minCgpa} CGPA</strong>
                  </span>
                  <span className="font-mono text-[10px] font-bold">
                    {applications.filter(a => a.jobId === job.id).length} Applicants
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Candidate Filter & Scheduling Panel */}
        <div className="lg:col-span-2 space-y-4">
          {activeJob && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-extrabold text-[#003366]">{activeJob.company}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                      {activeJob.packageCtc}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{activeJob.role} • Min CGPA: {activeJob.minCgpa}</p>
                </div>

                {/* 1-Click Auto-Shortlist Button */}
                <button
                  onClick={handleAutoShortlist}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase px-3.5 py-1.5 rounded-lg transition-colors shadow flex items-center shrink-0"
                >
                  <Sparkles size={13} className="mr-1.5 text-yellow-300" />
                  Auto-Shortlist Qualified
                </button>
              </div>

              {/* Required Skills Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-gray-500 mr-1">Required Competencies:</span>
                {activeJob.requiredSkills.map((s, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-700 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                    {s}
                  </span>
                ))}
              </div>

              {/* Candidates Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200 uppercase text-[10px]">
                      <th className="p-2.5">Candidate</th>
                      <th className="p-2.5">Branch</th>
                      <th className="p-2.5">CGPA</th>
                      <th className="p-2.5">Fit Score</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {jobApplications.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-gray-400 text-xs">
                          No students have applied for this drive yet.
                        </td>
                      </tr>
                    ) : (
                      jobApplications.map(app => (
                        <tr key={app.id} className="hover:bg-blue-50/30">
                          <td className="p-2.5 font-bold text-gray-900">{app.studentName}</td>
                          <td className="p-2.5 text-gray-600">{app.studentBranch}</td>
                          <td className="p-2.5 font-bold text-[#003366]">{app.studentCgpa}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              app.matchScore >= 90 ? 'bg-green-100 text-green-800' :
                              app.matchScore >= 75 ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {app.matchScore}% Match
                            </span>
                          </td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              app.status === 'SHORTLISTED' ? 'bg-indigo-100 text-indigo-800' :
                              app.status === 'INTERVIEW_SCHEDULED' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="p-2.5 text-right">
                            {app.status !== 'INTERVIEW_SCHEDULED' ? (
                              <button
                                onClick={() => setScheduleApp(app)}
                                className="bg-[#003366] hover:bg-blue-900 text-yellow-400 text-[11px] font-bold px-2.5 py-1 rounded transition-colors shadow-xs"
                              >
                                Schedule Interview
                              </button>
                            ) : (
                              <span className="text-[11px] text-emerald-600 font-bold flex items-center justify-end">
                                <CheckCircle2 size={12} className="mr-1" /> Scheduled
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Upcoming Interview Schedule Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#003366] mb-3 flex items-center">
              <Calendar size={14} className="mr-1.5 text-yellow-600" />
              Confirmed Campus Interview Schedule
            </h3>
            {interviews.length === 0 ? (
              <p className="text-xs text-gray-400">No interviews currently scheduled.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {interviews.map(int => (
                  <div key={int.id} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs text-gray-900">{int.studentName}</span>
                        <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded uppercase">
                          {int.mode}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">{int.company} • {int.role}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-200 text-[10px] text-gray-600 flex items-center justify-between font-mono">
                      <span>{int.date} | {int.timeSlot}</span>
                      <span className="truncate max-w-[140px] text-right font-sans font-semibold text-gray-700">{int.venueOrLink}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: POST NEW JOB */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-extrabold text-[#003366]">Post New Campus Recruitment Drive</h3>
              <button onClick={() => setShowPostModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={roleTitle}
                    onChange={e => setRoleTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Package CTC</label>
                  <input
                    type="text"
                    required
                    value={packageCtc}
                    onChange={e => setPackageCtc(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Minimum CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    min="5"
                    max="10"
                    required
                    value={minCgpa}
                    onChange={e => setMinCgpa(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Application Deadline</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Eligible Branches (comma-separated)</label>
                <input
                  type="text"
                  required
                  value={branches}
                  onChange={e => setBranches(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Required Skills & Tech Stack</label>
                <input
                  type="text"
                  required
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Job Description & Autonomous Preferences</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-[#003366] bg-yellow-400 hover:bg-yellow-300 rounded-lg uppercase tracking-wider"
                >
                  Publish Campus Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SCHEDULE INTERVIEW */}
      {scheduleApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#003366]">Schedule Candidate Interview</h3>
                <p className="text-xs text-gray-500">Student: {scheduleApp.studentName} ({scheduleApp.studentCgpa} CGPA)</p>
              </div>
              <button onClick={() => setScheduleApp(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Interview Date</label>
                <input
                  type="date"
                  required
                  value={intDate}
                  onChange={e => setIntDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Time Slot</label>
                <input
                  type="text"
                  required
                  value={intTime}
                  onChange={e => setIntTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                  placeholder="e.g. 10:30 AM - 11:30 AM"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Interview Format</label>
                <div className="flex space-x-3">
                  <label className="flex items-center space-x-1.5">
                    <input
                      type="radio"
                      name="mode"
                      checked={intMode === 'IN_PERSON'}
                      onChange={() => setIntMode('IN_PERSON')}
                      className="accent-[#003366]"
                    />
                    <span>In-Person On-Campus</span>
                  </label>
                  <label className="flex items-center space-x-1.5">
                    <input
                      type="radio"
                      name="mode"
                      checked={intMode === 'VIRTUAL'}
                      onChange={() => setIntMode('VIRTUAL')}
                      className="accent-[#003366]"
                    />
                    <span>Virtual (Google Meet)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  {intMode === 'IN_PERSON' ? 'Campus Venue' : 'Video Meeting Link'}
                </label>
                <input
                  type="text"
                  required
                  value={intVenue}
                  onChange={e => setIntVenue(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setScheduleApp(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#003366] hover:bg-blue-900 rounded-lg uppercase tracking-wider"
                >
                  Confirm & Notify Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
