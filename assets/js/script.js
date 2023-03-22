const appID = '98c449ac6da7543bd710d0a40481466f';
const units = 'imperial';
const searchMethod = '';
const currentConditionEl = document.getElementById('currentCondition');
const currentTempEl = document.getElementById('currentTemp');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('windSpeed');
const cityNameEl = document.getElementById('cityName');
const currentWeatherPNG = document.getElementById('currentWeatherPNG');

const locationResultEl = document.getElementById('locationResult');

///////////////////////////////////

function weatherForecast() {

    let userInput = document.getElementById('searchInput').value;

    // if userInput is true, proceed to API
    if (userInput) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q${searchMethod}=${userInput}&APPID=${appID}&units=${units}`)
        .then(result => {
        return result.json();
        })
        .then(result => {
            if (result.error) {
                window.alert("Something went wrong!");
            } else {
                // collect weather results
                findWeather(result); 
                // create new listItem using userInput 
                previousSearches(userInput);
            }
        })
        .catch(error => {
            // if error exists, inform user
            window.alert("Please enter a valid city name!")
        });
    } 
};
    
///////////////////////////////////

// 
document.getElementById('searchButton').addEventListener('click', (event) => { 
    event.preventDefault();
    weatherForecast();
});

document.getElementById('searchInput').addEventListener('keydown', (event) => { 
    if(event.code === "Enter") {
        event.preventDefault();
        weatherForecast();
    }
});

///////////////////////////////////

// let getResult = function() {

    // collect userInput 
    // let userInput = document.getElementById('searchInput').value;

    // if (userInput) {
        // passes userInput to weatherForecast for search results
        // weatherForecast(userInput);

        // create a new listItem using userInput
        // previousSearches(userInput);   
    // }
// }

///////////////////////////////////

// Create a function that'll initialize the application and return the user input to the HTML
function findWeather(resultFromServer) {    
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
    console.log(resultFromServer);
};
    
// Create a separate function for the five-day forecast

// Collect data from the API

///////////////////////////////////

// Create HTML elements to store the data and display to front-end
function previousSearches(userInput) {
    // collect userData from formEntry 

    // Create a <p> or <span> element containing the userData
    let listWrapperEl = document.createElement('li');

    // locationWrapperEl.add("")

    locationWrapperEl = document.createElement('span');

    // append to <li> element
    let locationTextEl = document.createTextNode(userInput);

    // append to wrapperEl 
    locationWrapperEl.appendChild(locationTextEl);

    listWrapperEl.appendChild(locationWrapperEl);

    // append to previousSearches list on HTML
    locationResultEl.appendChild(listWrapperEl);
    
    // if the previousSearch is clicked

    // then re-search for that city

    // if city is already in previous search, do not add

    // if userInput results in 404 from API, do not add input and include error.
}

///////////////////////////////////

// SETUP: Setup LocalStorage and save the previously searched location

// the results from findWeather and fiveDay will be recalled when previously searched location is selected 