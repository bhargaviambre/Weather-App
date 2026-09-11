const input = document.querySelector(".search-box input");
const searchButton = document.querySelector(".search-box button");

const loading = document.querySelector(".loading");
const error = document.querySelector(".error");
const weatherInfo = document.querySelector(".weather-info");

const city = document.querySelector(".city");
const temperature = document.querySelector(".temp");
const condition = document.querySelector(".condition");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const savedCity = localStorage.getItem("city");

searchButton.addEventListener("click", searchWeather);
input.addEventListener("keypress",function(event){
    if(event.key === "Enter"){
        searchWeather();
    }
});
 async function searchWeather() {
    const cityName = input.value.trim();
    
    if(cityName === ""){
        return;
    }
    localStorage.setItem("city",cityName);
    loading.style.display = "block";
    error.style.display = "none";
    weatherInfo.style.display= "none";

    try{
        const locationResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`
);
const locationData = await locationResponse.json();
if(!locationData.results){
    throw new Error("City not found");
}

const latitude = locationData.results[0].latitude;
const longitude = locationData.results[0].longitude;
const cityNameResult = locationData.results[0].name;

const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`);
const weatherData = await weatherResponse.json();

city.textContent = cityNameResult;
temperature.textContent = weatherData.current.temperature_2m;
humidity.textContent = weatherData.current.relative_humidity_2m + "%";
wind.textContent = weatherData.current.wind_speed_10m + "km/h";

condition.textContent = getWeatherCondition(
    weatherData.current.weather_code
);
weatherInfo.style.display = "block";
    }
    catch(err){
        error.style.display = "block";
    }
    finally{
        loading.style.display = "none";
    }
 }

 function getWeatherCondition(code){
    if(code === 0){
        return "Clear Sky ☀️";
    }
    else if(code <= 3){
        return "Cloudy ☁️"
    }
    else if(code <= 48){
        return "Foggy 🌫️";
    }
    else if(code <= 67){
        return "Rainy 🌧️";
    }
    else if(code <= 77){
        return "Snowy ❄️";
    }
    else if(code <= 82){
        return "Rain Showers 🌦️";
    }
    else{
        return "Thunderstorm ⛈️";
    }
 }
 if(savedCity){
    input.value = savedCity;
    searchWeather();
 }
