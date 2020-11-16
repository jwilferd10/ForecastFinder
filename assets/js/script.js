// Start off by setting our global variables
// Try to add an event listener that'll gather details from the user input
// From there we'll try to fetch an API & it's object via fetch 
// Then try to dynamically create a card that'll present the user with obtained data

var searchBarEl = document.querySelector("#searchBar");
var searchCityEl = document.querySelector("#searchCity");
var searchBtnEl = document.querySelector("#searchButton").value;
var locationEl = document.querySelector("#locationResult");
var weatherDisplayEl = document.querySelector("#weatherDisplay")
const APIkey = '55b80c71193a286e4403adee39a3f1d3'; // Should make it easier to plug into the code

// function (searchWeather(searchTerm) {
//     fetch (
//         'http://api.openweathermap.org/data/2.5/forecast?q=' + searchCityEl + "&appid=" + APIkey
//     )
// });

// Notes: &api_key=