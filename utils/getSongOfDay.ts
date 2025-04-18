import { Song, CuratedSongs } from '../types';

// Create a fallback song for when data can't be loaded
const fallbackSong: Song = {
  Game: 'FIFA 21',
  Artist: 'Error loading song',
  Song: 'Please try again later'
};

// Cache the songs data to avoid multiple fetches
let cachedSongs: CuratedSongs | null = null;

/**
 * Get the song for the current day using a deterministic algorithm
 */
export async function getSongOfDay(): Promise<Song> {
  if (!cachedSongs) {
    try {
      // In the browser, we need to fetch the file from the public directory
      const response = await fetch('/data/curated-songs.json');
      if (!response.ok) {
        throw new Error(`Failed to load songs: ${response.statusText}`);
      }
      cachedSongs = await response.json() as CuratedSongs;
    } catch (error) {
      console.error('Failed to load songs data:', error);
      // Return a fallback song if data is not available
      return fallbackSong;
    }
  }
  
  // Safety check
  if (!cachedSongs || !cachedSongs.songs || cachedSongs.songs.length === 0) {
    return fallbackSong;
  }
  
  // Get current date and normalize to days since epoch
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const daysSinceEpoch = Math.floor(startOfDay.getTime() / (1000 * 60 * 60 * 24));
  
  // Use the day to select a song index (rotating through all songs)
  const songs = cachedSongs;
  const songIndex = songs.curatedIndex.indices[daysSinceEpoch % songs.songs.length];
  
  return songs.songs[songIndex];
}