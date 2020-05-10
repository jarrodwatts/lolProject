const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
const fetch = require('node-fetch');
const fs = require('fs');

const RIOT_API_KEY = "RGAPI-cefb21ef-3e2f-4bce-8344-59d62dd8f73c"
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
    "BRONZE",
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
    // "II",
    // "III",
    // "IV"
]

let MAIN_GAME_OBJECT = {};
let MAIN_PLAYER_OBJECT = {};
let MAIN_GAME_DETAIL_OBJECT = {};

async function main() {

    //Stores ALL SERVERS
    MAIN_GAME_DETAIL_OBJECT["ALL_SERVERS"] = {}

    for (server of servers) {

        //Store's player Puuids for a given server
        MAIN_PLAYER_OBJECT[server] = {};

        //Stores Game Ids for a given server
        MAIN_GAME_OBJECT[server] = {};

        //Stores Game Details for a given server
        MAIN_GAME_DETAIL_OBJECT[server] = {};

        //Stores ALL RANKS for a given server
        let allRanksForServerGameDetailsObjectsArray = [];

        for (tier of tiers) {

            //Initialize the tier for ALL_SERVERS
            MAIN_GAME_DETAIL_OBJECT["ALL_SERVERS"][tier] = []

            let playerPuuids = [];
            let gameIds = [];
            let gameDetailObjects = [];

            for (division of divisions) {
                let serverTierDivisionPlayerInformation = await fetchAllSummonerInformation(server, tier, division);

                //Get player Puuid's into MAIN_PLAYER_OBJECT.
                for (let i = 0; i < serverTierDivisionPlayerInformation.length; i++) {
                    //console.log("converting", serverTierDivisionPlayerInformation[i].summonerName, "to puuid")
                    let summonerPuuid = await convertNametoPuuid(serverTierDivisionPlayerInformation[i].summonerName, server)
                    playerPuuids.push(summonerPuuid)
                    //console.log("Pushed ", serverTierDivisionPlayerInformation[i].summonerName, "to player puuids arr")
                }

            }

            MAIN_PLAYER_OBJECT[server][tier] = playerPuuids;


            //Loop through servers
            for (serverName in MAIN_PLAYER_OBJECT) {

                //Loop through ranks
                for (rankName in MAIN_PLAYER_OBJECT[serverName]) {

                    //Loop through Puuids
                    for (puuidName of MAIN_PLAYER_OBJECT[serverName][rankName]) {


                        let thisPlayersGameIds = await fetchPlayersGameIds(
                            puuidName, //Puuid
                            server //Actual server name from loop
                        )

                        for (let n = 0; n < thisPlayersGameIds.length; n++) {
                            gameIds.push(thisPlayersGameIds[n])
                            //console.log("Pushed", thisPlayersGameIds[n], "to gameIds")

                            //Now we want to do a similar process, but convert it to game detail
                            let gameDetail = await fetchGameDetailFromId(
                                thisPlayersGameIds[n], //Game Id
                                server //Server
                            )

                            gameDetailObjects.push(gameDetail);
                            allRanksForServerGameDetailsObjectsArray.push(gameDetail);
                        }
                    }
                }
            }

            MAIN_GAME_OBJECT[server][tier] = gameIds;
            MAIN_GAME_DETAIL_OBJECT[server][tier] = gameDetailObjects;

            //Now add this server's rank details to the ALL_SERVERS...
            MAIN_GAME_DETAIL_OBJECT["ALL_SERVERS"][tier].push(gameDetailObjects)

        }

        //this is all ranks for one server
        MAIN_GAME_DETAIL_OBJECT[server]["ALL_RANKS"] = allRanksForServerGameDetailsObjectsArray;

    }

    console.log(MAIN_GAME_OBJECT);

    fs.writeFile("C:/Users/New/Documents/GitHub/lolProject/backend/logs/MAIN_PLAYER_OBJECT.txt", JSON.stringify(MAIN_PLAYER_OBJECT), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The MAIN PLAYER OBJECT file was saved!");
    });

    fs.writeFile("C:/Users/New/Documents/GitHub/lolProject/backend/logs/MAIN_GAME_OBJECT.txt", JSON.stringify(MAIN_GAME_OBJECT), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The MAIN GAME OBJECT file was saved!");
    });

    fs.writeFile("C:/Users/New/Documents/GitHub/lolProject/backend/logs/MAIN_GAME_DETAIL_OBJECT.txt", JSON.stringify(MAIN_GAME_DETAIL_OBJECT), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The MAIN GAME DETAIL OBJECT file was saved!");
    });

}

async function fetchAllSummonerInformation(server, tier, division) {
    // console.log("Fetching", server, tier, division, "Summoner Information");
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

    //console.log("Successfully ocnverted ", summonerName, "to ", profile.puuid)
    return profile.puuid;

}

async function fetchPlayersGameIds(puuid, server) {
    //https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/
    //<puuid>/ids?count=5&api_key=RGAPI-4d0835ee-f6eb-4dd8-b7a8-4172e02e95d4
    let gameIds;
    //DEV ONLY: count is set to 5
    debugger;
    let resGameIds = await fetch(
        encodeURI(`https://${serverGroups[server]}.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?` + '?count=5' + '&api_key=' + RIOT_API_KEY)
    )

    if (resGameIds.status == 200) {
        //Response was OK
        gameIds = await resGameIds.json();
    }

    if (resGameIds.status == 429) {
        await timeout(121000)
        resGameIds = await fetch(
            encodeURI(`https://${serverGroups[server]}.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?` + '?count=5' + '&api_key=' + RIOT_API_KEY)
        )
        gameIds = await resGameIds.json();
    }

    return gameIds;

}

async function fetchGameDetailFromId(gameId, server) {

    let matchDetail;

    try {
        let resMatchDetail = await fetch(
            encodeURI(`https://${serverGroups[server]}.api.riotgames.com/tft/match/v1/matches/${gameId}` + '?api_key=' + RIOT_API_KEY)
        )

        if (resMatchDetail.status == 200) {
            //Response was OK
            matchDetail = await resMatchDetail.json();
        }

        if (resMatchDetail.status == 404) {
            console.log("gameId ", gameId, " could not be found. Skipped.")
        }

        if (resMatchDetail.status == 429) {
            console.log("Rate Limit Exceeded. Waiting two minutes.")
            await timeout(121000)
            resMatchDetail = await fetch(
                encodeURI(`https://${serverGroups[server]}.api.riotgames.com/tft/match/v1/matches/${gameId}` + '?api_key=' + RIOT_API_KEY)
            )
            matchDetail = await resMatchDetail.json();
        }

        return matchDetail;
    }

    catch (err) {
        console.log(err)
    }
}

main();

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}