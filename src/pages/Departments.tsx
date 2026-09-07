import { mockDepartments } from '../mockData';
import { ChevronRight, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Departments() {
  return (
    <div className="w-full bg-gray-50 font-sans text-gray-800">
      <div className="bg-[#003366] text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center"></div>
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight">Departments & Programs</h1>
          <nav className="flex text-sm mt-4 text-gray-300 font-medium">
            <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-yellow-400">Departments</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#003366] mb-4 border-b-2 border-yellow-500 pb-2 inline-block">Academic Departments</h2>
          <p className="text-gray-600 max-w-3xl leading-relaxed mt-4">
            Sathaye College offers a wide array of programs across Arts, Science, and Commerce streams. Our departments are equipped with modern facilities and staffed by experienced faculty members dedicated to academic excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockDepartments.map((dept) => (
            <div key={dept.id} className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all flex flex-col h-full">
              <div className="h-2 w-full bg-gray-200 group-hover:bg-[#003366] transition-colors"></div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center mb-4 border-b border-gray-100 pb-4">
                  <div className="w-10 h-10 rounded bg-blue-50 text-[#003366] flex items-center justify-center mr-3 shrink-0 group-hover:bg-[#003366] group-hover:text-white transition-colors">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#003366] transition-colors leading-tight">{dept.title}</h3>
                </div>
                
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Programs Offered</h4>
                <ul className="space-y-2 flex-grow mb-6">
                  {dept.subjects.map((sub, i) => (
                    <li key={i} className="text-gray-700 text-sm flex items-start">
                      <ChevronRight size={16} className="text-yellow-500 mr-2 shrink-0 mt-0.5" /> {sub}
                    </li>
                  ))}
                </ul>
                
                <Link to={`/department/${dept.id}`} className="mt-auto w-full inline-flex items-center justify-center bg-gray-50 hover:bg-[#003366] text-[#003366] hover:text-white border border-gray-200 font-bold py-2 px-4 rounded text-sm uppercase tracking-wider transition-colors">
                  View Department <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
