import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      <div className="bg-[#003366] text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center"></div>
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight">Contact Us</h1>
          <nav className="flex text-sm mt-4 text-gray-300 font-medium">
            <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-yellow-400">Contact</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div>
            <h2 className="text-2xl font-bold text-[#003366] mb-6 uppercase tracking-tight">Get In Touch</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We welcome your inquiries. Please use the contact details below or fill out the form to reach the administration office of Sathaye College.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4 text-[#003366] shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 uppercase tracking-wider text-sm">Address</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Parle Tilak Vidyalaya Association's Sathaye College<br />
                    Dixit Road, Vile Parle (East),<br />
                    Mumbai - 400057, Maharashtra, India.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4 text-[#003366] shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 uppercase tracking-wider text-sm">Phone</h4>
                  <p className="text-gray-600 text-sm">+91 9321347772</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4 text-[#003366] shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 uppercase tracking-wider text-sm">Email</h4>
                  <p className="text-gray-600 text-sm"><a href="mailto:sathayecollege@gmail.com" className="hover:text-[#003366]">sathayecollege@gmail.com</a></p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4 text-[#003366] shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 uppercase tracking-wider text-sm">Office Hours</h4>
                  <p className="text-gray-600 text-sm">Monday to Saturday: 10:00 AM - 5:00 PM<br/>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white shadow-lg rounded border-t-4 border-yellow-500 p-8">
              <h3 className="text-xl font-bold text-[#003366] mb-6 border-b border-gray-100 pb-4">Send a Message</h3>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully (Demo mode)"); }}>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                  <input type="text" required className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                  <input type="email" required className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none" placeholder="Your email" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
                  <input type="text" required className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none" placeholder="Message subject" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                  <textarea required rows={4} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none" placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" className="w-full flex items-center justify-center bg-[#003366] text-white px-6 py-3 rounded font-bold hover:bg-blue-800 transition-colors uppercase tracking-wider mt-4">
                  <Send size={18} className="mr-2" /> Send Message
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
      
      {/* Map Section */}
      <div className="w-full h-96 bg-gray-200 relative">
        {/* Fictional Map Placeholder for Demo Purposes */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500">
           <MapPin size={48} className="text-gray-400 mb-4" />
           <p className="font-bold uppercase tracking-widest text-sm">Interactive Map Unavailable in Demo</p>
           <p className="text-xs mt-2">Dixit Road, Vile Parle (East), Mumbai - 400057</p>
        </div>
      </div>
    </div>
  );
}
