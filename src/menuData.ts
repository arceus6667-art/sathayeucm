export type MenuItem = {
  id: string;
  type: string;
  children?: MenuItem[];
  path?: string;
};

// The structured menu retrieved from the actual website's API
export const siteMenu: MenuItem[] = [
  { id: "1", type: "Home", path: "/" },
  { id: "smart-campus", type: "Smart Campus", children: [
    { id: "sc-map", type: "3D Campus Map & Wayfinding", path: "/map" },
    { id: "sc-canteen", type: "Smart Canteen & Meal Tokens", path: "/canteen" },
    { id: "sc-library", type: "Smart Library & Reading Seats", path: "/library" },
    { id: "sc-events", type: "Campus Events & Passes", path: "/events" },
    { id: "sc-support", type: "Support & Lost-and-Found", path: "/support" },
    { id: "sc-safety", type: "Safety, Medical & SOS", path: "/safety" },
    { id: "sc-portal", type: "Unified Role Portal", path: "/portal" }
  ]},
  { id: "209", type: "about", children: [
    { id: "157", type: "Principal's Message", path: "/page/157/principals-message" },
    { id: "3", type: "About College", path: "/page/3/about-college" },
    { id: "90", type: "Vision, Mission & Objectives", path: "/page/90/vision-mission-objectives" },
    { id: "162", type: "facilities", children: [
      { id: "461", type: "Campuses", path: "/page/461/campuses" },
      { id: "414", type: "Library", children: [
        { id: "481", type: "Library", path: "/page/481/library" },
        { id: "401", type: "Web OPAC", path: "/page/401/web-opac" }
      ]},
      { id: "462", type: "Digital Resources", path: "/page/462/digital-resources" },
      { id: "492", type: "Login For KNIMBUS", path: "/login" }
    ]},
    { id: "475", type: "Organogram", path: "/page/475/organogram" },
    { id: "351", type: "Committees", path: "/page/351/committees" },
    { id: "463", type: "Statutory Bodies", path: "/page/463/statutory-bodies" }
  ]},
  { id: "382", type: "NEP-2020", children: [
    { id: "189", type: "NEP 2020", path: "/page/189/nep-2020" },
    { id: "399", type: "Syllabus NEP", path: "/page/399/syllabus-nep" }
  ]},
  { id: "16", type: "Department", path: "/departments" },
  { id: "230", type: "admission", children: [
    { id: "246", type: "Degree College", path: "/page/246/degree-college" },
    { id: "227", type: "Post Graduate Courses", path: "/page/227/post-graduate" }
  ]},
  { id: "301", type: "Associations", children: [
    { id: "458", type: "Cultural Association", path: "/page/458/cultural" },
    { id: "306", type: "NCC", path: "/page/306/ncc" },
    { id: "308", type: "NSS", path: "/page/308/nss" },
    { id: "384", type: "WDC-Women Development Cell", path: "/page/384/wdc" },
    { id: "493", type: "Entrepreneurship Development Cell", path: "/page/493/edc" }
  ]},
  { id: "191", type: "student section", children: [
    { id: "392", type: "Prospectus 2023-24", path: "/page/392/prospectus" },
    { id: "184", type: "Online Form", path: "/admissions" },
    { id: "9", type: "Academic Calendar", path: "/page/9/calendar" },
    { id: "264", type: "Students Portal", path: "/login" },
    { id: "466", type: "Examination Policy", path: "/page/466/examination" },
    { id: "136", type: "Scholarships", path: "/page/136/scholarships" },
    { id: "271", type: "Catalogue And Time Table", path: "/page/271/timetable" },
    { id: "133", type: "Anti Ragging", path: "/page/133/anti-ragging" }
  ]},
  { id: "311", type: "Alumni", children: [
    { id: "67", type: "Alumni activities", path: "/page/67/alumni-activities" },
    { id: "58", type: "Alumni Registration", path: "/alumni-registration" }
  ]},
  { id: "243", type: "research", path: "/page/243/research" },
  { id: "460", type: "Placement", path: "/page/460/placement" },
  { id: "420", type: "About DBT", path: "/page/420/about-dbt" }
];
