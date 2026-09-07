import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AICampusCopilot from './AICampusCopilot';
import AccessibilityToolbar from './AccessibilityToolbar';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans relative">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <AICampusCopilot />
      <AccessibilityToolbar />
    </div>
  );
}

