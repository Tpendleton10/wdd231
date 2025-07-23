const apiKey = 'b76bb436c54fd8839f6a359806ecb177';
const lat = 36.1699;
const lon = -115.1398;
const weatherContainer = document.getElementById('weather');

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    const current = data.current;
    const daily = data.daily;

    const currentWeather = `
      <h2>Weather in Las Vegas</h2>
      <p><strong>Now:</strong> ${Math.round(current.temp)}°F, ${current.weather[0].description}</p>
      <h3>3-Day Forecast:</h3>
      <ul>
        ${daily.slice(1, 4).map(day => `
          <li>${new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'short' })}: ${Math.round(day.temp.day)}°F</li>
        `).join('')}
      </ul>
    `;

    weatherContainer.innerHTML = currentWeather;

  } catch (error) {
    weatherContainer.innerHTML = '<p>Weather data unavailable.</p>';
    console.error('Weather fetch error:', error);
  }
}

getWeather();
