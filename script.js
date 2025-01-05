const weatherInfo = document.getElementById('weather-info');
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city');

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();

  if (city === '') {
    weatherInfo.innerHTML = '<p>Please enter a city name!</p>';
    return;
  }

  // Open-Meteo API requires latitude and longitude; use a helper API to fetch coordinates
  fetch(`https://geocode.maps.co/search?q=${city}`)
    .then(response => response.json())
    .then(locationData => {
      if (!locationData.length) {
        weatherInfo.innerHTML = '<p>City not found. Please try again!</p>';
        return;
      }

      const { lat, lon } = locationData[0];
      return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    })
    .then(response => response.json())
    .then(data => {
      if (data) {
        const { temperature, weathercode } = data.current_weather;
        weatherInfo.innerHTML = `
          <h2>Weather in ${city}</h2>
          <p>Temperature: ${temperature}°C</p>
          <p>Weather Code: ${weathercode}</p>
        `;
      }
    })
    .catch(error => {
      weatherInfo.innerHTML = '<p>Error fetching weather data. Please try again later.</p>';
      console.error('Error:', error);
    });
});
