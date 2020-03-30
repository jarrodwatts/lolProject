import React, { Component } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Box, MuiLink, Button, TextField } from '@material-ui/core';
import fetch from 'isomorphic-unfetch';

const RIOT_API_KEY = "RGAPI-a863df6c-5d90-450b-a383-bc892f2f38aa"

function profileRenderHandler(profile) {
    console.log("profileRenderHandler being called");

    return (
        <Container>
            <p><b>id:</b> {profile.id}</p>
            <p><b>accountId:</b> {profile.accountId}</p>
            <p><b>puuid:</b> {profile.puuid}</p>
            <p><b>profileIconId:</b> {profile.profileIconId}</p>
            <p><b>revisionDate:</b> {profile.revisionDate}</p>
            <p><b>summonerLevel:</b> {profile.summonerLevel}</p>
        </Container>
    )
}

function matchesRenderHandler(matches) {
    console.log("matchesRenderHandler being called");

    return (
        <Container>
            <h2>Matches:</h2>
            <ul>
                {matches.map((item, key) => (
                    <li key={key}>{item}</li>
                ))}
            </ul>
        </Container>
    )
}

function matchOneRenderHandler(matchOne) {
    console.log("matcheOneRenderHandler being called");
    return (
        <Container>
            <h2>Match One Details:</h2>
            <h3>MetaData:</h3>
            <p><b>match_id: </b>{matchOne.metadata.match_id}</p>
            <p><b>Participants:</b></p>
            <ul>
                {matchOne.metadata.participants.map((item, key) => (
                    <li key={key}>{item}</li>
                ))}
            </ul>

            <h3>Info:</h3>
            <p><b>match_id: </b>{matchOne.metadata.match_id}</p>
            <p><b>Time: </b>{formatUnixDate(matchOne.info.game_datetime)}</p>
        </Container>
    )
}


function Summoner({ profile, matches, matchOne }) {
    console.log(profile);
    console.log(matches);
    console.log(matchOne);

    return (
        <Container>
            <h1>{profile.name}</h1>
            {profileRenderHandler(profile)}
            <p>--------------------------------------------------</p>
            {matchesRenderHandler(matches)}
            <p>--------------------------------------------------</p>
            {matchOneRenderHandler(matchOne)}


        </Container>
    )
}

export async function getServerSideProps(context) {
    //Fetch data from external API

    //1. Get Profile
    /** Profile Schema: id, accountId, puuid, profileIconId, revisionDate, summonerLevel, */
    const { id } = context.query;
    const resProfile = await fetch(
        `https://oc1.api.riotgames.com/tft/summoner/v1/summoners/by-name/${id}` + '?api_key=' + RIOT_API_KEY
    );
    const profile = await resProfile.json();
    console.log(`Fetched profile: ${profile.id}`);


    //2. Get matches, using puuid
    /** Matches Schema: Array of Match ID's */
    const puuid = profile.puuid;
    const resMatches = await fetch(
        `https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids` + '?api_key=' + RIOT_API_KEY
        //https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/rm2I2NMbizMmRU_Tdyv2TTh8w4AXEyBAMgeJzXmd43usFwEYUJiXdkKif2TBABrI7Wj6XsHB-08_RQ/ids?api_key=RGAPI-a863df6c-5d90-450b-a383-bc892f2f38aa
    );
    const matches = await resMatches.json();
    console.log(`Fetched matches: ${matches}`);


    //3. Get match details, using match ID
    /** Match Schema:  A lot */
    const matchOneId = matches[0];
    const resMatchOne = await fetch(
        `https://americas.api.riotgames.com/tft/match/v1/matches/${matchOneId}` + '?api_key=' + RIOT_API_KEY
        //https://americas.api.riotgames.com/tft/match/v1/matches/OC1_287795996?api_key=RGAPI-a863df6c-5d90-450b-a383-bc892f2f38aa
    );
    const matchOne = await resMatchOne.json();
    console.log(`Fetched match One: ${matchOne}`);


    return {
        props: {
            profile,
            matches,
            matchOne
        }
    };
}

function formatUnixDate(date) {
    var dateString = new Date(date).toLocaleDateString("en-US")
    var timeString = new Date(date).toLocaleTimeString("en-US")

    return '' + dateString + ' at ' + timeString;
}

export default Summoner