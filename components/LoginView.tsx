
import React, { useState } from 'react';
import { Channel } from '../types';
import { parseM3U } from '../services/m3uParser';
import { saveDeviceSession } from '../services/supabase';

interface LoginViewProps {
  onSuccess: (channels: Channel[], playlistName: string) => void;
  userIp: string;
}

const LoginView: React.FC<LoginViewProps> = ({ onSuccess, userIp }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Playlist URL is unreachable. Please check the address.');
      
      const text = await response.text();
      const channels = parseM3U(text);
      
      if (channels.length === 0) throw new Error('No valid streams found in this playlist.');
      
      const saved = await saveDeviceSession(userIp, url, `Device-${userIp.split('.').pop()}`);
      
      if (!saved) {
        console.warn("Supabase persistence failed. Proceeding with local session.");
      }

      onSuccess(channels, 'My Feed');
    } catch (err: any) {
      setError(err.message || 'Connection failed. Ensure the URL is public or use a proxy.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-y-auto no-scrollbar">
      {/* Cinematic Background Animations */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-0 right-0 w-[1200px] h-[1200px] bg-primary/5 rounded-full blur-[300px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[250px] animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      </div>

      <div className="min-h-full w-full flex flex-col items-center justify-center p-6 md:p-12 lg:p-20">
        <div className="relative z-10 w-full max-w-xl animate-in zoom-in-95 fade-in duration-1000">
          <div className="text-center mb-10 md:mb-16">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-primary rounded-[2.5rem] md:rounded-[3rem] flex items-center justify-center mx-auto mb-6 md:mb-10 shadow-[0_40px_100px_rgba(244,192,37,0.4)] transform rotate-6 border-4 border-white/5 transition-transform hover:rotate-0 duration-700">
              <span className="text-black font-black text-4xl md:text-5xl tracking-tighter">NS</span>
            </div>
            <h1 className="text-[60px] md:text-[100px] font-black text-white tracking-tighter mb-4 leading-none select-none">NOVA</h1>
            <div className="flex items-center justify-center gap-4">
               <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
               <p className="text-white/40 text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] md:tracking-[1em] select-none">Cloud Synchronized</p>
            </div>
          </div>

          <div className="glass-panel p-8 md:p-14 rounded-[3rem] md:rounded-[4rem] border border-white/5 shadow-2xl backdrop-blur-3xl">
            {error && (
              <div className="mb-8 p-5 bg-red-600/10 border border-red-600/20 rounded-2xl md:rounded-3xl flex items-start gap-3 animate-in slide-in-from-top-4 duration-500">
                <span className="material-symbols-outlined text-red-500 text-2xl md:text-3xl">warning</span>
                <p className="text-xs md:text-sm text-red-400 font-bold leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center justify-between px-4">
                   <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] md:tracking-[0.5em]">Playlist Endpoint</label>
                   <span className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-[0.2em]">{userIp}</span>
                </div>
                <div className="relative group">
                  <input 
                    type="url" 
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/playlist.m3u"
                    className="w-full bg-white/5 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] px-8 md:px-12 py-6 md:py-8 text-white text-lg md:text-xl font-bold focus:ring-4 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder-gray-800 tracking-tight outline-none"
                  />
                  <span className="absolute right-8 md:right-10 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-700 group-focus-within:text-primary transition-all text-2xl md:text-3xl">link</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="group w-full py-6 md:py-9 bg-primary hover:bg-yellow-400 disabled:opacity-50 text-black font-black rounded-[2rem] md:rounded-[3rem] transition-all duration-500 shadow-[0_40px_80px_rgba(244,192,37,0.3)] flex items-center justify-center gap-4 md:gap-6 active:scale-95 text-xl md:text-2xl uppercase tracking-tighter"
              >
                {loading ? (
                  <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>INITIALIZE SYSTEM</span>
                    <span className="material-symbols-outlined font-black text-3xl md:text-4xl transition-transform group-hover:translate-x-3">rocket_launch</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 md:mt-14 flex flex-col items-center gap-3">
              <div className="flex gap-4">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse delay-75"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse delay-150"></div>
              </div>
              <p className="text-white/10 text-[8px] font-black uppercase tracking-[0.4em]">Hardware Node Identification Enabled</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
