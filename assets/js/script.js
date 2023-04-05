const appID = '98c449ac6da7543bd710d0a40481466f';

///////////////////////////////////

const units = 'imperial';
const currentConditionEl = document.getElementById('currentCondition');
const currentTempEl = document.getElementById('currentTemp');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('windSpeed');
const cityNameEl = document.getElementById('cityName');
const currentWeatherPNG = document.getElementById('currentWeatherPNG');
const locationResultEl = document.getElementById('locationResult');

///////////////////////////////////

const searchInputEl = document.getElementById('searchInput');
const fiveDayBodyEl = document.getElementById('fiveDayBody');
let notifyUserEl = document.getElementById('notifyUser');

let previousSearchID = 0;
const searchArr = [];


///////////////////////////////////

// collect weather data 
let weatherForecast = function() {

    let userInput = searchInputEl.value;

    // let cityObj = {
    //     text: userInput
    // };

    // if userInput is true, proceed to API
    if (userInput) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${userInput}&APPID=${appID}&units=${units}`)

        .then(result => {
        return result.json();
        })
        .then(result => {
            if (result.error) {
                window.alert("Something went wrong!");
            } else {

                // user notification
                notifyUserEl.textContent = 'Search Successful!';
                notifyUserEl.style.color = 'var(--success)';
                showElement();

                // collect weather results
                findWeather(result); 

                // five day call
                fiveDay(userInput);

                // create new listItem using userInput 
                previousSearches(userInput);
            }
        })
        .catch(error => {
            // if error exists, inform user
            window.alert("Please enter a valid city name!");

            // user notification
            notifyUserEl.textContent = 'Something went wrong!';
            notifyUserEl.style.color = 'var(--red)';
            showElement();
        });
    } 
};
    
///////////////////////////////////

// geocode userInput 
const geocodeLocation = function(userInput) {
    
    // encode userInput for the URL search
    const encodedInput = encodeURIComponent(userInput);

    const encodedSearch = `http://api.openweathermap.org/geo/1.0/direct?q=${encodedInput}&appid=${appID}`

    // view searchInput's JSON response
    // console.log(searchInput);

    // fetch from geoCode API 
    return fetch(encodedSearch)
        .then(response => {
            if(!response.ok) {
                // if something isn't working
                throw new Error('Something went wrong fetching location data!');
            }
            // parsing JSON response
            return response.json() 
        })
        .catch(error => {
            console.error('Error fetching API Data:', error);
        });
};

///////////////////////////////////

// fiveDay forecast
const fiveDay = function(userInput) {

    // clear existing content when called
    fiveDayBodyEl.innerHTML = '';

    // whenever user searches, run geocodeLocation to encode input
    geocodeLocation(userInput) 
        .then (weatherData => {
            // collect the lat and lon from geoCodeAPI
            const lat = weatherData[0].lat;
            const lon = weatherData[0].lon;

            // search for the desired city 
            const fiveForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${appID}`;

            // return JSON response and log it, otherwise state error
            fetch(fiveForecast)
            .then(response => {
                return response.json();
            })
            .then(data => {
                // console.log("Data Received:", data);
                
                for (let i = 1; i < 6; i++) {
                    // const element = array[i];
                    
                    let list = data.list[i];

                    // div wrapper for content
                    let fiveStyleDiv = document.createElement('div');
                    fiveStyleDiv.classList.add('fiveDayStyle', 'border', 'card', 'text-white', 'cardColor', 'mb-3');
            
                    // card header 
                    let fiveHeaderEl = document.createElement('div');
                    fiveHeaderEl.classList.add('card-header');
                    
                    // convert unix to miliseconds and create new Date object and increment date
                    let dateFormat = new Date(list.dt * 1000);
                    let date = new Date(dateFormat.setDate(dateFormat.getDate() + i));
                    let dateString = date.toLocaleDateString();
                    
                    // Add the date 
                    fiveHeaderEl.textContent = dateString;
            
                    // card body
                    let fiveBodyEl = document.createElement('div');
                    fiveBodyEl.classList.add('card-body');
            
                    // card body content 
                    
                    // weather img
                    let fiveDayImg = document.createElement('img');
                    fiveDayImg.id = "fiveWeatherPNG";
                    fiveDayImg.src = `http://openweathermap.org/img/w/${list.weather[0].icon}.png`;
                    fiveDayImg.classList.add('fiveBody');

                    // temp
                    let fiveTempEl = document.createElement('p');
                    fiveTempEl.classList.add('card-text', 'fiveBody');
                    fiveTempEl.textContent = "Temp: " + Math.floor(list.main.temp) + '°F'; // Add The Temp
            
                    // humidity
                    let fiveHumidEl = document.createElement('p');
                    fiveHumidEl.classList.add('card-text', 'fiveBody');
                    fiveHumidEl.textContent = "Humidity: " + list.main.humidity + "%"; // Add the humidity 
            
                    // wind 
                    let fiveWindEl = document.createElement('p');
                    fiveWindEl.classList.add('card-text', 'fiveBody');
                    fiveWindEl.textContent = "Wind: " + Math.floor(list.wind.speed) + " MPH"; // add wind speeds 
            
                    // append temp, humidity, wind to fiveBodyEl
                    fiveBodyEl.append(fiveDayImg, fiveTempEl, fiveHumidEl, fiveWindEl);
            
                    // append card header & body to fiveStyleDiv
                    fiveStyleDiv.append(fiveHeaderEl, fiveBodyEl);     
                    
                    //
                    fiveDayBody.append(fiveStyleDiv);
                }
            })
            .catch(error => {
                console.log("Error fetching data:", error);
            });
        })
}

