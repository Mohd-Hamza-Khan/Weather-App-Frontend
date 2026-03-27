# Weather App

A modern, responsive weather application built with React that provides real-time weather information and 5-day forecasts for any location worldwide.

## PM Accelerator Mission

*"By making industry-leading tools and education available to individuals from all backgrounds, we level the playing field for future PM leaders. This is the PM Accelerator motto, as we grant aspiring and experienced PMs what they need most – Access. We introduce you to industry leaders, surround you with the right PM ecosystem, and discover the new world of AI product management skills."*

---

## Features

- **Location Search**: Search by city name (London, Paris, New York) or zip code (10001, SW1A 1AA)
- **Current Weather**: Displays temperature, weather conditions, humidity, wind speed, pressure, visibility, and sunrise time
- **5-Day Forecast**: Organized grid view showing daily high/low temperatures with weather icons
- **Error Handling**: Graceful error messages for invalid locations, network issues, and API errors with retry functionality
- **Modern UI**: Glassmorphism design with emoji weather icons and smooth animations

## Technology Stack

- **React** - UI library
- **OpenWeatherMap API** - Weather data
- **CSS3** - Styling with gradients, animations, and responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd weather-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production

## Project Structure

```
weather-app/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Main application component
│   ├── index.js        # React entry point
│   └── index.css       # Global styles
├── .env                # Environment variables (API key)
├── .gitignore
├── package.json
└── README.md
```

## API Configuration

The app uses OpenWeatherMap API. The API key is stored in a `.env` file (not committed to git):

```bash
REACT_APP_API_KEY=your_api_key_here
```

Create a `.env` file in the project root with your API key. A sample `.env` file is included for development.

## Usage

1. **Search for a location**: Enter a city name or zip code in the search box and click "Search"
2. **View current weather**: See temperature, conditions, and detailed weather metrics
3. **Check forecast**: Scroll down to see the 5-day weather forecast
4. **Handle errors**: If a location isn't found, an error message appears with a retry button

## Weather Icons

The app uses emoji icons that change based on weather conditions:
- ☀️ Clear sky (day)
- 🌙 Clear sky (night)
- ⛅ Few clouds
- ☁️ Cloudy
- 🌧️ Rain
- ⛈️ Thunderstorm
- ❄️ Snow
- 🌫️ Mist

## Error Handling

The app handles various error scenarios:
- Invalid city/location names (404)
- Invalid API key (401)
- API rate limits (429)
- Network failures
- Missing weather data

## License

This project is for demonstration purposes.
