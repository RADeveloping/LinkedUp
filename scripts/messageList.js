//======================//
// Global Variables     //
//======================//

let elements = [];

//======================//
// HTML DOM Methods     //
//======================//

function createMessages() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            let numMessages = getNumMessages(user);
        } else {
            alert("You're not logged in!");
        }
    })
}

function createElements() {
    elements[0] = document.createElement("div");
    elements[1] = document.createElement("div");
    elements[2] = document.createElement("img");
    elements[3] = document.createElement("div");
    elements[4] = document.createElement("h2");
    elements[5] = document.createElement("p");
    elements[6] = document.createElement("a");
}

function setAttributes() {
    elements[0].setAttribute("class", "row align-items-center py-1"); 
    elements[1].setAttribute("class", "col-3"); 
    elements[2].setAttribute("class", "img-fluid rounded-circle"); 
    elements[3].setAttribute("class", "col"); 
    elements[4].setAttribute("class", "messageList_user"); 
    elements[5].setAttribute("class", "preview"); 
    elements[6].setAttribute("class", "stretched-link"); 
}

function setValues(user) {
    elements[2].src = user.photoURL;
    elements[4].innerHTML = "Other user's name"
    elements[5].innerHTML = "Preview message."  
}

function appendElements() {
    elements[1].appendChild(elements[2]);
    elements[3].appendChild(elements[4]);
    elements[3].appendChild(elements[5]);
    
    document.getElementsByClassName("container").appendChild(elements[1]);
    document.getElementsByClassName("container").appendChild(elements[3]);
}

//======================//
// Firebase             //
// Cloud Firestore      //
// Functions            //
//======================//

function getNumMessages(user) {
    let numMessages = 0;
    let userRef = db.collection("users").doc(user.id);

    userRef.get().then(function(doc) {
        if ((doc.numMessages) != null) {
            numMessages = doc.numMessages;

            for (let i = 0; i < numMessages; i++) {
                createElements();
                setAttributes();
                setValues(user);
                appendElements();
            }
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

//======================//
// Function Calls       //
//======================//

createMessages();