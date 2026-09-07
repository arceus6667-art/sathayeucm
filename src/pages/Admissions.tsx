import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, CheckCircle, FileText } from 'lucide-react';

export default function Admissions() {
  return (
    <div className="w-full bg-white font-sans text-gray-800">
      <div className="bg-[#003366] text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center"></div>
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight">Admissions 2026-27</h1>
          <nav className="flex text-sm mt-4 text-gray-300 font-medium">
            <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-yellow-400">Admissions</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-bold text-[#003366] mb-6 border-b border-gray-200 pb-4">Online Admission Procedure</h2>
              <div className="prose max-w-none text-gray-700">
                <p className="text-lg mb-8">Welcome to the online admission portal for Sathaye College. Please read the instructions carefully before proceeding with your application.</p>
                
                <h3 className="text-xl font-bold text-[#003366] mt-8 mb-4 flex items-center">
                  <span className="bg-yellow-500 text-[#003366] w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-black">1</span> 
                  Account Creation
                </h3>
                <p>Register yourself on the admission portal using a valid email address and mobile number. All future communications will be sent to these contact details.</p>
                
                <h3 className="text-xl font-bold text-[#003366] mt-8 mb-4 flex items-center">
                  <span className="bg-yellow-500 text-[#003366] w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-black">2</span> 
                  Fill Application
                </h3>
                <p>Log in with your credentials, fill in your personal details, and select your desired department and program. Ensure all details exactly match your 10th and 12th marksheets.</p>

                <h3 className="text-xl font-bold text-[#003366] mt-8 mb-4 flex items-center">
                  <span className="bg-yellow-500 text-[#003366] w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-black">3</span> 
                  Document Upload
                </h3>
                <p>Upload clear, scanned copies of all required documents in the specified format (JPEG/PDF). Incomplete applications will be rejected.</p>
              </div>
            </section>

            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded shadow-sm">
              <h3 className="text-lg font-bold text-yellow-800 mb-4 flex items-center"><CheckCircle className="mr-2" /> Required Documents for Upload</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li className="flex items-center text-sm text-gray-700"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2"></div> SSC Marksheet</li>
                <li className="flex items-center text-sm text-gray-700"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2"></div> HSC Marksheet</li>
                <li className="flex items-center text-sm text-gray-700"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2"></div> Leaving Certificate</li>
                <li className="flex items-center text-sm text-gray-700"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2"></div> Caste Certificate (if applicable)</li>
                <li className="flex items-center text-sm text-gray-700"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2"></div> Aadhar Card</li>
                <li className="flex items-center text-sm text-gray-700"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2"></div> Passport Size Photograph</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              
              <div className="bg-white shadow-lg rounded border-2 border-yellow-500 overflow-hidden">
                <div className="bg-[#003366] text-white p-4 text-center">
                  <h3 className="font-bold uppercase tracking-wide text-lg">Apply Now</h3>
                </div>
                <div className="p-6 space-y-4">
                  <Link to="/apply" className="block w-full text-center bg-yellow-500 hover:bg-yellow-600 text-[#003366] font-bold py-3 px-4 rounded transition-colors uppercase text-sm tracking-wider shadow">
                    Start Application
                  </Link>
                  <Link to="/login" className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded transition-colors uppercase text-sm tracking-wider border border-gray-300">
                    Applicant Login
                  </Link>
                </div>
              </div>

              <div className="bg-white shadow rounded border border-gray-200 p-6">
                <h3 className="font-bold text-[#003366] mb-4 flex items-center border-b border-gray-200 pb-2"><Calendar size={18} className="mr-2 text-yellow-500" /> Important Dates</h3>
                <ul className="space-y-4">
                  <li className="flex justify-between items-start border-b border-gray-50 pb-2">
                    <div>
                      <p className="text-sm font-bold text-gray-800">Form Filling Starts</p>
                      <p className="text-xs text-gray-500">Online Portal</p>
                    </div>
                    <span className="text-sm font-bold text-[#003366]">May 25</span>
                  </li>
                  <li className="flex justify-between items-start border-b border-gray-50 pb-2">
                    <div>
                      <p className="text-sm font-bold text-gray-800">First Merit List</p>
                      <p className="text-xs text-gray-500">Website & Notice Board</p>
                    </div>
                    <span className="text-sm font-bold text-[#003366]">June 12</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-gray-800">Document Verification</p>
                      <p className="text-xs text-gray-500">College Campus</p>
                    </div>
                    <span className="text-sm font-bold text-[#003366]">June 13-15</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
