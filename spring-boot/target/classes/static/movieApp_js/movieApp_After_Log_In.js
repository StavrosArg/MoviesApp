var moviesList = [];
var favMoviesList = [];
var postersList = [];
var pages = 0;
var currentPage = 1;
var validInput = false;
var userId = window.localStorage.getItem("userId");

$(document).ready(function() {
    initializeForm();
    retrieveFavoriteMovies();
    retrieveInitialMovies();
    
    console.log("userID: " + userId);
    $('#search').keyup(delay(function(event) {
        currentPage = 1;
        initializeForm();
        retrieveMovies(currentPage);
    }, 500));
});

function initializeForm() {
    for (let i = 1; i <= 10; i++) {
        $("#movieBox" + i).hide();
    }
    $(".movieDetails").hide();
    $(".paging").hide();
    $(".notFavorite").show();
    $(".favorite").hide();
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

            checkIfMovieIsFav(movieId, index);
        } else {
            console.log('error parsing response');
        }
    }
    request.send();
}

function retrieveInitialMovies() {
    $("#movieBox1").show();
    retrieveOneMovie("tt1375666", 0);
    $("#movieBox2").show();
    retrieveOneMovie("tt0468569", 1);
    $("#movieBox3").show();
    retrieveOneMovie("tt0110912", 2);
    $("#movieBox4").show();
    retrieveOneMovie("tt0120737", 3);
}

function retrieveMovies(pageNumber) {
    if (validInput) {
        var movieTitle = document.getElementById("search").value.replace(/\s/g, "+").toLowerCase();
        var elements = $(".movies");
        if (movieTitle.length <= 2) {
            elements.hide();
            elements.children(".img").attr('src', '');
            $(".paging").hide();
            $(".movieDetails").hide();
        } else {
            let request = new XMLHttpRequest();
            let apikey = "&apikey=826655e3";
            let type = "&type=movie";
            let page = "&page=" + pageNumber;
            let url = 'http://www.omdbapi.com/?s=' + movieTitle + page + type + apikey;

            request.open('GET', url, true);
            request.onload = function() {
                let data = JSON.parse(this.response);

                if (request.status >= 200 && request.status < 400) {
                    let count = 1;
                    let arr = data.Search;
                    let elementId = "";

                    if (data.Response && arr != undefined && arr != null) {
                        $(".movieDetails").hide();
                        calculatePageNumber(data.totalResults);
                        moviesList = [];
                        postersList = [];
                        for (let i = 0; i < 10; i++) {
                            elementId = "movieBox" + count;
                            if (arr[i] && arr[i].imdbID != undefined && arr[i].Type == "movie") {

                                count++;
                                retrieveOneMovie(arr[i].imdbID, i);
                                elements.show();
                                $("#" + elementId).show();
                            } else {
                                $("#" + elementId).hide();
                                count++;
                            }
                        }
                        $(".paging").show();
                        let el = $("#pagingDetails");
                        let paging = "Page " + currentPage + " of " + pages;
                        el.text(paging);
                        $("#buttonNext").prop('disabled', pageNumber == pages);
                        $("#buttonPrevious").prop('disabled', pageNumber == 1);
                        $("#buttonFirst").prop('disabled', pageNumber == 1);
                        $("#buttonLast").prop('disabled', pageNumber == pages);
                    }
                } else {
                    console.log('error parsing response');
                }
            }
            request.send();
        }
    }
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
          }
        },
        error : function(e) {
          console.log("ERROR: ", e);
        }
      });
}

function checkIfMovieIsFav(id, index){
    if(favMoviesList.length > 0 && favMoviesList.find(movieId => movieId == id)){
        $("#movieBox" + index).children(".favorite").show();
        $("#movieBox" + index).children(".notFavorite").hide();
    }
    else{
        $("#movieBox" + index).children(".favorite").hide();
        $("#movieBox" + index).children(".notFavorite").show();
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
        retrieveMovies(nextPage);
        currentPage++;
    }
}

function pushButtonPrevious() {
    let previousPage = currentPage - 1;
    if (previousPage >= 1) {
        retrieveMovies(previousPage);
        currentPage--;
    }
}

function pushButtonLast() {
    if (currentPage != pages) {
        retrieveMovies(pages);
        currentPage = pages;
    }
}

function pushButtonFirst() {
    if (currentPage != 1) {
        retrieveMovies(1);
        currentPage = 1;
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

function addToFavorites(){
    let id = window.event.currentTarget.parentNode.id;
    let movieObj = {
    		userId: userId,
    		movieId: moviesList[id.replace("movieBox","") - 1].imdbID,
    		movieTitle: moviesList[id.replace("movieBox","") - 1].Title,
    }

    $.ajax({
        type : "POST",
        contentType : "application/json",
        url : "/favoriteMovies", 
        dataType : 'json',
        data: JSON.stringify(movieObj),
        success : function(result) {
          if(result.status == "success"){
            console.log("result"+ result);
            favMoviesList.push(result.movieId);
            $("#" + id).children(".notFavorite").hide();
            $("#" + id).children(".favorite").show();
          }
        },
        error : function(e) {
          console.log("ERROR: ", e);
        }
      });
}

function removeFromFavorites(){
    let id = window.event.currentTarget.parentNode.id;
    let movieObj = {
    		userId: userId,
    		movieId: moviesList[id.replace("movieBox","") - 1].imdbID
    }

    $.ajax({
        type : "DELETE",
        contentType : "application/json",
        url : "/favoriteMovies", 
        dataType : 'json',
        data: JSON.stringify(movieObj),
        success : function(result) {
          if(result.status == "success"){
            console.log("result"+ result);
            favMoviesList = result.data
            $("#" + id).children(".notFavorite").show();
            $("#" + id).children(".favorite").hide();
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