#!/usr/bin/env node

/**
 * Script to extract top FIFA songs by YouTube views
 * and create a curated-songs.json file for FIFA Song Quiz
 */

const fs = require('fs');
const path = require('path');

// Define file paths
const songsFilePath = path.join(__dirname, './public/data/songs.json');
const outputFilePath = path.join(__dirname, './public/data/curated-songs.json');

// Main function
function main() {
  try {
    console.log('FIFA Song Quiz - Top Songs Extractor\n');
    
    // Load the main songs file
    const data = JSON.parse(fs.readFileSync(songsFilePath, 'utf8'));
    
    if (!data.songs || !Array.isArray(data.songs)) {
      console.error('Invalid songs data format');
      process.exit(1);
    }
    
    console.log(`Loaded ${data.songs.length} songs from ${songsFilePath}\n`);
    
    // Normalize and calculate popularity scores
    const songsWithScores = data.songs.map(song => {
      // Make a copy of the song object
      const songWithData = { ...song };
      
      // Convert view count to number if it's not already
      if (songWithData.yt_view_count) {
        if (typeof songWithData.yt_view_count === 'string') {
          songWithData.yt_view_count = parseInt(songWithData.yt_view_count.replace(/,/g, ''), 10) || 0;
        }
        
        // Calculate views per year to normalize for older songs
        if (songWithData.yt_pub_date) {
          const pubYear = new Date(songWithData.yt_pub_date).getFullYear();
          const currentYear = new Date().getFullYear();
          const yearsOnline = Math.max(1, currentYear - pubYear);
          songWithData.views_per_year = Math.round(songWithData.yt_view_count / yearsOnline);
          
          // Calculate popularity score (based on views and likes)
          let likeCount = 0;
          if (songWithData.yt_like_count && typeof songWithData.yt_like_count === 'string') {
            likeCount = parseInt(songWithData.yt_like_count.replace(/,/g, ''), 10) || 0;
          }
          
          const likesBonus = likeCount * 0.5; // Likes have 50% weight of a view
          songWithData.popularity_score = songWithData.views_per_year + likesBonus;
        }
      } else {
        // If no view count, set to 0
        songWithData.yt_view_count = 0;
        songWithData.views_per_year = 0;
        songWithData.popularity_score = 0;
      }
      
      return songWithData;
    });
    
    // Sort by popularity score
    const sortedByPopularity = [...songsWithScores]
      .sort((a, b) => b.popularity_score - a.popularity_score);
    
    // Get unique FIFA games
    const fifaGames = [...new Set(data.songs.map(song => song.Game))].filter(Boolean);
    
    // Ensure we have balanced representation from each game
    const gameRepresentation = {};
    for (const game of fifaGames) {
      gameRepresentation[game] = 0;
    }
    
    // For our sample of 20 songs, adjust the number per game
    const targetTotal = Math.min(data.songs.length, 20);
    const songsPerGame = Math.floor(targetTotal / fifaGames.length);
    let remainder = targetTotal % fifaGames.length;
    
    // Create a balanced list with top songs from each game
    const selectedSongs = [];
    
    // First, get the top songs for each game
    for (const game of fifaGames) {
      const topSongsForGame = sortedByPopularity
        .filter(song => song.Game === game)
        .slice(0, songsPerGame + (remainder > 0 ? 1 : 0));
        
      selectedSongs.push(...topSongsForGame);
      gameRepresentation[game] = topSongsForGame.length;
      
      // Decrement remainder if we added an extra song
      if (remainder > 0) {
        remainder--;
      }
    }
    
    // Sort the final list by popularity score
    const finalSongs = [...selectedSongs].sort((a, b) => b.popularity_score - a.popularity_score);
    
    // Create indices array for daily rotation
    const indices = Array.from({ length: finalSongs.length }, (_, i) => i);
    
    // Create the output object
    const output = {
      fifaGames,
      songs: finalSongs,
      curatedIndex: {
        description: "This array maps dates to indices in the songs array for daily rotation",
        indices
      }
    };
    
    // Write the output file
    fs.writeFileSync(outputFilePath, JSON.stringify(output, null, 2));
    
    // Print summary
    console.log('=== Top FIFA Songs Selected ===\n');
    
    for (const [game, count] of Object.entries(gameRepresentation)) {
      console.log(`${game}: ${count} songs`);
    }
    
    console.log(`\nTotal: ${finalSongs.length} songs`);
    console.log(`\nTop 5 songs by popularity score:`);
    
    finalSongs.slice(0, 5).forEach((song, index) => {
      const scoreFormatted = Math.round(song.popularity_score).toLocaleString();
      console.log(`${index+1}. "${song.Song}" by ${song.Artist} (${song.Game}) - Score: ${scoreFormatted}`);
    });
    
    console.log(`\nSuccess! Created curated songs file at:`);
    console.log(outputFilePath);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
main();