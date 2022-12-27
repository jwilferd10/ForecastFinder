// The appID should be a const that contains our apiKey
const appID = '98c449ac6da7543bd710d0a40481466f';
// We'll want the units to be imperial
const units = 'imperial';
// searchMethod will be an empty string
const searchMethod = '';

function weatherForecast(userInput) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q${searchMethod}=${userInput}&APPID=${appID}&units=${units}`)
    .then(result => {
      return result.json(); // Return the appropriate JSON
    })
    .then(result => {
        findWeather(result); // Initialize the application
    });
};
    
// Create an event listener for the search button
document.getElementById('searchButton').addEventListener('click', () => {
    // Take the value of the userInput
    let userInput = document.getElementById('searchInput').value;
    if(userInput)
    weatherForecast(userInput);
});

// Create a function that'll initialize the application and return the user input to the HTML
function findWeather(resultFromServer) {
    // Importing the index.html's ID's into the function.
    const currentConditionEl = document.getElementById('currentCondition');
    const currentTempEl = document.getElementById('currentTemp');
    const humidityEl = document.getElementById('humidity');
    const windSpeedEl = document.getElementById('windSpeed');
    const cityNameEl = document.getElementById('cityName');
    const currentWeatherPNG = document.getElementById('currentWeatherPNG');
    
    // Referencing the imported ID's above, applying innerHTML that acts as the returned results
    let weatherData = resultFromServer.weather[0].description;

    // Take the current conditions and capitalize the first character
    currentConditionEl.innerText = weatherData.charAt(0).toUpperCase() + weatherData.slice(1);

    // Brings back the name of the searched city
    cityNameEl.innerHTML = resultFromServer.name; 

    // Present a png image of current weather conditions of searched location
    currentWeatherPNG.src = 'http://openweathermap.org/img/w/' + resultFromServer.weather[0].icon + '.png';
   
    // Brings back the current temperature of searched city
    currentTempEl.innerHTML = 'Temperature: ' + Math.floor(resultFromServer.main.temp) + ' &#176F';
    
    // Bring back the current wind velocity 
    windSpeedEl.innerHTML = 'Wind Speed: ' + Math.floor(resultFromServer.wind.speed) + ' MPH';

    // Bring back the current humidity of searched city 
    humidityEl.innerHTML = 'Humidity: ' + resultFromServer.main.humidity + '%';

    // Console.log the results from the server
    // This is to see what information is transfered from the openweatherAPI
    console.log(resultFromServer);
};
    
