// Fetch API key for weather data
const appID = '98c449ac6da7543bd710d0a40481466f';

// DOM element references for current weather data display 
const units = 'imperial';
const currentConditionEl = document.getElementById('currentCondition');
const currentTempEl = document.getElementById('currentTemp');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('windSpeed');
const cityNameEl = document.getElementById('cityName');
const currentWeatherPNG = document.getElementById('currentWeatherPNG');
const locationResultEl = document.getElementById('locationResult');

// DOM Element references for search functionality 
const searchInputEl = document.getElementById('searchInput');
const fiveDayBodyEl = document.getElementById('fiveDayBody');
const notifyUserEl = document.getElementById('notifyUser');

// Variables tracking search history 
let previousSearchID = 0;
const searchArr = [];

// Notification visibility functions 
let timeoutId;

// collect weather data 
const weatherForecast = function(searchInput, prevCity) {

    userInput = searchInput || prevCity;

    // if userInput is true, proceed to API
    if (userInput) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${userInput}&APPID=${appID}&units=${units}`)

        .then(result => {
        return result.json();
        })
        .then(result => {
            if (result.error) {
                window.alert('Something went wrong!');
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
            window.alert('Please enter a valid city name!');

            // user notification
            notifyUserEl.textContent = 'Something went wrong!';
            notifyUserEl.style.color = 'var(--red)';
            showElement();
        });
    }
};
    
// Fetch location data from geocode API 
const geocodeLocation = function(userInput) {
    
    // Encode userInput for the URL search
    const encodedInput = encodeURIComponent(userInput);

    // Construct URL for geocode API search
    const encodedSearch = `https://api.openweathermap.org/geo/1.0/direct?q=${encodedInput}&appid=${appID}`;

    // fetch from geoCode API 
    return fetch(encodedSearch)
        .then(response => {
            if(!response.ok) {
                // Throw error if location data fetch fails
                throw new Error('Something went wrong fetching location data!');
            }
            // parsing JSON response
            return response.json() 
        })
        .catch(error => {
            // Log an error if there's an issue with fetching API data 
            console.error('Error fetching API Data:', error);
        });
};

// Function to fetch and display 5-Day weather forecast for a given location
const fiveDay = function(userInput) {

    // clear existing content when called
    fiveDayBodyEl.innerHTML = '';

    // Fetch latitude and longitude from geocodeLocation API
    geocodeLocation(userInput) 
        .then (weatherData => {

            // Using object destructuring to extract lat and lon from weatherDatae
            const { lat, lon } = weatherData[0]

            // Construct URL for 5-Day forecast API with lat, lon, units, and appID
            const fiveForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${appID}`;

            // Fetch data from 5-Day forecast API
            fetch(fiveForecast)
            .then(response => {
                return response.json();
            })
            .then(data => {
                // Loop through the fetched data and create forecast cards
                for (let i = 1; i < 6; i++) {
                    
                    let { dt, main, weather, wind } = data.list[i];

                    // div wrapper for content
                    let fiveStyleDiv = document.createElement('div');
                    fiveStyleDiv.classList.add('fiveDayStyle', 'border', 'card', 'text-white', 'cardColor', 'mb-3');
            
                    // card header 
                    let fiveHeaderEl = document.createElement('h5');
                    fiveHeaderEl.classList.add('card-header', 'text-center');
                    
                    // convert unix to miliseconds and create new Date object and increment date
                    let dateFormat = new Date(dt * 1000);
                    let date = new Date(dateFormat.setDate(dateFormat.getDate() + i));
                    let dateString = date.toLocaleDateString();
                    
                    // Add the date 
                    fiveHeaderEl.textContent = dateString;
            
                    // card body
                    let fiveBodyEl = document.createElement('div');
                    fiveBodyEl.classList.add('card-body');
                     
                    // weather img
                    let fiveDayImg = document.createElement('img');
                    fiveDayImg.id = 'fiveWeatherPNG';
                    fiveDayImg.src = `http://openweathermap.org/img/w/${weather[0].icon}.png`;
                    fiveDayImg.classList.add('fiveBody', 'weatherImgShadow');

                    // temp
                    let fiveTempEl = document.createElement('p');
                    fiveTempEl.classList.add('card-text', 'fiveBody');
                    fiveTempEl.textContent = 'Temp: ' + Math.floor(main.temp) + '°F';
            
                    // humidity
                    let fiveHumidEl = document.createElement('p');
                    fiveHumidEl.classList.add('card-text', 'fiveBody');
                    fiveHumidEl.textContent = 'Humidity: ' + main.humidity + '%'; 
            
                    // wind 
                    let fiveWindEl = document.createElement('p');
                    fiveWindEl.classList.add('card-text', 'fiveBody');
                    fiveWindEl.textContent = 'Wind: ' + Math.floor(wind.speed) + ' MPH';
            
                    // Append temp, humidity, wind to fiveBodyEl
                    fiveBodyEl.append(fiveDayImg, fiveTempEl, fiveHumidEl, fiveWindEl);
            
                    // Append card header & body to fiveStyleDiv
                    fiveStyleDiv.append(fiveHeaderEl, fiveBodyEl);     
                    
                    // Append fiveStyleDiv to fiveDayBody
                    fiveDayBody.append(fiveStyleDiv);
                }
            })
            .catch(error => {
                console.log('Error fetching data:', error);
            });
        })
}

