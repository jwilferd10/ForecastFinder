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
const formWrapperEl = document.getElementById('formWrapper');

// Variables tracking search history 
let previousSearchID = 0;
const searchArr = [];

// Notification visibility functions 
const modalNotifyEl = document.getElementById('modalNotify');
const modalTitleEl = document.getElementById('modalTitle');
const modalTextEl = document.getElementById('modalText');
const closeButtonEl = document.querySelector('#modalNotify .modal-footer .btn-secondary');
const xButtonEl = document.querySelector('#modalNotify .modal-header .close');
const modalActionBtnEl = document.querySelector('#modalActionBtn');
let timeoutId;

// Error Handling 
let errorHandling = (previewError) => {
    console.log('Error fetching the API data:', previewError);
    throw previewError;
}

// Notification visibility functions 
const showElement = () => {
    // cancel previous timeout
    clearTimeout(timeoutId);
    notifyUserEl.style.display = 'block';
    timeoutId = setTimeout(hideElement, 3000);
};

const hideElement = () =>  {
    notifyUserEl.style.display='none';
    formWrapperEl.classList.remove('successAnimation');
    formWrapperEl.classList.remove('blinkRed');
};

// Modal Visibility 
const closeModal = () => {
    modalNotifyEl.classList.remove('show');
    modalNotifyEl.style.display = 'none';
}

// collect main weather data 
const weatherForecast = async (searchInput, prevCity) => {
    try { 
        // consolidate the two arguments to pass onto API link
        const userInput = searchInput || prevCity;
        let searchLink;

        // default format
        const countryFormat = 'us';

        // using regex check if searchInput uses zip code format
        // \d is a shorthand character class that will match any digit character between 0-9
        const zipCodePattern = /^\d+$/;

        if (zipCodePattern.test(userInput)) {
            searchLink = `https://api.openweathermap.org/data/2.5/weather?zip=${userInput},${countryFormat}&APPID=${appID}&units=${units}`;
        } else {
            searchLink = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&APPID=${appID}&units=${units}`;
        }
            
        const response = await fetch(searchLink);
            
        if (!response.ok) {
            throw new Error('Something is wrong, please try again later!')
        }

        const result = await response.json();

        // user notification
        notifyUserEl.textContent = 'Search Successful!';
        notifyUserEl.style.color = 'var(--success)';
        notifyUserEl.classList.add('notifyAnimation');
        formWrapperEl.classList.add('successAnimation');
        showElement();
            
        // Invoke additional functions for weather results and previous searches
        findWeather(result); 
        fiveDay(userInput);
        previousSearches(userInput);

    } catch (error) {
        // Show the modal
        modalNotifyEl.classList.add('show');
        modalNotifyEl.style.display = 'block';
        
        // Set the content inside the modal
        modalTitleEl.textContent = 'Error';
        modalTextEl.textContent = 'Please enter a valid city name!';

        // Action btn within modal
        modalActionBtnEl.classList.add('hidden');
        // user notification
        notifyUserEl.textContent = 'Something went wrong!';
        notifyUserEl.style.color = 'var(--red)';
        notifyUserEl.classList.add('notifyAnimation');
        formWrapperEl.classList.add('blinkRed');
        showElement();
        
        errorHandling(error);
    }
};
    
// Fetch location data from geocode API 
const geocodeLocation = async (userInput) => {
    try {

        // Encode userInput and construct URL for search 
        const encodedInput = encodeURIComponent(userInput);
        const encodedSearch = `https://api.openweathermap.org/geo/1.0/direct?q=${encodedInput}&appid=${appID}`;
        
        // Fetch location data from API 
        const response = await fetch(encodedSearch)

        if(!response.ok) {
            // Throw error if location data fetch fails
            throw new Error('Something went wrong fetching location data!');
        }
        
        // parsing JSON response
        const weatherData = await response.json();

        // return response 
        return weatherData;
    } catch(error) {
        errorHandling(error);
    };
};

// Function to fetch 5-Day weather forecast for a given location
const fetchFiveDay = async (userInput) => {
    try {
        const weatherData = await geocodeLocation(userInput);
        const { lat, lon } = weatherData[0]
        const fiveForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${appID}`;
        const response = await fetch(fiveForecast);
        const data = await response.json();
        return data;

    } catch (error) {
        errorHandling(error);
    }
};

const fiveForecastCards = (data) => {
    // Clear existing content when called
    fiveDayBodyEl.innerHTML = '';

    // Loop through the fetched data and create forecast cards
    for (let i = 1; i < 6; i++) {
                        
        // object destructuring to extract specific data 
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
};

const fiveDay = async (userInput) => {
    try {
        const data = await fetchFiveDay(userInput);
        fiveForecastCards(data);
    } catch (error) {
        errorHandling(error);
    }
};

// Function runs when both formEntry means are engaged
const handleSearch = event => {
    event.preventDefault();
    
    // if searchInputEl is empty, remind user to type something
    if(searchInputEl.value === '') {
        // window.alert('Fill out the searchbar!')

        // Show the modal
        modalNotifyEl.classList.add('show');
        modalNotifyEl.style.display = 'block';
        
        // Set the content inside the modal
        modalTitleEl.textContent = 'Error';
        modalTextEl.textContent = 'Fill out the searchbar!';

        // Action btn within modal
        modalActionBtnEl.classList.add('hidden');
    } else {
        let searchInput = searchInputEl.value;

        // invoke weatherForecast
        weatherForecast(searchInput);

        // reset form
        document.getElementById('formID').reset();
    }
};

// Create a function that'll initialize the application and return the user input to the HTML
const findWeather = resultFromServer => {    
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
const previousSearches = (userInput) => {

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
const saveCity = () => {
    localStorage.setItem('previousSearch', JSON.stringify(searchArr));
}

// Re-create every HTML element saved to previousSearch
const loadCityList = () => {
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

// Function clears 'Previous Searches' when modalActionBtnEl is clicked 
const clearHistory = () => {
    // Set the content inside the modal
    modalTitleEl.textContent = 'Confirm';
    modalTextEl.textContent = 'Click the "Clear History" button again to clear the list';

    // Action btn within modal
    // If the user has invoked other modals, make sure hidden is removed from classList
    if (modalActionBtnEl.classList.contains('hidden')) {
        modalActionBtnEl.classList.remove('hidden');
    }

    modalActionBtnEl.classList.add('btn-outline-danger');
    modalActionBtnEl.textContent = 'Clear History';

    // call deleteProcess
    modalActionBtnEl.addEventListener('click', () => {
        deleteProcess();  
    })

};

// Clear list and localStorage
const deleteProcess = () => {
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
    notifyUserEl.classList.add('notifyAnimation');
    formWrapperEl.classList.add('blinkRed');
    showElement();
}

// Event Listeners
document.getElementById('searchButton').addEventListener('click', handleSearch);
searchInputEl.addEventListener('keydown', async (event) => { 
    if(event.code === 'Enter') {
        handleSearch(event);
    }
});
document.getElementById('clearBtn').addEventListener('click', clearHistory);
closeButtonEl.addEventListener('click', closeModal);
xButtonEl.addEventListener('click', closeModal);

loadCityList();