import React, { Component } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Box, MuiLink, Button, TextField, Grid, Avatar, GridList, GridListTile, Paper, } from '@material-ui/core';
import fetch from 'isomorphic-unfetch';
import { makeStyles } from '@material-ui/core/styles';

const RIOT_API_KEY = "RGAPI-79795c5d-ca1e-4c46-bef0-393b38fa8dbf"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
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

}));

function profileRenderHandler(profile) {

}

function matchesRenderHandler(matches) {

}

function matchDetailsArrayRenderHandler(matchDetailsArray, puuid) {


}


function Summoner({ profile, matches, matchDetailsArray, league }) {
    console.log(profile);
    console.log(matches);
    console.log(matchDetailsArray);
    console.log(league)

    const classes = useStyles();

    return (

        // Main Container
        <Container className={classes.topSpacing}>

            <Grid container spacing={2}>

                {/* Left Column */}
                <Grid item container direction="column" xs={3} spacing={2}>

                    <Grid item>
                        <Paper className={classes.paper}>
                            <Typography>{league[0].summonerName}</Typography>
                        </Paper>
                    </Grid>

                    <Grid item>
                        <Paper className={classes.paper}>
                            <Typography>{league[0].tier} {league[0].rank}</Typography>
                        </Paper>
                    </Grid>

                    <Grid item>
                        <Paper className={classes.paper}>
                            <Typography>Wins: {league[0].wins}</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Right Column */}
                <Grid container item xs={8} spacing={1} >

                    {/* Map matches into A paper element */}
                    {matchDetailsArray.map((match, key) => (
                        <Grid item>
                            <Paper key={key} style={{ display: 'flex', flexDirection: 'row', padding: '8px', justifyContent: 'center' }}>

                                <Box style={{ width: '33%' }}>

                                </Box>
                                {/* <Grid className={classes.champRow}> */}
                                {/* //Map units into row of avatars */}
                                {match.info.participants[getParticipantsIndex(match, profile.puuid)].units.map((unit, key) => (
                                    <Grid key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto', }}>
                                        <Avatar src={`/assets/champions/${unit.character_id.substr(5).toLowerCase()}.png`} />

                                        <Box style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                            <Avatar src={`/assets/champions/${unit.character_id.substr(5).toLowerCase()}.png`} style={{ width: '15%', height: '15%' }} />
                                            <Avatar src={`/assets/champions/${unit.character_id.substr(5).toLowerCase()}.png`} style={{ width: '15%', height: '15%' }} />
                                            <Avatar src={`/assets/champions/${unit.character_id.substr(5).toLowerCase()}.png`} style={{ width: '15%', height: '15%' }} />
                                        </Box>
                                    </Grid>
                                ))}
                                {/* </Grid> */}

                            </Paper>
                        </Grid>

                    ))}
                </Grid>
            </Grid>


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
    //console.log(`Fetched profile: ${profile.id}`);


    //2. Get matches, using puuid
    /** Matches Schema: Array of Match ID's */
    const puuid = profile.puuid;
    const resMatches = await fetch(
        `https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids` + '?api_key=' + RIOT_API_KEY
    );
    const matches = await resMatches.json();
    //console.log(`Fetched matches: ${matches}`);


    //3. Get match details, using match ID
    /** Match Schema:  A lot */
    let matchDetailsArray = [];

    // for (let i = 0; i < matches.length; i++) {
    for (let i = 0; i < 5; i++) {
        let resMatchDetails = await fetch(
            `https://americas.api.riotgames.com/tft/match/v1/matches/${matches[i]}` + '?api_key=' + RIOT_API_KEY

        );

        let matchDetails = await resMatchDetails.json();
        matchDetailsArray.push(matchDetails)
    }

    //console.log(`Fetched match details: ${matchDetailsArray}`);

    //4. Get Profile Details, using encryptedSummonerId
    /** Match Schema:  A lot */
    //https://oc1.api.riotgames.com/tft/league/v1/entries/by-summoner/gJgBREkCeTdA6jBXWU7C5JZgBT6ZrnxYSe7vZCs2ggMp-OE
    const encryptedSummonerId = profile.id;
    const resLeague = await fetch(
        `https://oc1.api.riotgames.com/tft/league/v1/entries/by-summoner/${encryptedSummonerId}` + '?api_key=' + RIOT_API_KEY
    );
    const league = await resleague[0].json();
    console.log(`Fetched league: ${league}`);


    return {
        props: {
            profile,
            matches,
            matchDetailsArray,
            league,
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