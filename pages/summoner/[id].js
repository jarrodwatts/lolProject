import React, { Component } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Box, MuiLink, Button, TextField, Grid, Avatar } from '@material-ui/core';
import fetch from 'isomorphic-unfetch';

const RIOT_API_KEY = "RGAPI-6e90627b-4817-4836-8d92-19ab94fc048c"

function profileRenderHandler(profile) {

}

function matchesRenderHandler(matches) {

}

function matchDetailsArrayRenderHandler(matchDetailsArray, puuid) {

    return (
        <Grid style={{ minWidth: '100%' }}>

            {matchDetailsArray.map((item, key) => (

                <Grid key={key} container direction="row" justify="flex-start" alignItems="center" style={{ padding: '16px', backgroundColor: '#202B43', minWidth: '100%', color: '#fff' }}>

                    {/* Image */}
                    <Avatar alt="profile-picture" src="/assets/champions/blitzcrank.png" />

                    {/* Place and Type */}
                    <Box style={{ backgroundColor: '#202B43', color: '#fff', paddingLeft: '16px' }}>
                        <Typography variant="h6" component="h6">{formatPlacement(findPlacement(item, puuid))} Place</Typography>
                        <Typography variant="h6" component="h6">Type</Typography>
                    </Box>


                    {/* Loop through and map units */
                        item.info.participants[getParticipantsIndex(item, puuid)].units.map((unit, key) => (
                            <Box key={key} style={{ paddingRight: '8px' }}
                            >
                                <Avatar
                                    key={key}
                                    alt={unit.character_id}
                                    src={`/assets/champions/${unit.character_id.substr(5).toLowerCase()}.png`}

                                />
                            </Box>
                        ))

                    }


                </Grid>

            ))}

        </Grid>
    )
}


function Summoner({ profile, matches, matchDetailsArray }) {
    console.log(profile);
    console.log(matches);
    console.log(matchDetailsArray);

    return (
        //Main Background Grid
        <Grid container style={{ minHeight: '100vh' }}
            direction="column" alignItems="flex-start">

            {/* Container that Centers things pushes them into the middle of the page */}
            <Container maxWidth="lg">

                <Grid container spacing={3} style={{ paddingTop: '16px' }}>

                    <Grid item xs={3}>
                        {/* LogoNameRank */}
                        <Grid container direction="row" alignItems="center" justify="space-around" style={{ padding: '16px', backgroundColor: '#202B43' }}>
                            {/* <Grid container direction="row" alignItems="center" justify="space-around"> */}
                            {/* TODO: Replace blitzcrank with profileIconId */}
                            <Avatar alt="profile-picture" src="/assets/champions/blitzcrank.png" style={{ width: '25%', height: '25%' }} />
                            {/* </Grid> */}

                            <Grid container direction="column" alignItems="center" justify="center" style={{ width: '75%', backgroundColor: '#202B43' }} >
                                <Typography variant="h6" component="h6" style={{ color: '#fff', padding: '16px' }}>{profile.name}</Typography>
                                <Typography variant="h6" component="h6" style={{ color: '#fff', padding: '16px' }}>Rank</Typography>
                            </Grid>
                        </Grid>

                        {/* Rank */}
                        <Grid>
                            <Typography variant="h3" component="h3" style={{ color: '#fff', padding: '16px' }}>Teamfight Tactics</Typography>
                            <Typography variant="h3" component="h3" style={{ color: '#fff', padding: '16px' }}>O RANK</Typography>
                        </Grid>

                        {/* Placement Distribution */}
                        <Grid>
                            <Typography variant="h3" component="h3" style={{ color: '#fff', padding: '16px' }}>Teamfight Tactics</Typography>
                            <Typography variant="h3" component="h3" style={{ color: '#fff', padding: '16px' }}>O RANK</Typography>
                        </Grid>

                    </Grid>

                    {/* Match History */}
                    <Grid container item xs={9} style={{ padding: '16px' }}>
                        {/* <Typography variant="h2" component="h2" style={{ color: '#fff', padding: '16px' }}>Match History</Typography>
                        <Typography variant="h2" component="h2" style={{ color: '#fff', padding: '16px' }}>Match History</Typography>
                        <Typography variant="h2" component="h2" style={{ color: '#fff', padding: '16px' }}>Match History</Typography>
                        <Typography variant="h2" component="h2" style={{ color: '#fff', padding: '16px' }}>Match History</Typography>
                        <Typography variant="h2" component="h2" style={{ color: '#fff', padding: '16px' }}>Match History</Typography>
                        <Typography variant="h2" component="h2" style={{ color: '#fff', padding: '16px' }}>Match History</Typography>
                        <Typography variant="h2" component="h2" style={{ color: '#fff', padding: '16px' }}>Match History</Typography>
                        <Typography variant="h2" component="h2" style={{ color: '#fff', padding: '16px' }}>Match History</Typography> */}

                        {matchDetailsArrayRenderHandler(matchDetailsArray, profile.puuid)}


                    </Grid>


                </Grid>

            </Container>
        </Grid>
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
    );
    const matches = await resMatches.json();
    console.log(`Fetched matches: ${matches}`);


    //3. Get match details, using match ID
    /** Match Schema:  A lot */
    let matchDetailsArray = [];

    // for (let i = 0; i < matches.length; i++) {
    for (let i = 0; i < 2; i++) {
        let resMatchDetails = await fetch(
            `https://americas.api.riotgames.com/tft/match/v1/matches/${matches[i]}` + '?api_key=' + RIOT_API_KEY

        );

        let matchDetails = await resMatchDetails.json();
        matchDetailsArray.push(matchDetails)
    }

    console.log(`Fetched match details: ${matchDetailsArray}`);


    return {
        props: {
            profile,
            matches,
            matchDetailsArray
        }
    };
}

//HELPER FUNCTIONS
//TODO: Move these out of here

function formatUnixDate(date) {
    var dateString = new Date(date).toLocaleDateString("en-US")
    var timeString = new Date(date).toLocaleTimeString("en-US")

    return '' + dateString + ' at ' + timeString;
}

function findPlacement(item, puuid) {
    for (let i = 0; i < item.info.participants.length; i++) {
        if (item.info.participants[i].puuid == puuid) {
            return item.info.participants[i].placement;
        }
    }
}

function getParticipantsIndex(item, puuid) {
    for (let i = 0; i < item.info.participants.length; i++) {
        if (item.info.participants[i].puuid == puuid) {
            return i;
        }
    }
}

function formatPlacement(placement) {
    switch (placement) {
        case 1:
            return "1st"

        case 2:
            return "2nd"

        case 3:
            return "3rd"

        default:
            return "" + placement + "th"
    }
}


export default Summoner