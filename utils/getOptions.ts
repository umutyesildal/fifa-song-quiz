import { Song, QuizOption, CuratedSongs } from '../types';

// Cache the songs data to avoid multiple fetches
let cachedSongs: CuratedSongs | null = null;

/**
 * Generate 4 options (A,B,C,D) with one correct answer
 * Modified to show FIFA game options instead of artists
 */
export async function generateOptions(correctSong: Song): Promise<QuizOption[]> {
  // Load all songs for generating wrong options
  let allSongs: Song[] = [];
  let fifaGames: string[] = [];
  
  if (!cachedSongs) {
    try {
      // In the browser, we need to fetch the file from the public directory
      const response = await fetch('/data/curated-songs.json');
      if (!response.ok) {
        throw new Error(`Failed to load songs: ${response.statusText}`);
      }
      cachedSongs = await response.json() as CuratedSongs;
      allSongs = cachedSongs.songs;
      fifaGames = cachedSongs.fifaGames || [];
    } catch (error) {
      console.error('Failed to load songs for options:', error);
      // Return basic options if data is not available
      return [
        { text: correctSong.Game, isCorrect: true },
        { text: 'FIFA 21', isCorrect: false },
        { text: 'FIFA 20', isCorrect: false },
        { text: 'FIFA 19', isCorrect: false }
      ];
    }
  } else {
    allSongs = cachedSongs.songs;
    fifaGames = cachedSongs.fifaGames || [];
  }
  
  // Create correct option
  const correctOption: QuizOption = {
    text: correctSong.Game,
    isCorrect: true
  };
  
  // Get 3 random wrong options
  const wrongOptions: QuizOption[] = [];
  const usedGames = new Set([correctSong.Game]);
  
  // If we have a list of FIFA games, use that for options
  if (fifaGames.length > 0) {
    // Shuffle the list of games
    const shuffledGames = [...fifaGames].sort(() => Math.random() - 0.5);
    
    // Take the first 3 that aren't the correct game
    for (const game of shuffledGames) {
      if (wrongOptions.length >= 3) break;
      
      if (!usedGames.has(game)) {
        wrongOptions.push({
          text: game,
          isCorrect: false
        });
        
        usedGames.add(game);
      }
    }
  }
  
  // If we don't have enough games from the FIFA games list, use the ones from the songs
  if (wrongOptions.length < 3) {
    // Safety counter to prevent infinite loops
    let attempts = 0;
    
    while (wrongOptions.length < 3 && attempts < 100) {
      attempts++;
      
      // Get a random song
      const randomIndex = Math.floor(Math.random() * allSongs.length);
      const randomSong = allSongs[randomIndex];
      
      // Skip if we don't have a valid song or game
      if (!randomSong || !randomSong.Game) continue;
      
      // If we haven't used this game yet, add it as an option
      if (!usedGames.has(randomSong.Game)) {
        wrongOptions.push({
          text: randomSong.Game,
          isCorrect: false
        });
        
        usedGames.add(randomSong.Game);
      }
    }
  }
  
  // If we still couldn't find 3 unique games, fill with placeholder options
  while (wrongOptions.length < 3) {
    const placeholderGame = `FIFA ${20 - wrongOptions.length}`;
    if (!usedGames.has(placeholderGame)) {
      wrongOptions.push({
        text: placeholderGame,
        isCorrect: false
      });
      usedGames.add(placeholderGame);
    }
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