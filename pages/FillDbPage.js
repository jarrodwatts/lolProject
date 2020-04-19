import React, { Component } from 'react';
import { Container, Typography, Box, Grid, Avatar, Paper, } from '@material-ui/core';
import fetch from 'isomorphic-unfetch';
import { makeStyles, responsiveFontSizes } from '@material-ui/core/styles';
import NavBar from '../components/NavBar.js';

const colours = {
    yellow: '#F8E9A1',
    red: '#F76C6C',
    teal: '#A8D0E6',
    blue: '#374785',
    navy: '#24305E',
}

const RIOT_API_KEY = "RGAPI-8228f71c-77c1-494c-8d19-2e6b503ddeaf"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },

    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
    },

    champRow: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },

    topSpacing: {
        paddingTop: theme.spacing(2)
    },

    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    large: {
        width: theme.spacing(4.5),
        height: theme.spacing(4.5),
    },

    black: {
        backgroundColor: '#000'
    },




}));

export default function FillDbPage({ matchDetails }) {
    const classes = useStyles();

    console.log(matchDetails);

    return (
        <div>
            yessir
        </div>
    )
}

export async function getServerSideProps(context) {
    //Fetch data from external API

    let mongoCollection = {};
    let challengerSummonerNames = [];
    let challengerPuuids = [];
    let matchIds = [];
    let matchDetails = [];

    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://jarrod:AwPz9DLa0izkzHnA@matchcluster-tdshe.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true });

    //1. Grab all challengers
    console.log("Reached 1")
    const resChallengers = await fetch(
        `https://oc1.api.riotgames.com/tft/league/v1/master` + '?api_key=' + RIOT_API_KEY
    );
    const challengersWithMetadata = await resChallengers.json();
    const challengers = challengersWithMetadata.entries;

    //2. Grab challengerSummonerNames
    console.log("Reached 2")
    for (let i = 0; i < challengers.length; i++) {
        challengerSummonerNames.push(challengers[i].summonerName)
    }
    //console.log(challengerSummonerNames)


    //TEMP: chop off challengerSummonerNames to ten
    challengerSummonerNames.length = 10;

    //3. Grab challengers' PuuIds
    console.log("Reached 3")
    for (let i = 0; i < challengerSummonerNames.length; i++) {
        let resPuuid = await fetch(
            encodeURI(`https://oc1.api.riotgames.com/tft/summoner/v1/summoners/by-name/${challengerSummonerNames[i]}` + '?api_key=' + RIOT_API_KEY)
        )
        let profile = await resPuuid.json();
        challengerPuuids.push(profile.puuid)
    }
    //console.log(challengerPuuids);


    //4. Ask the Matches API to grab these challenger's puuid's matches.
    console.log("Reached 4")
    for (let i = 0; i < challengerPuuids.length; i++) {
        let resMatches = await fetch(`https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/${challengerPuuids[i]}/ids?count=20&` + 'api_key=' + RIOT_API_KEY)
        let matchBatch = await resMatches.json();

        //Loop do all challengers x 20 games
        for (let x = 0; x < 20; x++) {
            matchIds.push(matchBatch[x]);
        }

        ///matchIds.push(matchBatch);
    }

    console.log(matchIds)

    //5. For each MatchId, ask the match Details API to 
    console.log("Reached 5")
    for (let i = 0; i < matchIds.length; i++) {
        debugger;
        let resMatchDetail = await fetch(
            encodeURI(`https://americas.api.riotgames.com/tft/match/v1/matches/${matchIds[i]}` + '?api_key=' + RIOT_API_KEY)
        )
        let matchDetail = await resMatchDetail.json();

        matchDetails.push(matchDetail);

        client.connect(err => {
            let collection = client.db("matchDatabase").collection("matchCollection");
            mongoCollection = collection;

            //6. Add shit to mongodb
            collection.insertOne(matchDetail)
                .then(result => {
                    setTimeout(function () { console.log(`Successfully inserted item with _id: ${result.insertedId}`) }, 5000)
                })
                .catch(err => {
                    setTimeout(function () { console.error(`Failed to insert item: ${err}`) })

                })
        });

    }

    console.log(matchDetails)

    return ({
        props: {
            matchDetails
        }
    })
}

        // //1. Get Profile
        // /** Profile Schema: id, accountId, puuid, profileIconId, revisionDate, summonerLevel, */
        // const { id } = context.query;
        // const resProfile = await fetch(
        //     `https://oc1.api.riotgames.com/tft/summoner/v1/summoners/by-name/${id}` + '?api_key=' + RIOT_API_KEY
        // );
        // const profile = await resProfile.json();
        // //console.log(`Fetched profile: ${profile.id}`);


        // //2. Get matches, using puuid
        // /** Matches Schema: Array of Match ID's */
        // const puuid = profile.puuid;
        // const resMatches = await fetch(
        //     `https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids` + '?api_key=' + RIOT_API_KEY
        // );
        // const matches = await resMatches.json();
        // //console.log(`Fetched matches: ${matches}`);


        // //3. Get match details, using match ID
        // /** Match Schema:  A lot */
        // let matchDetailsArray = [];

        // // for (let i = 0; i < matches.length; i++) {
        // for (let i = 0; i < 20; i++) {
        //     let resMatchDetails = await fetch(
        //         `https://americas.api.riotgames.com/tft/match/v1/matches/${matches[i]}` + '?api_key=' + RIOT_API_KEY

        //     );

        //     let matchDetails = await resMatchDetails.json();
        //     matchDetailsArray.push(matchDetails)
        // }

        // //console.log(`Fetched match details: ${matchDetailsArray}`);

        // //4. Get Profile Details, using encryptedSummonerId
        // //https://oc1.api.riotgames.com/tft/league/v1/entries/by-summoner/gJgBREkCeTdA6jBXWU7C5JZgBT6ZrnxYSe7vZCs2ggMp-OE
        // const encryptedSummonerId = profile.id;
        // const resLeague = await fetch(
        //     `https://oc1.api.riotgames.com/tft/league/v1/entries/by-summoner/${encryptedSummonerId}` + '?api_key=' + RIOT_API_KEY
        // );
        // const league = await resLeague.json();
        // console.log(`Fetched league: ${league}`);


        // return {
        //     props: {
        //         profile,
        //         matches,
        //         matchDetailsArray,
        //         league,
        //     }
        // };