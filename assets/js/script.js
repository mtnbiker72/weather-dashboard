// Set high level variables
const apiKey = "520bf727e3c3660e6c51121d185dd541";
const submitButton = document.querySelector("#submit-button");
const cityNameEl = document.querySelector("#city-name");
var favoriteCities = JSON.parse(localStorage.getItem("favoriteCities"));
var cityName = '';
const favoriteCitiesEl = document.querySelector(".favorite-cities");

// Determine if favoriteCities is empty or not
if (!favoriteCities ) {
    favoriteCities = [];
  }

// Display cities from local storage
showCities(favoriteCities);

// Set the current time to display
var currentDate = moment().format("M/D/YY");
$("#date").text(currentDate);

function getWeather() {
    cityName = cityNameEl.value;
    getWeatherForCity(cityName);
}

// Send the API request and verify the response is 200
// If not, alert the user and allow them to try again
function getWeatherForCity(cityName) {
    showCities(favoriteCities);
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiKey)
        .then(function (response) {
            if (response.status !== 200) {
                alert("Invalid City");
                return 
            }
            else return response.json()
        }) 
        .then(function (weatherData) {
           getWeatherData(weatherData);
        })
    // Store city in local storage, but check to make sure it's not there already
    if (favoriteCities.indexOf(cityName) === -1)  {
        favoriteCities.push(cityName);
        localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
        showCities(favoriteCities);
    }
}

// Parse the output of the API response and get out weather details
// To get extended forecast, get lat and long parameters to use for next API call
function getWeatherData(city) {
    document.getElementById('city').innerHTML = city.name + " (" + currentDate + ") " + 
    "<img class='weather-icon' src='http://openweathermap.org/img/wn/" + city.weather[0].icon + "@2x.png'></img>"; 
    document.getElementById('temp').innerHTML = "Temp: " + tempConverter(city.main.temp) + String.fromCharCode(176);
    document.getElementById('wind').innerHTML = "Wind Speed: " + city.wind.speed + " MPH";
    document.getElementById('humidity').innerHTML = "Humidity: " + city.main.humidity + "%";
    var lat = city.coord.lat;
    var long = city.coord.lon;

    // Get extended forcast and UV Index
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + long + '&exclude=current,hourly,minutely&appid=' + apiKey)
        .then(function (response) {
          return response.json()
          })
        .then(function (forecastData) {
            // Get the UV index and change the background color based on the value
            uvIndex = forecastData.daily[0].uvi;
            if (uvIndex < 3) {
                document.getElementById('uv-index').style.backgroundColor = "green"
                document.getElementById('uv-index').innerHTML = "UV Index: " + uvIndex;
            }
            else if (uvIndex > 2 || uvIndex < 6) {
            document.getElementById('uv-index').style.backgroundColor = "orange"
            document.getElementById('uv-index').innerHTML = "UV Index: " + uvIndex;
            }
            else {
                document.getElementById('uv-index').style.backgroundColor = "red"
                document.getElementById('uv-index').innerHTML = "UV Index: " + uvIndex;
            }

            // 5 Day Forecast Section
            // Convert the time from unix time to a readable date format
            // Convert the temp from kelvin to Farenheit and display for each day
            // Use image from openweathermap.org to populate the page (make image a little larger, too)
            document.querySelector('.day1').innerHTML = "<div>" + timeConverter(forecastData.daily[1].dt) + "</div>"  +
            "<div> <img src='http://openweathermap.org/img/wn/" + forecastData.daily[1].weather[0].icon + "@2x.png'> </div>" +
            "<div>Temp: " + tempConverter(forecastData.daily[1].temp.day) + String.fromCharCode(176) + "</div>" + 
            "<div>Wind: " + forecastData.daily[0].wind_speed + " MPH" +"</div>" +
            "<div>Humidity: " + forecastData.daily[0].humidity + "%" +"</div>"
            document.querySelector('.day2').innerHTML = "<div>" + timeConverter(forecastData.daily[2].dt) + "</div>"  +
            "<div> <img src='http://openweathermap.org/img/wn/" + forecastData.daily[2].weather[0].icon + "@2x.png'> </div>" +
            "<div>Temp: " + tempConverter(forecastData.daily[2].temp.day) + String.fromCharCode(176) + "</div>" + 
            "<div>Wind: " + forecastData.daily[1].wind_speed + " MPH" +"</div>" +
            "<div>Humidity: " + forecastData.daily[1].humidity + "%" +"</div>" 
            document.querySelector('.day3').innerHTML = "<div>" + timeConverter(forecastData.daily[3].dt) + "</div>"  +
            "<div> <img src='http://openweathermap.org/img/wn/" + forecastData.daily[3].weather[0].icon + "@2x.png'> </div>" +
            "<div>Temp: " + tempConverter(forecastData.daily[3].temp.day) + String.fromCharCode(176) + "</div>" + 
            "<div>Wind: " + forecastData.daily[2].wind_speed + " MPH" +"</div>" +
            "<div>Humidity: " + forecastData.daily[2].humidity + "%" +"</div>" 
            document.querySelector('.day4').innerHTML = "<div>" + timeConverter(forecastData.daily[4].dt) + "</div>"  +
            "<div> <img src='http://openweathermap.org/img/wn/" + forecastData.daily[4].weather[0].icon + "@2x.png'> </div>" +
            "<div>Temp: " + tempConverter(forecastData.daily[4].temp.day) + String.fromCharCode(176) + "</div>" + 
            "<div>Wind: " + forecastData.daily[3].wind_speed + " MPH" +"</div>" +
            "<div>Humidity: " + forecastData.daily[3].humidity + "%" +"</div>" 
            document.querySelector('.day5').innerHTML = "<div>" + timeConverter(forecastData.daily[5].dt) + "</div>"  +
            "<div> <img src='http://openweathermap.org/img/wn/" + forecastData.daily[5].weather[0].icon + "@2x.png'> </div>" +
            "<div>Temp: " + tempConverter(forecastData.daily[5].temp.day) + String.fromCharCode(176) + "</div>" + 
            "<div>Wind: " + forecastData.daily[4].wind_speed + " MPH" +"</div>" +
            "<div>Humidity: " + forecastData.daily[4].humidity + "%" +"</div>" 
        })
}

// Once submit button is pressed, go to getWeather function
submitButton.addEventListener("click", getWeather);

// Get local storage cities
function showCities(favoriteCities) {
    var citiesHTML = "";
    for (var i = 0; i < favoriteCities.length; i++) {
        citiesHTML+= `<div class="favorite-city-button" onClick="getWeatherForCity('${favoriteCities[i]}')">${favoriteCities[i]}</div>`
    }
    favoriteCitiesEl.innerHTML = citiesHTML;
}

// Temp is returned as Kelvin so convert to farenheit and remove after decimal
function tempConverter(kelvin) {
    return (((kelvin - 273.15) * 1.8) + 32).toFixed();
}

// Time is returned in unix time so convert it to a readable format
function timeConverter(unixtime) {
    var format = {
        day: "numeric",
        month: "2-digit",
        year: "numeric"
    };
    return (new Date(unixtime * 1000).toLocaleString("en-us", format))
}
