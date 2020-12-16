var moviesList = [];
var favMoviesList = [];
var postersList = [];
var pages = 0;
var currentPage = 1;
var validInput = false;
var userId = window.localStorage.getItem("userId");
var searchList = [];

$(document).ready(function() {
    initializeForm();
    retrieveFavoriteMovies();
    $('#search').keyup(delay(function(event) {
        currentPage = 1;
        initializeForm();
        if(favMoviesList.length > 0){
        	searchFavoriteMovies();
        }
    }, 500));
});

function initializeForm() {
    for (let i = 1; i <= 10; i++) {
        $("#movieBox" + i).hide();
    }
    $(".movieDetails").hide();
    $(".paging").hide();
    $(".favorite").show();
}

function searchFavoriteMovies(){
	let movieTitle = $('#search').val();
	$.ajax({
        type : "GET",
        contentType : "application/json",
        url : "/searchMovies?movieTitle=" + movieTitle, 
        dataType : 'json',
        success : function(result) {
          if(result.status == "success"){
            console.log("result"+ result);
            searchList = result.data;

            retrieveSearchedMovies();
          }
        },
        error : function(e) {
          console.log("ERROR: ", e);
        }
      });
}

function retrieveSearchedMovies(){
	
	if (validInput) {
        var movieTitle = document.getElementById("search").value.replace(/\s/g, "+").toLowerCase();
        var elements = $(".movies");
        if (movieTitle.length <= 2) {
            retrieveFavoriteMovies();
        } else {
            calculatePageNumber(searchList.length);
            initializePaging();
            let count = 1;
            let elementId = "";
            moviesList = [];
            postersList = [];
            for (let i = 0; i < 10 && i < searchList.length; i++) {
                elementId = "movieBox" + count;
                count++;
                retrieveOneMovie(searchList[i], i);
                elements.show();
                $("#" + elementId).show();   
            }               
        }           
    }    
}

function retrieveOneMovie(movieId, index) {
    var request = new XMLHttpRequest();
    let plot = "&plot=full";
    var apikey = "&apikey=826655e3";
    var url = 'http://www.omdbapi.com/?i=' + movieId + plot + apikey;
    index++;
    request.open('GET', url, true);
    request.onload = function() {
        var data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) {
            moviesList[index - 1] = data;
            id = data.imdbID;
            title = data.Title;
            let movieBoxID = "#movieBox" + index;
            let imageSrc = $(movieBoxID).children(".img").attr('src');

            displayPoster(data.Poster, index);

            if (data.Title.length <= 30)
                $(movieBoxID).children(".title").text(data.Title);
            else
                $(movieBoxID).children(".title").text(data.Title.substring(0, 28) + "..");

            if (data.Plot.length <= 100)
                $(movieBoxID).children(".description").text(data.Plot);
            else
                $(movieBoxID).children(".description").text(data.Plot.substring(0, 98) + "..");

            if (data.Genre.length <= 35)
                $(movieBoxID).children(".genre").text(data.Genre);
            else
                $(movieBoxID).children(".genre").text(data.Genre.substring(0, 33) + "..");

            $(movieBoxID).children(".year").text(data.Year);
            $(movieBoxID).children(".duration").text(data.Runtime);


        } else {
            console.log('error parsing response');
        }
    }
    request.send();
}

function retrieveInitialMovies() {
    if(favMoviesList.length > 0){
        calculatePageNumber(favMoviesList.length);
        initializePaging();
        $(".movies").show();
        for(let i = 0; i < 10 && i < favMoviesList.length; i++){
        	
            let elementid = i + 1;
            $("#movieBox" + elementid).show();
            retrieveOneMovie(favMoviesList[i], i);
        }
    }
}

function retrieveMoreMovies() {
	initializeForm();
    calculatePageNumber(favMoviesList.length);
    initializePaging();
	moviesList = [];
    postersList = [];
    let minCounter = (currentPage - 1)*10;
    let maxCounter = (currentPage < pages || favMoviesList.length%10 == 0) 
                    ? 10
                    : favMoviesList.length%10;
    let index = minCounter;
    for(let i = 0; i < maxCounter; i++){
        
        let elementid = i + 1;
        $("#movieBox" + elementid).show();
        retrieveOneMovie(favMoviesList[index], i);
        index++;
    } 
}

function retrieveFavoriteMovies(){
    $.ajax({
        type : "GET",
        contentType : "application/json",
        url : "/favoriteMovies?userId=" + userId, 
        dataType : 'json',
        success : function(result) {
          if(result.status == "success"){
            console.log("result"+ result);
            favMoviesList = result.data;
            retrieveInitialMovies();
          }
        },
        error : function(e) {
          console.log("ERROR: ", e);
        }
      });
}

function displayPoster(poster, index) {
    if (index > 0) {
        let imageId = "movie" + index;

        if (poster == "N/A") {
            poster = "./movieApp_images/posterNotFound.jpg";
        }
        document.getElementById(imageId).src = poster;
        postersList[index - 1] = poster;
    }
}

