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
    // "IRON",
    // "BRONZE",
    // "SILVER",
    // "GOLD",
    // "PLATINUM",
    // "DIAMOND",

    // //pro tiers
    //"MASTER",
    //"GRANDMASTER",
    "CHALLENGER",
]

const divisions = [
    "I",
    "II",
    "III",
    "IV"
]

const CURRENT_DATA_VERSION = 4;
const CURRENT_PATCH = "Version 10.14";

let MAIN_GAME_OBJECT = {};
let MAIN_PLAYER_OBJECT = {};
let MAIN_GAME_DETAIL_OBJECT = {};

//Stores ALL SERVERS
MAIN_GAME_DETAIL_OBJECT["ALL_SERVERS"] = {}
MAIN_GAME_DETAIL_OBJECT["ALL_SERVERS"]["ALL_RANKS"] = []

async function runFillForServer(server) {
    //wait 5 secs for debug 
    await timeout(5000)
    //Store's player Puuids for a given server
    MAIN_PLAYER_OBJECT[server] = {};
    //Stores Game Ids for a given server
    MAIN_GAME_OBJECT[server] = {};

    //Stores Game Details for a given server
    MAIN_GAME_DETAIL_OBJECT[server] = {
        //"IRON": [],
        //"BRONZE": [],
        //"SILVER": [],
        //"GOLD": [],
        //"PLATINUM": [],
        //"DIAMOND": [],
        //"MASTER": [],
        //"GRANDMASTER": [],
        "CHALLENGER": [],
        "ALL_RANKS": [],
    };

    for (tier of tiers) {

        //Initialize the tier for ALL_SERVERS
        MAIN_GAME_DETAIL_OBJECT["ALL_SERVERS"][tier] = []
        //Initialize this tier so we can push to it
        //MAIN_GAME_DETAIL_OBJECT[server][tier] = [];

        let playerPuuids = [];
        let gameIds = [];

        for (division of divisions) {

            //for pro leagues, the url is different and the response is different and there is only one division
            if (tier == "MASTER" || tier == "GRANDMASTER" || tier == "CHALLENGER") {

                let serverTierDivisionPlayerInformation = await fetchAllSummonerInformationForProDivision(server, tier);
                for (let i = 0; i < serverTierDivisionPlayerInformation.length; i++) {
                    //Check if Puuid was found
                    try {
                        let summonerPuuid = await convertNametoPuuid(serverTierDivisionPlayerInformation[i].summonerName, server)
                        if (summonerPuuid != "Not Found") {
                            try {
                                playerPuuids.push(summonerPuuid)
                            }
                            catch (error) {
                                console.log(server, ":", tier, ":", division, ":", error)
                            }
                        }
                    }
                    catch (error) {
                        //debugger;
                        console.log(server, ":", tier, "on:", serverTierDivisionPlayerInformation[i], "error:", error)
                    }
                }
                //break division loop since there is only one division
                break;
            }

            else {

                let serverTierDivisionPlayerInformation = await fetchAllSummonerInformation(server, tier, division);
                for (let i = 0; i < serverTierDivisionPlayerInformation.length; i++) {
                    //Check if Puuid was found
                    try {
                        let summonerPuuid = await convertNametoPuuid(serverTierDivisionPlayerInformation[i].summonerName, server)
                        if (summonerPuuid != "Not Found") {
                            try {
                                playerPuuids.push(summonerPuuid)
                            }
                            catch (error) {
                                console.log(server, ":", tier, ":", division, ":", error)
                            }
                        }
                    }
                    catch (error) {
                        //debugger;
                        console.log(server, ":", tier, ":", division, ":", "on:", serverTierDivisionPlayerInformation[i], "error:", error)
                    }
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
                        try {
                            if (gameDetail.info.game_version.includes(CURRENT_PATCH)) {

                                //console.log("Pushed", gameDetail)
                                MAIN_GAME_DETAIL_OBJECT[server][tier].push(gameDetail);                 //e.g. BR1 IRON
                                MAIN_GAME_DETAIL_OBJECT[server]["ALL_RANKS"].push(gameDetail);          //e.g. BR1 ALL_RANKS
                                MAIN_GAME_DETAIL_OBJECT["ALL_SERVERS"]["ALL_RANKS"].push(gameDetail);   //e.g. ALL_SERVERS ALL_RANKS
                                MAIN_GAME_DETAIL_OBJECT["ALL_SERVERS"][tier].push(gameDetail);          //e.g. ALL_SERVERS IRON
                                console.log("Pushed game to", server, tier);
                            }
                        }
                        catch (error) {
                            //debugger;
                            console.log(server, ":", tier, ": Error pushing game:", error);
                        }
                    }
                }
            }
        }
    } //finish tiers loop

    //gotta return something to await it...?
    return MAIN_GAME_DETAIL_OBJECT[server];
}

