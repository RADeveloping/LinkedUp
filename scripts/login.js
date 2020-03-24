/**
 * @desc Adds user to Firestore
 */
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        if (user.displayName == null) {
            // user not fully registred 
            document.getElementById("validationCustomEmail").value = user.email;
            db.collection("users").doc(user.uid).set({
                email: user.email
            }).then(function() {
                console.log("New user added to firestore");
                window.location.assign("createProfile.html");
            }).catch(function(error) {
                console.log("Error adding new user: " + error);
            });

        } else {
            // user fully registred 
            window.location.assign("main.html");

        }

    }


});

/**
 * @desc JavaScript for disabling form submissions if there are invalid fields
 */
(function() {
    'use strict';
    window.addEventListener('load', function() {

        document.getElementById("nextButton").disabled = true;

        let forms = document.getElementsByClassName('form-signin');
        // Loop over them and prevent submission
        Array.prototype.filter.call(forms, function(form) {

            form.addEventListener('input', function(event) {
                if (form[0].checkValidity() === false) {
                    event.stopPropagation();
                    form.classList.add('was-validated');
                    document.getElementById("nextButton").disabled = true;
                    console.log("LOAD LISTNER");
                }

                if (form[0].checkValidity() === true) {
                    document.getElementById("nextButton").disabled = false;
                    document.getElementById("loginButton").disabled = true;
                }

                if (form.checkValidity() === true) {
                    document.getElementById("loginButton").disabled = false;
                    document.getElementById("signupButton").disabled = false;
                } else {
                    document.getElementById("loginButton").disabled = true;
                    document.getElementById("signupButton").disabled = true;
                }

            }, false);
        });

        /**
         * @desc JavaScript for validating form once submit button pressed
         */
        Array.prototype.filter.call(forms, function(form) {

            form.addEventListener('submit', function(event) {
                event.preventDefault();
                if (form[0].checkValidity() === false) {
                    event.stopPropagation();

                }

                if (form[0].checkValidity() === true && form[1].checkValidity() === false) {
                    console.log("success");
                    document.getElementById("nextButton").disabled = true;
                    document.getElementById("nextButton").innerHTML = '<span class="spinner-border spinner-border-sm mr-2 disabled" role="status" aria-hidden="true"></span>Loading...';

                    checkIfUserExists();
                }

                form.classList.add('was-validated');
            }, false);
        });

    }, false);
})();


/**
 * @desc checks if user exists in Firebase.
 */
function checkIfUserExists() {

    let email = document.getElementById("validationCustomEmail").value;

    db.collection("users").where("email", "==", email)
        .get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                if (querySnapshot.size > 0) {
                    userFound();

                }

            });
            if (querySnapshot.size == 0) {
                userNotFound();
            }
        });
}

/**
 * @desc Logs in user using email and password.
 */
function loginUser() {

    document.getElementById("loginButton").innerHTML = '<span class="spinner-border spinner-border-sm mr-2 disabled" role="status" aria-hidden="true"></span>Loading...';

    let email = document.getElementById("validationCustomEmail").value;
    let password = document.getElementById("validationCustomPassword").value

    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
        // user signed in
    }).catch(function(error) {
        switch (error.code) {
            case "auth/user-not-found":
                userNotFound();
                break;
            case "auth/wrong-password":
                displayIncorrectPassword();
                break;
            default:
                document.getElementById("invalidPassword").classList.replace("d-none", "d-block");
                document.getElementById("invalidPassword").innerHTML = "Oops! " + error.message
                document.getElementById("loginButton").innerHTML = "Login";
        }

    });

}

/**
 * @desc incorrect password. Hides and shows DOM Elements.
 */

function displayIncorrectPassword() {

    document.getElementById("invalidPassword").classList.replace("d-none", "d-block");
    document.getElementById("invalidPassword").innerHTML = "Oops! incorrect password, try again!"
    document.getElementById("loginButton").innerHTML = "Login";

}

/**
 * @desc user found. Hides and shows DOM Elements.
 */
function userFound() {

    console.log("Userfound");
    document.getElementById("validationCustomEmail").readOnly = true;
    document.getElementById("nextButton").classList.add("d-none");
    document.getElementById("loginButton").classList.add("d-block");
    document.getElementById("passwordGroup").classList.replace("d-none", "d-block");
    document.getElementById("signupButton").classList.replace("d-block", "d-done");



}

/**
 * @desc user is not found. Hides and shows DOM Elements.
 */
function userNotFound() {
    console.log("user not found");

    document.getElementById("validationCustomEmail").readOnly = true;
    document.getElementById("nextButton").classList.add("d-none");
    //document.getElementById("loginButton").classList.add("d-block");
    document.getElementById("passwordGroup").classList.replace("d-none", "d-block");
    document.getElementById("signupButton").classList.replace("d-none", "d-block");
    document.getElementById("signupButton").disabled = true;



}

/**
 * @desc creating user and adding to firebase.
 */
function registerUser() {

    document.getElementById("signupButton").disabled = true;

    document.getElementById("signupButton").innerHTML = '<span class="spinner-border spinner-border-sm mr-2 disabled" role="status" aria-hidden="true"></span>Loading...';

    let email = document.getElementById("validationCustomEmail").value;
    let password = document.getElementById("validationCustomPassword").value;
    console.log(email + ":" + password);

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch(function(error) {
            document.getElementById("invalidPassword").classList.replace("d-none", "d-block");
            document.getElementById("invalidPassword").innerHTML = "Oops! " + error.message
            document.getElementById("signupButton").disabled = false;
            document.getElementById("signupButton").innerHTML = "Register";
        });

}