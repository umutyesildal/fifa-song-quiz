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
 * that follows the exact order of songs by popularity in the curated list
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
  
  // Get current date
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Define the starting date - April 18, 2025
  const startDate = new Date(2025, 4, 19); // Month is 0-based, so 3 = April
  
  // Calculate days elapsed since start date
  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Handle dates before the start date
  if (daysSinceStart < 0) {
    console.log("Current date is before the start date. Using first song.");
    return cachedSongs.songs[0];
  }
  
  // First cycle: Go through the first 120 songs in order (0-119 days since start)
  const songCount = cachedSongs.songs.length;
  
  if (daysSinceStart < songCount) {
    // Direct mapping: day 0 -> song 0, day 1 -> song 1, etc.
    return cachedSongs.songs[daysSinceStart];
  }
  
  // After first cycle (120+ days): Use modulo to create repeating pattern
  // We can also introduce different patterns for variety
  
  // Calculate which cycle we're in (cycle 0 is the first 120 days)
  const cycle = Math.floor(daysSinceStart / songCount);
  
  // Different selection patterns based on which cycle we're in
  switch (cycle % 3) {
    case 0: 
      // First pattern: Standard order (like first cycle)
      return cachedSongs.songs[daysSinceStart % songCount];
    
    case 1: 
      // Second pattern: Reverse order
      return cachedSongs.songs[songCount - 1 - (daysSinceStart % songCount)];
    
    case 2:
      // Third pattern: Groups of 10 songs
      // Days 240-249: songs 0-9, Days 250-259: songs 10-19, etc.
      const groupSize = 10;
      const groupIndex = Math.floor((daysSinceStart % songCount) / groupSize);
      const indexWithinGroup = daysSinceStart % groupSize;
      const songIndex = (groupIndex * groupSize + indexWithinGroup) % songCount;
      return cachedSongs.songs[songIndex];
      
    default:
      // Fallback to standard order
      return cachedSongs.songs[daysSinceStart % songCount];
  }
}