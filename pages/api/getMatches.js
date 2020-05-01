
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

if (!firebase) {
    // Initialize Cloud Firestore through Firebase
    firebase.initializeApp({
        apiKey: "AIzaSyDRFR4EiyUwJJ1S2Bqdihqp7XgR7H4sDRA",
        authDomain: "lolproject-6938d.firebaseapp.com",
        databaseURL: "https://lolproject-6938d.firebaseio.com",
        projectId: "lolproject-6938d",
        storageBucket: "lolproject-6938d.appspot.com",
        messagingSenderId: "681416986021",
        appId: "1:681416986021:web:33705f6e1da5b886016c4c",
        measurementId: "G-MQDG4DGTK6"
    });
}

export default async (req, res) => {
    let comps = [];

    let db = firebase.firestore();

    await db.collection("comps").get()
        .then((querySnapshot) => {
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                comps.push(doc.data().comp)
            });
        });

    res.statusCode = 200
    res.end(JSON.stringify(comps))
};