const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
const fetch = require('node-fetch');
const fs = require('fs');

const RIOT_API_KEY = "RGAPI-4d0835ee-f6eb-4dd8-b7a8-4172e02e95d4"
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

const servers = [
    "BR1", //Brazil
    "EUN1", //Europe and Nordic East
    // "EUW1", //Europe West
    // "JP1", //Japan
    // "KR", //Korea
    // "LA1", //Latin America North
    // "LA2", //Latin America South
    // "NA1", //North America
    // "OC1", //Oceania
    // "RU", //Russia
    // "TR1", //Turkey
]

const serverGroups = {
    "BR1": 'Americas',
    "EUN1": 'Europe',
    "EUW1": 'Europe',
    "JP1": 'Asia',
    "KR": 'Asia',
    "LA1": 'Americas',
    "LA2": 'Americas',
    "NA1": 'Americas',
    "OC1": 'Americas',
    "RU": 'Europe',
    "TR1": 'Europe',

}

const tiers = [
    "IRON",
    // "BRONZE",
    // "SILVER",
    // "GOLD",
    // "PLATINUM",
    // "DIAMOND"
]

const proTiers = [
    "master",
    "grandmaster",
    "challenger",
]

const divisions = [
    "I",
    "II",
    "III",
    "IV"
]

let MAIN_GAME_OBJECT = {};
let MAIN_PLAYER_OBJECT = {};


async function main() {

    for (server of servers) {

        MAIN_PLAYER_OBJECT[server] = {};
        MAIN_GAME_OBJECT[server] = {};

        for (tier of tiers) {

            let playerPuuids = [];
            let gameIds = [];

            for (division of divisions) {
                let serverTierDivisionPlayerInformation = await fetchAllSummonerInformation(server, tier, division);

                //Get player Puuid's into MAIN_PLAYER_OBJECT.
                for (let i = 0; i < serverTierDivisionPlayerInformation.length; i++) {
                    let summonerPuuid = await convertNametoPuuid(serverTierDivisionPlayerInformation[i].summonerName, server)
                    playerPuuids.push(summonerPuuid)
                }

                //Get Player Match Ids
                // = For each Puuid in every region and tier, convert it to past 5 games

                //Loop through each server
                Object.keys(MAIN_PLAYER_OBJECT).forEach((serverName) => {

                    //Loop through each Rank within a server
                    Object.keys(MAIN_PLAYER_OBJECT[serverName]).forEach((rank) => {
                        let thisPlayersGameIds = await fetchPlayersGameIds(
                            MAIN_PLAYER_OBJECT[serverName][rank], //Puuid
                            server //Actual server name from loop
                        );

                        //For each player, push their games Id's to the gamesId array
                        for (let x = 0; x < thisPlayersGameIds.length; x++) {
                            gameIds.push(thisPlayersGameIds[x])
                        }

                    })
                })

            }

            MAIN_PLAYER_OBJECT[server][tier] = playerPuuids;
            MAIN_GAME_OBJECT[server][tier] = gameIds;
        }

    }

    console.log(MAIN_PLAYER_OBJECT);

    fs.writeFile("C:/Users/New/Documents/GitHub/lolProject/backend/logs/logs.txt", JSON.stringify(MAIN_PLAYER_OBJECT), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });

}

async function fetchAllSummonerInformation(server, tier, division) {
    console.log("Fetching", server, tier, division, "Summoner Information");
    let serverTierDivisionPlayerInformation;

    let resServerTierDivisionPlayerInformation = await fetch(
        encodeURI(`https://${server}.api.riotgames.com/tft/league/v1/entries/${tier}/${division}` + '?api_key=' + RIOT_API_KEY)
    )

    if (resServerTierDivisionPlayerInformation.status == 200) {
        serverTierDivisionPlayerInformation = await resServerTierDivisionPlayerInformation.json();
    }

    if (resServerTierDivisionPlayerInformation.status == 404) {
        //Something not found
        console.error("Recieved a 404 response on: ", server, tier, division)
    }

    if (resServerTierDivisionPlayerInformation.status == 429) {
        //Too many requests
        console.log("Chilling for two minutes")
        await timeout(121000);
        serverTierDivisionPlayerInformation = await resServerTierDivisionPlayerInformation.json();
    }

    //DEV ONLY: REDUCE PLAYER LIMIT TO 10
    serverTierDivisionPlayerInformation.length = 10;
    return serverTierDivisionPlayerInformation;
}

async function convertNametoPuuid(summonerName, server) {

    let profile;

    let resPuuid = await fetch(
        encodeURI(`https://${server}.api.riotgames.com/tft/summoner/v1/summoners/by-name/${summonerName}` + '?api_key=' + RIOT_API_KEY)
    )

    if (resPuuid.status == 200) {
        //Response was OK
        profile = await resPuuid.json();
    }

    if (resPuuid.status == 429) {
        await timeout(121000)
        resPuuid = await fetch(
            encodeURI(`https://${server}.api.riotgames.com/tft/summoner/v1/summoners/by-name/${summonerName}` + '?api_key=' + RIOT_API_KEY)
        )
        profile = await resPuuid.json();
    }

    return profile.puuid;

}

async function fetchPlayersGameIds(puuid, server) {
    //https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/
    //<puuid>/ids?count=5&api_key=RGAPI-4d0835ee-f6eb-4dd8-b7a8-4172e02e95d4
    //DEV ONLY: count is set to 5
    let resGameIds = await fetch(
        encodeURI(`https://${serverGroups.server}.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}` + '?count=5' + '&api_key=' + RIOT_API_KEY)
    )

    if (resGameIds.status == 200) {
        //Response was OK
        gameIds = await resPuuid.json();
    }

    if (resGameIds.status == 429) {
        await timeout(121000)
        resGameIds = await fetch(
            encodeURI(`https://${server}.api.riotgames.com/tft/summoner/v1/summoners/by-name/${summonerName}` + '?api_key=' + RIOT_API_KEY)
        )
        gameIds = await resGameIds.json();
    }

    return gameIds;

}

main();

//In the end... I want an object that stores: {
//     BR1: [
//         IRON: [
//             compGroups: [
//                 0: {
//                     comps: [
//                         {},
//                         totalMatches: 644,
//                     ]
//                 }
//             ],
//         ],
//         BRONZE: [
//             compGroups: [
//                 0: {
//                     comps: [
//                         {},
//                         totalMatches: 644,
//                     ]
//                 }
//             ],
//         ],
//         SILVER: [
//             compGroups: [
//                 0: {
//                     comps: [
//                         {},
//                         totalMatches: 644,
//                     ]
//                 }
//             ],
//         ],
//         ALL: [ //sum of all ranks in BR1
//             compGroups: [
//                 0: {
//                     comps: [
//                         {},
//                         totalMatches: 644,
//                     ]
//                 }
//             ],
//         ]
//     ] }

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}