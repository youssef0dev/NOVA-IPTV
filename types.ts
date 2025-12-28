
export interface Program {
  title: string;
  description: string;
  season?: number;
  episode?: number;
  rating: string;
  genres: string[];
  startTime: string;
  endTime: string;
  thumbnail: string;
  channelName: string;
  streamUrl?: string; // URL for live playback (HLS/m3u8)
}

export interface Channel {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  currentProgram: Program;
  nextProgram?: {
    title: string;
    startTime: string;
  };
}

export interface Playlist {
  id: string;
  name: string;
  url: string;
  status: 'active' | 'loading' | 'error';
  channelsCount: number;
}

export enum NavItem {
  Home = 'home',
  LiveTV = 'live_tv',
  Categories = 'categories',
  Favorites = 'favorites',
  AI = 'ai'
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
