/**
 * @desc initialize javascript to do initial tasks.
 */
function init() {
    document.getElementById("validationCustomEmail").readOnly = true;
}

/**
 * @desc checks if user is fully registered or not
 */
firebase.auth().onAuthStateChanged(function(user) {

    if (user.displayName == null) {
        // user not fully registred 
        document.getElementById("validationCustomEmail").value = user.email;

    } else {
        // user fully registred 
        window.location.assign("main.html");
    }

});

/**
 * @desc JavaScript for disabling form submissions if there are invalid fields
 */
(function() {
    'use strict';
    window.addEventListener('load', function() {

        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('form-completeRegistration');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function(form) {
            form.addEventListener('submit', function(event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                    console.log("NOT VALIDATE!")
                    document.getElementById("completeRegistrationButton").disabled = false;


                }
                form.classList.add('was-validated');

                if (form.checkValidity() == true) {
                    event.preventDefault();
                    event.stopPropagation();
                    saveUserInfo();
                }

            }, false);
        });
    }, false);
})();


/**
 * @desc save user information to Firestore
 */
function saveUserInfo() {

    document.getElementById("completeRegistrationButton").disabled = true;
    document.getElementById("completeRegistrationButton").innerHTML = '<span class="spinner-border spinner-border-sm mr-2 disabled" role="status" aria-hidden="true"></span>Loading...';


    var user = firebase.auth().currentUser;

    user.updateProfile({
        displayName: document.getElementById("validationFirstName").value
    }).then(function() {
        db.collection("users").doc(user.uid).set({
            firstName: document.getElementById("validationFirstName").value,
            lastName: document.getElementById("validationLastName").value,
            dateOfBirth: document.getElementById("validationDateOfBirth").value,
            bio: document.getElementById("bioTextBox").value,
            email: user.email
        }).then(function() {
            console.log("Updated information!");
            window.location.assign("main.html");
        }).catch(function(error) {
            console.log("Error updating user user: " + error);
            document.getElementById("errorMessage").classList.replace("d-none", "d-block");
            document.getElementById("errorMessage").innerHTML = "Oops! " + error.message
            document.getElementById("completeRegistrationButton").innerHTML = "Complete Registration";
        });
    }).catch(function(error) {
        // An error happened.
        document.getElementById("errorMessage").classList.replace("d-none", "d-block");
        document.getElementById("errorMessage").innerHTML = "Oops! " + error.message
        document.getElementById("completeRegistrationButton").innerHTML = "Complete Registration";
    });
}