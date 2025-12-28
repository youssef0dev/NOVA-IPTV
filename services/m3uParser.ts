
import { Channel } from "../types";

/**
 * Generates a deterministic ID based on the stream URL.
 * This ensures that the same channel gets the same ID every time it's parsed,
 * allowing favorites to persist in Supabase.
 */
const generateDeterministicId = (url: string): string => {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return 'ch-' + Math.abs(hash).toString(36);
};

export const parseM3U = (text: string): Channel[] => {
  const channels: Channel[] = [];
  const lines = text.split('\n');
  let currentChannel: Partial<Channel> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('#EXTINF:')) {
      const nameMatch = line.match(/,(.*)$/);
      const logoMatch = line.match(/tvg-logo="([^"]*)"/);
      const groupMatch = line.match(/group-title="([^"]*)"/);
      
      const name = nameMatch ? nameMatch[1].trim() : 'Unknown Channel';
      const logo = logoMatch ? logoMatch[1] : '';
      const group = groupMatch ? groupMatch[1] : 'General';

      currentChannel = {
        name: name,
        icon: logo || 'live_tv',
        iconColor: 'text-primary',
        currentProgram: {
          title: 'Live Broadcast',
          description: `Streaming from group: ${group}`,
          rating: 'LIVE',
          genres: [group],
          startTime: 'NOW',
          endTime: 'LIVE',
          thumbnail: logo || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=400&auto=format&fit=crop',
          channelName: name,
        }
      };
    } else if (line.startsWith('http') && currentChannel.name) {
      const streamUrl = line;
      currentChannel.id = generateDeterministicId(streamUrl);
      currentChannel.currentProgram!.streamUrl = streamUrl;
      channels.push(currentChannel as Channel);
      currentChannel = {};
    }
  }

  return channels;
};
