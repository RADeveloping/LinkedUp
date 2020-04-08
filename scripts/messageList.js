//======================//
// Global Variables     //
//======================//

let elements = [];
let list = [];

//======================//
// HTML DOM Methods     //
//======================//

/**
 * @desc creates the message for the user.
 * @param user the current logged in user.
 */
function createMessages(user) {
    let promises = [];
    let numMessages = 0;
    let docRef = db.collection("users").doc(user.uid).collection("chats").doc("chatId");
    let chatId;

    docRef.onSnapshot(function(doc) {

        if (doc.data()) {
            numMessages = parseInt(doc.data().id.length);
            document.getElementById("noMessages").classList.replace("d-block", "d-none");
        }

        for (let i = 0; i < numMessages; i++) {
            chatId = doc.data().id[i];

            createElements();
            setAttributes(chatId);
            const promiseSetValues = new Promise((resolve, reject) => {
                setValues(user, chatId);
                resolve();
            });
            promises.push(promiseSetValues);
            appendElements();
        }

        Promise.all(promises);
    })
}

/**
 * @desc creates the HTML elements for the chat
 */
function createElements() {
    elements[0] = document.createElement("div");
    elements[1] = document.createElement("div");
    elements[2] = document.createElement("img");
    elements[3] = document.createElement("div");
    elements[4] = document.createElement("h2");
    elements[5] = document.createElement("p");
}

/**
 * @desc set the attributes for the chat.
 * @param chatId the chat id for this element.
 */
function setAttributes(chatId) {
    elements[0].setAttribute("class", "row align-items-center py-1");
    elements[0].style.cursor = "pointer";
    elements[0].setAttribute("onclick", "messageClick(\"" + chatId + "\")");
    elements[1].setAttribute("class", "col-3");
    elements[2].setAttribute("class", "img-fluid rounded-circle");
    elements[2].setAttribute("id", chatId);
    elements[3].setAttribute("class", "col");
    elements[4].setAttribute("class", "messageList_user");
    elements[5].setAttribute("class", "preview");
}

/**
 * @desc set the values for the messages.
 * @param user the current user
 * @param chatId the chat ID for this message
 */
function setValues(user, chatId) {
    let docRef = db.collection("users").doc(user.uid);

    docRef.onSnapshot(function(doc) {
        let httpsReference = storage.refFromURL(doc.data().photoURL);

        httpsReference.getDownloadURL().then(function(newURL) {
            document.getElementById(chatId).src = newURL;
        });
    });

    elements[4].innerHTML = "Other user's name"
    elements[5].innerHTML = "Preview message."
}

/**
 * @desc appends the message elements to the bodys
 * @param promisedElements the promissed elements
 */
function appendElements(promisedElements) {
    elements[1].appendChild(elements[2]);
    elements[3].appendChild(elements[4]);
    elements[3].appendChild(elements[5]);

    elements[0].appendChild(elements[1]);
    elements[0].appendChild(elements[3]);

    document.getElementById("messageListItems").appendChild(elements[0]);
}
/**
 * @desc opens a message
 * @param chatId the chat id for this message.
 */
function messageClick(chatId) {
    localStorage.setItem("chatId", chatId);
    window.open("messageUser.html", "_self");
}


//======================//
// Firebase             //
// Cloud Firestore      //
// Functions            //
//======================//

/**
 * @desc check if current user is signed in
 * @param user current logged in user
 */
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        createMessages(user);
    } else {
        window.location.assign("login.html");
    }
})

/**
 * @desc adds onClick to the logout button
 */
function addOnClick() {
    document.getElementById("logoutButton").onclick = logout;
}

/**
 * @desc log out current logged in user.
 */
function logout() {
    firebase.auth().signOut().then(function() {
        window.location.assign("login.html");
    })
}

addOnClick();