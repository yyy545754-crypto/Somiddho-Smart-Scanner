
import React from 'react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setView: (view: View) => void;
  t: any;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, t }) => {
  return (
    <div className="relative h-screen flex flex-col justify-between overflow-hidden bg-rose-950 text-white">
      {/* Dynamic Content */}
      <div className="flex-1 relative overflow-hidden">
        {children}
      </div>

      {/* Navigation Bar */}
      <nav className="z-50 bg-rose-950/95 backdrop-blur-2xl border-t border-white/5 pt-3 pb-8 px-6">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <NavItem 
            isActive={currentView === View.SCANNER} 
            onClick={() => setView(View.SCANNER)} 
            icon="center_focus_strong" 
            label={t.scanner} 
          />
          <NavItem 
            isActive={currentView === View.GENERATOR} 
            onClick={() => setView(View.GENERATOR)} 
            icon="add_box" 
            label={t.generator} 
          />
          <NavItem 
            isActive={currentView === View.SHOPPING} 
            onClick={() => setView(View.SHOPPING)} 
            icon="shopping_bag" 
            label={t.shopping} 
          />
          <NavItem 
            isActive={currentView === View.HISTORY} 
            onClick={() => setView(View.HISTORY)} 
            icon="folder_shared" 
            label={t.history} 
          />
          <NavItem 
            isActive={currentView === View.SETTINGS} 
            onClick={() => setView(View.SETTINGS)} 
            icon="settings" 
            label={t.settings} 
          />
        </div>
      </nav>

      {/* Background Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] pointer-events-none z-[-1]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(19,146,236,0.05)_0%,transparent_70%)]"></div>
      </div>
    </div>
  );
};

interface NavItemProps {
  isActive: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ isActive, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-primary scale-110' : 'text-white/40 hover:text-white'}`}
  >
    <span className="material-icons-round text-2xl">{icon}</span>
    <span className="text-[13px] font-black uppercase tracking-tight">{label}</span>
  </button>
);

export default Layout;