async function fillAllServersInParallel() {

    //do all the servers at once
    let BR1 = runFillForServer("BR1")
    let EUN1 = runFillForServer("EUN1")
    let EUW1 = runFillForServer("EUW1")
    let JP1 = runFillForServer("JP1")
    let KR = runFillForServer("KR")
    let LA1 = runFillForServer("LA1")
    let LA2 = runFillForServer("LA2")
    let NA1 = runFillForServer("NA1")
    let OC1 = runFillForServer("OC1")
    let RU = runFillForServer("RU")
    let TR1 = runFillForServer("TR1")

    //await the results;
    let resultedBR1 = await BR1;
    let resultedEUN1 = await EUN1;
    let resultedEUW1 = await EUW1;
    let resultedJP1 = await JP1;
    let resultedKR = await KR;
    let resultedLA1 = await LA1;
    let resultedLA2 = await LA2;
    let resultedNA1 = await NA1;
    let resultedOC1 = await OC1;
    let resultedRU = await RU;
    let resultedTR1 = await TR1;

    //All servers games have been collected, now perform grouping algorithm on each server and each rank
    for (server in MAIN_GAME_DETAIL_OBJECT) {

        for (rank in MAIN_GAME_DETAIL_OBJECT[server]) {
            console.log("Running groupComps for:", server, ":", rank);
            try {
                //Just DIRECTLY change/convert the game detail to the comp groupings... forget making a new object
                MAIN_GAME_DETAIL_OBJECT[server][rank] = await groupCompsFromMatches(
                    MAIN_GAME_DETAIL_OBJECT[server][rank],
                    server,
                    rank,
                )
            } catch (error) {
                console.log(error);
            }

        }
    }
}

async function fetchAllSummonerInformation(server, tier, division) {
    try {
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
            console.log("Chilling for two minutes on server", server)
            await timeout(121000);
            serverTierDivisionPlayerInformation = await resServerTierDivisionPlayerInformation.json();
        }

        //DEV ONLY: REDUCE PLAYER LIMIT TO 10
        // if (serverTierDivisionPlayerInformation.length > 9) {
        //     serverTierDivisionPlayerInformation.length = 10;
        // }

        return serverTierDivisionPlayerInformation;
    }
    catch (error) {
        console.log(error);
    }
}

