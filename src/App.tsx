import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import GenericPage from './pages/GenericPage';
import Departments from './pages/Departments';
import DepartmentDetail from './pages/DepartmentDetail';
import Admissions from './pages/Admissions';
import Login from './pages/Login';
import Portal from './pages/Portal';
import ApplicationFlow from './pages/ApplicationFlow';
import AlumniRegistration from './pages/AlumniRegistration';
import Contact from './pages/Contact';
import CampusMap from './pages/CampusMap';
import Canteen from './pages/Canteen';
import Library from './pages/Library';
import Events from './pages/Events';
import CampusSupport from './pages/CampusSupport';
import Safety from './pages/Safety';
import PlacementPortal from './pages/PlacementPortal';
import CredentialVault from './pages/CredentialVault';
import RLResourceAllocator from './components/rl/RLResourceAllocator';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="departments" element={<Departments />} />
          <Route path="department/:id" element={<DepartmentDetail />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="alumni-registration" element={<AlumniRegistration />} />
          
          {/* Smart Sathey Campus Features */}
          <Route path="map" element={<CampusMap />} />
          <Route path="canteen" element={<Canteen />} />
          <Route path="canteen/order/:id" element={<Canteen />} />
          <Route path="canteen/history" element={<Canteen />} />
          <Route path="library" element={<Library />} />
          <Route path="events" element={<Events />} />
          <Route path="support" element={<CampusSupport />} />
          <Route path="safety" element={<Safety />} />
          <Route path="placements" element={<PlacementPortal />} />
          <Route path="vault" element={<CredentialVault />} />
          <Route path="rl-allocator" element={
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <RLResourceAllocator />
            </div>
          } />

          {/* Catch-all for dynamically built generic pages based on ID */}
          <Route path="page/:id/:slug" element={<GenericPage />} />
          <Route path="notice/:id" element={<GenericPage />} />
        </Route>
        
        {/* Portal and Application flows sit outside main layout for distinct UI */}
        <Route path="/portal" element={<Portal />} />
        <Route path="/apply" element={<ApplicationFlow />} />
      </Routes>
    </Router>
  );
}