function pushButtonMore() {
    let movieNumber = parseInt(window.event.currentTarget.parentNode.id.replace("movieBox","")) - 1;
    
    $(".movieDetails").show();
    $(".movies").hide();
    $(".paging").hide();
    $(".details").children(".detailedTitle").text(moviesList[movieNumber].Title);
    $(".details").children(".detailedDuration").text(moviesList[movieNumber].Runtime);
    $(".details").children(".detailedYear").text(moviesList[movieNumber].Released + " | ");
    $(".details").children(".detailedGenre").text(moviesList[movieNumber].Genre + " | ");
    $(".details").children(".detailedDescription").text(moviesList[movieNumber].Plot);
    $(".details").children(".detailedWriter").text("Writer(s): " + moviesList[movieNumber].Writer);
    $(".details").children(".detailedDirector").text("Director(s): " + moviesList[movieNumber].Director);
    $(".details").children(".detailedActors").text("Stars: " + moviesList[movieNumber].Actors);
    if(moviesList[movieNumber].Awards != "N/A"){
        $(".details").children(".detailedAwards").text(moviesList[movieNumber].Awards);
        $(".details").children(".detailedAwards").show();
    }else
        $(".details").children(".detailedAwards").hide();
    $(".details").children(".detailedRating").text("Rating: " + moviesList[movieNumber].imdbRating + "/10 (" + moviesList[movieNumber].imdbVotes + ")");
    $(".moviePosterDetail").children(".detailedImg").attr("src", postersList[movieNumber]);
}

function delay(callback, ms) {
    var timer = 0;
    return function() {
        var context = this,
            args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
            callback.apply(context, args);
        }, ms || 0);
    };
}

function initializePaging(){
    $(".paging").show();
    let el = $("#pagingDetails");
    let paging = "Page " + currentPage + " of " + pages;
    el.text(paging);
    $("#buttonNext").prop('disabled', currentPage == pages);
    $("#buttonPrevious").prop('disabled', currentPage == 1);
    $("#buttonFirst").prop('disabled', currentPage == 1);
    $("#buttonLast").prop('disabled', currentPage == pages);
}

function calculatePageNumber(responseNumber) {
    pages = responseNumber % 10 == 0 ?
        parseInt(responseNumber / 10) :
        parseInt(responseNumber / 10) + 1;
    if (pages > 0) {
        $(".paging").show();
    }
}

function pushButtonNext() {
    let nextPage = currentPage + 1;
    if (nextPage <= pages) {
        var movieTitle = document.getElementById("search").value.replace(/\s/g, "+").toLowerCase();
        if (validInput && movieTitle.length > 2) {
            favMoviesList = searchList;
        }
        currentPage++;
        retrieveMoreMovies();
    }
}

function pushButtonPrevious() {
    let previousPage = currentPage - 1;
    if (previousPage >= 1) {
        currentPage--;
        retrieveMoreMovies();
    }
}

function pushButtonLast() {
    if (currentPage != pages) {
        currentPage = pages;
    	retrieveMoreMovies();
    }
}

function pushButtonFirst() {
    if (currentPage != 1) {
        currentPage = 1;
        retrieveMoreMovies()
    }
}

function pushButtonReturn(){
    $(".movieDetails").hide();
    $(".movies").show();
    if(pages != 0)
    $(".paging").show();
}

function pushButtonLogOut(){
    window.location.href = "./movieApp.html";
}

function pushButtonProfile(){
    window.location.href = "./myProfile.html";
}

function pushButtonHome(){
    window.location.href = "./movieApp_After_Log_In.html";
}

function pushButtonFavorites(){
    window.location.href = "./movieApp_Favorites.html";
}

function removeFromFavorites(){
    let id = window.event.currentTarget.parentNode.id;
    let movieId = moviesList[id.replace("movieBox","") - 1].imdbID
    let deleteFromSearchList = false;
    if($('#search').val().length > 2){
        deleteFromSearchList = true;
        searchList.splice(searchList.findIndex(id => id == movieId),1);
        if(searchList.length%10 == 0 && searchList.length > 0){
            currentPage--;
        }
        retrieveMoreMovies();
    }
    
    let movieObj = {
            userId: userId,
            movieId: movieId
    }

    $.ajax({
        type : "DELETE",
        contentType : "application/json",
        url : "/favoriteMovies", 
        dataType : 'json',
        data: JSON.stringify(movieObj),
        success : function(result) {
        if(result.status == "success"){
            console.log("Movie successfully removed");
            console.log("result"+ result);
            if(!deleteFromSearchList){
                favMoviesList = result.data;
                if(currentPage > 1 && favMoviesList.length%10 == 0){
                    currentPage--;
                }
                initializeForm();
                retrieveMoreMovies();
            }
        }
        },
        error : function(e) {
        console.log("ERROR: ", e);
        }
    });
    
    
}

function onlyAlphabets(event) {
    try {
        let regExp = /[a-zA-Z0-9 ]/;
        if (event) {
            var char = window.event.key;
        } else { return true; }
        if (regExp.test(char) &&
            event.keyCode != 9 &&
            event.keyCode != 13 &&
            event.keyCode != 16 &&
            event.keyCode != 17 &&
            event.keyCode != 18 &&
            event.keyCode != 20 &&
            event.keyCode != 27 &&
            event.keyCode != 37 &&
            event.keyCode != 38 &&
            event.keyCode != 39 &&
            event.keyCode != 40) {
            validInput = true;
            return true;
        } else {
            validInput = false;
            return false;
        }
    } catch (err) {
        alert(err.Description);
    }
}