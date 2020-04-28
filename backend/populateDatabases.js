// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs

console.log(
    'helo'
)

const firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDRFR4EiyUwJJ1S2Bqdihqp7XgR7H4sDRA",
    authDomain: "lolproject-6938d.firebaseapp.com",
    databaseURL: "https://lolproject-6938d.firebaseio.com",
    projectId: "lolproject-6938d",
    storageBucket: "lolproject-6938d.appspot.com",
    messagingSenderId: "681416986021",
    appId: "1:681416986021:web:33705f6e1da5b886016c4c",
    measurementId: "G-MQDG4DGTK6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();

let temp1;
let temp2;

db.collection('players').get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
        });

        temp1 = "shit"
    })

    .then(() => {
        temp2 = "2"
        console.log(temp2)
        
    })

    .then(() => {

        temp2 = "3"
        console.log(temp2)
        
    })

    .then(() => {

        temp2 = "4"
        console.log(temp2)
        process.exit(0)
    })

    .catch((err) => {
        console.log('Error getting documents', err);
        process.exit(1)
    });
