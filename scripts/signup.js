let profilePhotoFile;
let profilePhotoDataUrl;
let URLtoUpload;

// 
// HELPER TO PROCESS IMAGE UPLOADS.
//
let myDropzone = new Dropzone("div#photoupload", {
    url: "/file/post",
    paramName: "file", // The name that will be used to transfer the file
    maxFilesize: 4, // MB
    resizeWidth: 600,
    resizeHeight: 600,
    resizeMethod: 'contain',
    resizeQuality: 1.0,
    acceptedFiles: "image/*",
    capture: "image/*",
    thumbnail: function(file, dataUrl) {
        if (file.previewElement) {
            file.previewElement.classList.remove("dz-file-preview");
            let images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
            for (let i = 0; i < images.length; i++) {
                let thumbnailElement = images[i];
                thumbnailElement.alt = file.name;
                thumbnailElement.src = dataUrl;
            }
            setTimeout(function() {
                profilePhotoFile = file;
                profilePhotoDataUrl = dataUrl;

                uploadPhotoToFirebase(profilePhotoFile, profilePhotoDataUrl);
                document.getElementById("profileimage").src = dataUrl;
                document.getElementById("profileimageDescription").innerText = "Awesome!"
                myDropzone.removeFile(file);

            }, 1);
        }
    }
});

/**
 * @desc adds photo to Firebase Storage
 * @param url string
 * @param dataURL the base64 url of the imagefile
 */
function uploadPhotoToFirebase(file, dataUrl) {

    const metadata = {
        contentType: file.type
    };
    const task = storageRef.child("images/" + firebase.auth().currentUser.uid).put(file, metadata);
    task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then((url) => {
            addPhotoToUserProfile(url);
            URLtoUpload = url;
        })
        .catch(console.error);
}

/**
 * @desc adds photo to Firstore
 * @param url string
 */
function addPhotoToUserProfile(url) {

    let user = firebase.auth().currentUser;

    user.updateProfile({
        displayName: document.getElementById("validationFirstName").value
    }).then(function() {
        db.collection("users").doc(user.uid).update({
            photoURL: url,
        }).then(function() {
            console.log("Updated information!");
        }).catch(function(error) {
            console.log("error adding photo url to db");
        });
    });
}

/**
 * @desc log out current logged in user.
 */
function logout() {
    firebase.auth().signOut().then(function() {
        window.location.assign("login.html");
    })
}


/**
 * @desc checks if user is fully registered or not
 */
firebase.auth().onAuthStateChanged(function(user) {

    if (user.displayName == null) {
        // user not fully registred 
        document.getElementById("validationCustomEmail").value = user.email;
        document.getElementById("validationCustomEmail").readOnly = true;
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
        let forms = document.getElementsByClassName('form-completeRegistration');
        // Loop over them and prevent submission
        let validation = Array.prototype.filter.call(forms, function(form) {
            form.addEventListener('submit', function(event) {
                if (form.checkValidity() == false || calculateAge(document.getElementById("validationDateOfBirth").value) <= 17 || (typeof URLtoUpload === "undefined")) {

                    event.preventDefault();
                    event.stopPropagation();
                    console.log("NOT VALIDATE!")
                    document.getElementById("completeRegistrationButton").disabled = false;
                }

                form.classList.add('was-validated');

                if (form.checkValidity() == true && calculateAge(document.getElementById("validationDateOfBirth").value) >= 17 && (typeof URLtoUpload !== "undefined")) {
                    event.preventDefault();
                    event.stopPropagation();

                    saveUserInfo();
                }

                if (calculateAge(document.getElementById("validationDateOfBirth").value) <= 17) {
                    document.getElementById("errorMessage").classList.replace("d-none", "d-block");
                    document.getElementById("errorMessage").innerHTML = "Oops! " + "You must be 17 years of age or older to use our service."
                    document.getElementById("completeRegistrationButton").innerHTML = "Complete Registration";
                }

                if ((typeof URLtoUpload === "undefined")) {
                    document.getElementById("errorMessage").classList.replace("d-none", "d-block");
                    document.getElementById("errorMessage").innerHTML = "Oops! " + "You must upload a profile photo! Tap the arrow button above the email field."
                    document.getElementById("completeRegistrationButton").innerHTML = "Complete Registration";
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

    let user = firebase.auth().currentUser;
    user.updateProfile({
        displayName: document.getElementById("validationFirstName").value
    }).then(function() {
        db.collection("users").doc(user.uid).set({
            firstName: document.getElementById("validationFirstName").value,
            lastName: document.getElementById("validationLastName").value,
            dateOfBirth: document.getElementById("validationDateOfBirth").value,
            bio: document.getElementById("bioTextBox").value,
            email: user.email,
            photoURL: URLtoUpload
        }).then(function() {
            console.log("Updated information!");
            window.location.assign("main.html");
        }).catch(function(error) {
            console.log("Error updating user user: " + error);
            displayErrorMessage();
        });
    }).catch(function(error) {
        // An error happened.
        displayErrorMessage();
    });
}

/**
 * @desc displays error message in div and re enable button
 */
function displayErrorMessage() {
    document.getElementById("errorMessage").classList.replace("d-none", "d-block");
    document.getElementById("errorMessage").innerHTML = "Oops! " + error.message
    document.getElementById("completeRegistrationButton").innerHTML = "Complete Registration";
    document.getElementById("completeRegistrationButton").disabled = false;
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
    return Math.trunc(((now - dobNew) / 86400000) / 365);
}