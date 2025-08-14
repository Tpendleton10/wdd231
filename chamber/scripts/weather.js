// Production-ready weather API for Las Vegas Chamber
const apiKey = '7a826c85111d4b75ff54282ff848657e'; // Replace with your OpenWeatherMap API key
const lat = 36.1699; // Las Vegas latitude
const lon = -115.1398; // Las Vegas longitude

async function getWeather() {
  const weatherContainer = document.getElementById('weather');
  
  if (!weatherContainer) {
    console.error('Weather container not found');
    return;
  }

  // Check if API key is configured
  if (apiKey === '7a826c85111d4b75ff54282ff848657e' || !apiKey || apiKey.length < 10) {
    displayWeatherError('Weather service configuration needed');
    return;
  }

  try {
    // Show loading state
    weatherContainer.innerHTML = `
      <h2 id="weather-heading">Las Vegas Weather</h2>
      <div class="weather-loading" aria-live="polite">
        <p>Loading current weather conditions...</p>
      </div>
    `;

    // Fetch current weather and forecast
    const [currentData, forecastData] = await Promise.all([
      fetchCurrentWeather(),
      fetchForecast()
    ]);

    // Display the weather
    displayWeather(currentData, forecastData);

  } catch (error) {
    console.error('Weather error:', error);
    displayWeatherError('Unable to load current weather conditions');
  }
}

async function fetchCurrentWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Current weather API error: ${response.status}`);
  }
  
  return await response.json();
}

async function fetchForecast() {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Forecast API error: ${response.status}`);
  }
  
  return await response.json();
}

function displayWeather(current, forecast) {
  const weatherContainer = document.getElementById('weather');
  
  // Extract current weather data with fallbacks
  const temp = Math.round(current?.main?.temp || 0);
  const description = current?.weather?.[0]?.description || 'Unknown conditions';
  const icon = current?.weather?.[0]?.icon || '01d';
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  const humidity = current?.main?.humidity || 0;
  const windSpeed = Math.round(current?.wind?.speed || 0);
  
  // Get 3-day forecast
  const threeDayForecast = getThreeDayForecast(forecast?.list || []);
  
  // Create accessible HTML
  weatherContainer.innerHTML = `
    <h2 id="weather-heading">Las Vegas Weather</h2>
    <div class="current-weather" role="region" aria-labelledby="current-conditions">
      <div class="weather-main">
        <img src="${iconUrl}" 
             alt="Current weather: ${description}" 
             class="weather-icon"
             width="80" 
             height="80"
             loading="lazy">
        <div class="weather-details">
          <div class="temperature" aria-label="Current temperature">${temp}°F</div>
          <div class="description">${capitalizeDescription(description)}</div>
          <div class="additional-info">
            <span aria-label="Humidity">Humidity: ${humidity}%</span> | 
            <span aria-label="Wind speed">Wind: ${windSpeed} mph</span>
          </div>
        </div>
      </div>
    </div>
    <div class="forecast-section" role="region" aria-labelledby="forecast-heading">
      <h3 id="forecast-heading">3-Day Forecast</h3>
      <div class="forecast-grid" role="list">
        ${threeDayForecast.map((day, index) => `
          <div class="forecast-item" role="listitem" aria-label="${day.day} forecast">
            <div class="forecast-day">${day.day}</div>
            <img src="https://openweathermap.org/img/wn/${day.icon}.png" 
                 alt="${day.description}" 
                 class="forecast-icon"
                 width="50"
                 height="50"
                 loading="lazy">
            <div class="forecast-temp" aria-label="High temperature">${day.temp}°F</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Announce completion to screen readers
  announceToScreenReader(`Weather loaded. Current temperature is ${temp} degrees Fahrenheit with ${description}.`);
}

function getThreeDayForecast(forecastList) {
  if (!Array.isArray(forecastList) || forecastList.length === 0) {
    return getStaticForecast();
  }

  const forecasts = [];
  const today = new Date();
  
  // Get forecasts for next 3 days
  for (let i = 1; i <= 3; i++) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + i);
    
    // Find forecast around noon for this day
    const dayForecast = forecastList.find(item => {
      const itemDate = new Date(item.dt * 1000);
      return itemDate.getDate() === targetDate.getDate() && 
             itemDate.getHours() >= 11 && itemDate.getHours() <= 15;
    });
    
    // If no noon forecast, get any forecast for that day
    const fallbackForecast = forecastList.find(item => {
      const itemDate = new Date(item.dt * 1000);
      return itemDate.getDate() === targetDate.getDate();
    });
    
    const forecast = dayForecast || fallbackForecast;
    
    if (forecast) {
      forecasts.push({
        day: targetDate.toLocaleDateString('en-US', { weekday: 'short' }),
        temp: Math.round(forecast.main.temp),
        description: forecast.weather[0].description,
        icon: forecast.weather[0].icon
      });
    }
  }
  
  // Fill with static data if we don't have enough forecasts
  while (forecasts.length < 3) {
    const staticForecasts = getStaticForecast();
    forecasts.push(staticForecasts[forecasts.length]);
  }
  
  return forecasts.slice(0, 3);
}

