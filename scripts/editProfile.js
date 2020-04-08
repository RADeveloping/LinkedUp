let profilePhotoFile;
let profilePhotoDataUrl;
let tempPhotoURL;

/**
 * @desc creates a new drop zone to upload image
 */
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
                uploadPhotoToFirebase(file, dataUrl);
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

    const name = (+new Date()) + '-' + file.name;
    const metadata = {
        contentType: file.type
    };
    const task = storageRef.child("images/" + firebase.auth().currentUser.uid).put(file, metadata);

    task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then((url) => {
            tempPhotoURL = url;
        })
        .catch(console.error);

}


/**
 * @desc add onClick to buttons
 */

function init() {
    document.getElementById("logoutButton").onclick = logout;
    document.getElementById("validationCustomEmail").readOnly = true;

}

init();


/**
 * @desc log out current logged in user.
 */

function logout() {
    firebase.auth().signOut().then(function() {
        window.location.assign("login.html");
    })
}

/**
 * @desc Check user state.
 */
firebase.auth().onAuthStateChanged(function(user) {
    loadUserInfo(user);
});


/**
 * @desc loads user information from Firebase
 * @param user the current logged in user.
 */
function loadUserInfo(user) {
    let firstName = document.getElementById("validationFirstName")
    let lastName = document.getElementById("validationLastName")
    let dateOfBirth = document.getElementById("validationDateOfBirth")
    let bio = document.getElementById("bioTextBox")
    let email = document.getElementById("validationCustomEmail");
    let userProfileImage = document.getElementById("profileimage");

    let docRef = db.collection("users").doc(user.uid)

    docRef.get().then(function(doc) {
        if (doc.exists) {
            firstName.value = doc.data().firstName;
            lastName.value = doc.data().lastName;
            validationDateOfBirth.value = doc.data().dateOfBirth;
            bio.value = doc.data().bio;
            email.value = user.email;

            let httpsReference = storage.refFromURL(doc.data().photoURL);
            httpsReference.getDownloadURL().then(function(newURL) {
                // Or inserted into an <img> element:
                userProfileImage.src = newURL;

            }).catch(function(error) {
                // Handle any errors
                console.log(error);

            });

        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}


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
                if (form.checkValidity() == false || calculateAge(document.getElementById("validationDateOfBirth").value) <= 17 || (typeof tempPhotoURL === "undefined")) {

                    event.preventDefault();
                    event.stopPropagation();
                    console.log("NOT VALIDATE!")
                    if (calculateAge(document.getElementById("validationDateOfBirth").value) <= 17) {
                        alert("Sorry, you must be at least 17 years of age to use this app!")
                    }
                    if ((typeof tempPhotoURL === "undefined")) {
                        alert("You must upload a profile photo! Tap the arrow in the cloud right above the email field!")
                    }
                    document.getElementById("completeRegistrationButton").disabled = false;
                }

                form.classList.add('was-validated');

                if (form.checkValidity() == true && calculateAge(document.getElementById("validationDateOfBirth").value) >= 17 && (typeof tempPhotoURL !== "undefined")) {
                    event.preventDefault();
                    event.stopPropagation();

                    saveUserInfo();
                }

                if (calculateAge(document.getElementById("validationDateOfBirth").value) <= 17) {
                    document.getElementById("errorMessage").classList.replace("d-none", "d-block");
                    document.getElementById("errorMessage").innerHTML = "Oops! " + "You must be 17 years of age or older to use our service."
                    document.getElementById("completeRegistrationButton").innerHTML = "Update Profile";
                }
            }, false);
        });
    }, false);
})();
/**
 * @desc update user information on firebase
 */
function saveUserInfo() {

    document.getElementById("completeRegistrationButton").disabled = true;
    document.getElementById("completeRegistrationButton").innerHTML = '<span class="spinner-border spinner-border-sm mr-2 disabled" role="status" aria-hidden="true"></span>Loading...';

    let user = firebase.auth().currentUser;

    let docRef = db.collection("users").doc(user.uid)
    docRef.get().then(function(doc) {
        if (doc.exists) {
            if (tempPhotoURL == null) {
                tempPhotoURL = doc.data().photoURL;
            }
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

    // Update user profile after saving
    updateProfile(user);
}

/**
 * @desc update user information on firebase
 * @param user the current loged in user
 */
function updateProfile(user) {
    user.updateProfile({
        displayName: document.getElementById("validationFirstName").value
    }).then(function() {
        db.collection("users").doc(user.uid).set({
            firstName: document.getElementById("validationFirstName").value,
            lastName: document.getElementById("validationLastName").value,
            dateOfBirth: document.getElementById("validationDateOfBirth").value,
            bio: document.getElementById("bioTextBox").value,
            email: user.email,
            photoURL: tempPhotoURL
        }).then(function() {
            console.log("Updated information!");
            window.location.assign("main.html");
        }).catch(function(error) {
            displayErrorMessage();
        });
    }).catch(function(error) {
        displayErrorMessage();
    });
}

/**
 * @desc displays error message in div and re enable button
 */
function displayErrorMessage() {
    document.getElementById("errorMessage").classList.replace("d-none", "d-block");
    document.getElementById("errorMessage").innerHTML = "Oops! " + error.message
    document.getElementById("completeRegistrationButton").innerHTML = "Update Profile";
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
    console.log(((now - dobNew) / 86400000) / 365);
    return Math.trunc(((now - dobNew) / 86400000) / 365);
}