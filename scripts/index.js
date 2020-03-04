/**

// EVERYONE'S JAVASCRIPT WILL BE IN HERE. NO INTERNAL JS
// PLEASE CREATE FUNCTIONS AND THEN CALL YOUR FUNCTIONS.
// PLEASE TRY TO INCLUDE THE FOLLOWING COMMENT BLOCK FOR EACH FUNCTION 
// TO MAKE CODE READABILITY EASIER FOR EVERYONE

/**
 * @desc opens a modal window to display a message
 * @param string $msg - the message to be displayed
 * @return bool - success or failure
 */

 

//--------------------------------------------------------------------
// JS FOR INDEX.HTML
//--------------------------------------------------------------------
/**
 * @desc adds a event handler to the login button
 */
function addHandlerToLoginButton(){

    let index_login = document.getElementById("index_login").onclick = loginPressed;
}

/**
 * @desc redirects to the login page
 */
function loginPressed(){
    window.location.href = "login.html";
}


// CALL INDEX FUCNTIONS HERE
addHandlerToLoginButton();

