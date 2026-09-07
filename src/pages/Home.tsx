import { Link } from 'react-router-dom';
import { mockNotices, mockEvents, mockFacilities, mockDepartments, principalMessage } from '../mockData';
import { ChevronRight, Calendar, ArrowRight, User, BookOpen, GraduationCap, Building, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { id: 1, image: '/WhatsApp%20Image%202026-09-07%20at%209.25.47%20AM.jpeg', title: 'Welcome to Sathaye College', subtitle: 'Empowering minds since 1959' },
    { id: 2, image: '/WhatsApp%20Image%202026-09-07%20at%209.13.05%20AM.jpeg', title: 'State-of-the-Art Infrastructure', subtitle: 'Modern auditoriums and facilities' },
    { id: 4, image: '/WhatsApp%20Image%202026-09-07%20at%209.11.20%20AM.jpeg', title: 'Vibrant Campus Life', subtitle: 'Nurturing creativity and innovation' },
    { id: 5, image: '/WhatsApp%20Image%202026-09-07%20at%209.09.32%20AM.jpeg', title: 'Holistic Development', subtitle: 'Focusing on education, culture, and sports' },
    { id: 6, image: '/WhatsApp%20Image%202026-09-07%20at%209.09.14%20AM.jpeg', title: 'Rich Heritage', subtitle: 'A legacy of academic brilliance since 1959' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-white font-sans text-gray-800">
      
      {/* Hero Slider */}
      <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden bg-gray-900">
        <AnimatePresence>
          {slides.map((slide, index) => (
            index === currentSlide && (
              <motion.div 
                key={slide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0 bg-black/50 z-10" />
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                  <h2 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-white mb-4 uppercase tracking-wider drop-shadow-lg">{slide.title}</h2>
                  <p className="text-lg md:text-2xl text-yellow-400 font-medium drop-shadow-md">{slide.subtitle}</p>
                  <div className="mt-8 flex space-x-4">
                    <Link to="/page/3/about-college" className="bg-[#003366] hover:bg-blue-800 text-white px-6 py-3 rounded text-sm md:text-base font-semibold transition-colors border border-[#003366]">
                      Discover More
                    </Link>
                    <Link to="/admissions" className="bg-transparent hover:bg-yellow-500 text-yellow-400 hover:text-[#003366] px-6 py-3 rounded text-sm md:text-base font-semibold transition-colors border-2 border-yellow-500">
                      Admissions 2026
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
        {/* Slider Controls */}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center space-x-2">
          {slides.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-colors ${idx === currentSlide ? 'bg-yellow-500' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* Announcements Marquee */}
      <div className="bg-[#003366] text-white py-2 flex items-center border-b-[4px] border-yellow-500">
        <div className="bg-yellow-500 text-[#003366] font-bold px-4 py-1 text-sm uppercase shrink-0 z-10 ml-4 md:ml-8 rounded-sm shadow-sm">Latest Updates</div>
        <div className="overflow-hidden whitespace-nowrap ml-4 flex-grow">
          <div className="animate-marquee inline-block text-sm font-medium">
            {mockNotices.map((n) => (
              <span key={n.id} className="mx-8">
                {n.title} {n.isNew && <span className="text-red-600 text-[10px] bg-yellow-300 px-2 py-0.5 rounded-sm font-bold animate-pulse ml-1">NEW</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* About & Principal Section */}
      <section className="py-16 md:py-24 max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* About College */}
          <div className="lg:col-span-7">
            <h3 className="text-[#003366] font-bold uppercase tracking-widest text-sm mb-2 flex items-center">
              <span className="w-8 h-1 bg-yellow-500 mr-2 inline-block"></span> Welcome To
            </h3>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 uppercase tracking-tight">Sathaye College</h2>
            <p className="text-gray-600 mb-4 leading-relaxed text-lg">
              Established in 1959 by the Parle Tilak Vidyalaya Association, Sathaye College has grown into a premier institution of higher education in Mumbai. We offer a diverse range of undergraduate, postgraduate, and doctoral programs.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Our campus is a vibrant community where students are encouraged to explore their potential not just academically, but also in cultural activities, sports, and social service through NSS and NCC. With autonomous status granted in 2021, we continue to innovate our curriculum to meet global standards.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded border-l-4 border-[#003366]">
                <h4 className="font-bold text-[#003366] text-xl">A Grade</h4>
                <p className="text-sm text-gray-600">NAAC Re-accreditation</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-500">
                <h4 className="font-bold text-yellow-700 text-xl">Autonomous</h4>
                <p className="text-sm text-gray-600">Status 2021-31</p>
              </div>
            </div>
            <Link to="/page/3/about-college" className="inline-flex items-center font-bold text-[#003366] hover:text-yellow-600 transition-colors uppercase text-sm tracking-wide">
              Read More About College <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>

          {/* Principal's Message & Notices */}
          <div className="lg:col-span-5 space-y-8">
            {/* Principal Box */}
            <div className="bg-white rounded shadow-md border border-gray-100 overflow-hidden relative">
              <div className="h-1 w-full bg-[#003366]"></div>
              <div className="p-6 md:p-8">
                <div className="flex items-start mb-4">
                  <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden shrink-0 border-2 border-yellow-500">
                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200" alt="Principal" className="w-full h-full object-cover" />
                  </div>
                  <div className="ml-4 pt-2">
                    <h3 className="font-bold text-xl text-[#003366]">Principal's Desk</h3>
                    <p className="text-sm text-yellow-600 font-medium">Dr. M. R. Rajwade</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm italic mb-4 line-clamp-4 relative bg-gray-50 p-3 rounded border border-gray-100">
                  "{principalMessage}"
                </p>
                <Link to="/page/157/principals-message" className="text-[#003366] text-sm font-bold hover:underline inline-flex items-center uppercase tracking-wide">
                  Read Full Message <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Quick Notice Board */}
            <div className="bg-white rounded shadow border border-gray-100 overflow-hidden">
              <div className="bg-[#003366] text-white px-4 py-3 flex justify-between items-center">
                <h3 className="font-bold uppercase flex items-center tracking-wider text-sm"><Calendar size={16} className="mr-2 text-yellow-400" /> Notice Board</h3>
                <Link to="/page/496/notice-board" className="text-xs text-yellow-400 hover:text-white transition-colors">View All</Link>
              </div>
              <div className="p-0">
                <ul className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                  {mockNotices.map(notice => (
                    <li key={notice.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-bold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded uppercase tracking-wider">{notice.category}</span>
                        <span className="text-xs text-gray-400 font-medium">{notice.date}</span>
                      </div>
                      <Link to={`/notice/${notice.id}`} className="text-gray-800 font-medium text-sm hover:text-[#003366] block leading-snug mt-1">
                        {notice.title} {notice.isNew && <span className="inline-block w-2 h-2 rounded-full bg-red-500 ml-1"></span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-cover bg-center relative bg-fixed py-16" style={{backgroundImage: 'url(/WhatsApp%20Image%202026-09-07%20at%209.13.05%20AM.jpeg)'}}>
        <div className="absolute inset-0 bg-[#003366]/90"></div>
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div className="p-4">
              <User size={48} className="mx-auto mb-4 text-yellow-400 opacity-90" />
              <h3 className="text-4xl font-extrabold mb-2">5000+</h3>
              <p className="uppercase text-sm tracking-widest font-bold text-gray-300">Students</p>
            </div>
            <div className="p-4">
              <BookOpen size={48} className="mx-auto mb-4 text-yellow-400 opacity-90" />
              <h3 className="text-4xl font-extrabold mb-2">35+</h3>
              <p className="uppercase text-sm tracking-widest font-bold text-gray-300">Programs</p>
            </div>
            <div className="p-4">
              <GraduationCap size={48} className="mx-auto mb-4 text-yellow-400 opacity-90" />
              <h3 className="text-4xl font-extrabold mb-2">150+</h3>
              <p className="uppercase text-sm tracking-widest font-bold text-gray-300">Faculty</p>
            </div>
            <div className="p-4">
              <Building size={48} className="mx-auto mb-4 text-yellow-400 opacity-90" />
              <h3 className="text-4xl font-extrabold mb-2">1959</h3>
              <p className="uppercase text-sm tracking-widest font-bold text-gray-300">Established</p>
            </div>
          </div>
        </div>
      </section>

      {/* Academics/Departments */}
      <section className="py-16 md:py-24 bg-gray-50 border-y border-gray-200">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="text-yellow-600 font-bold uppercase tracking-widest text-sm mb-2">Academics</h3>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#003366] uppercase tracking-tight">Departments & Programs</h2>
            <div className="w-16 h-1 bg-yellow-500 mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockDepartments.map((dept, idx) => (
              <div key={dept.id} className="group bg-white rounded shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-1 w-full bg-gray-200 group-hover:bg-[#003366] transition-colors"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#003366] transition-colors border-b border-gray-100 pb-3">{dept.title}</h3>
                  <ul className="space-y-2 mb-6">
                    {dept.subjects.slice(0, 4).map((sub, i) => (
                      <li key={i} className="text-gray-600 text-sm flex items-start">
                        <ChevronRight size={16} className="text-yellow-500 mr-2 shrink-0 mt-0.5" /> {sub}
                      </li>
                    ))}
                    {dept.subjects.length > 4 && <li className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-6 mt-2">+{dept.subjects.length - 4} More</li>}
                  </ul>
                  <Link to={`/department/${dept.id}`} className="text-xs font-bold text-white bg-[#003366] px-4 py-2 rounded uppercase tracking-wider hover:bg-yellow-500 hover:text-[#003366] transition-colors inline-block">
                    Explore Department
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities & Events - Split layout */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Campus Facilities */}
            <div>
              <h3 className="text-2xl font-bold text-[#003366] mb-8 uppercase border-b-2 border-yellow-500 pb-2 inline-block tracking-tight">Campus Facilities</h3>
              <div className="space-y-6">
                {mockFacilities.slice(0, 3).map(fac => (
                  <div key={fac.id} className="flex bg-gray-50 rounded shadow-sm overflow-hidden border border-gray-200 hover:border-[#003366] transition-colors group">
                    <div className="w-1/3 shrink-0 overflow-hidden">
                      <img src={fac.image} alt={fac.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5 flex flex-col justify-center">
                      <h4 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-[#003366]">{fac.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{fac.desc}</p>
                      <Link to={`/page/162/facilities`} className="text-[#003366] text-xs font-bold uppercase tracking-wider hover:text-yellow-600 flex items-center">
                        View Details <ArrowRight size={14} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <h3 className="text-2xl font-bold text-[#003366] mb-8 uppercase border-b-2 border-yellow-500 pb-2 inline-block tracking-tight">Upcoming Events</h3>
              <div className="grid gap-6">
                {mockEvents.map(event => (
                  <div key={event.id} className="group relative overflow-hidden rounded shadow-sm border border-gray-200 aspect-[21/9]">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/90 via-[#003366]/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 w-full border-b-[3px] border-yellow-500">
                      <span className="bg-yellow-500 text-[#003366] text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-sm mb-3 inline-block shadow">
                        {event.date}
                      </span>
                      <h4 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors leading-tight">{event.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <style>{`
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