///////////////////////////////////

// Notification visibility functions 
let showElement = function() {
    notifyUserEl.style.display = 'block';
    setTimeout(hideElement, 3000);
};

let hideElement = function() {
    notifyUserEl.style.display='none';
};

///////////////////////////////////

// function runs when both formEntry means are engaged
let handleSearch = function(event) {
    event.preventDefault();
    
    // if searchInputEl is empty, remind user to type something
    if(searchInputEl.value === "") {
        window.alert("Fill out the searchbar!")
    } else {

        // invoke weatherForecast
        weatherForecast();

        // reset form
        document.getElementById('formID').reset();
    }
};

///////////////////////////////////

let clearHistory = function() {

    let checkWithUser = window.confirm("Confirm that you want to clear this list");

    if (checkWithUser) {
        // set the list back to an empty state
        locationResultEl.innerHTML = ("");

        // user notification
        notifyUserEl.textContent = 'Search history deleted!';
        notifyUserEl.style.color = 'var(--red)';
        showElement();
    }    
};

///////////////////////////////////
// Create a function that'll initialize the application and return the user input to the HTML
let findWeather = function(resultFromServer) {    
    // remove hidden 
    document.getElementById('weatherDetails').classList.remove('hidden');

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

    // cityObj
    let cityObj = {
        text: userInput,
        id: previousSearchID
    };

    // Create a <p> or <span> element containing the userData
    let listWrapperEl = document.createElement('li');
    listWrapperEl.id = "cityID " + previousSearchID;

    // wrapper and clickable element for textEl
    locationWrapperEl = document.createElement('span');

    // class for locationWrapperEl
    locationWrapperEl.classList.add("listItem");
    locationWrapperEl.classList.add("card");

    // append to <li> element
    let locationTextEl = document.createTextNode(cityObj.text);

    // append to wrapperEl 
    locationWrapperEl.appendChild(locationTextEl);

    listWrapperEl.appendChild(locationWrapperEl);

    // append to previousSearches list on HTML
    locationResultEl.appendChild(listWrapperEl);
    
    searchArr.push(cityObj);

    previousSearchID++;

    // check array
    // console.log(searchArr);

    // document.getElementById('searchListID').addEventListener('click', prevCitySearch);
}

///////////////////////////////////

// previousCity is clicked
// let prevCitySearch = function() {

//     console.log(searchListID.value);
//     // then re-search for that city

//     // if city is already in previous search, do not add
// }

///////////////////////////////////

// SETUP: Setup LocalStorage and save the previously searched location

    // the results from findWeather and fiveDay will be recalled when previously searched location is selected 

///////////////////////////////////

// Event Listeners


document.getElementById('searchButton').addEventListener('click', handleSearch);

searchInputEl.addEventListener('keydown', (event) => { 
    if(event.code === "Enter") {
        handleSearch(event);
    }
});

document.getElementById('clearBtn').addEventListener('click', clearHistory);

// document.getElementById('searchListID').addEventListener('click', previousCity);