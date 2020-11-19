// Start off by setting our global variables
// Try to add an event listener that'll gather details from the user input
// From there we'll try to fetch an API & it's object via fetch 
// Then try to dynamically create a card that'll present the user with obtained data

var searchBarEl = document.querySelector("#searchBar");
var searchCityEl = document.querySelector("#searchCity");
var searchBtnEl = document.querySelector("#searchButton").value;
var locationEl = document.querySelector("#locationResult");
var weatherDisplayEl = document.querySelector("#weatherDisplay");
const APIkey = '55b80c71193a286e4403adee39a3f1d3'; // Should make it easier to plug into the code

// Currently hardcoded, needs to adjusted to allow user input to determine where to search
// Try a function using an onclick event for searchBtnEl. Link below may help
// api.openweathermap.org/data/2.5/weather?q={city name}&appid=55b80c71193a286e4403adee39a3f1d3 

$.getJSON("http://api.openweathermap.org/data/2.5/weather?q=Reno&units=imperial&appid=" + APIkey, function(data) {
    
    console.log(data);

    // Get data found in main
    var weather = "Weather Condition: " + data.weather[0].main;
    var temp = "Temperature: " + "°" + data.main.temp;
    var humid = "Humidity: " + data.main.humidity + "%";

    // Then append data to html
    $("#temp").append(temp);
    $("#weather").append(weather);
    $("#humid").append(humid);
});
