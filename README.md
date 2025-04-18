# FIFA Song Quiz 🎮 🎵

A daily quiz game that challenges players to identify which FIFA game featured iconic songs from the series' legendary soundtracks.

![FIFA Song Quiz Screenshot](https://via.placeholder.com/800x450.png?text=FIFA+Song+Quiz+Screenshot)

## 🎮 About the Project

FIFA games are known for their incredible soundtracks that have introduced players to amazing artists and tracks. This quiz presents players with one song per day from FIFA's history and challenges them to identify which FIFA game it appeared in.

Key features:
- Daily song rotation in order of popularity
- YouTube music player integration
- Score tracking
- Daily countdown timer
- Mobile-friendly design

## 📋 How It Works

1. Each day, a new song is selected from the FIFA games soundtrack history
2. Songs follow a deterministic order based on a popularity algorithm that considers:
   - YouTube views and likes
   - Iconic status (manually curated)
   - Year of release
3. Players get two chances to guess the correct FIFA game
4. Results can be shared with friends

## 🔧 Data Processing

The project uses a data pipeline to:
1. Collect data about FIFA songs from a comprehensive list
2. Fetch YouTube statistics using a Selenium-based scraper
3. Apply a sophisticated ranking algorithm that heavily weights iconic songs
4. Generate JSON data files for the quiz application

## 🚀 Running the Project

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/umutyesildal/fifa-song-quiz.git
cd fifa-song-quiz

# Install dependencies
npm install
# or
yarn install
```

### Development

```bash
# Run the development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the quiz.

### Building for Production

```bash
# Build the application
npm run build
# or
yarn build

# Start the production server
npm run start
# or
yarn start
```

## 🧠 Technical Details

### Data Generation

The quiz utilizes a two-step process to generate its song database:

1. **Data Collection**: Uses `youtube-search-selenium.py` to gather YouTube metrics for each FIFA song
2. **Data Processing**: Uses `csv-to-json.js` to:
   - Calculate popularity scores based on views, likes, and engagement
   - Apply multipliers for iconic songs (ranked 1-100)
   - Generate both complete and curated song lists

### Daily Song Selection

Songs are selected in order of popularity, starting with the highest-ranked song on the first day (April 18, 2025) and progressing down the list each day. After the first cycle through all songs, the system employs different patterns to keep the quiz interesting.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- FIFA game series for the amazing soundtracks
- YouTube for providing the music player API
- All the incredible artists featured in FIFA games
