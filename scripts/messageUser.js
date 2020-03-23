/*
var firebaseConfig = {
    apiKey: "AIzaSyAzerA-zdbvh-Thp6UYFn5qKbYc2_za72A",
    authDomain: "techmini-e3a2a.firebaseapp.com",
    databaseURL: "https://techmini-e3a2a.firebaseio.com",
    projectId: "techmini-e3a2a",
    storageBucket: "techmini-e3a2a.appspot.com",
    messagingSenderId: "281432190044",
    appId: "1:281432190044:web:ccdc6f459fdb16cbdcca99"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
*/

//-----------------------------------------------------------------------------
/*
let userId = firebase.UserInfo.uid;
let userCollection = db.collection("users").doc(userId);
*/
const month = 
    ["January", "February", 
    "March", "April", 
    "May", "June", 
    "July", "August", 
    "September", "October", 
    "November", "December"];

function sendMessage() {
    let message = document.getElementById("btn-input").value;

    createMessageDiv(message);
}

function createMessageDiv(message) {
    let allMessages = document.getElementById("allMessages");
    let today = new Date();

    let messageDiv = document.createElement("div");
    messageDiv.setAttribute("class", "messageDiv");
    
    let profilePic = document.createElement("img");
    profilePic.setAttribute("class", "profilePic");
    //profilePic.src = "https://via.placeholder.com/100.png/f00";

    let userName = document.createElement("p");
    userName.setAttribute("class", "userName");
    //userName.innerHTML = "Bob";

    let userMessage = document.createElement("p");
    userMessage.setAttribute("class", "userMessage");
    //userMessage.innerHTML = message;

    let sentDate = document.createElement("p");
    sentDate.setAttribute("class", "sentDate");
    sentDate.innerHTML = 
        month[today.getMonth()] + " " 
        + today.getDate() + ", " 
        + today.getFullYear() + ", " 
        + today.getHours() + ":" 
        + today.getMinutes();

    messageDiv.appendChild(profilePic);
    messageDiv.appendChild(userName);
    messageDiv.appendChild(userMessage);
    messageDiv.appendChild(sentDate);
    allMessages.appendChild(messageDiv);
}