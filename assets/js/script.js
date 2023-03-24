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

let previousSearchID = 0;
const searches = [];


///////////////////////////////////

let weatherForecast = function() {

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

// function runs when both formEntry means are engaged
let handleSearch = function(event) {
    event.preventDefault();
    weatherForecast();

    document.getElementById('formID').reset();
};

///////////////////////////////////

let clearHistory = function() {

    let checkWithUser = window.confirm("Confirm that you want to clear this list");

    if (checkWithUser) {
            // set the list back to an empty state
        document.getElementById("locationResult").innerHTML = ("");
    }    
};

///////////////////////////////////

// previousSearch is clicked

    // then re-search for that city

    // if city is already in previous search, do not add

///////////////////////////////////

// Create a function that'll initialize the application and return the user input to the HTML
let findWeather = function(resultFromServer) {    
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

///////////////////////////////////
    
// Create a separate function for the five-day forecast

    // Collect data from the API

///////////////////////////////////

// Commented out for now, will need to add more soon.

// let checkForRepeat = function(userInput) {
//     if (userInput.value === userInput.value) {
//         return;
//     } else {
//         previousSearches(userInput);
//     }
// }

///////////////////////////////////

// Create HTML elements to store the data and display to front-end
let previousSearches = function(userInput) {
    // collect userData from formEntry 

    // Create a <p> or <span> element containing the userData
    let listWrapperEl = document.createElement('li');

    // wrapper and clickable element for textEl
    locationWrapperEl = document.createElement('span');

    // class for locationWrapperEl
    locationWrapperEl.classList.add("listItem");
    locationWrapperEl.classList.add("card");

    // append to <li> element
    let locationTextEl = document.createTextNode(userInput);

    // append to wrapperEl 
    locationWrapperEl.appendChild(locationTextEl);

    listWrapperEl.appendChild(locationWrapperEl);

    // append to previousSearches list on HTML
    locationResultEl.appendChild(listWrapperEl);
}

///////////////////////////////////

// SETUP: Setup LocalStorage and save the previously searched location

    // the results from findWeather and fiveDay will be recalled when previously searched location is selected 

///////////////////////////////////

// Event Listeners


document.getElementById('searchButton').addEventListener('click', handleSearch);

document.getElementById('searchInput').addEventListener('keydown', (event) => { 
    if(event.code === "Enter") {
        handleSearch(event);
    }
});

document.getElementById('clearBtn').addEventListener('click', clearHistory);