
import { createClient } from '@supabase/supabase-js';

// Using your specific project URL and public key provided
const SUPABASE_URL = 'https://vtwgeknfpxkfajmmwdfe.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_KHuk4zm7IF2OM3GLFI3y3g_ENAHMpaj'; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Fetches the saved playlist for this device based on mac_address.
 */
export const getDeviceSession = async (mac: string) => {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('mac_address', mac)
      .single();
    
    if (error) return null;
    return data;
  } catch (err) {
    console.error("Supabase Fetch Error:", err);
    return null;
  }
};

/**
 * Saves or updates the playlist association for this device.
 */
export const saveDeviceSession = async (mac: string, url: string, name: string) => {
  try {
    const { error } = await supabase
      .from('devices')
      .upsert({ 
        mac_address: mac, 
        playlist_url: url, 
        device_name: name 
      }, { onConflict: 'mac_address' });
    
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Supabase Save Error:", err);
    return false;
  }
};

/**
 * Removes the session from Supabase.
 */
export const deleteDeviceSession = async (mac: string) => {
  try {
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('mac_address', mac);
    
    return !error;
  } catch (err) {
    console.error("Supabase Delete Error:", err);
    return false;
  }
};

/**
 * Fetches favorites for a specific device identifier (mac_address).
 */
export const getFavorites = async (mac: string) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('channel_id')
      .eq('mac_address', mac);
    
    if (error) {
      console.error("Error fetching favorites:", error);
      return [];
    }
    return data.map(f => f.channel_id);
  } catch (err) {
    console.error("Get Favorites Exception:", err);
    return [];
  }
};

/**
 * Toggles a favorite entry in the database.
 */
export const toggleFavoriteInDb = async (mac: string, channelId: string, isFav: boolean) => {
  try {
    if (isFav) {
      // Upsert to handle potential duplicates gracefully
      await supabase
        .from('favorites')
        .upsert({ mac_address: mac, channel_id: channelId }, { onConflict: 'mac_address,channel_id' });
    } else {
      await supabase
        .from('favorites')
        .delete()
        .eq('mac_address', mac)
        .eq('channel_id', channelId);
    }
  } catch (err) {
    console.error("Favorite Sync Failed", err);
  }
};
