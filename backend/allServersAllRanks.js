const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
const fetch = require('node-fetch');
const fs = require('fs');

const RIOT_API_KEY = "RGAPI-5a1760a7-9e9b-4d42-93f9-c92b5893d974"
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
    "EUW1", //Europe West
    "JP1", //Japan
    "KR", //Korea
    "LA1", //Latin America North
    "LA2", //Latin America South
    "NA1", //North America
    "OC1", //Oceania
    "RU", //Russia
    "TR1", //Turkey
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
    "SILVER",
    "GOLD",
    "PLATINUM",
    "DIAMOND"
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

const CURRENT_DATA_VERSION = 4;

let MAIN_GAME_OBJECT = {};
let MAIN_PLAYER_OBJECT = {};
let MAIN_GAME_DETAIL_OBJECT = {};

async function main() {

    //Stores ALL SERVERS
    MAIN_GAME_DETAIL_OBJECT["ALL_SERVERS"] = {}

    MAIN_GAME_DETAIL_OBJECT["ALL_SERVERS"]["ALL_RANKS"] = []

    for (server of servers) {
        //Store's player Puuids for a given server
        MAIN_PLAYER_OBJECT[server] = {};

        //Stores Game Ids for a given server
        MAIN_GAME_OBJECT[server] = {};

        //Stores Game Details for a given server
        MAIN_GAME_DETAIL_OBJECT[server] = {};
        MAIN_GAME_DETAIL_OBJECT[server]["ALL_RANKS"] = [];

        for (tier of tiers) {

            //Initialize the tier for ALL_SERVERS
            MAIN_GAME_DETAIL_OBJECT["ALL_SERVERS"][tier] = []
            //Initialize this tier so we can push to it
            MAIN_GAME_DETAIL_OBJECT[server][tier] = [];

            let playerPuuids = [];
            let gameIds = [];

            for (division of divisions) {
                let serverTierDivisionPlayerInformation = await fetchAllSummonerInformation(server, tier, division);
                // for (let i = 0; i < serverTierDivisionPlayerInformation.length; i++) {
                for (let i = 0; i < serverTierDivisionPlayerInformation.length; i++) {
                    //Check if Puuid was found
                    let summonerPuuid = await convertNametoPuuid(serverTierDivisionPlayerInformation[i].summonerName, server)
                    if (summonerPuuid != "Not Found") {
                        playerPuuids.push(summonerPuuid)
                        //console.log("Pushed ", serverTierDivisionPlayerInformation[i].summonerName, "to player puuids arr")
                    }
                }
            }

            MAIN_PLAYER_OBJECT[server][tier] = playerPuuids;

            //Loop through Puuids
            for (puuidName of playerPuuids) {

                let thisPlayersGameIds = await fetchPlayersGameIds(
                    puuidName, //Puuid
                    server //Actual server name from loop
                )

                if (thisPlayersGameIds != "Not Found") {
                    for (let n = 0; n < thisPlayersGameIds.length; n++) {
                        //TODO: Check if this playerGameId is already in 
                        gameIds.push(thisPlayersGameIds[n])

                        //Now we want to do a similar process, but for each game Id, make it a game detail objhect
                        let gameDetail = await fetchGameDetailFromId(
                            thisPlayersGameIds[n], //Game Id
                            server //Server
                        )

                        //Check if match was found
                        if (gameDetail != "Not Found") {
                            //console.log("Pushed", gameDetail)
                            MAIN_GAME_DETAIL_OBJECT[server][tier].push(gameDetail);                 //e.g. BR1 IRON
                            MAIN_GAME_DETAIL_OBJECT[server]["ALL_RANKS"].push(gameDetail);          //e.g. BR1 ALL_RANKS
                            MAIN_GAME_DETAIL_OBJECT["ALL_SERVERS"]["ALL_RANKS"].push(gameDetail);   //e.g. ALL_SERVERS ALL_RANKS
                            MAIN_GAME_DETAIL_OBJECT["ALL_SERVERS"][tier].push(gameDetail);          //e.g. ALL_SERVERS IRON
                        }
                    }
                }
            }
        } //finish tiers loop
    }

    //All servers games have been collected, now perform grouping algorithm on each server and each rank
    for (server in MAIN_GAME_DETAIL_OBJECT) {
        console.log(server)

        for (rank in MAIN_GAME_DETAIL_OBJECT[server]) {
            console.log(server, ":", rank)
            //Just DIRECTLY change/convert the game detail to the comp groupings... forget making a new object
            MAIN_GAME_DETAIL_OBJECT[server][rank] = await groupCompsFromMatches(
                MAIN_GAME_DETAIL_OBJECT[server][rank],
                server,
                rank,
            )

        }
    }

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

    console.log("All done, trying to write to database...");
    //finally.... Add EVERYTHING to the db
    await firebase.database().ref('/comps').set({
        compGroupings: MAIN_GAME_DETAIL_OBJECT
    });

    console.log("Successfully published to Datbabase.");

}

