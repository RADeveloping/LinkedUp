let profilePhotoFile;
let profilePhotoDataUrl;

/**
 * @desc creates a new drop zone to upload image
 */
var myDropzone = new Dropzone("div#photoupload", {
    url: "/file/post",
    paramName: "file", // The name that will be used to transfer the file
    maxFilesize: 4, // MB
    acceptedFiles: "image/*",
    capture: "image/*",
    thumbnail: function(file, dataUrl) {
        if (file.previewElement) {
            file.previewElement.classList.remove("dz-file-preview");
            var images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
            for (var i = 0; i < images.length; i++) {
                var thumbnailElement = images[i];
                thumbnailElement.alt = file.name;
                thumbnailElement.src = dataUrl;
            }
            setTimeout(function() {
                profilePhotoFile = file;
                profilePhotoDataUrl = dataUrl;

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
            addPhotoToUserProfile(url);
        })
        .catch(console.error);

}



/**
 * @desc adds photo to Firstore
 * @param url string
 */
function addPhotoToUserProfile(url) {

    var user = firebase.auth().currentUser;
    var userRef = db.collection("users").doc(user.uid);
    // Set the "capital" field of the city 'DC'
    return userRef.update({
            photoURL: url
        })
        .then(function() {
            console.log("Document successfully updated!");
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });

}
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

    var docRef = db.collection("users").doc(user.uid)


    docRef.get().then(function(doc) {
        if (doc.exists) {
            firstName.value = doc.data().firstName;
            lastName.value = doc.data().lastName;
            validationDateOfBirth.value = doc.data().dateOfBirth;
            bio.value = doc.data().bio;
            email.value = user.email;
            userProfileImage.src = getProfileImageFromFireBaseurl(doc.data().photoURL);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function getProfileImageFromFireBaseurl(url) {
    var httpsReference = storage.refFromURL(user.photoURL);

    httpsReference.getDownloadURL().then(function(url) {
        // Or inserted into an <img> element:
        return url;

    }).catch(function(error) {
        // Handle any errors
    });
}

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
 * @desc update user information on firebase
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
            email: user.email,
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