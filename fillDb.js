const fetch = require('isomorphic-unfetch');
const RIOT_API_KEY = "RGAPI-ab6fe2c4-9d06-4763-b5e3-0c7ff535c19e"

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://jarrod:AwPz9DLa0izkzHnA@matchcluster-tdshe.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

client.connect(err => {
    const collection = client.db("matchDatabase").collection("matchCollection3");

    //1. Grab top challenger players
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
                for (let x = 0; x < challengers.entries.length; x++) {

                    console.log("Loop", x)

                    //Make a call to puuid API with this challenger
                    fetch(
                        `https://oc1.api.riotgames.com/tft/summoner/v1/summoners/by-name/${challengers.entries[x].summonerName}` + '?api_key=' + RIOT_API_KEY
                    )
                        .then((r) => r.json())
                        .then((data) => {
                            //push the puuid to puuids
                            puuids.push(data.puuid)


                            //After we do that, make a request with the current puuid to grab this puuid's matches
                            fetch(`https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/${data.puuid}/ids?count=20&` + 'api_key=' + RIOT_API_KEY)
                                .then((r) => r.json())
                                .then((data) => {

                                    //Loop do all challengers x 20 games
                                    for (let i = 0; i < 20; i++) {
                                        matchIds.push(data[i]);
                                        
                                        fetch(`https://americas.api.riotgames.com/tft/match/v1/matches/${data[i]}` + '?api_key=' + RIOT_API_KEY)
                                            .then((r) => r.json())
                                            .then((data) => {
                                                
                                                matchDetails.push(data)

                                                console.log("Summoner", x, ", Match", i, data);
                                                //Add to MongoDB this match/"data"
                                                collection.insertOne(data)
                                                    .then(result => {
                                                        setTimeout(function () { console.log(`Successfully inserted item with _id: ${result.insertedId}`) }, 5000)
                                                    })
                                                    .catch(err => {
                                                        setTimeout(function () { console.error(`Failed to insert item: ${err}`) })

                                                    })
                                            })
                                    }
                                })
                        })
                        .catch((err) => console.log(err))
                }
            })
})

