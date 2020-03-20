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
document.getElementById("validationCustomEmail").readOnly = true;


firebase.auth().onAuthStateChanged(function(user) {

  loadUserInfo(user);
   
  });
  

  function loadUserInfo(user){

    let firstName =  document.getElementById("validationFirstName")

    let lastName = document.getElementById("validationLastName")
 
    let age = document.getElementById("validationAge")
 
    let bio =  document.getElementById("bioTextBox")
 
    let email= document.getElementById("validationCustomEmail");

    var docRef = db.collection("users").doc(user.uid)

  docRef.get().then(function(doc) {
    if (doc.exists) {
      
      firstName.value = doc.data().firstName;
      lastName.value = doc.data().lastName;
      age.value = doc.data().age;
      bio.value = doc.data().bio;
      email.value= user.email;


    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
  }).catch(function(error) {
    console.log("Error getting document:", error);
});


  

  }

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

            if (form.checkValidity() == true){
                event.preventDefault();
            event.stopPropagation();
                saveUserInfo();
            }          

        }, false);
      });
    }, false);
  })();

  function saveUserInfo(){

    document.getElementById("completeRegistrationButton").disabled = true;
    document.getElementById("completeRegistrationButton").innerHTML = '<span class="spinner-border spinner-border-sm mr-2 disabled" role="status" aria-hidden="true"></span>Loading...';


    var user = firebase.auth().currentUser;
    
      user.updateProfile({
          displayName: document.getElementById("validationFirstName").value
      }).then(function () {
        db.collection("users").doc(user.uid).set({
            firstName : document.getElementById("validationFirstName").value,
            lastName: document.getElementById("validationLastName").value,
            age: document.getElementById("validationAge").value,
            bio: document.getElementById("bioTextBox").value,
            email: user.email
        }).then(function() {
            console.log("Updated information!");
         window.location.assign("main.html");
        }).catch(function (error) {
                console.log("Error updating user user: " + error);
                document.getElementById("errorMessage").classList.replace("d-none", "d-block");
                document.getElementById("errorMessage").innerHTML = "Oops! " + error.message
                document.getElementById("completeRegistrationButton").innerHTML = "Complete Registration";
            });
      }).catch(function (error) {
          // An error happened.
          document.getElementById("errorMessage").classList.replace("d-none", "d-block");
          document.getElementById("errorMessage").innerHTML = "Oops! " + error.message
          document.getElementById("completeRegistrationButton").innerHTML = "Complete Registration";
      });


  }
