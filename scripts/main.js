document.getElementById("logoutButton").onclick = logout;


function logout() {
  firebase.auth().signOut().then(function () {

      window.location.assign("login.html");
    })
    .catch(function (err) {
      // Handle errors
    });

}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;

    var docRef = db.collection("users").doc(user.uid)

    docRef.get().then(function (doc) {
      if (doc.exists) {

        document.getElementById("firstName").innerText = doc.data().firstName;
        document.getElementById("firstNameHover").innerText = doc.data().firstName;;
        document.getElementById("bio").innerText = doc.data().bio;
        document.getElementById("age").innerText = "AGE | " + convertDobToAge(doc.data().dateOfBirth);
        document.getElementById("campus").innerText = "BCIT | BURNABY";



      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });



    // ...
  } else {
    // User is signed out.
    // ...
  }
});

function convertDobToAge(date) {

  return moment().diff(date, 'years', false);

}