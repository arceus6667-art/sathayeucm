import { useParams, Link } from 'react-router-dom';
import { mockDepartments } from '../mockData';
import { ChevronRight, FileText, Download, Users, BookOpen, Clock, Award } from 'lucide-react';

export default function DepartmentDetail() {
  const { id } = useParams();
  const department = mockDepartments.find(d => d.id === id);

  if (!department) return <div className="p-8 text-center font-bold text-red-600">Department not found.</div>;

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      {/* Page Header / Banner */}
      <div className="bg-[#003366] text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center"></div>
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight capitalize">{department.title}</h1>
          
          {/* Breadcrumbs */}
          <nav className="flex text-sm mt-4 text-gray-300 font-medium">
            <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
            <span className="mx-2 text-gray-500">/</span>
            <Link to="/departments" className="hover:text-yellow-400 transition-colors">Departments</Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-yellow-400 capitalize">{department.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white shadow rounded border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                <h3 className="font-bold text-[#003366] uppercase tracking-wide text-sm">Quick Links</h3>
              </div>
              <ul className="divide-y divide-gray-100">
                <li className="px-4 py-3 hover:bg-yellow-50 transition-colors cursor-pointer">
                  <Link to="/admissions" className="text-sm font-medium text-gray-700 hover:text-[#003366] flex items-center">
                    <ChevronRight size={14} className="text-yellow-500 mr-2" /> Admissions 2026-27
                  </Link>
                </li>
                <li className="px-4 py-3 hover:bg-yellow-50 transition-colors cursor-pointer">
                  <Link to="/page/466/examination" className="text-sm font-medium text-gray-700 hover:text-[#003366] flex items-center">
                    <ChevronRight size={14} className="text-yellow-500 mr-2" /> Exam Schedules
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="bg-[#1e293b] text-white p-6 rounded shadow border-t-4 border-yellow-500">
              <h3 className="font-bold uppercase tracking-wider mb-2 text-yellow-400">Apply Now</h3>
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">Interested in joining our {department.title} programs?</p>
              <Link to="/apply" className="block text-center bg-white text-[#1e293b] font-bold py-2 rounded hover:bg-gray-200 transition-colors text-sm uppercase tracking-wide">Admission Portal</Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white shadow rounded border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-[#003366] mb-4 uppercase tracking-wide border-b border-gray-200 pb-2">About the Department</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{department.description}</p>

              <h3 className="text-lg font-bold text-[#003366] mb-4 flex items-center"><BookOpen size={20} className="mr-2 text-yellow-500" /> Programs Offered</h3>
              <div className="space-y-4 mb-8">
                {department.programs?.map((prog, idx) => (
                  <div key={idx} className="border border-gray-200 rounded p-4 bg-gray-50 flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[#003366] text-lg mb-1">{prog.name}</h4>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                        <span className="flex items-center"><Award size={14} className="mr-1 text-gray-400" /> {prog.level}</span>
                        <span className="flex items-center"><Clock size={14} className="mr-1 text-gray-400" /> {prog.duration}</span>
                        <span className="flex items-center"><strong>Eligibility:</strong> <span className="ml-1">{prog.eligibility}</span></span>
                        <span className="flex items-center"><strong>Intake:</strong> <span className="ml-1">{prog.intake}</span></span>
                        {prog.fee && <span className="flex items-center font-bold text-green-700">{prog.fee}</span>}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-4 shrink-0">
                       <Link to="/apply" className="bg-[#003366] hover:bg-blue-800 text-white text-xs font-bold py-2 px-4 rounded uppercase tracking-wider transition-colors">Apply</Link>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-bold text-[#003366] mb-4 flex items-center"><Users size={20} className="mr-2 text-yellow-500" /> Faculty Members</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {department.faculty?.map((member, idx) => (
                  <div key={idx} className="flex items-center border border-gray-200 rounded p-4 hover:shadow-md transition-shadow">
                    <img src={member.photo} alt={member.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 mr-4" />
                    <div>
                      <h4 className="font-bold text-gray-900">{member.name}</h4>
                      <p className="text-xs font-bold text-[#003366] uppercase tracking-wider mb-1">{member.designation}</p>
                      <p className="text-xs text-gray-500">{member.qualification}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
