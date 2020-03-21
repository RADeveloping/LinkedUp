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

//-----------------------------------------------------------------------------

let userId = firebase.UserInfo.uid;
let userCollection = db.collection("users").doc(userId);

function sendMessage() {
    let message = document.getElementById("btn-chat").value;

    createMessageDiv();
}

function createMessageDiv() {
    let allMessages = document.getElementById("allMessage");

    let messageDiv = document.createElement("div");
    messageDiv.setAttribute("class", "messageDiv");
    
    let profilePic = document.createElement("img");
    profilePic.setAttribute("class", "profilePic");

    let userName = document.createElement("p");
    userName.setAttribute("class", "userName");

    let userMessage = document.createElement("p");
    userMessage.setAttribute("class", "userMessage");

    let sentDate = document.createElement("p");
    sentDate.setAttribute("class", "sentDate");

    messageDiv.appendChild(profilePic, userName, userMessage, sentDate);
    allMessages.appendChild(messageDiv);
}