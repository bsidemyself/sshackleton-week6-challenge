// fucntion for search button listener and create search value
$(document).ready(function () {
    $("#search-button").on("click", function () {
      var citySearch = $("#search-value").val();
      $("#search-value").val("");
      weatherCurrent(citySearch);
      weatherForecast(citySearch);
    });
  
    //get history of searched cities
    var history = JSON.parse(localStorage.getItem("history")) || [];

    if (history.length > 0) {
      weatherCurrent(history[history.length - 1]);
    }
    //create a new row for history searches
    for (var i = 0; i < history.length; i++) {
      createRow(history[i]);
    }
  
    //creates list item of searched cities 
    function createRow(text) {
      var listItem = $("<li>").addClass("list-group-item").text(text);
      $(".history").append(listItem);
    }
  
    //listener to get weather for previously searched cities
    $(".history").on("click", "li", function () {
      weatherCurrent($(this).text());
      weatherForecast($(this).text());
    });
  
    function weatherCurrent(citySearch) {
      //fetching to open weather with an api key
      $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=7a197888d1e5a92be3e2fbc35e1b5540",
  
  
      }).then(function (data) {
        //if index of search value does not exist, sets searched city as history
        if (history.indexOf(citySearch) === -1) {
          history.push(citySearch);
          localStorage.setItem("history", JSON.stringify(history));
          createRow(citySearch);
        }
        // clears out old search result
        $("#today").empty();
  
        var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
  
  
        var card = $("<div>").addClass("card");
        var cardBody = $("<div>").addClass("card-body");
        var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
        var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + " %");
        var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " K");
        console.log(data)
  
        // merge and add stats
        title.append(img);
        cardBody.append(title, temp, humid, wind);
        card.append(cardBody);
        $("#today").append(card);
        console.log(data);
      });
    }
   
    function weatherForecast(citySearch) {
      $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&appid=7a197888d1e5a92be3e2fbc35e1b5540&units=imperial",
  
      }).then(function (data) {
        console.log(data);
        $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");
  
        //loop to create a new card for 5 days and get image icons
        for (var i = 0; i < data.list.length; i++) {
  
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
  
            var titleFive = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
            var imgFive = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
            var colFive = $("<div>").addClass("col-md-2.5");
            var cardFive = $("<div>").addClass("card bg-primary text-white");
            var cardBodyFive = $("<div>").addClass("card-body p-2");
            var humidFive = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
            var tempFive = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " °F");
  
            //merge together all weather variables
            colFive.append(cardFive.append(cardBodyFive.append(titleFive, imgFive, tempFive, humidFive)));
            //add five day to the new row
            $("#forecast .row").append(colFive);
          }
        }
      });
    }
  
  });