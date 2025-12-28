
import React, { useState, useMemo, useEffect } from 'react';
import ChannelBrowser from './components/ChannelBrowser';
import PlayerInfo from './components/PlayerInfo';
import HomeDashboard from './components/HomeDashboard';
import LoginView from './components/LoginView';
import NavigationRail from './components/NavigationRail';
import CategoriesView from './components/CategoriesView';
import AIAgent from './components/AIAgent';
import { NavItem, Channel, Playlist } from './types';
import { getDeviceSession, deleteDeviceSession, getFavorites, toggleFavoriteInDb } from './services/supabase';
import { parseM3U } from './services/m3uParser';
import { processAgentCommand } from './services/geminiService';

const App: React.FC = () => {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [activeNav, setActiveNav] = useState<NavItem>(NavItem.Home);
  const [customChannels, setCustomChannels] = useState<Channel[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeGenre, setActiveGenre] = useState<string>('All');
  const [aiCategories, setAiCategories] = useState<string[]>([]);
  const [showChannelList, setShowChannelList] = useState(false);
  const [showAIAgent, setShowAIAgent] = useState(false);
  const [showLiveSidebar, setShowLiveSidebar] = useState(false); // New state for live table toggle
  const [userIp, setUserIp] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const allChannels = useMemo(() => customChannels, [customChannels]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const contextualChannels = useMemo(() => {
    let filtered = allChannels;
    if (activeNav === NavItem.Favorites) filtered = filtered.filter(c => favorites.includes(c.id));
    if (activeGenre !== 'All') {
      const lowerGenre = activeGenre.toLowerCase();
      filtered = filtered.filter(c => 
        c.currentProgram.genres?.some(g => g.toLowerCase().includes(lowerGenre)) ||
        c.name.toLowerCase().includes(lowerGenre)
      );
    }
    return filtered;
  }, [allChannels, activeNav, favorites, activeGenre]);

  useEffect(() => {
    const initSession = async () => {
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const { ip } = await ipRes.json();
        setUserIp(ip);

        const session = await getDeviceSession(ip);
        if (session && session.playlist_url) {
          const m3uRes = await fetch(session.playlist_url);
          if (m3uRes.ok) {
            const text = await m3uRes.text();
            const channels = parseM3U(text);
            if (channels.length > 0) {
              setCustomChannels(channels);
              const favIds = await getFavorites(ip);
              setFavorites(favIds);
              setIsSetupComplete(true);
              setSelectedChannel(channels[0]);
            }
          }
        }
      } catch (e) {
        console.warn("Session check bypass:", e);
      } finally {
        setIsInitializing(false);
      }
    };
    initSession();
  }, []);

  const handleInitialSetup = async (channels: Channel[], playlistName: string) => {
    setCustomChannels(channels);
    if (userIp) {
      const favIds = await getFavorites(userIp);
      setFavorites(favIds);
    }
    setIsSetupComplete(true);
    if (channels.length > 0) {
      setSelectedChannel(channels[0]);
      setActiveNav(NavItem.Home);
    }
  };

  const handleLogout = async () => {
    // Instant UI Reset (Fixes "Logout didn't work" issue)
    setIsSetupComplete(false);
    setCustomChannels([]);
    setSelectedChannel(null);
    setFavorites([]);
    setAiCategories([]);
    setActiveNav(NavItem.Home);
    setShowChannelList(false);
    setShowLiveSidebar(false);

    // Background cleanup
    if (userIp) {
      deleteDeviceSession(userIp).catch(e => console.error("Session cleanup delayed:", e));
    }
  };

  const toggleFavorite = async (channelId: string) => {
    if (!userIp) return;
    const isNowFav = !favorites.includes(channelId);
    setFavorites(prev => isNowFav ? [...prev, channelId] : prev.filter(id => id !== channelId));
    await toggleFavoriteInDb(userIp, channelId, isNowFav);
  };

  const renderContent = () => {
    switch (activeNav) {
      case NavItem.Home:
      case NavItem.Favorites:
        return (
          <div className="animate-in fade-in zoom-in-95 duration-1000 h-full">
            <HomeDashboard 
              title={activeNav === NavItem.Favorites ? "Favorites" : "Global Networks"}
              topPicks={activeNav === NavItem.Favorites ? contextualChannels : allChannels.slice(0, 24)} 
              onChannelSelect={(c) => { setSelectedChannel(c); setActiveNav(NavItem.LiveTV); }} 
              onGoToLive={() => setShowChannelList(true)}
              isEmpty={activeNav === NavItem.Favorites && contextualChannels.length === 0}
            />
          </div>
        );
      case NavItem.Categories:
        return (
          <CategoriesView 
            categories={availableGenres} 
            activeCategory={activeGenre} 
            onCategorySelect={(cat) => { setActiveGenre(cat); setShowChannelList(true); }} 
          />
        );
      case NavItem.LiveTV:
        return (
          <div className="w-full h-full flex flex-row overflow-hidden relative">
            <div className="flex-1 h-full relative">
              {selectedChannel ? (
                <PlayerInfo 
                  channel={selectedChannel} 
                  isTheaterMode={true} 
                  onToggleTheater={() => {}} 
                  onClose={() => setActiveNav(NavItem.Home)} 
                  onNext={() => {
                    const idx = contextualChannels.findIndex(c => c.id === selectedChannel.id);
                    setSelectedChannel(contextualChannels[(idx + 1) % contextualChannels.length]);
                  }}
                  onPrev={() => {
                    const idx = contextualChannels.findIndex(c => c.id === selectedChannel.id);
                    setSelectedChannel(contextualChannels[(idx - 1 + contextualChannels.length) % contextualChannels.length]);
                  }}
                  onTriggerRecovery={() => setShowAIAgent(true)}
                  isFavorite={favorites.includes(selectedChannel.id)}
                  onToggleFavorite={() => toggleFavorite(selectedChannel.id)}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-black" onClick={() => setShowChannelList(true)}>
                  <div className="text-center opacity-20 cursor-pointer group">
                     <span className="material-symbols-outlined text-8xl mb-6 group-hover:scale-110 transition-transform text-primary/40">tv_off</span>
                     <p className="text-[9px] font-black uppercase tracking-[1em]">Select Active Feed</p>
                  </div>
                </div>
              )}

              {/* Toggle Sidebar Button (For Non-XL screens) */}
              <button 
                onClick={() => setShowLiveSidebar(!showLiveSidebar)}
                className="xl:hidden absolute bottom-28 left-6 z-50 w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white shadow-2xl active:scale-90"
              >
                <span className="material-symbols-outlined">{showLiveSidebar ? 'close' : 'list'}</span>
              </button>
            </div>

            {/* LIVE PAGE CHANNEL TABLE (Responsive Sidebar) */}
            <div className={`fixed inset-y-0 right-0 xl:relative xl:translate-x-0 w-[320px] md:w-[380px] h-full bg-[#0a0a0a] border-l border-white/5 shadow-2xl z-[150] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${showLiveSidebar ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="p-6 md:p-8 border-b border-white/5 flex flex-col gap-4 bg-white/[0.02]">
                <div className="flex items-center justify-between">
                   <h3 className="text-lg font-black uppercase italic tracking-tighter">Transmission</h3>
                   {/* Close for mobile */}
                   <button onClick={() => setShowLiveSidebar(false)} className="xl:hidden material-symbols-outlined text-gray-500">close</button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-4 space-y-2">
                {contextualChannels.map((ch) => {
                  const isActive = selectedChannel?.id === ch.id;
                  return (
                    <div 
                      key={ch.id}
                      onClick={() => { setSelectedChannel(ch); if (window.innerWidth < 1280) setShowLiveSidebar(false); }}
                      className={`group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${isActive ? 'bg-primary text-black shadow-glow' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${isActive ? 'bg-black/10 border-black/10' : 'bg-black border-white/5 group-hover:border-primary/20'}`}>
                        {ch.icon.startsWith('http') ? (
                          <img src={ch.icon} className={`w-6 h-6 object-contain ${isActive ? 'invert' : ''}`} alt="" />
                        ) : (
                          <span className={`material-symbols-outlined text-xl ${isActive ? 'text-black' : 'text-primary'}`}>{ch.icon}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className={`text-[11px] font-black uppercase truncate tracking-tight ${isActive ? 'text-black' : 'text-white'}`}>{ch.name}</p>
                         <p className={`text-[9px] font-bold uppercase tracking-widest opacity-60 truncate ${isActive ? 'text-black' : 'text-gray-500'}`}>{ch.currentProgram.genres[0] || 'Broadcasting'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const availableGenres = useMemo(() => {
    if (aiCategories.length > 0) return aiCategories;
    const genres = new Set<string>();
    allChannels.forEach(channel => {
      channel.currentProgram.genres?.forEach(genre => genres.add(genre));
    });
    return Array.from(genres).sort();
  }, [allChannels, aiCategories]);

  if (isInitializing) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-10">
           <div className="w-16 h-16 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
           <p className="text-white/20 uppercase tracking-[0.6em] font-black text-[10px]">Uplink Initializing</p>
        </div>
      </div>
    );
  }

  if (!isSetupComplete) {
    return <LoginView onSuccess={handleInitialSetup} userIp={userIp || '0.0.0.0'} />;
  }

  return (
    <div className="relative h-screen w-full bg-oled-black overflow-hidden font-display text-white flex flex-col md:flex-row">
      <NavigationRail 
        activeNav={activeNav} 
        onNavChange={setActiveNav} 
        onLogout={handleLogout} 
        onToggleAI={() => setShowAIAgent(true)} 
      />

      <main className="relative flex-1 h-full overflow-hidden">
        {renderContent()}
      </main>

      <AIAgent 
        isOpen={showAIAgent} 
        onClose={() => setShowAIAgent(false)} 
        channels={allChannels} 
        onExecuteCommand={(cmd) => {
          if (cmd.type === 'SELECT_CHANNEL' || cmd.type === 'RECOVER') {
            const ch = allChannels.find(c => c.id === cmd.value);
            if (ch) { setSelectedChannel(ch); setActiveNav(NavItem.LiveTV); setShowAIAgent(false); }
          }
        }}
      />
    </div>
  );
};

export default App;
