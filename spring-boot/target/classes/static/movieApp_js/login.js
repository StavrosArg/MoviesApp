var validInput = false;

$( document ).ready(function() {
  
  // SUBMIT FORM
    $(".login").click(function(event) {
    // Prevent the form from submitting via the browser.
    event.preventDefault();
    ajaxPost();
  });
    
    $(".back").click(function() {
        // Prevent the form from submitting via the browser.
    	window.location.href = "./movieApp.html";
      });
    
    
    function ajaxPost(){
      
      // PREPARE FORM DATA
      let username = document.getElementById("usernametext").value;
      let password = document.getElementById("passwordtext").value;
      
      
      // DO POST
      $.ajax({
      type : "GET",
      contentType : "application/json",
      url : "login?username=" + username + "&password=" + password,
      dataType : 'json',
      success : function(result) {
        if(result.status == "success"){
          console.log("result"+ result);
          window.localStorage.setItem("userId",result.data.id);
          window.location.href = "./movieApp_After_Log_In.html";
        }
        else{
        	$("#message").text("Wrong Credentials");
        }
      },
      error : function(e) {
        console.log("ERROR: ", e);
      }
    });
    }  
})

function pushButtonHome(){
  window.location.href = "./movieApp.html";
}

function checkInput(event) {
  try {
      let regExp = /[a-zA-Z0-9!@#$_.]/;
      if (event) {
          var char = window.event.key;
      } else { return true; }
      if (regExp.test(char) &&
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