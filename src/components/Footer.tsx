import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1e293b] text-white pt-12 pb-6 border-t-[6px] border-yellow-500">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Section */}
          <div>
            <h4 className="text-lg font-bold uppercase tracking-wider mb-4 border-b-2 border-yellow-500 pb-2 inline-block">Sathaye College</h4>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Parle Tilak Vidyalaya Association's Sathaye College (Autonomous 2021-31). Re-accredited "A" Grade by NAAC (3rd CYCLE). An institution dedicated to excellence in education and holistic student development.
            </p>
            <div className="flex space-x-3 mt-4">
              <a href="https://sathayecollege.edu.in" className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center hover:bg-[#003366] hover:text-white transition-colors">
                <Facebook size={16} />
              </a>
              <a href="https://sathayecollege.edu.in" className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center hover:bg-[#003366] hover:text-white transition-colors">
                <Twitter size={16} />
              </a>
              <a href="https://sathayecollege.edu.in" className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center hover:bg-[#003366] hover:text-white transition-colors">
                <Instagram size={16} />
              </a>
              <a href="https://sathayecollege.edu.in" className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center hover:bg-[#003366] hover:text-white transition-colors">
                <Linkedin size={16} />
              </a>
              <a href="https://sathayecollege.edu.in" className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold uppercase tracking-wider mb-4 border-b-2 border-yellow-500 pb-2 inline-block">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/page/3/about-college" className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">›</span> About Us</Link></li>
              <li><Link to="/admissions" className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">›</span> Admissions</Link></li>
              <li><Link to="/departments" className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">›</span> Departments</Link></li>
              <li><Link to="/page/460/placement" className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">›</span> Placements</Link></li>
              <li><Link to="/page/67/alumni-activities" className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">›</span> Alumni</Link></li>
              <li><Link to="/page/9/calendar" className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">›</span> Academic Calendar</Link></li>
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h4 className="text-lg font-bold uppercase tracking-wider mb-4 border-b-2 border-yellow-500 pb-2 inline-block">Important Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/page/189/nep-2020" className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">›</span> NEP 2020</Link></li>
              <li><Link to="/page/136/scholarships" className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">›</span> Scholarships</Link></li>
              <li><Link to="/page/466/examination" className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">›</span> Examination Policy</Link></li>
              <li><Link to="/page/133/anti-ragging" className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">›</span> Anti-Ragging</Link></li>
              <li><Link to="/page/32/grievance-redressal" className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">›</span> Grievance Redressal</Link></li>
              <li><Link to="/page/481/library" className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">›</span> Library</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold uppercase tracking-wider mb-4 border-b-2 border-yellow-500 pb-2 inline-block">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 text-yellow-500 shrink-0 mt-0.5" />
                <span>Dixit Road, Vile Parle (East),<br />Mumbai - 400057,<br />Maharashtra, India.</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 text-yellow-500 shrink-0" />
                <span>+91 9321347772</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 text-yellow-500 shrink-0" />
                <a href="mailto:sathayecollege@gmail.com" className="hover:text-white">sathayecollege@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Sathaye College. All Rights Reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/page/1/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/page/2/terms-of-use" className="hover:text-white">Terms of Use</Link>
            <Link to="/page/3/sitemap" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
