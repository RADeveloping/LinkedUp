var firebaseConfig = {
    apiKey: "AIzaSyAEZnIL7YOqY0xHIfR402hVwJ0FWv3ATSA",
    authDomain: "linkedup-f5db2.firebaseapp.com",
    databaseURL: "https://linkedup-f5db2.firebaseio.com",
    projectId: "linkedup-f5db2",
    storageBucket: "linkedup-f5db2.appspot.com",
    messagingSenderId: "957675612833",
    appId: "1:957675612833:web:f493f2c3ed606f2c80dee0",
    measurementId: "G-E16PSFXZL9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
let storage = firebase.storage();
const storageRef = storage.ref();