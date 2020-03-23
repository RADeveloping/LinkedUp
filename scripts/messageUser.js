// Constants
const MONTH = 
    ["January", "February", 
    "March", "April", 
    "May", "June", 
    "July", "August", 
    "September", "October", 
    "November", "December"];

// Global Variables
let elements;

function sendMessage() {
    debugger;
    createMessageDiv();
    setElementAttributes();
    setElementValues();
    appendElements();
}

function createMessageDiv() {
    elements = [
        document.createElement("img"),
        document.createElement("p"),
        document.createElement("p"),
        document.createElement("p"),
        document.createElement("div"),
        document.getElementById("allMessages")
    ]
}

function setElementAttributes() {
    elements[0].setAttribute("class", "profilePic");
    elements[1].setAttribute("class", "userName");
    elements[2].setAttribute("class", "userMessage");
    elements[3].setAttribute("class", "sentDate")
    elements[4].setAttribute("class", "messageDiv");
}

function setElementValues() {
    let user = firebase.auth().currentUser;

    if (user != null) {
        let userName = user.displayName;
        let userPic = user.photoURL;
        let message = document.getElementById("btn-input").value;
        let today = new Date();

        //----------------------------------------

        elements[0].src = userPic;
        elements[1].innerHTML = userName;
        elements[2].innerHTML = message;
        elements[3].innerHTML = 
            MONTH[today.getMonth()] + " " 
            + today.getDate() + ", " 
            + today.getFullYear() + ", " 
            + today.getHours() + ":" 
            + today.getMinutes();
    } else {
        console.log("Not logged in");
    }
}

function appendElements() {
    elements[4].appendChild(elements[0]);
    elements[4].appendChild(elements[1]);
    elements[4].appendChild(elements[2]);
    elements[4].appendChild(elements[3]);
    elements[5].appendChild(elements[4]);
}