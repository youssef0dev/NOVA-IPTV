
import React from 'react';
import { NavItem } from '../types';

interface NavigationRailProps {
  activeNav: NavItem;
  onNavChange: (nav: NavItem) => void;
  onLogout: () => void;
  onToggleAI: () => void;
}

const NavigationRail: React.FC<NavigationRailProps> = ({ activeNav, onNavChange, onLogout, onToggleAI }) => {
  const icons = [
    { id: NavItem.Home, icon: 'grid_view', label: 'Home' },
    { id: NavItem.LiveTV, icon: 'live_tv', label: 'Live' },
    { id: NavItem.Categories, icon: 'category', label: 'Categories' },
    { id: NavItem.Favorites, icon: 'star', label: 'Favorites' },
  ];

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLogout();
  };

  return (
    <>
      {/* Desktop & TV Side Rail */}
      <nav className="hidden md:flex flex-col items-center w-[100px] h-full glass-panel border-r border-white/5 shrink-0 relative z-[200] overflow-y-auto no-scrollbar">
        <div className="py-8 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md w-full flex justify-center z-10 border-b border-white/5 mb-4">
          <div 
            onClick={() => onNavChange(NavItem.Home)}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-black font-black text-xl shadow-glow cursor-pointer hover:scale-110 transition-all duration-500 active:scale-90"
          >
            NS
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full items-center pb-8">
          {icons.map(({ id, icon, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => onNavChange(id)}
              className={`group relative flex flex-col items-center justify-center w-18 h-18 py-4 rounded-2xl transition-all duration-700 ${
                activeNav === id 
                ? 'bg-primary/10 text-primary' 
                : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: activeNav === id ? "'FILL' 1" : "'FILL' 0" }}>
                {icon}
              </span>
              <span className="text-[8px] font-black tracking-[0.1em] mt-1 opacity-60 uppercase">{label}</span>
            </button>
          ))}

          <div className="h-px w-8 bg-white/10 my-2"></div>

          <button
            onClick={onToggleAI}
            type="button"
            className="group relative flex flex-col items-center justify-center w-18 h-18 py-4 rounded-2xl transition-all duration-700 text-primary hover:bg-primary/10 hover:shadow-glow"
          >
            <span className="material-symbols-outlined text-[32px] animate-pulse">smart_toy</span>
            <span className="text-[8px] font-black tracking-[0.1em] mt-1 uppercase text-primary">Nova AI</span>
          </button>
        </div>

        <div className="mt-auto py-8 w-full flex justify-center sticky bottom-0 bg-[#0a0a0a]/80 backdrop-blur-md border-t border-white/5">
          <button 
            onClick={handleLogoutClick}
            type="button"
            title="Disconnect System"
            className="w-12 h-12 rounded-xl bg-white/5 hover:bg-red-500 hover:text-white border border-white/5 flex items-center justify-center transition-all group active:scale-90 shadow-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl group-hover:-translate-x-1 transition-transform">logout</span>
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 glass-panel border-t border-white/5 flex items-center justify-around px-2 z-[200] bg-black/80 backdrop-blur-2xl">
        {icons.map(({ id, icon, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onNavChange(id)}
            className={`flex flex-col items-center justify-center gap-1 transition-all flex-1 ${
              activeNav === id ? 'text-primary scale-110' : 'text-gray-500'
            }`}
          >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: activeNav === id ? "'FILL' 1" : "'FILL' 0" }}>
              {icon}
            </span>
            <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
          </button>
        ))}
        <button
          onClick={handleLogoutClick}
          type="button"
          className="flex flex-col items-center justify-center gap-1 text-red-500/60 hover:text-red-500 flex-1 border-l border-white/10"
        >
          <span className="material-symbols-outlined text-2xl">logout</span>
          <span className="text-[8px] font-black uppercase tracking-widest">Exit</span>
        </button>
      </nav>
    </>
  );
};

export default NavigationRail;
