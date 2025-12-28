
import React from 'react';
import { Channel } from '../types';

interface HomeDashboardProps {
  title?: string;
  topPicks: Channel[];
  onChannelSelect: (channel: Channel) => void;
  onGoToLive: () => void;
  isEmpty?: boolean;
}

const HomeDashboard: React.FC<HomeDashboardProps> = ({ 
  title = "Global Networks", 
  topPicks, 
  onChannelSelect, 
  onGoToLive, 
  isEmpty = false
}) => {
  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar p-6 md:p-12 pb-32">
      {/* Premium Hero Section */}
      {title === "Global Networks" && (
        <div className="relative w-full h-[320px] md:h-[450px] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden mb-12 md:mb-16 group shadow-premium border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[30s] ease-linear opacity-50"
            alt="Hero Background"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center p-8 md:p-20 max-w-3xl">
            <div className="flex items-center gap-4 mb-4">
               <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black rounded-full border border-primary/20 tracking-[0.2em] uppercase">Enterprise Stream</span>
            </div>
            <h1 className="text-[44px] md:text-[80px] font-black text-white mb-4 md:mb-6 leading-[0.85] tracking-tighter">
              UNIFIED <br/> BROADCAST.
            </h1>
            <p className="hidden md:block text-gray-400 text-lg mb-10 font-light leading-relaxed max-w-lg">
              The next generation of IPTV intelligence. Deterministic node mapping with zero-latency synchronization.
            </p>
            <div className="flex gap-4">
              <button onClick={onGoToLive} className="px-8 py-4 md:px-10 md:py-5 bg-primary text-black font-black rounded-2xl hover:bg-yellow-400 hover:scale-110 transition-all shadow-glow text-base md:text-lg flex items-center gap-3 active:scale-95">
                LAUNCH FEED <span className="material-symbols-outlined font-black">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid Content */}
      <div className="staggered-grid">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 px-4 gap-4">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-2 md:w-3 h-10 md:h-12 bg-primary rounded-full shadow-glow"></div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic">{title}</h2>
          </div>
          <div className="flex flex-row md:flex-col items-center md:items-end opacity-60 gap-4 md:gap-0">
             <p className="text-[10px] font-black text-primary tracking-[0.3em] uppercase mb-0.5">Status: Operational</p>
             <p className="text-[9px] font-black text-white/40 tracking-[0.3em] uppercase">Nodes: {topPicks.length}</p>
          </div>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-24 md:py-32 glass-panel rounded-[2.5rem] md:rounded-[4rem] border-dashed border-white/10 mx-4">
             <span className="material-symbols-outlined text-[80px] md:text-[100px] text-white/5 mb-6">security</span>
             <h3 className="text-xl md:text-2xl font-black text-white/30 uppercase tracking-[0.4em] text-center px-4">Vault is Empty</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
            {topPicks.map((channel, idx) => (
              <div 
                key={channel.id}
                onClick={() => onChannelSelect(channel)}
                className="group relative h-[280px] md:h-[320px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden cursor-pointer bg-surface-dark border border-white/5 hover:border-primary/50 transition-all duration-700 shadow-premium"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
                <img 
                  src={channel.currentProgram.thumbnail} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[1.5s] ease-out" 
                  alt={channel.name}
                />
                
                <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
                   <div className="w-10 h-10 md:w-12 md:h-12 glass-panel rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      {channel.icon.startsWith('http') ? (
                        <img src={channel.icon} className="w-6 h-6 md:w-7 md:h-7 object-contain" alt="" />
                      ) : (
                        <span className="material-symbols-outlined text-primary text-xl md:text-2xl">{channel.icon}</span>
                      )}
                   </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 z-20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                    <span className="text-[8px] font-black text-red-500 tracking-[0.2em] uppercase">Live Feed</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white line-clamp-2 leading-none tracking-tighter mb-2 group-hover:text-primary transition-colors">{channel.currentProgram.title}</h3>
                  <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest">{channel.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeDashboard;
