/**
 * @desc add onClick to buttons
 */
let uid;
let usersArray = [];
let hasSeenArray = [];
let likesArray = [];
let currentExternalID;

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
            // Handle errors
        });

}

/**
 * @desc get user info from database and display it on a card.
 */
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        uid = user.uid;
        var providerData = user.providerData;

        //     // GET USER PROFILE 
        //     var docRef = db.collection("users").doc(user.uid)
        //     docRef.get().then(function(doc) {
        //         if (doc.exists) {
        //             document.getElementById("firstName").innerText = doc.data().firstName;
        //             document.getElementById("firstNameHover").innerText = doc.data().firstName;;
        //             document.getElementById("bio").innerText = doc.data().bio;
        //             document.getElementById("age").innerText = "AGE | " + calculateAge(doc.data().dateOfBirth);
        //             document.getElementById("campus").innerText = "BCIT | BURNABY";
        //         } else {
        //             // doc.data() will be undefined in this case
        //             console.log("No such document!");
        //         }
        //     }).catch(function(error) {
        //         console.log("Error getting document:", error);
        //     });


        let docID;
        let docRef = db.collection("users").doc(user.uid).collection("hasSeen").get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
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
                    // doc.data() is never undefined for query doc snapshots
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
            alert("Matched user");

            /// USERS HAVE MATCHED CREATE A CONVERSATION BETWEEN THEM!

            currentExternalID = usersArray.pop();
            getNextUserProfile(currentExternalID);

        } else {
            addUserLike();
        }
    } else {
        noMoreUsers();
    }
}

function noMoreUsers() {
    document.getElementById("usercard").classList.replace("d-block", "d-none");
    document.getElementById("noMoreUsers").classList.replace("d-none", "d-block");
}


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


function getNextUserProfile(docID) {
    // GET USER PROFILE 
    let docRef = db.collection("users").doc(docID)
    docRef.get().then(function(doc) {
        if (doc.exists) {
            document.getElementById("firstName").innerText = doc.data().firstName;
            document.getElementById("age_campus").innerText = calculateAge(doc.data().dateOfBirth) + " " + "BCIT | BURNABY";
            document.getElementById("bio").innerText = doc.data().bio;
            if (doc.data().photoURL.length > 10) {
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
            // document.getElementById("bio").innerText = doc.data().bio;
            // document.getElementById("age").innerText = "AGE | " + calculateAge(doc.data().dateOfBirth);
            // document.getElementById("campus").innerText = "BCIT | BURNABY";
        } else {
            // doc.data() will be undefined in this case
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
    var dobSplit = dob.split("/");

    var now = new Date(2020, 03, 24);
    var dob = new Date(parseInt(dobSplit[2]), dobSplit[1], dobSplit[0]);
    console.log(((now - dob) / 86400000) / 365);
    return Math.trunc(((now - dob) / 86400000) / 365);

}