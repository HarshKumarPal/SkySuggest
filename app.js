const input = document.getElementById("input");
const temperature = document.getElementById("temperature");
const city = document.getElementById("location");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherImage = document.getElementById("weatherImage");
const weatherCard = document.getElementById("weatherCard");
const weather = document.getElementById("weather");
const forecast = document.getElementById("forecast");
const suggestions = document.getElementById("suggestions");
const apiKey = "0eb5d5d0b6722c6268094c8ff160c359";

function getWeatherData(cityName) {
  const response = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
  ).then((res) => res.json());
  console.log(response)
  return response;
}

function getWeeklyForecast(cityName) {
  return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`)
    .then((res) => res.json());
}

function formatTime(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString();
}

function submitHandler(e) {
  e.preventDefault();
  getWeatherData(input.value)
    .then((data) => {
      if (data.hasOwnProperty("message")) {
        console.log(data)
        const prevValue = input.value
        input.value = "City not found!!"
        setTimeout(()=>{
            input.value = prevValue
        }, 2000)
      }
      else
      {
        weatherCard.style.display = 'block';
        temperature.innerText = data.main.temp + "° C";
        minTemp.innerText = 'Min Temp: ' + data.main.temp_min + "° C";
        maxTemp.innerText = 'Max Temp: ' + data.main.temp_max + "° C";
        feelsLike.innerText = 'Feels Like: ' + data.main.feels_like + "° C";
        humidity.innerText = 'Humidity: ' + data.main.humidity + " %";
        wind.innerText = 'Wind Speed: ' + data.wind.speed + " m/s";
        sunrise.innerText = 'Sunrise: ' + formatTime(data.sys.sunrise);
        sunset.innerText = 'Sunset: ' + formatTime(data.sys.sunset);
        city.innerText = data.name;
        weatherImage.src =  weatherImage.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weather.innerText = data.weather[0].main;
        return data.name;
      }
    })
    .then((cityName) => {
      return getWeeklyForecast(cityName);
    })
    .then((forecastData) => {
      forecast.innerHTML = '';
      const dailyForecasts = forecastData.list.filter((_, idx) => idx % 8 === 0); // Get daily data
      dailyForecasts.forEach(day => {
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('forecastCard');
        forecastCard.innerHTML = `
          <h4>${new Date(day.dt * 1000).toLocaleDateString()}</h4>
          <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon">
          <h4>${day.main.temp}° C</h4>
          <h5>Min: ${day.main.temp_min}° C</h5>
          <h5>Max: ${day.main.temp_max}° C</h5>
          <h5>${day.weather[0].main}</h5>
        `;
        forecast.appendChild(forecastCard);
      });
    })
    .catch((e) => console.log(e));
}

// Type-ahead suggestions (simplified example, requires a server or a list of cities)
input.addEventListener('input', () => {
  const query = input.value;
  if (query.length > 2) {
    // Fetch or filter city suggestions based on the query
    // This is a placeholder example
    const suggestedCities = ["London", "Paris", "New York"].filter(city => city.toLowerCase().includes(query.toLowerCase()));
    suggestions.innerHTML = '';
    suggestedCities.forEach(city => {
      const suggestionItem = document.createElement('div');
      suggestionItem.classList.add('suggestion-item');
      suggestionItem.innerText = city;
      suggestionItem.onclick = () => {
        input.value = city;
        suggestions.innerHTML = '';
      };
      suggestions.appendChild(suggestionItem);
    });
  } else {
    suggestions.innerHTML = '';
  }
});

