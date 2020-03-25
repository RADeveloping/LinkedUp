/**
 * @desc add onClick to buttons
 */

function init() {
    document.getElementById("logoutButton").onclick = logout;
    document.getElementById("interestedButton").onclick = interested;
    document.getElementById("notInterestedButton").onclick = notInterested;

    usersArray = [];
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
        var uid = user.uid;
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


        //         db.collection("users").get().then(function(querySnapshot) {
        //             querySnapshot.forEach(function(docUsers) {
        //                 db.collection("users").doc(docUsers.id).collection("likes").get()
        //                     .then(querySnapshot => {
        //                         querySnapshot.forEach(doc => {

        //                             if (doc.id == uid) {
        //                                 likesArray.push(docUsers.id);
        //                                 getNextUserProfile(docUsers.id);
        //                             }
        //                         })
        //                     });
        //             });

        //         });



        //     }
        // });

        let docID;

        db.collection("users")
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                    usersArray.push(doc.id);

                });

                getNextUserProfile(usersArray.pop());

            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
    }
});




/**
 * @desc user selected not interested
 */

function notInterested() {

    if (usersArray.length > 0) {
        docID = usersArray.pop();
        getNextUserProfile(docID);
    } else {
        document.getElementById("usercard").classList.replace("d-block", "d-none");
        document.getElementById("noMoreUsers").classList.replace("d-none", "d-block");
    }

}

/**
 * @desc user selected interested.
 */

function interested() {

    if (usersArray.length > 0) {
        docID = usersArray.pop();
        getNextUserProfile(docID);
    } else {
        document.getElementById("usercard").classList.replace("d-block", "d-none");
        document.getElementById("noMoreUsers").classList.replace("d-none", "d-block");
    }
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
            // document.getElementById("bio").innerText = doc.data().bio;
            // document.getElementById("age").innerText = "AGE | " + calculateAge(doc.data().dateOfBirth);
            // document.getElementById("campus").innerText = "BCIT | BURNABY";
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
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