// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const firebase = require("firebase/app");
// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
const fetch = require('node-fetch');

const RIOT_API_KEY = "RGAPI-20f7879b-47a6-4c74-bbf2-0908de9828a4"

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

async function main() {
    //1. Grab a list of challengers
    let challengers = await grabChallengers();
    console.log("Grabbed Challengers")

    //2. Grab all their summonerNames so we can find out their puuid's
    let challengerSummonerNames = await createChallengerNamesArray(challengers);
    console.log("Grabbed Summoner Names")

    //3. Get All Puuids
    let playerPuuids = await grabPuuids(challengerSummonerNames);
    console.log("Grabbed Summoner Puuids")

    //4. Ask the Matches API to grab these challenger's puuid's matches.
    let matchIds = await grabMatchIds(playerPuuids);
    console.log("Grabbed MatchIds")

    //5. For each MatchId, ask the match Details API to give the matches detials
    let matches = await grabMatchDetails(matchIds);
    console.log("Grabbed Match Details")

    //6. Add 1 document per match to the collection   
    //TODO: This is most likely not necessary and going to cost me
    // for (let i = 0; i < matches.length; i++) {
    //     await db.collection('matches').add(
    //         {
    //             match: matches[i]
    //         })
    //         .then((ref) => console.log('Added document with ID: ', ref.id))
    //         .catch((err) => console.log(err))
    // }

    //7. Grouping algorithm on all matches -> Unique Comp Groupings
    await groupCompsFromMatches(matches);

}

async function grabChallengers() {
    try {
        const resChallengers = await fetch(
            `https://oc1.api.riotgames.com/tft/league/v1/challenger` + '?api_key=' + RIOT_API_KEY
        );

        const challengersWithMetadata = await resChallengers.json();
        const challengers = challengersWithMetadata.entries;
        return challengers;
    }
    catch (err) {
        console.log(err)
    }
}

async function createChallengerNamesArray(challengers) {
    try {
        let challengerSummonerNames = [];
        for (let i = 0; i < challengers.length; i++) {
            //for (let i = 0; i < 1; i++) {
            challengerSummonerNames.push(challengers[i].summonerName)
        }
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
            //for (let i = 0; i < 2; i++) {
            let resPuuid = await fetch(
                encodeURI(`https://oc1.api.riotgames.com/tft/summoner/v1/summoners/by-name/${challengerSummonerNames[i]}` + '?api_key=' + RIOT_API_KEY)
            )

            if (resPuuid.status == 200) {
                //Response was OK
                let profile = await resPuuid.json();
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
                matches.push(matchDetail);
            }

        }
        return matches;

    }

    catch (err) {
        console.log(err)
    }
}

async function groupCompsFromMatches(matches) {
    try {
        //1. Create the MasterArray containing all Comps and their items
        let masterArray = await createArrayOfAllComps(matches);
        console.log("MasterArray completed")
        //2. Create the Unique Array containing only unique comps + their winrates, and other attributes.
        let uniqueArray = await createUniqueArrayOfComps(masterArray);
        console.log("Unique Comps derived from Master.")
        console.log("UniqueArray:", uniqueArray)
        //3. Create the comp groupings with similarity algorithm
        let compGroupings = await createCompGroupings(uniqueArray);
        console.log("Comp Groupings completed.")
        console.log("compGroupings:", compGroupings)

        //4. Clean the results ready to pass to the API
        let FINAL_RESULTS = await cleanResults(compGroupings);
        console.log("Results cleaned.")
        console.log("Final Results:", FINAL_RESULTS);
        //5. Loop through each result and add it to the database.
        for (let i = 0; i < FINAL_RESULTS.length; i++) {
            await db.collection('comps').add(
                {
                    comp: FINAL_RESULTS[i]
                })
                .then((ref) => console.log('Added document with ID: ', ref.id))
                .catch((err) => console.log(err))
        }
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
        //Add a field to each compGrouping that is total matches
        for (let i = 0; i < compGroupings.length; i++) {
            compGroupings[i]["totalMatches"] = sumMatches(compGroupings[i]);
        }
        
        //Clean out comps with less than 50 total matches
        for (var i = compGroupings.length - 1; i >= 0; i--) {
            if (compGroupings[i].totalMatches < 50) {
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

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function sumMatches(compGrouping) {
    //for each comp grouping, sum up each children's matches and add them to a sum
    sum = 0;
    for (let i = 0; i < compGrouping.comps.length; i++) {
        sum += compGrouping.comps[i].matches
    }
    return sum;
}

function isArrayEqual(arr1, arr2) {

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

function produceSimilarity(a, b) {
    let matched = 0;
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

function produceTraitSimilarity(a, b) {
    //Expects two trait array of objects
    //Returns a true or false
    let x = a.filter(trait => trait.tier_total > 1)
    let y = b.filter(trait => trait.tier_total > 1)

    x.sort((a, b) => b.num_units - a.num_units);
    y.sort((a, b) => b.num_units - a.num_units);

    x.length = 2;
    y.length = 2;

    console.log(x)
    console.log(y)

    try {
        return (x[0].name == y[0].name || x[0].name == y[1].name && x[1].name == y[1].name || x[1].name == y[0].name)
    }
    catch (error) {
        console.error("A was: ", a, " B was: ", b, " Error was", error)
        return false;
    }

}

main();