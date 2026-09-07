import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, GraduationCap, Users } from 'lucide-react';

export default function AlumniRegistration() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      <div className="bg-[#003366] text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center"></div>
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight">Alumni Registration</h1>
          <nav className="flex text-sm mt-4 text-gray-300 font-medium">
            <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
            <span className="mx-2 text-gray-500">/</span>
            <Link to="/page/67/alumni-activities" className="hover:text-yellow-400 transition-colors">Alumni</Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-yellow-400">Registration</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white shadow rounded border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                <h3 className="font-bold text-[#003366] uppercase tracking-wide text-sm">Alumni Links</h3>
              </div>
              <ul className="divide-y divide-gray-100">
                <li className="px-4 py-3 hover:bg-yellow-50 transition-colors cursor-pointer">
                  <Link to="/page/67/alumni-activities" className="text-sm font-medium text-gray-700 hover:text-[#003366] flex items-center">
                    <ChevronRight size={14} className="text-yellow-500 mr-2" /> Alumni Activities
                  </Link>
                </li>
                <li className="px-4 py-3 bg-yellow-50 cursor-pointer border-l-4 border-yellow-500">
                  <span className="text-sm font-bold text-[#003366] flex items-center">
                    <ChevronRight size={14} className="text-[#003366] mr-2" /> Alumni Registration
                  </span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-6 rounded shadow-sm border border-gray-200 text-center">
               <div className="w-16 h-16 mx-auto bg-blue-100 text-[#003366] rounded-full flex items-center justify-center mb-4">
                 <Users size={32} />
               </div>
               <h3 className="font-bold text-[#003366] uppercase tracking-wide mb-2">Connect With Us</h3>
               <p className="text-sm text-gray-600">Join our extensive alumni network to stay updated with college events and networking opportunities.</p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white shadow rounded border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-[#003366] mb-6 border-b border-gray-200 pb-4 flex items-center">
                <GraduationCap className="mr-3 text-yellow-500" size={28} />
                Alumni Registration Form
              </h2>
              
              {isSubmitted ? (
                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded shadow-sm text-center">
                   <div className="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                   </div>
                   <h3 className="text-xl font-bold text-green-800 mb-2">Registration Successful</h3>
                   <p className="text-green-700">Thank you for registering with the Sathaye College Alumni Network. Your details have been recorded successfully.</p>
                   <button onClick={() => setIsSubmitted(false)} className="mt-6 bg-[#003366] text-white px-6 py-2 rounded font-bold text-sm hover:bg-blue-800 transition-colors uppercase tracking-wider">
                     Submit Another
                   </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-sm text-gray-700 mb-8">
                    <p><strong>Note:</strong> This form is for demo purposes only. No real data is stored or transmitted.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                      <input type="text" required className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none" placeholder="Enter first name" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                      <input type="text" required className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none" placeholder="Enter last name" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                      <input type="email" required className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none" placeholder="Email for communication" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                      <input type="tel" required pattern="[0-9]{10}" className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none" placeholder="10 digit mobile number" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Course Completed <span className="text-red-500">*</span></label>
                      <select required className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none bg-white">
                        <option value="">Select a course</option>
                        <option value="B.A.">B.A.</option>
                        <option value="B.Com.">B.Com.</option>
                        <option value="B.Sc.">B.Sc.</option>
                        <option value="B.M.S.">B.M.S.</option>
                        <option value="B.A.M.M.C.">B.A.M.M.C.</option>
                        <option value="B.Sc. IT">B.Sc. IT</option>
                        <option value="M.A.">M.A.</option>
                        <option value="M.Com.">M.Com.</option>
                        <option value="M.Sc.">M.Sc.</option>
                        <option value="Ph.D.">Ph.D.</option>
                        <option value="Junior College">Junior College (11th/12th)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Year of Passing <span className="text-red-500">*</span></label>
                      <select required className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none bg-white">
                        <option value="">Select year</option>
                        {Array.from({length: 50}, (_, i) => new Date().getFullYear() - i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Current Organization (Optional)</label>
                      <input type="text" className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none" placeholder="Where do you work?" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Designation (Optional)</label>
                      <input type="text" className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none" placeholder="Your job title" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button type="submit" className="w-full md:w-auto bg-[#003366] text-white px-8 py-3 rounded font-bold text-sm hover:bg-blue-800 transition-colors uppercase tracking-wider shadow">
                      Submit Registration
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
