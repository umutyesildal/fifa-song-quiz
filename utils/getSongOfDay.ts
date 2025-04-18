import { Song, CuratedSongs } from '../types';

/**
 * Get the song for the current day using a deterministic algorithm
 */
export function getSongOfDay(): Song {
  // In a real implementation, this would be a fetch from the API or local storage
  // For now, we're assuming the curated-songs.json is available
  let songs: CuratedSongs;
  
  try {
    // In a browser environment, we would use fetch
    // For server-side or static generation, we use require
    songs = require('../public/data/curated-songs.json');
  } catch (error) {
    console.error('Failed to load songs data:', error);
    // Return a fallback song if data is not available
    return {
      Game: 'FIFA 21',
      Artist: 'Error loading song',
      Song: 'Please try again later'
    };
  }
  
  // Get current date and normalize to days since epoch
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const daysSinceEpoch = Math.floor(startOfDay.getTime() / (1000 * 60 * 60 * 24));
  
  // Use the day to select a song index (rotating through all songs)
  const songIndex = songs.curatedIndex.indices[daysSinceEpoch % songs.songs.length];
  
  return songs.songs[songIndex];
}