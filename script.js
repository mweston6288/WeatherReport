var APIKey = "bbda06d34b1585cdae406d73ae167e39"
var locations = []
// make call for city weather
function getCityInfo(place){
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q="+place+"&units=Imperial&APPID="+APIKey,
        method: "GET"
    }).then(function(result){
        console.log(result)
        // print date and info
        $(".report").text(place+ " "+ moment().format('MMMM Do YYYY'))
        var image = $("<img>")
        $(image).attr("src", "http://openweathermap.org/img/wn/"+result.weather[0].icon+".png")
        $(".report").append(image)
        // make info sections
        var temp = $("<p>")
        var humidity = $("<p>")
        var wind = $("<p>")
        var uvIndex = $("<p>")

        $(temp).text("Temperature: "+result.main.temp+"\xB0F")
        $(humidity).text("Humidity: "+result.main.humidity+"%")
        $(wind).text("Wind Speed: "+result.wind.speed+" mph")
        $(".report").append(temp)
        $(".report").append(humidity)
        $(".report").append(wind)
        $(".report").append(uvIndex)

        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/uvi?lat="+result.coord.lat+"&lon="+result.coord.lon+"&appid="+APIKey,
            method:"GET"
        }).then(function(response){
            console.log(response)
            $(uvIndex).text("UV Index: "+response.value)
        }).fail(function(){
            $(uvIndex).text("UV Index unavailable")
        })

        // create a button for search history
        var previousSearch = $("#"+place)
        // Delete old instance of a search
        $(previousSearch).remove()
        var cityBtn = $("<button>")
        $(cityBtn).text(place)
        $(cityBtn).attr("class","btn btn-outline-secondary btn-block prevCities") 
        $(cityBtn).attr("id", place)
        $(cityBtn).on("click", function(){
            getCityInfo($(this).text())
        })
        
        var row = $("<div>")
        row.attr("class", "row")
        row.attr("id", place)
        $(row).append(cityBtn)
        $("#searchContainer").prepend(row)        
        // edit search array
        var index = locations.indexOf(place)
        if (index !== -1){
            locations.splice(index, 1)
        }
        locations.push(place)

    localStorage.setItem("pastSearch", JSON.stringify(locations))
})


$.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast/?q="+place+"&units=Imperial&APPID="+APIKey,
    method: "GET"
}).then(function(result){
    var hour = moment().hour()
    hour = Math.floor(hour/3)
    
    for(var i = 0; i < 5; i++){
        var box = $("[data="+i+"]")
        $(box).text(result.list[i*8+hour].dt_txt)
        var image = $("<img>")
        $(image).attr("src", "http://openweathermap.org/img/wn/"+result.list[i*8+hour].weather[0].icon+".png")
        $(box).append(image)

        var temp = $("<p>")
        var humidity = $("<p>")
        $(temp).text("Temperature: "+result.list[i*8+hour].main.temp)
        $(humidity).text("Humidity: "+result.list[i*8+hour].main.humidity)
        $(box).append(temp)
        $(box).append(humidity)
    }
})
}

function restoreHistory(){
    var list = JSON.parse(localStorage.getItem("pastSearch"))
    console.log(list)
    if (list == null)
        return
    $(list).each(function(index, place){
        var cityBtn = $("<button>")
        $(cityBtn).text(place)
        $(cityBtn).attr("class","btn btn-outline-secondary btn-block prevCities") 
        $(cityBtn).attr("id", place)
        $(cityBtn).on("click", function(){
                getCityInfo($(this).text())
            
        })
        var row = $("<div>")
        row.attr("class", "row")
        row.attr("id", place)
        $(row).append(cityBtn)
        $("#searchContainer").prepend(row)
        locations.push(place)
    })
    getCityInfo(list[list.length-1])
}
restoreHistory()

$(".btn-success").on("click", function(){
    var place = $("#search").val()
    if(place.trim()){
        getCityInfo(place)
    }

})
