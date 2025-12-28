
import { Channel } from './types';

export const MOCK_CHANNELS: Channel[] = [
  {
    id: 'nasa',
    name: 'NASA TV Live',
    icon: 'rocket_launch',
    iconColor: 'text-blue-400',
    currentProgram: {
      title: 'Space Station Live',
      description: 'Live coverage from the International Space Station, featuring breathtaking views of Earth and insights into the latest scientific research being conducted in orbit.',
      rating: 'TV-G',
      genres: ['Documentary', 'Science'],
      startTime: '12:00',
      endTime: '23:59',
      thumbnail: 'https://www.nasa.gov/wp-content/uploads/2023/10/iss-aurora.jpg',
      channelName: 'NASA TV',
      streamUrl: 'https://ntv-public.akamaized.net/hls/live/2025333/NTV-Public/index.m3u8'
    }
  },
  {
    id: 'france24',
    name: 'France 24 English',
    icon: 'language',
    iconColor: 'text-blue-600',
    currentProgram: {
      title: 'Live News Feed',
      description: 'International news and current affairs from a French perspective. Providing continuous updates on global politics, economy, and culture.',
      rating: 'TV-PG',
      genres: ['News'],
      startTime: '00:00',
      endTime: '23:59',
      thumbnail: 'https://picsum.photos/seed/france24/1280/720',
      channelName: 'France 24',
      streamUrl: 'https://static.france24.com/live/F24_EN_LO_HLS/live_web.m3u8'
    }
  },
  {
    id: 'sky-news',
    name: 'Sky News UK',
    icon: 'cloud_queue',
    iconColor: 'text-blue-300',
    currentProgram: {
      title: 'Sky News at Ten',
      description: 'Award-winning news coverage with expert analysis and exclusive reporting from across the United Kingdom and around the world.',
      rating: 'TV-14',
      genres: ['News', 'Talk'],
      startTime: '22:00',
      endTime: '23:00',
      thumbnail: 'https://picsum.photos/seed/skynews/1280/720',
      channelName: 'Sky News',
      streamUrl: 'https://skynews-skynews-main-1-gb.samsung.wurl.com/manifest/playlist.m3u8'
    }
  },
  {
    id: 'pbs-kids',
    name: 'PBS Kids Live',
    icon: 'child_care',
    iconColor: 'text-green-400',
    currentProgram: {
      title: 'Sesame Street',
      description: 'On a settled street, characters learn together, sing together, and discover the world. A children\'s television classic since 1969.',
      rating: 'TV-Y',
      genres: ['Educational', 'Children'],
      startTime: '14:00',
      endTime: '15:00',
      thumbnail: 'https://picsum.photos/seed/pbskids/1280/720',
      channelName: 'PBS Kids',
      streamUrl: 'https://ls-pbs.akamaized.net/out/v1/7610f46c69454848a52f4477839352e8/index.m3u8'
    }
  },
  {
    id: 'bloomberg',
    name: 'Bloomberg TV',
    icon: 'trending_up',
    iconColor: 'text-gray-400',
    currentProgram: {
      title: 'Markets Now',
      description: 'Real-time financial news, data, and analysis. Bloomberg provides comprehensive coverage of global financial markets around the clock.',
      rating: 'TV-G',
      genres: ['Business', 'News'],
      startTime: '08:00',
      endTime: '20:00',
      thumbnail: 'https://picsum.photos/seed/bloomberg/1280/720',
      channelName: 'Bloomberg',
      streamUrl: 'https://live-bloomberg-uk.samsung.wurl.com/manifest/playlist.m3u8'
    }
  }
];
