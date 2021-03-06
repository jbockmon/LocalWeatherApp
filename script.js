var date, sunrise, sunset;
var weatherData;
var units = "imp";


$(document).ready(function(){
    getData();

    
    $("#infoWrapper").click(function() {
        convertTemp();
    });

});

function getData() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            $.getJSON("https://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&appid=f0dff5a92e27f8e2c49b5fa24a3a719b&units=imperial",gotWeatherData);    
            $.getJSON("https://api.openweathermap.org/data/2.5/forecast?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&appid=f0dff5a92e27f8e2c49b5fa24a3a719b&units=imperial",gotForecastData);    

        })
    } else {
        console.log("boop")
        $("body").css('visibility', 'visible');
        $("body").html("Geolocation not available.");
    }
};

function gotWeatherData(data) {
    weatherData = data;
    date = new Date(); 
    sunrise = new Date(data.sys.sunrise * 1000);
    sunset = new Date(data.sys.sunset * 1000);

    $("#cityName").html(data.name);
    $("#temperature").html(parseInt(data.main.temp) + "°F");
    $("#highTemp").html(parseInt(data.main.temp_max));
    $("#lowTemp").html(parseInt(data.main.temp_min));
    $("#data").html(data.weather[0].main);
    $("#data").append("<br><img src=https://openweathermap.org/img/w/" + weatherData.weather[0].icon + ".png></img>" );
    $("#updateTime").html("<br>Last updated: " + date.toLocaleTimeString());
    $("#humidityDiv").append(data.main.humidity + "%");
    $("#pressureDiv").append(data.main.pressure + " mb");
    $("#coordsDiv").append("lat: " + data.coord.lat + "<br>" + "lon: " + data.coord.lon);
    $("#sunDiv").append(sunrise.toLocaleTimeString() + "<br>" + sunset.toLocaleTimeString());
    $("#windDiv").append(+ data.wind.speed + " mph <br>" + convertWindDir(data.wind.deg)  );

    setBackground();
    $("body").css('visibility', 'visible');
}

function gotForecastData(data) {
    console.log(data);
}


function setBackground() {

    var imageString = "images/";
    //day picture selection
    if(isDay()) {
        //rainy during daytime
        if( isRaining() ){
            imageString = imageString.concat("rainy_day.jpg");


        //freezing during daytime
        } else if( isFreezing() ){
            imageString = imageString.concat("cold_day.jpg");

        // clear day over freezing
        } else {
            imageString = imageString.concat("sunny_day.jpg")

        }

    //Night picture selection
    } else {
        
        //rainy night
        if( isRaining() ){
            imageString = imageString.concat("rainy_night.jpg");
        //freezing night
        } else if( isFreezing() ) {
            imageString = imageString.concat("cold_clear_night.jpg");

        //clear night over freezing
        } else {
            imageString = imageString.concat("warm_clear_night.jpg");

        }
    }

   $('body').css('background-image', 'url(' + imageString + ')');   
}

function isDay() {
    if( (date.getTime()/1000 > weatherData.sys.sunrise) && ((date.getTime()/1000) < weatherData.sys.sunset) ) {
        return true;
    } else {
        //night mode for dark backgrounds
        $('#updateTime').css('color', 'white');
        $('#infoWrapper').css('background', 'rgba(255, 255, 255, 0.05)');
        return false;
    } 
}

function isFreezing() {

    if (weatherData.main.temp < 32)
        return true;
    else return false;
}

function isRaining() {
    var weatherCondition;

    weatherCondition = weatherData.weather[0].main;
    weatherCondition = weatherCondition.toLowerCase();

    if( (weatherCondition.search("rain") == -1) && (weatherCondition.search("storm") == -1) )
        return false;
    else return true;

}


function convertTemp() {
    if( units == "imp"){
        units = "met";
        $("#temperature").html(parseInt((weatherData.main.temp - 32) * 5/9) + "°C");
        $("#highTemp").html(parseInt((weatherData.main.temp_max -32) * 5/9));
        $("#lowTemp").html(parseInt((weatherData.main.temp_min -32) * 5/9));
    } else {
        units = "imp";
        $("#temperature").html(parseInt(weatherData.main.temp) + "°F");
        $("#highTemp").html(parseInt(weatherData.main.temp_max));
        $("#lowTemp").html(parseInt(weatherData.main.temp_min));
    }
}

function convertWindDir(direction) {
    // indexed table of directions with 16 directions
    var windDir = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", 
        "W", "WNW", "NW", "NNW", "N"];

    // ensure degrees are <= 360
    direction = direction % 360;

    // 16 directions over 360 degrees = 22.5 degrees per direction
    var arrIndex = ~~(direction / 22.5);
    return windDir[arrIndex];
}








   

