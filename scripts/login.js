/**

// EVERYONE'S JAVASCRIPT WILL BE IN HERE. NO INTERNAL JS
// PLEASE CREATE FUNCTIONS AND THEN CALL YOUR FUNCTIONS.
// PLEASE TRY TO INCLUDE THE FOLLOWING COMMENT BLOCK FOR EACH FUNCTION 
// TO MAKE CODE READABILITY EASIER FOR EVERYONE

/**
 * @desc opens a modal window to display a message
 * @param string $msg - the message to be displayed
 * @return bool - success or failure
 */



//--------------------------------------------------------------------
// JS FOR LOGIN.HTML
//--------------------------------------------------------------------
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        db.collection("users").doc(user.uid).set({
            email: user.email
        }).then(function() {
            console.log("New user added to firestore");
         window.location.assign("main.html");
        }).catch(function (error) {
                console.log("Error adding new user: " + error);
            });
               
    }
  });

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict';
    window.addEventListener('load', function () {

        document.getElementById("nextButton").disabled = true;

        let forms = document.getElementsByClassName('form-signin');
        // Loop over them and prevent submission
        Array.prototype.filter.call(forms, function (form) {

            form.addEventListener('input', function (event) {
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

                }else{
                    document.getElementById("loginButton").disabled = true;
                    document.getElementById("signupButton").disabled = true;

                }

            }, false);
        });

         Array.prototype.filter.call(forms, function (form) {

            form.addEventListener('submit', function (event) {
                event.preventDefault();
                if (form[0].checkValidity() === false) {
                    event.stopPropagation();

                }

                if(form[0].checkValidity() === true && form[1].checkValidity() === false){
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


function checkIfUserExists() {

let email = document.getElementById("validationCustomEmail").value;
let docID;

db.collection("users").where("email", "==", email)
.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        docID = doc.id;

        userFound();
    });
    
})
.catch(function(error) {
    console.log("Error getting documents: ", error);
});

if(!docID){
    userNotFound();
}

}


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

function displayIncorrectPassword() {

    document.getElementById("invalidPassword").classList.replace("d-none", "d-block");
    document.getElementById("invalidPassword").innerHTML = "Oops! incorrect password, try again!"
    document.getElementById("loginButton").innerHTML = "Login";
    
}

function userFound() {

    console.log("Userfound");
    document.getElementById("validationCustomEmail").readOnly = true;
    document.getElementById("nextButton").classList.add("d-none");
    document.getElementById("loginButton").classList.add("d-block");
    document.getElementById("passwordGroup").classList.replace("d-none", "block");



}

function userNotFound() {
    console.log("user not found");

    document.getElementById("validationCustomEmail").readOnly = true;
    document.getElementById("nextButton").classList.add("d-none");
    //document.getElementById("loginButton").classList.add("d-block");
    document.getElementById("passwordGroup").classList.replace("d-none", "block");
    document.getElementById("signupButton").classList.replace("d-none", "block");
    document.getElementById("signupButton").disabled = true;



}

function registerUser() {

    document.getElementById("signupButton").innerHTML = '<span class="spinner-border spinner-border-sm mr-2 disabled" role="status" aria-hidden="true"></span>Loading...';

    let email = document.getElementById("validationCustomEmail").value;
    let password = document.getElementById("validationCustomPassword").value;
    console.log(email + ":" + password);

      firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch(function (error) {
        document.getElementById("invalidPassword").classList.replace("d-none", "d-block");
                document.getElementById("invalidPassword").innerHTML = "Oops! " + error.message
                document.getElementById("signupButton").innerHTML = "Register";
      });

}



// function loadFirebaseUI() {

//        // This login snippet goes at the end of the body tag
//         // After firebase libraries via CDN are sourced
//         // After your firebase project API config is defined
//         // After the authentication container is created in HTML
//         // Meanwhile in firebase console, you need to 
//         // - create a project
//         // - know the api key config info
//         // - enable firestore
//         // - create rules to allow for read/write
//         // - enable authentication method (email/pwd signin)


//    // Initialize the FirebaseUI Widget using Firebase.

//    var ui = new firebaseui.auth.AuthUI(firebase.auth());
//     var uiConfig = {
//         callbacks: {
//             signInSuccessWithAuthResult: function (authResult, redirectUrl) {
//                 // User successfully signed in.
//                 // Return type determines whether we continue the redirect automatically
//                 // or whether we leave that to developer to handle.
//                 //------------------------------------------------------------------------------------------
//                 // The code below is modified from default snippet provided by the documentation
//                 //
//                 // If the user is a "brand new" user, then create a new "user" in your own database
//                 // Assign this user with the name and email provided.
//                 // Before this works, you must enable "Firestore" from the firebase console.
//                 // The Firestore rules must allow the user to write. 
//                 //------------------------------------------------------------------------------------------
//                 var user = authResult.user;
//                 if (authResult.additionalUserInfo.isNewUser) {
//                     db.collection("users").doc(user.uid).set({
//                         name: user.displayName,
//                         email: user.email
//                     }).then(function () {
//                         console.log("New user added to firestore");
//                         window.location.assign("main.html");
//                     })
//                         .catch(function (error) {
//                             console.log("Error adding new user: " + error);
//                         });
//                 }
//                 else {
//                     return true;
//                 }
//                 return false;
//             },
//             uiShown: function () {
//                 // The widget is rendered.
//                 // Hide the loader.
//                 document.getElementById('loader').style.display = 'none';
//             }
//         },
//         // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
//         signInFlow: 'popup',
//         signInSuccessUrl: 'main.html',
//         signInOptions: [
//             // Leave the lines as is for the providers you want to offer your users.
//             //firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//             //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
//             //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
//             //firebase.auth.GithubAuthProvider.PROVIDER_ID,
//             firebase.auth.EmailAuthProvider.PROVIDER_ID,
//         ],
//         // Terms of service url.
//         tosUrl: 'main.html',
//         // Privacy policy url.
//         privacyPolicyUrl: 'main.html',
//         accountChooserEnabled: false
//     };
//     // The start method will wait until the DOM is loaded.
//     // Inject the login interface into the HTML
//     ui.start('#firebaseui-auth-container', uiConfig);
// }

// function validateEmail(){
//     console.log("output" + document.getElementById("inputEmail"));
// }
