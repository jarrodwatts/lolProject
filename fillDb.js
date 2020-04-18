const fetch = require('isomorphic-unfetch');

const RIOT_API_KEY = "RGAPI-ab6fe2c4-9d06-4763-b5e3-0c7ff535c19e"

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://jarrod:AwPz9DLa0izkzHnA@matchcluster-tdshe.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

client.connect(err => {
    //if (err) throw err;
    const collection = client.db("matchDatabase").collection("matchCollection");

    //1. Grab top 200 players
    //https://oc1.api.riotgames.com/tft/league/v1/challenger?
    fetch(
        `https://oc1.api.riotgames.com/tft/league/v1/challenger` + '?api_key=' + RIOT_API_KEY
    )
        .then((r) => r.json())
        .then(
            (data) => {
                let challengers = data;
                let puuids = [];
                let matchIds = [];
                let matchDetails = [];

                //Loop through each Challenger
                for (let x = 0; x < 4; x++) {
                    //console.log(challengers.entries[x].summonerName)

                    //Make a call to puuid API with this challenger
                    fetch(
                        `https://oc1.api.riotgames.com/tft/summoner/v1/summoners/by-name/${challengers.entries[x].summonerName}` + '?api_key=' + RIOT_API_KEY
                    )
                        .then((r) => r.json())
                        .then((data) => {
                            //push the puuid to puuids
                            puuids.push(data.puuid)

                            //After we do that, make a request with the current puuid to grab this puuid's matches
                            fetch(`https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/${data.puuid.toString()}/ids?count=20&` + 'api_key=' + RIOT_API_KEY)
                                .then((r) => r.json())
                                .then((data) => {
                                    //push the matches to matchIds
                                    //by looping through each item of the array

                                    //temp 1 loop which means we'll do 4 summoners x 1 game = 4 results
                                    for (let i = 0; i < 2; i++) {
                                        matchIds.push(data[i]);
                                        //console.log("length:", matchIds.length);

                                        fetch(`https://americas.api.riotgames.com/tft/match/v1/matches/${data[i]}` + '?api_key=' + RIOT_API_KEY)
                                            .then((r) => r.json())
                                            .then((data) => {
                                                //console.log("DATA:", data)
                                                matchDetails.push(data)

                                                console.log("Summoner", x, ", Match", i, matchDetails[i]);

                                                //Add to MongoDB this match/"data"
                                                collection.insertOne(data);
                                                
                                            })
                                    }

                                    //With each matchid, make a request to the match details API
                                    // for (let m = 0; m < 2; m++) {

                                    // }

                                })
                        })
                    // .then(console.log(matchIds))
                }

            })
})


// //get All summoner Id's from challengers
// let challengerSummonerIds = challengers.entries.map((challenger) => { challenger.summonerId });

// console.log(challengerSummonerIds);