const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
const fetch = require('node-fetch');
const fs = require('fs');

const RIOT_API_KEY = "RGAPI-fec5a364-3ece-4131-8cc8-65f570015985"
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

firebase.initializeApp(firebaseConfig);
let db = firebase.database();
let json;

const CURRENT_DATA_VERSION = 4;

//Pretend this file is the MAIN_GAME_DETAIL_OBJECT;

await fs.readFile('./logs/MAIN_GAME_DETAIL_OBJECT - Copy.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("Error reading file from disk:", err)
        return
    }
    try {
        json = JSON.parse(jsonString)

        //try manipulate data here
        console.log(Object.keys(json).length)

        for (server in json) {
            console.log(server)

            for (rank in json[server]) {
                console.log(server, ":", rank)

                //now this json[server][rank] is an array of games
                for (game of json[server][rank]) {
                    if (game.metadata.data_version == CURRENT_DATA_VERSION) {
                        //


                    }

                }

            }
        }

    }
    catch (err) {
        console.log('Error parsing JSON string:', err)
    }
})





