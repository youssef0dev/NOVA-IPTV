
import React, { useState, useEffect, useRef } from 'react';
import { Channel } from '../types';

declare global {
  interface Window {
    Hls: any;
  }
}

interface PlayerInfoProps {
  channel: Channel;
  isTheaterMode: boolean;
  onToggleTheater: () => void;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onTriggerRecovery?: (channelName: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ 
  channel, 
  onClose, 
  onNext, 
  onPrev, 
  onTriggerRecovery,
  isFavorite,
  onToggleFavorite
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<any>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  const prog = channel.currentProgram;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    setIsLoading(true);
    setHasError(false);

    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    if (prog.streamUrl) {
      if (window.Hls.isSupported()) {
        const hls = new window.Hls({
          autoStartLoad: true,
          enableWorker: true,
          maxBufferLength: 5, 
          maxMaxBufferLength: 10,
          lowLatencyMode: true,
          liveSyncDurationCount: 2,
          liveMaxLatencyDurationCount: 4,
          manifestLoadingMaxRetry: 3,
          levelLoadingMaxRetry: 3,
          fragLoadingMaxRetry: 3,
          backBufferLength: 0,
        });
        hlsRef.current = hls;
        hls.loadSource(prog.streamUrl);
        hls.attachMedia(video);
        
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
          setIsLoading(false);
        });

        hls.on(window.Hls.Events.ERROR, (event: any, data: any) => {
          if (data.fatal) {
            if (data.response?.code === 404 || data.response?.code === 403) {
               setHasError(true);
               setIsLoading(false);
            } else {
               hls.startLoad();
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = prog.streamUrl;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(() => {});
          setIsLoading(false);
        });
        video.addEventListener('error', () => {
          setHasError(true);
          setIsLoading(false);
        });
      }
    }
    
    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [prog.streamUrl]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      setShowControls(false);
    }, 4000);
  };

  const toggleFullScreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleMouseMove}
      className="relative flex flex-col h-full w-full bg-black overflow-hidden select-none group animate-in fade-in duration-1000"
      style={{ cursor: showControls ? 'default' : 'none' }}
    >
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-black overflow-hidden">
        <video 
          ref={videoRef}
          className="w-full h-full object-contain"
          autoPlay
          playsInline
          poster={prog.thumbnail}
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-20">
            <div className="flex flex-col items-center gap-6">
              <div className="w-16 h-16 border-2 border-white/5 border-t-primary rounded-full animate-spin"></div>
              <p className="text-[10px] font-black text-white/40 tracking-[0.5em] uppercase animate-pulse">Syncing Stream...</p>
            </div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/95 z-30 animate-in fade-in duration-700">
            <div className="max-w-md text-center p-12 glass-panel rounded-[3rem] border-red-500/20">
               <span className="material-symbols-outlined text-red-500 text-6xl mb-6 animate-pulse">signal_disconnected</span>
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic">Stream Offline</h3>
               <button 
                 onClick={() => onTriggerRecovery?.(channel.name)}
                 className="w-full py-5 bg-primary text-black font-black rounded-2xl flex items-center justify-center gap-3 shadow-glow hover:scale-105 active:scale-95 transition-all"
               >
                 <span className="material-symbols-outlined font-black">smart_toy</span>
                 AI RECOVERY
               </button>
               <button onClick={onClose} className="mt-4 text-[9px] font-black text-gray-700 hover:text-white uppercase tracking-widest">Return to Hub</button>
            </div>
          </div>
        )}
      </div>

      {/* Header Close */}
      <div className={`absolute top-6 left-6 md:top-10 md:left-10 z-50 transition-all duration-700 ${showControls ? 'opacity-100' : 'opacity-0 -translate-y-12'}`}>
        <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-white transition-all shadow-2xl active:scale-90"
        >
          <span className="material-symbols-outlined text-xl md:text-2xl">arrow_back</span>
        </button>
      </div>

      {/* Footer Controls */}
      <div className={`absolute bottom-6 md:bottom-12 left-0 right-0 z-40 px-4 md:px-16 flex justify-center transition-all duration-700 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
        <div className="flex items-stretch h-16 md:h-24 w-full max-w-6xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden rounded-[1.5rem] md:rounded-[3rem]">
          
          {/* Previous Channel Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
            className="hidden sm:flex bg-white/5 backdrop-blur-3xl px-6 items-center justify-center hover:bg-white/10 transition-colors border-r border-white/5 active:scale-95"
            title="Previous Channel"
          >
            <span className="material-symbols-outlined text-3xl text-white">skip_previous</span>
          </button>

          <div className="bg-[#0056b3] px-6 md:px-10 py-4 flex items-center justify-center self-stretch shrink-0">
             <span className="text-white font-black text-xl md:text-3xl tracking-tighter uppercase italic">LIVE</span>
          </div>

          <div className="flex-1 bg-[#1a2530]/95 backdrop-blur-3xl border-t border-b border-white/5 flex items-center px-4 md:px-10 gap-4 md:gap-8">
             <div className="flex flex-col min-w-0 flex-1">
                <span className="text-primary text-[8px] md:text-[10px] font-black tracking-[0.2em] uppercase opacity-80 truncate">{channel.name}</span>
                <h4 className="text-white text-sm md:text-xl font-bold tracking-tight truncate uppercase italic leading-tight">{prog.title}</h4>
             </div>
             
             <div className="flex items-center gap-2 md:gap-4 ml-auto shrink-0">
                {/* Favorite Toggle Button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(); }}
                  className={`w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-all ${isFavorite ? 'text-primary bg-primary/10' : 'text-white/60 bg-white/5 hover:bg-white/10 hover:text-white'}`}
                  title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                >
                  <span className="material-symbols-outlined text-xl md:text-3xl" style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}>
                    star
                  </span>
                </button>

                <button 
                  onClick={(e) => { e.stopPropagation(); if(videoRef.current) videoRef.current.muted = !videoRef.current.muted }}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-white/10"
                >
                  <span className="material-symbols-outlined text-xl md:text-3xl">{videoRef.current?.muted ? 'volume_off' : 'volume_up'}</span>
                </button>

                <button 
                  onClick={(e) => { e.stopPropagation(); toggleFullScreen(); }}
                  className="w-12 h-10 md:w-20 md:h-14 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center text-black shadow-lg hover:bg-yellow-400 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined font-black text-2xl md:text-4xl">fullscreen</span>
                </button>
             </div>
          </div>

          {/* Next Channel Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); onNext?.(); }}
            className="hidden sm:flex bg-white/5 backdrop-blur-3xl px-6 items-center justify-center hover:bg-white/10 transition-colors border-l border-white/5 active:scale-95"
            title="Next Channel"
          >
            <span className="material-symbols-outlined text-3xl text-white">skip_next</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;