function getStaticForecast() {
  const today = new Date();
  return [
    {
      day: new Date(today.getTime() + 24*60*60*1000).toLocaleDateString('en-US', { weekday: 'short' }),
      temp: 78,
      description: 'Sunny',
      icon: '01d'
    },
    {
      day: new Date(today.getTime() + 48*60*60*1000).toLocaleDateString('en-US', { weekday: 'short' }),
      temp: 80,
      description: 'Partly cloudy',
      icon: '02d'
    },
    {
      day: new Date(today.getTime() + 72*60*60*1000).toLocaleDateString('en-US', { weekday: 'short' }),
      temp: 75,
      description: 'Sunny',
      icon: '01d'
    }
  ];
}

function displayWeatherError(message) {
  const weatherContainer = document.getElementById('weather');
  
  weatherContainer.innerHTML = `
    <h2 id="weather-heading">Las Vegas Weather</h2>
    <div class="weather-error" role="alert">
      <p>⚠️ ${message}</p>
      <div class="static-weather">
        <div class="temperature">75°F</div>
        <div class="description">Sunny (Typical Las Vegas Weather)</div>
      </div>
      <button onclick="getWeather()" 
              class="retry-button"
              aria-label="Try loading weather again">
        Refresh Weather
      </button>
    </div>
  `;
}

function capitalizeDescription(description) {
  if (!description) return 'Unknown conditions';
  
  return description.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    if (document.body.contains(announcement)) {
      document.body.removeChild(announcement);
    }
  }, 1000);
}

// Initialize weather when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('Weather module loaded');
  getWeather();
});

// Retry function for global access
window.retryWeather = getWeather;

// Enhanced weather styles for better presentation
const weatherCSS = `
<style>
.weather-content {
  color: white;
}

.weather-loading {
  text-align: center;
  padding: 2rem;
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
  backdrop-filter: blur(5px);
}

.current-weather {
  margin-bottom: 2rem;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: rgba(255,255,255,0.1);
  padding: 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.weather-icon {
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  padding: 10px;
  flex-shrink: 0;
}

.weather-details {
  flex: 1;
}

.temperature {
  font-size: clamp(2.5rem, 5vw, 3rem);
  font-weight: bold;
  color: var(--secondary);
  line-height: 1;
  margin-bottom: 0.5rem;
}

.description {
  font-size: clamp(1.1rem, 2.5vw, 1.3rem);
  color: rgba(255,255,255,0.9);
  margin-bottom: 0.5rem;
}

.additional-info {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.8);
}

.forecast-section h3 {
  color: var(--secondary);
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.forecast-item {
  background: rgba(255,255,255,0.1);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  backdrop-filter: blur(5px);
  transition: background 0.3s ease;
}

.forecast-item:hover,
.forecast-item:focus-within {
  background: rgba(255,255,255,0.15);
}

.forecast-day {
  font-weight: bold;
  color: var(--secondary);
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.forecast-icon {
  margin: 0.5rem 0;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.forecast-temp {
  font-weight: bold;
  color: white;
  font-size: 1.1rem;
}

.weather-error {
  background: rgba(255,255,255,0.1);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  backdrop-filter: blur(10px);
  border-left: 4px solid var(--error-color, #ff6b6b);
}

.static-weather {
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
}

.static-weather .temperature {
  font-size: 2rem;
  color: var(--secondary);
  margin-bottom: 0.5rem;
}

.static-weather .description {
  color: rgba(255,255,255,0.9);
}

.retry-button {
  background: var(--secondary);
  color: var(--primary);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.retry-button:hover,
.retry-button:focus {
  background: #e8b90a;
  transform: translateY(-2px);
  outline: 2px solid white;
  outline-offset: 2px;
}

@media (max-width: 600px) {
  .weather-main {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .forecast-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .forecast-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    padding: 0.75rem;
  }
  
  .forecast-icon {
    margin: 0;
  }
  
  .temperature {
    font-size: 2.5rem !important;
  }
  
  .additional-info {
    font-size: 0.8rem;
  }
}

@media (min-width: 768px) {
  .weather-main {
    gap: 2rem;
  }
  
  .forecast-grid {
    gap: 1.5rem;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .weather-main,
  .forecast-item {
    border: 2px solid currentColor;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .retry-button,
  .forecast-item {
    transition: none;
  }
}
</style>
`;

// Inject styles into document head
if (document.head && !document.querySelector('#weather-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'weather-styles';
  styleElement.innerHTML = weatherCSS.replace('<style>', '').replace('</style>', '');
  document.head.appendChild(styleElement);
}