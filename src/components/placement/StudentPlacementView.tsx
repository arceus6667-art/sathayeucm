import React, { useState, useEffect } from 'react';
import { 
  Briefcase, CheckCircle2, AlertTriangle, Sparkles, 
  Calendar, Clock, MapPin, ArrowRight, BookOpen, Star, Send
} from 'lucide-react';
import { 
  placementStore, PlacementJob, JobApplication, InterviewSchedule, INITIAL_STUDENTS 
} from '../../services/placementStore';
import { campusStore } from '../../services/campusStore';

export default function StudentPlacementView() {
  const [jobs, setJobs] = useState<PlacementJob[]>(placementStore.getJobs());
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [interviews, setInterviews] = useState<InterviewSchedule[]>([]);
  const [applyFeedback, setApplyFeedback] = useState<string | null>(null);

  const currentUser = campusStore.getCurrentUser();
  // Find matching student profile in placement store (or fallback to student-1)
  const student = INITIAL_STUDENTS.find(s => s.name === currentUser?.name) || INITIAL_STUDENTS[0];

  useEffect(() => {
    const update = () => {
      setJobs(placementStore.getJobs());
      if (student) {
        setApplications(placementStore.getApplicationsForStudent(student.id));
        setInterviews(placementStore.getInterviewsForStudent(student.id));
      }
    };
    update();
    return placementStore.subscribe(update);
  }, [student]);

  const handleApply = (jobId: string) => {
    if (!student) return;
    const res = placementStore.applyForJob(student.id, jobId);
    setApplyFeedback(res.message);
    setTimeout(() => setApplyFeedback(null), 3500);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Student Career Profile Banner */}
      <div className="bg-[#003366] text-white p-6 rounded-2xl border-l-4 border-yellow-500 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-yellow-400 text-[#003366] text-xs font-black px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center">
              <Sparkles size={13} className="mr-1" /> Career Match Engine Active
            </span>
            <span className="text-xs text-blue-200">Sathaye Autonomous Placement Cell</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold">{student.name} • Academic Standing</h2>
          <p className="text-xs text-blue-200 mt-0.5">
            {student.branch} • Roll No: {student.rollNo} • Cumulative Grade Point: <strong className="text-yellow-400 font-mono text-sm">{student.cgpa} CGPA</strong>
          </p>

          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            <span className="text-[11px] text-blue-200 font-bold mr-1">Verified Skill Profile:</span>
            {student.skills.map((skill, idx) => (
              <span key={idx} className="bg-blue-900/80 border border-blue-400/40 text-yellow-300 text-[10px] font-bold px-2 py-0.5 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-blue-900/60 p-4 rounded-xl border border-blue-400/30 text-center shrink-0">
          <span className="text-[10px] uppercase font-bold text-blue-200 block">Eligible Campus Drives</span>
          <div className="text-3xl font-black text-yellow-400 mt-0.5">
            {jobs.filter(j => placementStore.checkEligibility(student, j).isEligible).length} / {jobs.length}
          </div>
          <span className="text-[10px] text-emerald-300 font-semibold block mt-1">Autonomous Verified</span>
        </div>
      </div>

      {applyFeedback && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow flex items-center">
          <CheckCircle2 size={16} className="mr-2 text-yellow-300" />
          <span>{applyFeedback}</span>
        </div>
      )}

      {/* Confirmed Interviews Banner if any */}
      {interviews.length > 0 && (
        <div className="bg-purple-900 text-white rounded-xl p-5 border-l-4 border-purple-400 shadow-sm space-y-3">
          <div className="flex items-center space-x-2">
            <Calendar size={18} className="text-purple-300" />
            <h3 className="text-sm font-extrabold uppercase tracking-wide">
              You Have {interviews.length} Confirmed Placement Interview(s)!
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {interviews.map(int => (
              <div key={int.id} className="bg-purple-950/60 p-3.5 rounded-xl border border-purple-400/30 flex justify-between items-center text-xs">
                <div>
                  <div className="font-extrabold text-yellow-300">{int.company}</div>
                  <div className="text-purple-200 text-[11px]">{int.role}</div>
                  <div className="text-[10px] text-gray-300 mt-1 font-mono">{int.date} • {int.timeSlot}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-purple-400 text-purple-950 font-black px-2 py-0.5 rounded uppercase">
                    {int.mode}
                  </span>
                  <div className="text-[10px] text-purple-200 mt-1 font-semibold max-w-[130px] truncate">{int.venueOrLink}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campus Drives with AI Career Recommender */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#003366] flex items-center">
          <Briefcase size={16} className="mr-2 text-yellow-600" />
          Active Campus Placement Opportunities & Skill Fit Analysis
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {jobs.map(job => {
            const elig = placementStore.checkEligibility(student, job);
            const app = applications.find(a => a.jobId === job.id);
            const isApplied = !!app;

            return (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-gray-200 hover:border-blue-400 shadow-xs p-5 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-extrabold text-base text-[#003366]">{job.company}</h4>
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded">
                        {job.packageCtc}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-gray-700 mt-0.5">{job.role}</p>
                    <p className="text-[11px] text-gray-500">{job.location} • Deadline: {job.deadline}</p>
                  </div>

                  {/* Eligibility & Fit Badge */}
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase flex items-center ${
                      elig.isEligible
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}>
                      {elig.isEligible ? (
                        <>
                          <CheckCircle2 size={13} className="mr-1" /> Eligible ({elig.matchScore}% Fit)
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={13} className="mr-1" /> {elig.reason}
                        </>
                      )}
                    </span>
                    <span className="text-[10px] text-gray-400">Cutoff: {job.minCgpa} CGPA</span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">{job.description}</p>

                {/* AI Skills Match & Gap Analysis Card */}
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-700 flex items-center">
                      <Sparkles size={13} className="mr-1.5 text-yellow-600" />
                      AI Recommendation Engine Analysis
                    </span>
                    <span className="font-extrabold text-[#003366] text-xs">{elig.matchScore}% Match Score</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-emerald-700 font-bold block mb-1">
                        Matching Competencies ({elig.matchingSkills.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {elig.matchingSkills.length === 0 ? (
                          <span className="text-gray-400">None detected</span>
                        ) : (
                          elig.matchingSkills.map((s, idx) => (
                            <span key={idx} className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
                              ✓ {s}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-rose-700 font-bold block mb-1">
                        Skill Gap / Missing ({elig.missingSkills.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {elig.missingSkills.length === 0 ? (
                          <span className="text-emerald-600 font-semibold">Zero skill gap! Ready for Day 1</span>
                        ) : (
                          elig.missingSkills.map((s, idx) => (
                            <span key={idx} className="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-medium">
                              ✗ {s}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* College Bridge Courses Recommendation */}
                  {elig.recommendedElectives.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200/80 text-[11px]">
                      <span className="font-bold text-[#003366] flex items-center">
                        <BookOpen size={12} className="mr-1 text-yellow-600" />
                        Recommended Sathaye Autonomous Bridge Electives to Boost Shortlist Odds:
                      </span>
                      <ul className="list-disc list-inside text-gray-600 mt-1 space-y-0.5">
                        {elig.recommendedElectives.map((c, idx) => (
                          <li key={idx} className="font-semibold text-gray-800">{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-[10px] text-gray-400 uppercase font-bold mr-1">Rounds:</span>
                    {job.rounds.map((r, idx) => (
                      <span key={idx} className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                        {r}
                      </span>
                    ))}
                  </div>

                  {isApplied ? (
                    <div className="flex items-center space-x-1.5 bg-blue-100 text-blue-900 px-3.5 py-1.5 rounded-lg text-xs font-extrabold">
                      <CheckCircle2 size={14} className="text-blue-700" />
                      <span>Applied • Status: {app.status}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={!elig.isEligible}
                      className="bg-[#003366] hover:bg-blue-900 disabled:opacity-40 disabled:cursor-not-allowed text-yellow-400 font-extrabold text-xs uppercase px-4 py-2 rounded-lg transition-colors shadow-xs flex items-center"
                    >
                      <Send size={13} className="mr-1.5" />
                      1-Click Apply With Sathaye Profile
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
