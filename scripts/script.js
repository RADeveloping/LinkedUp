//--------------------------------------------------------------------
// JS FOR INDEX.HTML
//--------------------------------------------------------------------
/**
 * @desc adds a event handler to the login button
 */
function addHandlerToLoginButton() {

    let index_login = document.getElementById("index_login").onclick = loginPressed;
}

/**
 * @desc redirects to the login page
 */
function loginPressed() {
    window.location.href = "login.html";
}

/**
 * @desc adds a event handler to the signup button
 */
function addHandlerToSignUpButton() {

    let index_signup = document.getElementById("index_signup").onclick = signUpPressed;
}

/**
 * @desc redirects to the sign up page
 */
function signUpPressed() {
    window.location.href = "signup.html";
}

// CALL INDEX FUNCTIONS HERE
addHandlerToLoginButton();
addHandlerToSignUpButton();