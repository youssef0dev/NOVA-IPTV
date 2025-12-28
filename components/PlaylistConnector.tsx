
import React, { useState } from 'react';
import { Playlist, Channel } from '../types';
import { parseM3U } from '../services/m3uParser';

interface PlaylistConnectorProps {
  onAddChannels: (channels: Channel[], playlistName: string) => void;
  playlists: Playlist[];
}

const PlaylistConnector: React.FC<PlaylistConnectorProps> = ({ onAddChannels, playlists }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [manualText, setManualText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showManual, setShowManual] = useState(false);

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError('');

    try {
      // Try to fetch the playlist
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch playlist. Check the URL or use Manual Paste.');
      const text = await response.text();
      const channels = parseM3U(text);
      
      if (channels.length === 0) throw new Error('No valid channels found in this playlist.');
      
      onAddChannels(channels, name || 'Imported Playlist');
      setUrl('');
      setName('');
    } catch (err: any) {
      setError(err.message || 'CORS Error: Most browsers block direct playlist downloads for security. Try "Manual Paste" below.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText) return;
    const channels = parseM3U(manualText);
    if (channels.length === 0) {
      setError('Invalid M3U format. Could not find channels.');
      return;
    }
    onAddChannels(channels, name || 'Manual Playlist');
    setManualText('');
    setName('');
    setShowManual(false);
  };

  return (
    <div className="flex-1 p-10 flex flex-col items-center justify-center max-w-4xl mx-auto overflow-y-auto no-scrollbar">
      <div className="w-full glass-panel p-10 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-400 to-orange-600"></div>
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6 border border-primary/20">
            <span className="material-symbols-outlined text-primary text-5xl">settings_input_antenna</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase">Playlist Engine</h1>
          <p className="text-gray-400 font-medium">Connect your M3U sources to the Nova cloud.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
            <span className="material-symbols-outlined text-red-500">error</span>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-4 mb-8">
           <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Playlist Name (e.g. My Provider)"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-primary/50 transition-all"
            />
        </div>

        {!showManual ? (
          <form onSubmit={handleUrlSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] ml-2">M3U URL</label>
              <input 
                type="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/playlist.m3u8"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading || !url}
              className="w-full py-5 bg-primary hover:bg-yellow-400 disabled:opacity-50 text-black font-black rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin"></div> : <span className="material-symbols-outlined">cloud_download</span>}
              {loading ? 'ANALYZING...' : 'DOWNLOAD & SYNC'}
            </button>

            <button 
              type="button"
              onClick={() => setShowManual(true)}
              className="w-full py-4 text-gray-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
            >
              Or Paste M3U Content Manually
            </button>
          </form>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] ml-2">M3U Content</label>
              <textarea 
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="#EXTM3U&#10;#EXTINF:-1,Channel Name&#10;http://stream-url.m3u8"
                rows={8}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <span className="material-symbols-outlined">content_paste</span>
              IMPORT CHANNELS
            </button>

            <button 
              type="button"
              onClick={() => setShowManual(false)}
              className="w-full py-4 text-gray-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
            >
              Back to URL Input
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PlaylistConnector;
