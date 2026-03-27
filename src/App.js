import React, { useState, useEffect } from 'react';

const API_KEY = process.env.REACT_APP_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';
const FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&q=';

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastQuery, setLastQuery] = useState('');

  useEffect(() => {
    searchWeather('London');
  }, []);

  const getWeatherIcon = (weatherCode, isNight = false) => {
    const icons = {
      '01': isNight ? '🌙' : '☀️',
      '02': isNight ? '☁️' : '⛅',
      '03': '☁️',
      '04': '☁️',
      '09': '🌧️',
      '10': isNight ? '🌧️' : '🌦️',
      '11': '⛈️',
      '13': '❄️',
      '50': '🌫️'
    };
    return icons[weatherCode] || '🌤️';
  };

  const formatTime = (timestamp, timezoneOffset) => {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toUTCString().split(' ')[4].substring(0, 5);
  };

  const processForecast = (list) => {
    const dailyData = {};
    list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyData[date]) {
        dailyData[date] = {
          temps: [],
          weather: item.weather[0],
          icon: item.weather[0].icon.substring(0, 2)
        };
      }
      dailyData[date].temps.push(item.main.temp);
    });

    const days = Object.keys(dailyData).slice(0, 5);
    return days.map((day, index) => {
      const dayData = dailyData[day];
      const minTemp = Math.round(Math.min(...dayData.temps));
      const maxTemp = Math.round(Math.max(...dayData.temps));
      const date = new Date(day);
      const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
      
      return {
        dayName,
        icon: getWeatherIcon(dayData.icon),
        minTemp,
        maxTemp
      };
    });
  };

  const searchWeather = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setError('Please enter a location to search.');
      return;
    }

    setLoading(true);
    setError('');
    setLastQuery(searchQuery);

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`${WEATHER_API_URL}${encodeURIComponent(searchQuery)}&appid=${API_KEY}`),
        fetch(`${FORECAST_API_URL}${encodeURIComponent(searchQuery)}&appid=${API_KEY}`)
      ]);

      if (!weatherRes.ok) {
        if (weatherRes.status === 404) {
          throw new Error(`Location "${searchQuery}" not found. Please check the spelling or try a different location.`);
        } else if (weatherRes.status === 401) {
          throw new Error('Invalid API key. Please check your credentials.');
        } else if (weatherRes.status === 429) {
          throw new Error('API rate limit exceeded. Please try again later.');
        } else {
          throw new Error(`Weather service error (${weatherRes.status}). Please try again.`);
        }
      }

      const weatherData = await weatherRes.json();
      
      if (!forecastRes.ok) {
        throw new Error('Failed to load forecast data.');
      }

      const forecastData = await forecastRes.json();

      setWeather(weatherData);
      setForecast(processForecast(forecastData.list));
      setQuery('');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchWeather(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchWeather(query);
    }
  };

  const retrySearch = () => {
    if (lastQuery) {
      searchWeather(lastQuery);
    }
  };

  const isNight = weather?.weather[0]?.icon.includes('n');
  const iconCode = weather?.weather[0]?.icon.substring(0, 2) || '01';

  return (
    <div className="container">
      <div className="header">
        <h1>Weather App</h1>
        <p>Get current weather and 5-day forecast</p>
      </div>

      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Enter city or zip code..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
        
        <div className={`error-message ${error ? 'show' : ''}`}>
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={retrySearch} style={{ fontSize: '0.9rem', padding: '10px 20px' }}>
            Retry
          </button>
        </div>

        <div className="tips">
          <strong>Tips:</strong> You can search by city name (London, Paris) or zip code (10001, SW1A 1AA)
        </div>
      </div>

      <div className={`loading ${loading ? 'show' : ''}`}>
        <div className="spinner"></div>
        <p>Loading weather data...</p>
      </div>

      {weather && !loading && (
        <>
          <div className="current-weather show">
            <div className="weather-main">
              <div className="weather-icon">{getWeatherIcon(iconCode, isNight)}</div>
              <div className="weather-info">
                <div className="temperature">{Math.round(weather.main.temp)}°C</div>
                <div className="location">{weather.name}, {weather.sys.country}</div>
                <div className="description">{weather.weather[0].description}</div>
              </div>
            </div>
            <div className="weather-details">
              <div className="detail-card">
                <div className="detail-icon">💧</div>
                <div className="detail-label">Humidity</div>
                <div className="detail-value">{weather.main.humidity}%</div>
              </div>
              <div className="detail-card">
                <div className="detail-icon">💨</div>
                <div className="detail-label">Wind Speed</div>
                <div className="detail-value">{weather.wind.speed} m/s</div>
              </div>
              <div className="detail-card">
                <div className="detail-icon">📊</div>
                <div className="detail-label">Pressure</div>
                <div className="detail-value">{weather.main.pressure} hPa</div>
              </div>
              <div className="detail-card">
                <div className="detail-icon">👁️</div>
                <div className="detail-label">Visibility</div>
                <div className="detail-value">{weather.visibility ? `${(weather.visibility / 1000).toFixed(1)} km` : 'N/A'}</div>
              </div>
              <div className="detail-card">
                <div className="detail-icon">🌅</div>
                <div className="detail-label">Sunrise</div>
                <div className="detail-value">{formatTime(weather.sys.sunrise, weather.timezone)}</div>
              </div>
            </div>
          </div>

          <div className="forecast-section show">
            <h2>5-Day Forecast</h2>
            <div className="forecast-grid">
              {forecast.map((day, index) => (
                <div key={index} className="forecast-card">
                  <div className="forecast-day">{day.dayName}</div>
                  <div className="forecast-icon">{day.icon}</div>
                  <div className="forecast-temp">
                    <span className="max-temp">{day.maxTemp}°</span> / <span className="min-temp">{day.minTemp}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