async function fetchAllSummonerInformation(server, tier, division) {
    try {
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
    catch (error) {
        console.log(error);
    }
}

async function convertNametoPuuid(summonerName, server) {

    try {
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

    catch (error) {
        console.log(error)
        return "Not Found"
    }

}

async function fetchPlayersGameIds(puuid, server) {
    try {
        let gameIds;
        //DEV ONLY: count is set to 5
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

        gameIds.length = 5; //DEV ONLY: Chop it to 5

        return gameIds;

    }

    catch (error) {
        console.log(error);
        return "Not Found"
    }

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
            //return checker to make sure we don't push it
            return "Not Found";
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
        return "Not Found"
    }
}

async function groupCompsFromMatches(matches, server, tier) {
    try {

        //1. Create the MasterArray containing all Comps and their items
        let masterArray = await createArrayOfAllComps(matches);
        console.log(server, tier, "MasterArray completed")
        //2. Create the Unique Array containing only unique comps + their winrates, and other attributes.
        let uniqueArray = await createUniqueArrayOfComps(masterArray);
        console.log(server, tier, "Unique Comps derived from Master.")
        console.log(server, tier, "UniqueArray:", uniqueArray)
        //3. Create the comp groupings with similarity algorithm
        let compGroupings = await createCompGroupings(uniqueArray);
        console.log(server, tier, "Comp Groupings completed.")
        console.log(server, tier, "compGroupings:", compGroupings)

        //4. Clean the results ready to pass to the API
        let FINAL_RESULTS = await cleanResults(compGroupings);
        console.log(server, tier, "Results cleaned.")
        console.log(server, tier, "Final Results");

        return FINAL_RESULTS;
    }

    catch (err) {
        console.log(err);
    }
}

async function createArrayOfAllComps(matches) {
    let masterArray = [];

    try {
        for (let i = 0; i < matches.length; i++) {

            try {
                for (let x = 0; x < matches[i].info.participants.length; x++) {
                    let tempArr = matches[i].info.participants[x].units.sort(function (a, b) {

                        var otherX = a.character_id.toLowerCase();
                        var otherY = b.character_id.toLowerCase();

                        if (otherX < otherY) { return -1; }
                        if (otherX > otherY) { return 1; }
                        return 0;
                    });


                    let tempPlacement = matches[i].info.participants[x].placement;

                    let tempObj = {
                        comp: tempArr,
                        traits: matches[i].info.participants[x].traits,
                        placementsArray: [tempPlacement],
                        winLoss: {
                            win: 0,
                            loss: 0
                        },
                        matches: 1,
                        placement: tempPlacement
                    }

                    //5. Push the units array to master array
                    masterArray.push(tempObj);
                }
            }

            catch (error) { console.log(error) }
        }

        return masterArray;
    }

    catch (error) {
        console.log(error)
    }
}

async function createUniqueArrayOfComps(masterArray) {
    let uniqueArray = [];
    try {
        for (let p = 0; p < masterArray.length; p++) {
            let actionTaken = false;

            if (uniqueArray.length == 0) {
                let tempObj = {
                    comp: masterArray[p].comp,
                    traits: masterArray[p].traits,
                    placementsArray: [masterArray[p].placement],
                    winLoss: {
                        win: 0,
                        loss: 0
                    },
                    matches: masterArray[p].matches,
                    averagePlacement: masterArray[p].placement,

                }
                masterArray[p].placement == 1 ? tempObj.winLoss.win++ : tempObj.winLoss.loss++
                uniqueArray.push(tempObj)
            }

            else {
                let thisComp = masterArray[p].comp;

                for (let n = 0; n < uniqueArray.length; n++) {
                    let comparisonComp = uniqueArray[n].comp

                    if (isArrayEqual(thisComp, comparisonComp)) {
                        masterArray[p].placement == 1 ? uniqueArray[n].winLoss.win++ : uniqueArray[n].winLoss.loss++
                        uniqueArray[n].matches++;
                        uniqueArray[n].placementsArray.push(masterArray[p].placement)

                        uniqueArray[n].averagePlacement = (
                            uniqueArray[n].placementsArray.reduce((a, b) => a + b) / uniqueArray[n].matches
                        )
                        actionTaken = true;
                        n = uniqueArray.length;
                    }
                }

                if (actionTaken == false) {
                    let tempObj = {
                        comp: masterArray[p].comp,
                        placementsArray: [masterArray[p].placement],
                        traits: masterArray[p].traits,
                        winLoss: {
                            win: 0,
                            loss: 0
                        },
                        matches: 1,
                        averagePlacement: masterArray[p].placement,
                    }
                    masterArray[p].placement == 1 ? tempObj.winLoss.win++ : tempObj.winLoss.loss++;
                    uniqueArray.push(tempObj)
                    actionTaken = true;
                }
            }
        }
        //Calculate a winrate for each unique comp
        for (let i = 0; i < uniqueArray.length; i++) {
            uniqueArray[i]["winRatio"] = Math.round(uniqueArray[i].winLoss.win / (uniqueArray[i].winLoss.win + uniqueArray[i].winLoss.loss) * 100) / 100
        }
        return uniqueArray;
    }
    catch (error) {
        console.log(error)
    }
}

async function createCompGroupings(uniqueArray) {

    let compGroupings = [];
    let actionTaken = false;

    try {
        //Loop through each item in the uniqueArray
        for (let i = 0; i < uniqueArray.length; i++) {
            actionTaken = false;
            //If we can find a suitable match in compGroupings then push it to that,
            for (let x = 0; x < compGroupings.length; x++) {
                //Is this comp similar in any of the comp groupings comp variations?
                console.log(x)
                //let temp = compGroupings[x].comps[y];
                for (let y = 0; y < compGroupings[x].comps.length; y++) {

                    if (produceSimilarity(uniqueArray[i].comp, compGroupings[x].comps[y].comp) > 74) {
                        //True: the comps were similar... Meaning this uniqueComp was similar to a compGrouping we already have.
                        //Add it, 
                        compGroupings[x].comps.push(uniqueArray[i])

                        //Flag so we can stop
                        actionTaken = true;

                        //and stop looping through this
                        break;


                    }
                    //False (no else required): There wasn't a similar comp so we move past this comp grouping, and look inside the next comp Grouping
                }
                //Also stop looping through all compGroupings since we've laready done something to it
                if (actionTaken) { break; }
            }
            //If we didn't find any compgroups that matched this... then we move on and create a new compGrouping
            if (!actionTaken) {
                let newCompGroup = {
                    comps: [
                        uniqueArray[i]
                    ]
                }
                compGroupings.push(newCompGroup);
            }
        }
        return compGroupings;
    }
    catch (error) {
        console.error(error)
    }
}

async function cleanResults(compGroupings) {
    try {
        //If a comp variation has less than 50 chop it
        for (var i = compGroupings.length - 1; i >= 0; i--) {
            for (var x = compGroupings[i].comps.length - 1; x >= 0; x--) {
                if (compGroupings[i].comps[x].matches < 50) {
                    compGroupings[i].comps.splice(x, 1);
                }
            }
            if (compGroupings[i].comps.length == 0) {
                compGroupings.splice(i, 1);
            }
        }

        //Add a field to each compGrouping that is total matches
        for (let i = 0; i < compGroupings.length; i++) {
            compGroupings[i]["totalMatches"] = sumMatches(compGroupings[i]);
        }

        //Clean out comps with less than 100 TOTAL matches
        for (var i = compGroupings.length - 1; i >= 0; i--) {
            if (compGroupings[i].totalMatches < 100) {
                compGroupings.splice(i, 1);
            }
        }

        //Sort each compGrouping's comp by win ratio, lowest to highest
        for (let i = 0; i < compGroupings.length; i++) {
            compGroupings[i].comps.sort((a, b) => a.winRatio - b.winRatio);
        }

        //Sort entire compGroupings array by the first comps total matches
        compGroupings.sort((a, b) =>
            b.totalMatches - a.totalMatches
        );

        return compGroupings;
    }
    catch (error) {
        console.log(error)
    }
}

function sumMatches(compGrouping) {
    //for each comp grouping, sum up each children's matches and add them to a sum
    try {
        sum = 0;
        for (let i = 0; i < compGrouping.comps.length; i++) {
            sum += compGrouping.comps[i].matches
        }
        return sum;
    }
    catch (error) {
        console.log(error);
        return 0;
    }
}

function isArrayEqual(arr1, arr2) {

    try {
        //Check if comps are the same length first before comparing
        if (arr1.length == arr2.length) {

            arr1 = arr1.sort(function (a, b) {
                var x = a.character_id.toLowerCase();
                var y = b.character_id.toLowerCase();
                if (x < y) { return -1; }
                if (x > y) { return 1; }
                return 0;
            });

            arr2 = arr2.sort(function (a, b) {
                var x = a.character_id.toLowerCase();
                var y = b.character_id.toLowerCase();
                if (x < y) { return -1; }
                if (x > y) { return 1; }
                return 0;
            });

            for (var i = 0; i < arr1.length; i++) {
                if (arr1[i].character_id !== arr2[i].character_id)
                    return false;
            }

            return true;
        }

        else { return false; }
    }

    catch (error) {
        console.log(error);
        return false;
    }
}

function produceSimilarity(a, b) {
    let matched = 0;

    try {
        let total;
        let tempA = a;
        let tempB = b;
        //Grab which ever one is longer for total

        //If A is longer, compare each item of b to a
        if (tempA.length > tempB.length) {
            total = tempA.length;
            for (let i = 0; i < tempA.length; i++) {

                let temp1 = tempA.map((champ => champ.character_id))
                let temp2 = tempB.map((champ => champ.character_id))

                if (temp1.includes(temp2[i])) {
                    matched++
                }
            }
        }

        //If b is longer, compare each item of a to b
        else {
            total = tempB.length;
            for (let i = 0; i < tempB.length; i++) {
                //TODO: here's an error... it's not included above.
                let temp1 = tempA.map((champ => champ.character_id))
                let temp2 = tempB.map((champ => champ.character_id))

                if (temp2.includes(temp1[i])) {
                    matched++
                }
            }
        }
        return (matched / total) * 100
    }
    catch (error) {
        console.log(error);
        return 0;
    }
}

main();

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}