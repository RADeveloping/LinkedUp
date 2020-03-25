let profilePhotoFile;
let profilePhotoDataUrl;

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
        })
        .catch(console.error);

}



/**
 * @desc adds photo to Firstore
 * @param url string
 */
function addPhotoToUserProfile(url) {

    var user = firebase.auth().currentUser;

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
 * @desc initialize javascript to do initial tasks.
 */
function init() {
    document.getElementById("validationCustomEmail").readOnly = true;
}

init();

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
                if (form.checkValidity() === false || calculateAge(document.getElementById("validationDateOfBirth").value) <= 17) {
                    event.preventDefault();
                    event.stopPropagation();
                    console.log("NOT VALIDATE!")
                    document.getElementById("completeRegistrationButton").disabled = false;


                }

                form.classList.add('was-validated');

                if (form.checkValidity() == true && calculateAge(document.getElementById("validationDateOfBirth").value) >= 17) {
                    event.preventDefault();
                    event.stopPropagation();
                    saveUserInfo();
                }

                if (calculateAge(document.getElementById("validationDateOfBirth").value) <= 17) {
                    document.getElementById("errorMessage").classList.replace("d-none", "d-block");
                    document.getElementById("errorMessage").innerHTML = "Oops! " + "You must be 17 years of age or older to use our service."
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