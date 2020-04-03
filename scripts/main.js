// DECLARE VARIABLES 

let uid;
let thisUser;
let usersArray = [];
let hasSeenArray = [];
let likesArray = [];
let currentExternalID;
let photoURL;

/**
 * @desc add onClick to buttons
 */
function init() {
    document.getElementById("logoutButton").onclick = logout;
    document.getElementById("interestedButton").onclick = interested;
    document.getElementById("notInterestedButton").onclick = notInterested;
}

init();

/**
 * @desc log out current logged in user.
 */

function logout() {
    firebase.auth().signOut().then(function() {

            window.location.assign("login.html");
        })
        .catch(function(err) {
            alert(err);
        });
}

/**
 * @desc get user info from database and display it on a card.
 */
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        thisUser = user;
        photoURL = user.photoURL;
        uid = user.uid;

        let docRef = db.collection("users").doc(user.uid).collection("hasSeen").get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    hasSeenArray.push(doc.id);
                });
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });

        db.collection("users")
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    if (doc.id != user.uid) {
                        if (!hasSeenArray.includes(doc.id)) {
                            usersArray.push(doc.id);
                        }
                    }
                });
                currentExternalID = usersArray.pop();
                getNextUserProfile(currentExternalID);
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
                noMoreUsers();

            });
    }
});




/**
 * @desc user selected not interested
 */
function notInterested() {

    if (usersArray.length >= 0) {

        db.collection("users").doc(uid).collection("hasSeen").doc(currentExternalID).set({

            })
            .then(function() {
                console.log("Document successfully written!");
                currentExternalID = usersArray.pop();
                getNextUserProfile(currentExternalID);
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
                noMoreUsers();
            });

    } else {
        noMoreUsers();

    }

}

/**
 * @desc user selected interested.
 */
function interested() {
    if (usersArray.length >= 0) {
        if (likesArray.includes(uid)) {
            addUserLike();
            Swal.fire(
                'Matched!',
                'You have been matched with the user!',
                'success'
            )

            /// USERS HAVE MATCHED CREATE A CONVERSATION BETWEEN THEM!
            currentExternalID = usersArray.pop();
            getNextUserProfile(currentExternalID);

            updateChats();

        } else {
            addUserLike();
        }
    } else {
        noMoreUsers();
    }
}

/**
 * @desc no more users to show, display placeholder text!
 */
function noMoreUsers() {
    document.getElementById("usercard").classList.replace("d-block", "d-none");
    document.getElementById("noMoreUsers").classList.replace("d-none", "d-block");
}

/**
 * @desc add users like to Firebase
 */
function addUserLike() {
    db.collection("users").doc(uid).collection("likes").doc(currentExternalID).set({

        })
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });

    addUserSeen();
}

/**
 * @desc add user seen to firebase
 */
function addUserSeen() {
    db.collection("users").doc(uid).collection("hasSeen").doc(currentExternalID).set({

        })
        .then(function() {
            console.log("Document successfully written!");
            if (usersArray.length > 0) {
                currentExternalID = usersArray.pop();
                getNextUserProfile(currentExternalID);
            } else {
                noMoreUsers();
            }

        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
}

/**
 * @desc Get the next user profile with give docID.
 * @param docID the next docID used to get next user.
 */
function getNextUserProfile(docID) {
    // GET USER PROFILE 
    let docRef = db.collection("users").doc(docID)
    docRef.get().then(function(doc) {
        if (doc.exists) {
            document.getElementById("firstName").innerText = doc.data().firstName;
            document.getElementById("age_campus").innerText = calculateAge(doc.data().dateOfBirth) + " " + "BCIT | BURNABY";
            document.getElementById("bio").innerText = doc.data().bio;
            if (doc.data().photoURL) {
                document.getElementById("userimage").src = doc.data().photoURL;
            } else {
                document.getElementById("userimage").src = "images/main/placeholderimage.jpg";
            }

            likesArray = [];
            db.collection("users").doc(docID).collection("likes").get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        if (doc.id == uid) {
                            likesArray.push(doc.id);
                        }
                    })

                });
        } else {
            noMoreUsers();
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
        noMoreUsers();
    });
}

/**
 * @desc calculate a users age based on their dob.
 * @param dob the date of birth of the user.
 * @returns int the age of the user.
 */
function calculateAge(dob) {
    let dobSplit = dob.split("/");

    let now = new Date(2020, 03, 24);
    let dobNew = new Date(parseInt(dobSplit[2]), dobSplit[1], dobSplit[0]);
    console.log(((now - dobNew) / 86400000) / 365);
    return Math.trunc(((now - dobNew) / 86400000) / 365);

}

/**
 * @desc updates the chats for the user
 */
function updateChats() {
    let chatRef = db.collection("chats");
    let chatIdRef = chatRef.doc();
    let chatId = chatIdRef.id;

    updateUser(thisUser, chatId);
    updateUser(currentExternalID, chatId);
}

/**
 * @desc Update the user and their chat id
 * @param user the user currently logged in
 * @param chatId the chat ID for the user.
 */
function updateUser(user, chatId) {
    let chatIdRef = db.collection("users").doc(user.uid).collection("chats").doc("chatId");

    chatIdRef.get().then(function(doc) {
        if (doc.exists) {
            chatIdRef.update({
                id: firebase.firestore.FieldValue.arrayUnion(chatId.toString())
            })
        } else {
            chatIdRef.set({
                id: firebase.firestore.FieldValue.arrayUnion(chatId.toString())
            })
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}