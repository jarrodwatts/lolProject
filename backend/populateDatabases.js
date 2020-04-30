// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const firebase = require("firebase/app");
// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
const fetch = require('node-fetch');

const RIOT_API_KEY = "RGAPI-6fb4b56e-63e6-4857-9507-8459ef7136ca"

console.log(
    'helo'
)

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

const DATE_NOW = Date.now();

async function main() {
    //0. Connect to db Collection
    let col = await db.collection('players').get();
    console.log(col)

    //1. Grab a list of challengers
    let challengers = await grabChallengers();
    console.log(challengers);

    //2. Grab all their summonerNames so we can find out their puuid's
    let challengerSummonerNames = await createChallengerNamesArray(challengers);
    console.log(challengerSummonerNames);

    //3. Get All Puuids
    let playerPuuids = await grabPuuids(challengerSummonerNames);
    console.log(playerPuuids);

    //4. Ask the Matches API to grab these challenger's puuid's matches.
    let matchIds = await grabMatchIds(playerPuuids);
    console.log(matchIds)

    //5. For each MatchId, ask the match Details API to give the matches detials
    let matches = await grabMatchDetails(matchIds);
    console.log(matches);
    
    //6. Add 1 document per match to the collection   
    // db.collection('matches').doc(Date.now().toString()).set(firebaseObj)
    // .then(() => console.log("Added to Database successfully"))
    // .catch((err) => console.error(err))

    for (let i = 0; i < matches.length; i++) {
        db.collection('matches').add(
            {
                matches: matches[i]
            })
            .then((ref) => console.log('Added document with ID: ', ref.id))
            .catch((err) => console.log(err))
    }

}

async function grabChallengers() {
    try {
        const resChallengers = await fetch(
            `https://oc1.api.riotgames.com/tft/league/v1/challenger` + '?api_key=' + RIOT_API_KEY
        );

        const challengersWithMetadata = await resChallengers.json();
        const challengers = challengersWithMetadata.entries;
        console.log("grabChallengers finished")
        return challengers;
    }
    catch (err) {
        console.log(err)
    }
}

async function createChallengerNamesArray(challengers) {
    try {
        let challengerSummonerNames = [];
        //for (let i = 0; i < challengers.length; i++) {
        for (let i = 0; i < 3; i++) {
            challengerSummonerNames.push(challengers[i].summonerName)
        }
        console.log("CreateChallengerNamesArrayfinished");
        return challengerSummonerNames;

    }
    catch (err) {
        console.log(err)
    }
}

async function grabPuuids(challengerSummonerNames) {
    let challengerPuuids = [];

    try {

        for (let i = 0; i < challengerSummonerNames.length; i++) {
            let resPuuid = await fetch(
                encodeURI(`https://oc1.api.riotgames.com/tft/summoner/v1/summoners/by-name/${challengerSummonerNames[i]}` + '?api_key=' + RIOT_API_KEY)
            )

            if (resPuuid.status == 200) {
                //Response was OK
                let profile = await resPuuid.json();
                console.log(profile);
                challengerPuuids.push(profile.puuid)
            }

            if (resPuuid.status == 404) {
                console.log("Account ", challengerSummonerNames[i], " could not be found. Skipped.")
            }

            if (resPuuid.status == 429) {
                console.log("Rate Limit Exceeded. Waiting two minutes.")
                await timeout(121000)
                console.log("Waited two minutes... Trying request again for", challengerSummonerNames[i])
                resPuuid = await fetch(
                    encodeURI(`https://oc1.api.riotgames.com/tft/summoner/v1/summoners/by-name/${challengerSummonerNames[i]}` + '?api_key=' + RIOT_API_KEY)
                )
                let profile = await resPuuid.json();
                console.log(profile);
                challengerPuuids.push(profile.puuid)
            }

        }
        return challengerPuuids;

    }

    catch (err) {
        console.log(err)
    }
}

async function grabMatchIds(playerPuuids) {
    let matchIds = [];
    try {
        for (let i = 0; i < playerPuuids.length; i++) {
            let resMatches = await fetch(
                encodeURI(`https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/${playerPuuids[i]}/ids?count=20&` + 'api_key=' + RIOT_API_KEY)
            )

            if (resMatches.status == 200) {
                //Response was OK
                let matchBatch = await resMatches.json();
                console.log(matchBatch);
                for (let x = 0; x < matchBatch.length; x++) {
                    matchIds.push(matchBatch[x])
                }
            }

            if (resMatches.status == 404) {
                console.log("Puuid ", playerPuuids[i], " could not be found. Skipped.")
            }

            if (resMatches.status == 429) {
                console.log("Rate Limit Exceeded. Waiting two minutes.")
                await timeout(121000)
                console.log("Waited two minutes... Trying request again for", playerPuuids[i])
                resMatches = await fetch(
                    encodeURI(`https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/${playerPuuids[i]}/ids?count=20&` + 'api_key=' + RIOT_API_KEY)
                )
                let matchBatch = await resMatches.json();
                console.log(matchBatch);
                for (let x = 0; x < matchBatch.length; x++) {
                    matchIds.push(matchBatch[x])
                }
            }

        }
        return matchIds;
    }

    catch (err) {
        console.log(err)
    }
}

async function grabMatchDetails(matchIds) {
    let matches = [];

    try {

        for (let i = 0; i < matchIds.length; i++) {

            let resMatchDetail = await fetch(
                encodeURI(`https://americas.api.riotgames.com/tft/match/v1/matches/${matchIds[i]}` + '?api_key=' + RIOT_API_KEY)
            )

            if (resMatchDetail.status == 200) {
                //Response was OK
                let matchDetail = await resMatchDetail.json();
                console.log(matchDetail)
                matches.push(matchDetail);
            }

            if (resMatchDetail.status == 404) {
                console.log("matchId ", matchIds[i], " could not be found. Skipped.")
            }

            if (resMatchDetail.status == 429) {
                console.log("Rate Limit Exceeded. Waiting two minutes.")
                await timeout(121000)
                console.log("Waited two minutes... Trying request again for", matchIds[i])
                resMatchDetail = await fetch(
                    encodeURI(`https://americas.api.riotgames.com/tft/match/v1/matches/${matchIds[i]}` + '?api_key=' + RIOT_API_KEY)
                )
                let matchDetail = await resMatchDetail.json();
                console.log(matchDetail)
                matches.push(matchDetail);
            }

            //Write to Database

        }
        return matches;

    }

    catch (err) {
        console.log(err)
    }
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main();