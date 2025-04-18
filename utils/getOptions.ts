import { Song, QuizOption, CuratedSongs } from '../types';

/**
 * Generate 4 options (A,B,C,D) with one correct answer
 */
export function generateOptions(correctSong: Song): QuizOption[] {
  // Load all songs for generating wrong options
  let allSongs: Song[] = [];
  
  try {
    const data: CuratedSongs = require('../public/data/curated-songs.json');
    allSongs = data.songs;
  } catch (error) {
    console.error('Failed to load songs for options:', error);
    // Return basic options if data is not available
    return [
      { text: correctSong.Artist, isCorrect: true },
      { text: 'Option B', isCorrect: false },
      { text: 'Option C', isCorrect: false },
      { text: 'Option D', isCorrect: false }
    ];
  }
  
  // Create correct option
  const correctOption: QuizOption = {
    text: correctSong.Artist,
    isCorrect: true
  };
  
  // Get 3 random wrong options
  const wrongOptions: QuizOption[] = [];
  const usedArtists = new Set([correctSong.Artist]);
  
  // Safety counter to prevent infinite loops
  let attempts = 0;
  
  while (wrongOptions.length < 3 && attempts < 100) {
    attempts++;
    
    // Get a random song
    const randomIndex = Math.floor(Math.random() * allSongs.length);
    const randomSong = allSongs[randomIndex];
    
    // Skip if we don't have a valid song or artist
    if (!randomSong || !randomSong.Artist) continue;
    
    // If we haven't used this artist yet, add it as an option
    if (!usedArtists.has(randomSong.Artist)) {
      wrongOptions.push({
        text: randomSong.Artist,
        isCorrect: false
      });
      
      usedArtists.add(randomSong.Artist);
    }
  }
  
  // If we couldn't find 3 unique artists, fill with placeholder options
  while (wrongOptions.length < 3) {
    wrongOptions.push({
      text: `Random Artist ${wrongOptions.length + 1}`,
      isCorrect: false
    });
  }
  
  // Combine and shuffle options
  const options = [correctOption, ...wrongOptions];
  
  // Fisher-Yates shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return options;
}