// Notification visibility functions 
let showElement = function() {
    // cancel previous timeout
    clearTimeout(timeoutId);
    notifyUserEl.style.display = 'block';
    timeoutId = setTimeout(hideElement, 3000);
};

let hideElement = function() {
    notifyUserEl.style.display='none';
};

// Function runs when both formEntry means are engaged
let handleSearch = function(event) {
    event.preventDefault();
    
    // if searchInputEl is empty, remind user to type something
    if(searchInputEl.value === '') {
        window.alert('Fill out the searchbar!')
    } else {

        let searchInput = searchInputEl.value;

        // invoke weatherForecast
        weatherForecast(searchInput);

        // reset form
        document.getElementById('formID').reset();
    }
};

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

// Create HTML elements to store the data and display to front-end
let previousSearches = function(userInput) {

    // using some() method, see if userInput already exists within array
    let cityExists = searchArr.some(city => city.text === userInput);

    // if true, return with no addition to list
    if (cityExists) {
        return; 
    }

    // Object that collects text and id, to be stored in searchArr
    let cityObj = {
        text: userInput,
        id: previousSearchID
    };

    // Create <li> element to hold search results
    let listWrapperEl = document.createElement('li');
    listWrapperEl.id = 'cityID ' + previousSearchID;

    // Create <span> element to display search result
    let locationWrapperEl = document.createElement('span');
    locationWrapperEl.classList.add('listItem', 'card');

    // Create text node with search result text 
    let locationTextEl = document.createTextNode(cityObj.text);

    // Append text node to <span> element
    locationWrapperEl.appendChild(locationTextEl);

    // Append <span> element to <li> element 
    listWrapperEl.appendChild(locationWrapperEl);

    // Append <li> element to the previousSearches list on HTML
    locationResultEl.appendChild(listWrapperEl);
    
    // Add the cityObj to the searchArr
    searchArr.push(cityObj);

    // Increment previousSearchID for next search
    previousSearchID++;

    let prevCitySpan = document.getElementById(`cityID ${cityObj.id}`);

    // Add click event listener to search result element
    prevCitySpan.addEventListener('click', function() {
        let prevCity = cityObj.text;
        weatherForecast(prevCity);
    });

    // save information to localStorage
    saveCity(cityObj);
}

// save content within searchArr to previousSearch and into localStorage
let saveCity = function() {
    localStorage.setItem('previousSearch', JSON.stringify(searchArr));
}

// Re-create every HTML element saved to previousSearch
let loadCityList = function() {
    let savedData = localStorage.getItem('previousSearch');

    if(!savedData) {
        return false;
    } else {
        console.log('Saved data found');
        savedData = JSON.parse(savedData);
        // run previousSearches to recreate every item
        for (let i = 0; i < savedData.length; i++) {
            previousSearches(savedData[i].text);
        }
    }
}

// Function clears 'Previous Searches' when 'clearBtn' is clicked 
let clearHistory = function() {
    let checkWithUser = window.confirm('Confirm that you want to clear this list');

    if (checkWithUser) {
        // set the list back to an empty state
        locationResultEl.innerHTML = ('');

        // clear localStorage
        localStorage.clear();
        localStorage.removeItem('previousSearch');

        // clear localStorage array
        previousSearch = [];
        
        // user notification
        notifyUserEl.textContent = 'Search history deleted!';
        notifyUserEl.style.color = 'var(--red)';
        showElement();
    }    
};

// Event Listeners
document.getElementById('searchButton').addEventListener('click', handleSearch);
searchInputEl.addEventListener('keydown', (event) => { 
if(event.code === 'Enter') {
        handleSearch(event);
    }
});
document.getElementById('clearBtn').addEventListener('click', clearHistory);

loadCityList();