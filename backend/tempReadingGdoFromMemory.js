const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
const fetch = require('node-fetch');
const fs = require('fs');

const RIOT_API_KEY = process.env.RIOT_API_KEY
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain:  process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL:  process.env.FIREBASE_DATABASE_URL,
    projectId:  process.env.FIREBASE_PROJECT_ID,
    storageBucket:  process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId:  process.env.FIREBASE_APP_ID,
    measurementId:  process.env.FIREBASE_MEASUREMENT_ID,
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





