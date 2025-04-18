export interface Song {
  Game: string;
  Artist: string;
  Song: string;
  tag?: string;
  full_name?: string;
  radio_station?: string;
  song_title?: string;
  yt_vid_title?: string;
  yt_vid_link?: string;
  yt_page_info?: string;
  yt_view_count?: number;
  yt_pub_date?: string;
  yt_like_count?: string | number;
  popularity_score?: number;
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizState {
  currentSong: Song;
  options: QuizOption[];
  selectedOption: number | null;
  isAnswered: boolean;
  isCorrect: boolean;
}

export interface CuratedSongs {
  fifaGames: string[];
  songs: Song[];
  curatedIndex: {
    description: string;
    indices: number[];
  };
}