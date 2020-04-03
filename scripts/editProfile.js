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
        .catch(function(err) {
            // Handle errors
        });

}


firebase.auth().onAuthStateChanged(function(user) {

    loadUserInfo(user);
});


/**
 * @desc loads user information from Firebase
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


            //  userProfileImage.src = a;
        } else {
            // doc.data() will be undefined in this case
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

            //  userProfileImage.src = a;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

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
            console.log("Error updating user user: " + error);
            document.getElementById("errorMessage").classList.replace("d-none", "d-block");
            document.getElementById("errorMessage").innerHTML = "Oops! " + error.message
            document.getElementById("completeRegistrationButton").innerHTML = "Complete Registration";
        });
    }).catch(function(error) {

        document.getElementById("errorMessage").classList.replace("d-none", "d-block");
        document.getElementById("errorMessage").innerHTML = "Oops! " + error.message
        document.getElementById("completeRegistrationButton").innerHTML = "Complete Registration";
    });


}