//copied function for pro leagues
async function fetchAllSummonerInformationForProDivision(server, tier) {
    try {
        console.log("Fetching", server, "Summoner Information for", tier);
        let serverTierDivisionPlayerInformation;

        let resServerTierDivisionPlayerInformation = await fetch(
            encodeURI(`https://${server.toLowerCase()}.api.riotgames.com/tft/league/v1/${tier.toLowerCase()}` + '?api_key=' + RIOT_API_KEY)
        )

        if (resServerTierDivisionPlayerInformation.status == 200) {
            serverTierDivisionPlayerInformation = await resServerTierDivisionPlayerInformation.json();
        }

        if (resServerTierDivisionPlayerInformation.status == 404) {
            //Something not found
            console.error("Recieved a 404 response on: ", server, tier)
        }

        if (resServerTierDivisionPlayerInformation.status == 429) {
            //Too many requests
            console.log("Chilling for two minutes on server", server)
            await timeout(121000);
            serverTierDivisionPlayerInformation = await resServerTierDivisionPlayerInformation.json();
        }

        //DEV ONLY: REDUCE PLAYER LIMIT TO 10
        // if (serverTierDivisionPlayerInformation['entries'].length > 9) {
        //     serverTierDivisionPlayerInformation['entries'].length = 10;
        // }

        return serverTierDivisionPlayerInformation['entries'];
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
            //Response was OKfunction
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
            console.log(server, ":Rate Limit Exceeded. Waiting two minutes.")
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

        //5. Write to the Database
        let WRITE_TO_DATABASE = await writeResultsToDatabase(compGroupings, server, tier);
        console.log(server, tier, ": Wrote to Database")

        return FINAL_RESULTS;
    }

    catch (err) {
        console.log(err);
    }
}

