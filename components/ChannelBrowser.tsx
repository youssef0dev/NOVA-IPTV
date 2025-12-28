
import React, { useState } from 'react';
import { Channel } from '../types';

interface ChannelBrowserProps {
  channels: Channel[];
  selectedChannelId: string;
  onChannelSelect: (channel: Channel) => void;
  favorites: string[];
  onToggleFavorite: (channelId: string) => void;
  isFavoritesView: boolean;
  genres: string[];
  activeGenre: string;
  onGenreSelect: (genre: string) => void;
}

const ChannelBrowser: React.FC<ChannelBrowserProps> = ({ 
  channels, 
  selectedChannelId, 
  onChannelSelect, 
  favorites, 
  onToggleFavorite,
  isFavoritesView,
  genres,
  activeGenre,
  onGenreSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChannels = channels.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full bg-oled-black border-r border-white/5">
      <div className="p-8 pb-6">
        <div className="flex items-center gap-4 mb-3">
           <div className="w-1.5 h-6 bg-primary rounded-full"></div>
           <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">
            {isFavoritesView ? 'Secure Vault' : 'Network Hub'}
          </h2>
        </div>
        <p className="text-[9px] font-black text-gray-600 tracking-[0.3em] uppercase mb-8">
           Sync: {filteredChannels.length} Active Nodes
        </p>

        {/* Search Bar */}
        <div className="relative flex items-center bg-white/5 border border-white/5 rounded-2xl px-6 py-4 mb-6 focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <span className="material-symbols-outlined text-gray-500 mr-3 text-2xl">search</span>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-white placeholder-gray-700 focus:ring-0 w-full text-base font-bold tracking-tight" 
            placeholder="Search Global Feed..." 
            type="text"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3">
          <button 
            onClick={() => onGenreSelect('All')}
            className={`px-5 py-2.5 rounded-xl text-[9px] font-black tracking-widest transition-all ${activeGenre === 'All' ? 'bg-primary text-black shadow-glow' : 'bg-white/5 text-gray-500 hover:text-white'}`}
          >
            ALL
          </button>
          {genres.filter(g => g !== 'All').map((genre) => (
            <button 
              key={genre} 
              onClick={() => onGenreSelect(genre)}
              className={`px-5 py-2.5 rounded-xl text-[9px] font-black tracking-widest border border-white/5 whitespace-nowrap transition-all ${activeGenre === genre ? 'bg-primary text-black shadow-glow' : 'bg-white/5 text-gray-500 hover:text-white'}`}
            >
              {genre.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-4 pb-16">
        {filteredChannels.map((channel) => {
          const isActive = selectedChannelId === channel.id;
          const isFavorite = favorites.includes(channel.id);

          return (
            <div 
              key={channel.id}
              onClick={() => onChannelSelect(channel)}
              className={`group relative flex items-center gap-4 p-4 rounded-3xl cursor-pointer transition-all duration-500 ${isActive ? 'bg-white/10 ring-1 ring-white/10 shadow-premium' : 'hover:bg-white/5'}`}
            >
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center border border-white/5 shrink-0 relative overflow-hidden shadow-lg group-hover:scale-105 transition-all">
                {channel.icon.startsWith('http') ? (
                  <img src={channel.icon} className="w-8 h-8 object-contain" alt="" />
                ) : (
                  <span className="material-symbols-outlined text-gray-600 group-hover:text-primary text-2xl">{channel.icon}</span>
                )}
                {isActive && <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`text-base font-black truncate transition-colors ${isActive ? 'text-primary' : 'text-gray-300'}`}>
                    {channel.name}
                  </h3>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>}
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[8px] text-gray-600 font-black uppercase tracking-[0.1em]">{channel.currentProgram.genres[0] || 'Direct'}</span>
                   <div className="w-1 h-1 rounded-full bg-gray-800"></div>
                   <span className="text-[8px] text-gray-400 font-black uppercase tracking-[0.1em]">4K UHD</span>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(channel.id); }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isFavorite ? 'text-primary bg-primary/10' : 'text-gray-800 hover:text-white hover:bg-white/10'}`}
              >
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}>
                  {isFavorite ? 'star' : 'star'}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChannelBrowser;
