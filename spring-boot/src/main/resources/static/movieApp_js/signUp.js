validInput = false;

$( document ).ready(function() {
  
  $("#signUpForm").submit(function(event) {
    event.preventDefault();
    if (document.getElementById("passwordField").value != document.getElementById("confirmPasswordField").value){
      $("#message").text("Password must match with Confirm Password!");
    }else{
      ajaxPost();
    }
  });
})

function ajaxPost(){
      
  let username = document.getElementById("usernameField").value;
  let password = document.getElementById("passwordField").value;
  let email = document.getElementById("emailField").value;
  var newUser = {
          email: email,
          username: username,
          password: password
          };
  
  $.ajax({
  type : "POST",
  contentType : "application/json",
  url : "account", 
  dataType : 'json',
  data: JSON.stringify(newUser),
  success : function(result) {
    if(result.status == "success"){
      console.log("result"+ result);
      window.localStorage.setItem("userId",result.data.id);
      window.location.href = "./movieApp_After_Log_In.html"; 
    }
    else if(result.status == "emailExists"){
      $("#message").text("This Email belong to another account");
    }
    else if(result.status == "userExists"){
      $("#message").text("User Already Exists");
    }
    else{
      $("#message").text("Something Went Wrong");
    }
  },
  error : function(e) {
    console.log("ERROR: ", e);
  }
});
}

function pushButtonHome(){
  window.location.href = "./movieApp.html";
}

function checkInput(event){
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
    } else {
        validInput = false;
    }
  } catch (err) {
      alert(err.Description);
  }
}

function checkUsernameInput(event){
  try {
    let regExp = /[a-zA-Z0-9]/;
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
    } else {
        validInput = false;
    }
  } catch (err) {
      alert(err.Description);
  }
}

function checkInputValidity(){
  if(!validInput){
    console.log("invalidInput");
    window.event.currentTarget.setCustomValidity("Invalid field.");
    if(window.event.currentTarget.id == "usernameField")
    $("#message").text("You have entered an invalid username. The valid characters are 'a-z','A-Z' and '0-9'. Please try again.");
    else
    $("#message").text("You have entered an invalid input. The valid characters are 'a-z','A-Z','0-9' and '!@#$_.'. Please try again.");
  }
  else{
    console.log("validInput");
    window.event.currentTarget.setCustomValidity("");
    $("#message").text("");
  }
}