async function createArrayOfAllComps(matches) {
    let masterArray = [];

    for (let i = 0; i < matches.length; i++) {

        try {
            //check if data is iterable
            if (matches[i] &&
                matches[i].info &&
                matches[i].info.participants) {

                for (let x = 0; x < matches[i].info.participants.length; x++) {
                    //check if data is iterable
                    if (matches[i].info.participants[x].units) {
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
            }
        }

        catch (error) {
            console.log(error)
        }
    }
    return masterArray;
}

async function createUniqueArrayOfComps(masterArray) {

    let uniqueDictionary = {};

    for (let p = 0; p < masterArray.length; p++) {
        try {
            //1. Grab comp units to strip them

            let thisCompsUnitsArray = masterArray[p].comp.map((champ => champ.character_id))

            //...are they sorted?...

            //2. Stringify it
            let stringifyThisCompsUnitsArray = JSON.stringify(thisCompsUnitsArray);

            //3. Ask if this exists (it won't here) ... if it does : add to it, if it doesn't: MAKE it.
            if (uniqueDictionary[stringifyThisCompsUnitsArray]) {
                //True:
                uniqueDictionary[stringifyThisCompsUnitsArray].placementsArray.push(masterArray[p].placement) //placements
                masterArray[p].placement == 1 ? uniqueDictionary[stringifyThisCompsUnitsArray].winLoss.win++ : uniqueDictionary[stringifyThisCompsUnitsArray].winLoss.loss++ //winLoss

                uniqueDictionary[stringifyThisCompsUnitsArray].matches++ //matches

                uniqueDictionary[stringifyThisCompsUnitsArray].averagePlacement = (
                    uniqueDictionary[stringifyThisCompsUnitsArray].placementsArray.reduce((a, b) => a + b) / uniqueDictionary[stringifyThisCompsUnitsArray].matches //average placement
                )
            }

            else {
                //False:
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
                uniqueDictionary[stringifyThisCompsUnitsArray] = tempObj
            }
        }

        catch (error) {
            console.log(error);
        }
    }

    //convert it to array?
    let uniqueArray = Object.keys(uniqueDictionary).map(i => uniqueDictionary[i])

    //Calculate a winrate for each unique comp
    for (let i = 0; i < uniqueArray.length; i++) {
        uniqueArray[i]["winRatio"] = Math.round(uniqueArray[i].winLoss.win / (uniqueArray[i].winLoss.win + uniqueArray[i].winLoss.loss) * 100) / 100
    }

    //return unqiueArray;
    return uniqueArray;
}

async function createCompGroupings(uniqueArray) {

    let compGroupings = [];
    let actionTaken = false;

    //Loop through each item in the uniqueArray
    for (let i = 0; i < uniqueArray.length; i++) {
        try {
            actionTaken = false;
            //If we can find a suitable match in compGroupings then push it to that,
            for (let x = 0; x < compGroupings.length; x++) {
                //Is this comp similar in any of the comp groupings comp variations?
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
        catch (error) {
            console.error(error)
        }
    }
    return compGroupings;

}

async function cleanResults(compGroupings) {
    //debugger;
    try {
        //Add a field to each compGrouping that is total matches
        for (let i = 0; i < compGroupings.length; i++) {
            compGroupings[i]["totalMatches"] = sumMatches(compGroupings[i]);
        }

        //Add a field to each compGrouping that is top 4 rate
        for (let i = 0; i < compGroupings.length; i++) {
            compGroupings[i]["topFourRate"] = createCompGroupingTopFourRate(compGroupings[i]);
        }

        //Add field for each comp grouping variation
        for (let i = 0; i < compGroupings.length; i++) {
            for (let x = 0; x < compGroupings[i].comps.length; x++) {
                compGroupings[i].comps[x]["topFourRate"] = createCompVariationTopFourRate(compGroupings[i].comps[x].placementsArray)
            }
        }

        //Add a field to each compGrouping that is win rate
        for (let i = 0; i < compGroupings.length; i++) {
            compGroupings[i]["winRate"] = createCompGroupingWinRate(compGroupings[i]);
        }

        //Add field for each comp group variation for win rate
        for (let i = 0; i < compGroupings.length; i++) {
            for (let x = 0; x < compGroupings[i].comps.length; x++) {
                compGroupings[i].comps[x]["winRate"] = createCompVariationWinRate(compGroupings[i].comps[x].placementsArray)
            }
        }

        //Add a field for each compGroupings average placement
        for (let i = 0; i < compGroupings.length; i++) {
            compGroupings[i]["averagePlacement"] = createCompAveragePlacement(compGroupings[i]);
        }

        //Sort each compGrouping's comp by matches
        for (let i = 0; i < compGroupings.length; i++) {
            compGroupings[i].comps.sort((a, b) => b.matches - a.matches);
            //also chop the variations length to 5 i guess
            if (compGroupings[i].comps.length > 5) {
                compGroupings[i].comps.length = 5;
            }
        }

        //Sort entire compGroupings array by total matches
        compGroupings.sort((a, b) =>
            b.totalMatches - a.totalMatches
        );

        //chop out empty comps
        for (let i = 0; i < compGroupings.length; i++) {
            for (let x = 0; x < compGroupings[i].comps.length; x++) {
                if (compGroupings[i].comps[x].comp == [] ||
                    compGroupings[i].comps[x].comp == undefined //empty comps
                ) {
                    //splice it out of the array
                    compGroupings[i].comps[x].splice(x, 1)
                }

                //same for traits
                if (compGroupings[i].comps[x].traits == [] ||
                    compGroupings[i].comps[x].traits == undefined ||
                    !compGroupings[i].comps[x].traits
                ) {
                    //splice it out of the array
                    compGroupings[i].comps[x].splice(x, 1)
                }
            }
        }

        //chop compGroupings to 20
        compGroupings.length = 20;

        //Sort each compGrouping's comp by unit rarity
        for (let i = 0; i < compGroupings.length; i++) {
            for (let x = 0; x < compGroupings[i].comps.length; x++) {
                compGroupings[i].comps[x].comp.sort((a, b) => a.rarity - b.rarity);
            }
        }

        //Remove empty comps from dodgy data im guessing
        //for (let server in compGroupings) {
        for (let p = 0; p < compGroupings.length; p++) {
            for (let i = 0; i < compGroupings[p].comps.length; i++) {
                //clean unmappable data
                try {
                    if (!compGroupings[p].comps[i].comp) {
                        //remove this cos we cant map it
                        compGroupings[p].splice(i, 1);
                        console.log("spliced", server, rank, i)
                    }
                }
                catch (error) {
                    console.log("Error in cleaning empty comps", error)
                }

            }
        }

        return compGroupings;
    }

    catch (error) {
        console.log(error)
    }
}

async function writeResultsToDatabase(compGroupings, server, tier) {
    try {
        console.log("Trying to write", server, tier, "to database");

        await firebase.database().ref(`/comps/${server}/${tier}`).set(
            JSON.parse(JSON.stringify(compGroupings)),

            //second parameter is a callback
            function (error) {
                if (error) {
                    //the write failed...
                    console.log("The write to dataabse for ", server, tier, "failed... error:", error)
                }
                else {
                    //Data saved successfully
                    console.log("Successfully wrote data for ", server, tier);
                }
            }
        );
    }

    catch (error) {
        console.log(error);
        return 0;
    }
}

function sumMatches(compGrouping) {
    //for each comp grouping, sum up each children's matches and add them to a sum
    try {
        let sum = 0;
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

function createCompGroupingTopFourRate(compGrouping) {
    //for each comp grouping, sum up each children's matches and add them to a sum
    try {
        let numOfTopFours = 0;
        let numOfMatches = 0;
        for (let i = 0; i < compGrouping.comps.length; i++) {
            for (let x = 0; x < compGrouping.comps[i].placementsArray.length; x++) {
                //is placement array x a win
                if (compGrouping.comps[i].placementsArray[x] < 5) {
                    numOfTopFours++;
                }
                numOfMatches++;
                //compGrouping.comps[i].placementsArray[x] < 5 ? (() => { numOfTopFours++; numOfMatches++; }) : (() => { numOfMatches++; })
            }
        }

        return Math.round((numOfTopFours / numOfMatches) * 100);
    }
    catch (error) {
        console.log(error);
        return 0;
    }
}

function createCompGroupingWinRate(compGrouping) {
    //for each comp grouping, sum up each children's matches and add them to a sum
    try {
        let numOfWins = 0;
        let numOfMatches = 0;
        for (let i = 0; i < compGrouping.comps.length; i++) {
            for (let x = 0; x < compGrouping.comps[i].placementsArray.length; x++) {
                if (compGrouping.comps[i].placementsArray[x] == 1) {
                    numOfWins++;
                }
                numOfMatches++;
            }
        }

        return Math.round((numOfWins / numOfMatches) * 100);
    }
    catch (error) {
        console.log(error);
        return 0;
    }
}

function createCompVariationWinRate(placementsArray) {
    try {
        let numOfTopFours = 0;
        let numOfMatches = 0;

        for (let i = 0; i < placementsArray.length; i++) {
            if (placementsArray[i] == 1) {
                numOfTopFours++;
            }
            numOfMatches++;
        }

        return Math.round((numOfTopFours / numOfMatches) * 100);
    }
    catch (error) {
        console.log(error)
        return 0;
    }
}

function createCompAveragePlacement(compGrouping) {
    try {
        let sumToDivide = 0;
        let numOfMatches = 0;

        for (let i = 0; i < compGrouping.comps.length; i++) {
            for (let x = 0; x < compGrouping.comps[i].placementsArray.length; x++) {
                sumToDivide += compGrouping.comps[i].placementsArray[x];
                numOfMatches++;
            }
        }
        return Math.round((sumToDivide / numOfMatches) * 100) / 100;
    }

    catch (error) {
        console.log(error);
        return 0;
    }
}

function createCompVariationTopFourRate(placementsArray) {
    try {
        let numOfWins = 0;
        let numOfMatches = 0;

        for (let i = 0; i < placementsArray.length; i++) {
            if (placementsArray[i] < 5) {
                numOfWins++;
            }
            numOfMatches++;
        }

        return Math.round((numOfWins / numOfMatches) * 100);
    }
    catch (error) {

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

            let temp1 = tempA.map((champ => champ.character_id))
            let temp2 = tempB.map((champ => champ.character_id))

            for (let i = 0; i < tempA.length; i++) {
                if (temp1.includes(temp2[i])) {
                    matched++
                }
            }
        }

        //If b is longer (or they're the same length), compare each item of a to b
        else {
            total = tempB.length;

            let temp1 = tempA.map((champ => champ.character_id))
            let temp2 = tempB.map((champ => champ.character_id))

            for (let i = 0; i < tempB.length; i++) {

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

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//run it
fillAllServersInParallel();