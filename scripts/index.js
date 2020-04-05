/**
 * @desc adds a event handler to the login button
 */
function addHandlerToLoginButton() {
    document.getElementById("index_login").onclick = loginPressed;
}

/**
 * @desc redirects to the login page
 */
function loginPressed() {
    window.location.href = "login.html";
}

addHandlerToLoginButton();