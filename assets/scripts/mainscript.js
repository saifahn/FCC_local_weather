var city = "";
var country = "";
var weather = "";
var weatherIcon = "";
var tempC = "";
var weatherID = "";
var celsius = true;
var tempF = "";
var daytime = true;

//if daytime, set daytime to true, from the data from the JSON
function isItDaytime(data) {
  var icon = data.weather[0].icon;
  for (var i = 0, n = icon.length; i < n; i++) {
    if (icon[i] == "d") {
      daytime = true;
    }
    else if (icon[i] == "n") {
      daytime = false;
    }
  }
}

// function to convert between C and F
function convertCF() {
  // if C, convert to F and vice-versa
  if (celsius) {
    tempF = tempC * 1.8 + 32
    celsius = false;
    $("#temperature-display").html(Math.floor(tempF) + " <span id='temperature-degrees'>°F</span>");
  }
  else {
    $("#temperature-display").html(Math.floor(tempC) + " <span id='temperature-degrees'>°C</span>");
    celsius = true;
  }
}

function displayWeatherIconFromFont(target) {
  if (daytime) {
    $(target).html("<i class = 'wi wi-owm-day-" + weatherID + "'></i>");
  }
  else {
    $(target).html("<i class = 'wi wi-owm-night-" + weatherID + "'></i>");
  }
}

function weatherFromData(data) {
  isItDaytime(data);
  weather = data.weather[0].main;
  tempC = data.main.temp;
  weatherIcon = data.weather[0].icon;
  weatherID = data.weather[0].id;
  city = data.name;
  country = data.sys.country;
  $("#weather-location").html(city + ", " + country);
  $("#temperature-display").html(Math.floor(tempC) + " <span id='temperature-degrees'>°C</span>");
  $("#weather-text").html(weather);
  displayWeatherIconFromFont("#weather-icon");
}

// take the user's input and use it as the city for the API call
function urlFromInput(input) {
  return "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&units=metric&appid=223075ec95c322193c0832f092740b48";
}

$(document).ready(function(){
  // on click of the button
      // the IP API, store city and country for lookup
    $.getJSON("https://ipinfo.io", function(data){
      city = data.city;
      country = data.country;
      // make a URL to call the weather API
      var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "," + country + "&units=metric&appid=223075ec95c322193c0832f092740b48";
      $.getJSON(url, function(data) {
        weatherFromData(data);
      });
      // because span is dynamically generated, must bind to the document
      $(document).on('click', '#temperature-degrees', function(){
        convertCF();
      });
      // enter key pressed in input field
      $("#user-city").keyup(function(e) {
        if (e.keyCode == 13) {
          $.getJSON(urlFromInput(document.getElementById("user-city").value), function(data){
            weatherFromData(data);
            document.getElementById("user-city").value = "";
            console.log(data);
          });
        }
      });
    });
});
