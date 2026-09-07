export const mockNotices = [
  { id: 1, title: 'Admissions Open for Academic Year 2026-27', date: '2026-08-15', category: 'Admission', isNew: true },
  { id: 2, title: 'Exam Timetable for First Year Degree College', date: '2026-09-01', category: 'Examination', isNew: true },
  { id: 3, title: 'Scholarship Application Deadline Extended', date: '2026-08-28', category: 'Student Section', isNew: false },
  { id: 4, title: 'NSS Enrollment for Current Academic Year', date: '2026-08-20', category: 'Notices', isNew: false },
  { id: 5, title: 'Placement Drive: IT & Computer Science', date: '2026-09-05', category: 'Placement', isNew: true },
];

export const mockEvents = [
  { id: 1, title: 'Annual Cultural Fest - Saptarang', date: '2026-10-15', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800' },
  { id: 2, title: 'Science Exhibition & Seminar', date: '2026-11-02', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800' },
  { id: 3, title: 'Intercollegiate Debate Competition', date: '2026-09-20', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800' },
];

export const mockDepartments = [
  { 
    id: '16', 
    title: 'Science Faculty', 
    description: 'The Faculty of Science at Sathaye College offers a robust curriculum emphasizing theoretical knowledge and practical skills. Our well-equipped laboratories and experienced faculty provide an excellent environment for scientific inquiry.',
    subjects: ['Physics', 'Chemistry', 'Botany', 'Zoology', 'Mathematics', 'Statistics'],
    programs: [
      { name: 'B.Sc. in Physics', level: 'Undergraduate', duration: '3 Years', eligibility: 'HSC Science', intake: 120 },
      { name: 'B.Sc. in Chemistry', level: 'Undergraduate', duration: '3 Years', eligibility: 'HSC Science', intake: 120 },
      { name: 'M.Sc. in Botany', level: 'Postgraduate', duration: '2 Years', eligibility: 'B.Sc. Botany', intake: 40 },
      { name: 'Ph.D. in Zoology', level: 'Doctoral', duration: '3-5 Years', eligibility: 'M.Sc. with NET/SET', intake: 10 }
    ],
    faculty: [
      { name: 'Dr. Anjali Deshmukh', designation: 'Head of Department', qualification: 'M.Sc., Ph.D.', photo: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { name: 'Prof. Rajesh Kadam', designation: 'Associate Professor', qualification: 'M.Sc., NET', photo: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { name: 'Dr. Priya Sharma', designation: 'Assistant Professor', qualification: 'M.Sc., Ph.D.', photo: 'https://randomuser.me/api/portraits/women/68.jpg' }
    ]
  },
  { 
    id: '17', 
    title: 'Commerce Faculty', 
    description: 'The Commerce department is dedicated to providing comprehensive education in accounting, finance, and business management, preparing students for successful careers in the corporate world.',
    subjects: ['Accountancy', 'Economics', 'Commerce'],
    programs: [
      { name: 'B.Com. (General)', level: 'Undergraduate', duration: '3 Years', eligibility: 'HSC Commerce', intake: 360 },
      { name: 'M.Com. (Advanced Accountancy)', level: 'Postgraduate', duration: '2 Years', eligibility: 'B.Com.', intake: 60 }
    ],
    faculty: [
      { name: 'Dr. S. K. Patil', designation: 'Head of Department', qualification: 'M.Com., Ph.D., CA', photo: 'https://randomuser.me/api/portraits/men/45.jpg' },
      { name: 'Prof. Neha Joshi', designation: 'Assistant Professor', qualification: 'M.Com., SET', photo: 'https://randomuser.me/api/portraits/women/33.jpg' }
    ]
  },
  { 
    id: '18', 
    title: 'Arts Faculty', 
    description: 'The Faculty of Arts nurtures critical thinking and creativity, offering diverse programs in languages, humanities, and social sciences.',
    subjects: ['English', 'Marathi', 'Hindi', 'Sanskrit', 'History', 'Sociology', 'Political Science', 'Economics'],
    programs: [
      { name: 'B.A. (English Literature)', level: 'Undergraduate', duration: '3 Years', eligibility: 'HSC Arts', intake: 120 },
      { name: 'B.A. (History)', level: 'Undergraduate', duration: '3 Years', eligibility: 'HSC Arts', intake: 120 },
      { name: 'M.A. (Marathi)', level: 'Postgraduate', duration: '2 Years', eligibility: 'B.A. Marathi', intake: 60 }
    ],
    faculty: [
      { name: 'Dr. Milind Kulkarni', designation: 'Head of Department', qualification: 'M.A., Ph.D.', photo: 'https://randomuser.me/api/portraits/men/55.jpg' },
      { name: 'Prof. Supriya Nair', designation: 'Associate Professor', qualification: 'M.A., NET', photo: 'https://randomuser.me/api/portraits/women/22.jpg' }
    ]
  },
  { 
    id: '19', 
    title: 'Information Technology (Self-Financing)', 
    description: 'A dynamic department focusing on the latest in computing, software development, and network technologies.',
    subjects: ['Information Technology', 'Computer Science'],
    programs: [
      { name: 'B.Sc. I.T.', level: 'Undergraduate', duration: '3 Years', eligibility: 'HSC Science with Mathematics', intake: 60, fee: '₹35,000/yr' },
      { name: 'B.Sc. Computer Science', level: 'Undergraduate', duration: '3 Years', eligibility: 'HSC Science with Mathematics', intake: 60, fee: '₹35,000/yr' },
      { name: 'M.Sc. I.T.', level: 'Postgraduate', duration: '2 Years', eligibility: 'B.Sc. I.T./C.S.', intake: 40, fee: '₹45,000/yr' }
    ],
    faculty: [
      { name: 'Prof. Rohan Desai', designation: 'Co-ordinator', qualification: 'M.C.A., NET', photo: 'https://randomuser.me/api/portraits/men/29.jpg' },
      { name: 'Prof. Aarti Singh', designation: 'Assistant Professor', qualification: 'M.Sc. I.T.', photo: 'https://randomuser.me/api/portraits/women/15.jpg' }
    ]
  },
  { 
    id: '20', 
    title: 'Management Studies (B.M.S.)', 
    description: 'Equipping future business leaders with practical management skills, case studies, and industry exposure.',
    subjects: ['Management Studies', 'Marketing', 'Finance', 'HR'],
    programs: [
      { name: 'Bachelor of Management Studies (B.M.S.)', level: 'Undergraduate', duration: '3 Years', eligibility: 'HSC (Any Stream)', intake: 120, fee: '₹25,000/yr' }
    ],
    faculty: [
      { name: 'Dr. Vivek Menon', designation: 'Co-ordinator', qualification: 'MBA, Ph.D.', photo: 'https://randomuser.me/api/portraits/men/60.jpg' }
    ]
  },
  { 
    id: '21', 
    title: 'Mass Media (B.A.M.M.C.)', 
    description: 'Fostering creative talent in journalism, advertising, and digital media communications.',
    subjects: ['Mass Media', 'Journalism', 'Advertising'],
    programs: [
      { name: 'B.A. in Multimedia and Mass Communication', level: 'Undergraduate', duration: '3 Years', eligibility: 'HSC (Any Stream)', intake: 60, fee: '₹25,000/yr' }
    ],
    faculty: [
      { name: 'Prof. Kavita Rao', designation: 'Co-ordinator', qualification: 'M.A. Communication', photo: 'https://randomuser.me/api/portraits/women/40.jpg' }
    ]
  },
];

export const mockFacilities = [
  { id: 1, title: 'Library', desc: 'A well-equipped library with a vast collection of books, journals, and digital resources.', image: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=800' },
  { id: 2, title: 'Laboratories', desc: 'State-of-the-art laboratories for Physics, Chemistry, Biology, and IT.', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800' },
  { id: 3, title: 'Auditorium', desc: 'Spacious auditorium for cultural events, seminars, and guest lectures.', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800' },
  { id: 4, title: 'Gymkhana', desc: 'Indoor and outdoor sports facilities promoting physical fitness.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800' },
];

export const principalMessage = "Welcome to Sathaye College, an institution of academic excellence. Our vision is to empower students through value-based education and holistic development. We strive to create an environment that fosters intellectual curiosity, critical thinking, and social responsibility. With a rich legacy and a commitment to adapting to changing educational paradigms, we prepare our students to face global challenges confidently.";
