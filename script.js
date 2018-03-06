var date;
var weatherData;
var units = "imp";


$(document).ready(function(){
    date = new Date();
    getData();

    
    $("#infoWrapper").click(function() {
        convertTemp();
    });

});

function getData() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            $.getJSON("https://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&appid=f0dff5a92e27f8e2c49b5fa24a3a719b&units=imperial",gotData);    
    })
    } else {
        console.log("Geolocation not available.")
    }
};

function gotData(data) {
    weatherData = data;
console.log(data);
    $("#cityName").html(data.name);
    $("#temperature").html(parseInt(data.main.temp) + "°F");
    $("#highTemp").html(parseInt(data.main.temp_max));
    $("#lowTemp").html(parseInt(data.main.temp_min));
    $("#data").html(data.weather[0].main);
    $("#data").append("<br><img src=https://openweathermap.org/img/w/" + weatherData.weather[0].icon + ".png></img>" );
    $("#updateTime").html("<br>Last updated: " + lastUpdated());

    setBackground();
    $("body").css('visibility', 'visible');
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
    
    $('.container').css('background', 'url(' + imageString + ') no-repeat');
    $('.container').css('background-size', 'cover');
}

function isDay() {
    if( (date.getTime() > weatherData.sys.sunrise) && ((date.getTime()/1000) < weatherData.sys.sunset) ) {
        return true;
    } else return false;
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

function lastUpdated() {
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var formattedTime = hours + ':' + minutes.substr(-2);

    return (formattedTime);
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








   

