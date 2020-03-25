//----------------------//
// Constants            //
//-----------------------//
const MONTH = 
    ["January", "February", 
    "March", "April", 
    "May", "June", 
    "July", "August", 
    "September", "October", 
    "November", "December"];

//----------------------//
// Global Variables     //
//----------------------//
let elements;
let chatId;

//----------------------//
// Button Event         //
//----------------------//
function sendMessage() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            createMessageDiv();
            setElementAttributes();
            setElementValues(user);
            appendElements();
            updateChats(user);
        } else {
            alert("You're not logged in!");
        }
    }) 
}

//----------------------//
// HTML DOM Methods     //
//----------------------//
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

function setElementValues(user) {
    let userName = user.displayName;
    let userPic = user.photoURL;
    let message = document.getElementById("btn-input").value;
    let today = new Date();

    //----------------------------------------

    elements[0].src = userPic;
    elements[1].innerHTML = userName;
    elements[2].innerHTML = message;
    elements[3].innerHTML = 
        // TODO: When possible, replace this with the timestamp provided by Firestore
        MONTH[today.getMonth()] + " " 
        + today.getDate() + ", " 
        + today.getFullYear() + ", " 
        + today.getHours() + ":" 
        + today.getMinutes();
}

function appendElements() {
    elements[4].appendChild(elements[0]);
    elements[4].appendChild(elements[1]);
    elements[4].appendChild(elements[2]);
    elements[4].appendChild(elements[3]);
    elements[5].appendChild(elements[4]);
}

//----------------------//
// Firebase             //
// Cloud Firestore      //
// Functions            //
//----------------------//
function updateChats(user) {
    let chatRef = db.collection("chats");

    if (chatId == null) {
        let chatIdRef = chatRef.doc();
        chatId = chatIdRef.id;
        
        chatIdRef.set({
            numMessages : 1
        });
        chatIdRef.collection("messages").add({
            from : user.uid,
            message : elements[2].innerHTML,
            time : firebase.firestore.FieldValue.serverTimestamp()
        });
        
        updateUser(user, chatId);
    } else {
        chatRef.doc(chatId).update({
            numMessages : firebase.firestore.FieldValue.increment(1)
        });

        chatRef.doc(chatId).collection("messages").add({
            from : user.uid,
            message : elements[2].innerHTML,
            time : firebase.firestore.FieldValue.serverTimestamp()
        });

        updateUser(user, chatId);
    }    
}

function updateUser(user, chatId) {
    let chatIdRef = db.collection("users").doc(user.uid).collection("chats").doc("chatId");

    chatIdRef.get().then(function(doc) {
        if (doc.exists) {
            chatIdRef.update({
                id : firebase.firestore.FieldValue.arrayUnion(chatId.toString())
            })
        } else {
            chatIdRef.set({
                id : firebase.firestore.FieldValue.arrayUnion(chatId.toString())
            })
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}