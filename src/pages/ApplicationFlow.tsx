import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Upload, ChevronRight, ChevronLeft, Building, User, Lock, FileText, CheckSquare, Search } from 'lucide-react';
import { mockDepartments } from '../mockData';

export default function ApplicationFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (step === 7) {
      const timer = setTimeout(() => {
        setStep(8);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const [formData, setFormData] = useState({
    // Account
    email: '',
    phone: '',
    password: '',
    // Personal
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    address: '',
    // Course
    departmentId: '',
    programName: '',
    // Documents
    sscUploaded: false,
    hscUploaded: false,
    photoUploaded: false,
    signatureUploaded: false,
    // Consent
    termsAccepted: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Generate a random app ID upon completion
  const [appId] = useState("DEMO-APP-" + Math.floor(100000 + Math.random() * 900000));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = (docName: string) => {
    setFormData(prev => ({ ...prev, [docName]: true }));
    if (errors[docName]) {
      setErrors(prev => ({ ...prev, [docName]: '' }));
    }
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = "Valid email is required";
        isValid = false;
      }
      if (!formData.phone || formData.phone.length < 10) {
        newErrors.phone = "Valid 10-digit phone number is required";
        isValid = false;
      }
      if (!formData.password || formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
        isValid = false;
      }
    } else if (currentStep === 3) {
      if (!formData.firstName) { newErrors.firstName = "First name is required"; isValid = false; }
      if (!formData.lastName) { newErrors.lastName = "Last name is required"; isValid = false; }
      if (!formData.dob) { newErrors.dob = "Date of birth is required"; isValid = false; }
      if (!formData.gender) { newErrors.gender = "Gender is required"; isValid = false; }
      if (!formData.address) { newErrors.address = "Address is required"; isValid = false; }
    } else if (currentStep === 4) {
      if (!formData.departmentId) { newErrors.departmentId = "Please select a department"; isValid = false; }
      if (!formData.programName) { newErrors.programName = "Please select a program"; isValid = false; }
    } else if (currentStep === 5) {
      if (!formData.sscUploaded) { newErrors.sscUploaded = "SSC Marksheet is required"; isValid = false; }
      if (!formData.hscUploaded) { newErrors.hscUploaded = "HSC Marksheet is required"; isValid = false; }
      if (!formData.photoUploaded) { newErrors.photoUploaded = "Photograph is required"; isValid = false; }
      if (!formData.signatureUploaded) { newErrors.signatureUploaded = "Signature is required"; isValid = false; }
    } else if (currentStep === 6) {
      if (!formData.termsAccepted) { newErrors.termsAccepted = "You must accept the terms and conditions"; isValid = false; }
    }

    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const autoFillDemo = () => {
    setFormData({
      email: 'aarav.demo@example.com',
      phone: '9876543210',
      password: 'DemoStudent@123',
      firstName: 'Aarav',
      lastName: 'Mehta',
      dob: '2005-04-15',
      gender: 'Male',
      address: '101, Sunshine Apts, Vile Parle East, Mumbai',
      departmentId: '16', // Science
      programName: 'B.Sc. in Physics',
      sscUploaded: true,
      hscUploaded: true,
      photoUploaded: true,
      signatureUploaded: true,
      termsAccepted: true
    });
  };

  const steps = [
    { num: 1, title: 'Register', icon: <User size={16} /> },
    { num: 2, title: 'Login', icon: <Lock size={16} /> },
    { num: 3, title: 'Personal Info', icon: <FileText size={16} /> },
    { num: 4, title: 'Course', icon: <Building size={16} /> },
    { num: 5, title: 'Documents', icon: <Upload size={16} /> },
    { num: 6, title: 'Review', icon: <Search size={16} /> },
    { num: 7, title: 'Submit', icon: <CheckSquare size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-[#003366] text-white py-4 shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 text-[#003366] font-bold shadow-sm border border-yellow-500">
              SC
            </div>
            <div>
              <h1 className="text-xl font-bold uppercase tracking-tight leading-none">Admission Portal</h1>
              <p className="text-xs text-yellow-400">Academic Year 2026-27</p>
            </div>
          </div>
          <Link to="/" className="text-sm hover:text-yellow-400 font-medium">Back to Home</Link>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-8">
        
        {/* Progress Bar */}
        {step < 8 && (
          <div className="mb-8">
            <div className="flex justify-between items-center relative">
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
              <div className="absolute left-0 top-1/2 h-1 bg-[#003366] -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}></div>
              
              {steps.map((s) => (
                <div key={s.num} className={`flex flex-col items-center ${step >= s.num ? 'text-[#003366]' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 mb-1 transition-colors ${step > s.num ? 'bg-[#003366] border-[#003366] text-white' : step === s.num ? 'bg-white border-[#003366] text-[#003366]' : 'bg-white border-gray-300 text-gray-400'}`}>
                    {step > s.num ? <CheckCircle size={16} /> : s.num}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">{s.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
          {/* Header for Step */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#003366] uppercase tracking-wide">
              {step === 8 ? 'Application Successful' : `Step ${step}: ${steps.find(s => s.num === step)?.title || 'Application'}`}
            </h2>
            {step === 1 && (
              <button onClick={autoFillDemo} className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded font-bold hover:bg-yellow-200 border border-yellow-300">
                Auto-fill Demo Data
              </button>
            )}
          </div>

          <div className="p-6 md:p-8">
            
            {/* STEP 1: Account Creation */}
            {step === 1 && (
              <div className="space-y-6 max-w-md mx-auto">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Create Application Account</h3>
                  <p className="text-sm text-gray-500">Register to start your admission process</p>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-[#003366] focus:border-[#003366]`} placeholder="Enter active email" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={`w-full p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-[#003366] focus:border-[#003366]`} placeholder="10-digit mobile number" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} className={`w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-[#003366] focus:border-[#003366]`} placeholder="Create a password" />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <button onClick={nextStep} className="w-full bg-[#003366] hover:bg-blue-800 text-white font-bold py-3 px-4 rounded uppercase tracking-wider transition-colors mt-4">
                  Register & Continue
                </button>
              </div>
            )}

            {/* STEP 2: Login (Simulated) */}
            {step === 2 && (
              <div className="space-y-6 max-w-md mx-auto text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Registration Successful!</h3>
                <p className="text-gray-600 mb-6">Your account has been created. Please log in with your credentials to proceed with the application.</p>
                
                <div className="bg-gray-50 p-6 rounded border border-gray-200 text-left mb-6">
                  <p className="text-sm text-gray-700 mb-2"><strong>Username:</strong> {formData.email}</p>
                  <p className="text-sm text-gray-700"><strong>Password:</strong> ********</p>
                </div>

                <button onClick={nextStep} className="w-full bg-[#003366] hover:bg-blue-800 text-white font-bold py-3 px-4 rounded uppercase tracking-wider transition-colors">
                  Login & Proceed to Application
                </button>
              </div>
            )}

            {/* STEP 3: Personal Info */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Applicant Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={`w-full p-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded`} />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={`w-full p-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded`} />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className={`w-full p-2 border ${errors.dob ? 'border-red-500' : 'border-gray-300'} rounded`} />
                    {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Gender <span className="text-red-500">*</span></label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className={`w-full p-2 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded bg-white`}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Residential Address <span className="text-red-500">*</span></label>
                    <textarea name="address" value={formData.address} onChange={handleInputChange} rows={3} className={`w-full p-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded`}></textarea>
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Course Selection */}
            {step === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Academic Program Selection</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Select Department / Faculty <span className="text-red-500">*</span></label>
                    <select name="departmentId" value={formData.departmentId} onChange={handleInputChange} className={`w-full p-2 border ${errors.departmentId ? 'border-red-500' : 'border-gray-300'} rounded bg-white`}>
                      <option value="">-- Select Faculty --</option>
                      {mockDepartments.map(d => (
                        <option key={d.id} value={d.id}>{d.title}</option>
                      ))}
                    </select>
                    {errors.departmentId && <p className="text-red-500 text-xs mt-1">{errors.departmentId}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Select Program <span className="text-red-500">*</span></label>
                    <select name="programName" value={formData.programName} onChange={handleInputChange} className={`w-full p-2 border ${errors.programName ? 'border-red-500' : 'border-gray-300'} rounded bg-white`} disabled={!formData.departmentId}>
                      <option value="">-- Select Program --</option>
                      {formData.departmentId && mockDepartments.find(d => d.id === formData.departmentId)?.programs?.map(p => (
                        <option key={p.name} value={p.name}>{p.name} ({p.level})</option>
                      ))}
                    </select>
                    {errors.programName && <p className="text-red-500 text-xs mt-1">{errors.programName}</p>}
                  </div>
                </div>
                
                {formData.programName && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded mt-6 flex items-start">
                    <AlertCircle className="text-blue-500 mr-3 shrink-0 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-bold text-blue-900 text-sm">Program Selected: {formData.programName}</h4>
                      <p className="text-xs text-blue-800 mt-1">Please ensure you meet the eligibility criteria for this program as specified on the department page. Application fees are non-refundable.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 5: Documents */}
            {step === 5 && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Document Uploads</h3>
                <p className="text-sm text-gray-600 mb-4">Please upload scanned copies of the following documents. (Demo: Click to simulate upload)</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'sscUploaded', label: '10th (SSC) Marksheet', required: true },
                    { id: 'hscUploaded', label: '12th (HSC) Marksheet', required: true },
                    { id: 'photoUploaded', label: 'Passport Size Photograph', required: true },
                    { id: 'signatureUploaded', label: 'Applicant Signature', required: true }
                  ].map(doc => (
                    <div key={doc.id} className={`p-4 border ${errors[doc.id] ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'} rounded flex justify-between items-center`}>
                      <div>
                        <p className="font-bold text-sm text-gray-800">{doc.label} {doc.required && <span className="text-red-500">*</span>}</p>
                        {errors[doc.id] && <p className="text-red-500 text-xs">{errors[doc.id]}</p>}
                      </div>
                      <button 
                        onClick={() => handleFileUpload(doc.id)}
                        className={`px-3 py-1 text-xs font-bold rounded uppercase ${formData[doc.id as keyof typeof formData] ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                      >
                        {formData[doc.id as keyof typeof formData] ? 'Uploaded ✓' : 'Upload'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 6: Review */}
            {step === 6 && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Review Application</h3>
                
                <div className="bg-gray-50 border border-gray-200 p-6 rounded space-y-6">
                  
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Personal Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p><span className="text-gray-500">Name:</span> <strong>{formData.firstName} {formData.lastName}</strong></p>
                      <p><span className="text-gray-500">DOB:</span> <strong>{formData.dob}</strong></p>
                      <p><span className="text-gray-500">Gender:</span> <strong>{formData.gender}</strong></p>
                      <p><span className="text-gray-500">Email:</span> <strong>{formData.email}</strong></p>
                      <p className="col-span-2"><span className="text-gray-500">Address:</span> <strong>{formData.address}</strong></p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Academic Selection</h4>
                    <div className="text-sm">
                      <p><span className="text-gray-500">Department:</span> <strong>{mockDepartments.find(d => d.id === formData.departmentId)?.title}</strong></p>
                      <p><span className="text-gray-500">Program:</span> <strong>{formData.programName}</strong></p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Documents</h4>
                    <div className="flex space-x-4 text-xs font-bold text-green-700">
                      <span>✓ SSC Marksheet</span>
                      <span>✓ HSC Marksheet</span>
                      <span>✓ Photo</span>
                      <span>✓ Signature</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 border border-yellow-200 rounded">
                  <label className="flex items-start">
                    <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleInputChange} className="mt-1 mr-3" />
                    <span className="text-sm text-gray-700">
                      I hereby declare that the information provided above is true and correct to the best of my knowledge. I understand that any false information may lead to cancellation of admission.
                    </span>
                  </label>
                  {errors.termsAccepted && <p className="text-red-500 text-xs mt-2 ml-6">{errors.termsAccepted}</p>}
                </div>

              </div>
            )}

            {/* STEP 7: Submit Process (Dummy) */}
            {step === 7 && (
              <div className="space-y-6 text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-[#003366] border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-gray-900">Processing Application...</h3>
                <p className="text-gray-500 text-sm">Please do not refresh or close the page.</p>
                {/* Auto advance after 2 seconds */}
                
              </div>
            )}

            {/* STEP 8: Success */}
            {step === 8 && (
              <div className="space-y-6 text-center py-8">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h3>
                <p className="text-gray-600 mb-6">Your application for {formData.programName} has been received.</p>
                
                <div className="bg-gray-50 p-6 rounded border border-gray-200 max-w-sm mx-auto mb-8">
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Application Number</p>
                  <p className="text-2xl font-bold text-[#003366]">{appId}</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded text-sm uppercase tracking-wider transition-colors border border-gray-300">
                    Download Form
                  </button>
                  <Link to="/portal" className="bg-[#003366] hover:bg-blue-800 text-white font-bold py-2 px-6 rounded text-sm uppercase tracking-wider transition-colors">
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {step > 2 && step < 7 && (
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                <button 
                  onClick={prevStep}
                  className="flex items-center text-[#003366] font-bold hover:bg-gray-100 px-4 py-2 rounded transition-colors"
                >
                  <ChevronLeft size={16} className="mr-1" /> Back
                </button>
                <button 
                  onClick={nextStep}
                  className="flex items-center bg-[#003366] hover:bg-blue-800 text-white font-bold px-6 py-2 rounded transition-colors"
                >
                  {step === 6 ? 'Submit Application' : 'Save & Continue'} <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            )}

          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-gray-400 py-4 text-center text-xs mt-auto">
        &copy; 2026 Sathaye College. This is a demo application portal.
      </footer>
    </div>
  );
}
