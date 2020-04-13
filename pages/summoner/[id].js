import React, { Component } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Box, MuiLink, Button, TextField, Grid, Avatar, GridList, GridListTile, Paper, } from '@material-ui/core';
import fetch from 'isomorphic-unfetch';
import { makeStyles } from '@material-ui/core/styles';

const RIOT_API_KEY = "RGAPI-2d856886-154c-4d86-a159-cf920b0b4937"

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

function placementColorHandler(placement) {
    switch (placement) {
        case 1:
            return (
                <Paper elevation={3} style={{ backgroundColor: '#EBB352', color: '#fff' }}>
                    <Typography>
                        <b>1</b>
                    </Typography>
                </Paper>)

        case 2:
            return (
                <Paper elevation={3} style={{ backgroundColor: '#A6ACB9', color: '#fff' }}>
                    <Typography>
                        <b>2</b>
                    </Typography>
                </Paper>)

        case 3:
            return (
                <Paper elevation={3} style={{ backgroundColor: '#AE8967', color: '#fff' }}>
                    <Typography>
                        <b>3</b>
                    </Typography>
                </Paper>)

        default:
            return (
                <Paper elevation={3} style={{ backgroundColor: '#eee', }}>
                    <Typography>
                        {placement}
                    </Typography>
                </Paper>)
    }

}

function placementDistributionHandler(matchDetailsArray, profile) {
    //Loop through each match and grab placement chuck into a placement array and map it
    let placements = [];

    for (let i = 0; i < matchDetailsArray.length; i++) {
        placements.push(matchDetailsArray[i].info.participants[
            getParticipantsIndex(matchDetailsArray[i], profile.puuid)
        ].placement)
    }

    console.log(placements)

    return (
        <Box>
            <Typography style={{ paddingBottom: '8px' }}><b>Placement Distribution</b></Typography>
            <Typography style={{ paddingBottom: '8px' }}>Average Place: <b>{average(placements)}</b></Typography>
            <Grid container spacing={1} >
                {placements.map((placement) => (
                    <Grid item style={{ width: '20%', }}>
                        {placementColorHandler(placement)}
                    </Grid>
                ))}
            </Grid>
        </Box>
    )

}

function sortedChampsCalculator(matchDetailsArray, profile) {
    let total = [];
    for (let i = 0; i < matchDetailsArray.length; i++) {
        //Within each match, find profile, loop through their units.
        let thisPersonsTroops = matchDetailsArray[i].info.participants[getParticipantsIndex(matchDetailsArray[i], profile.puuid)].units
        for (let x = 0; x < thisPersonsTroops.length; x++) {
            total.push(thisPersonsTroops[x].character_id)
        }
    }
    console.log(total)

    const result = {};

    for (let i = 0; i < total.length; ++i) { // loop over array

        if (!result[total[i]]) {  // if no key for that number yet
            result[total[i]] = 0;  // then make one
        }

        ++result[total[i]];     // increment the property for that number

    }
    console.log(result)

    var sortedChampsArray = [];
    for (var champ in result) {
        sortedChampsArray.push([champ, result[champ]]);
    }

    sortedChampsArray.sort(function (a, b) {
        return b[1] - a[1];
    });

    console.log(sortedChampsArray);

    sortedChampsArray.length = 10; //reduce to top 10

    //TODO: pass to renderer
    return (
        <Box>
            <Typography style={{ paddingBottom: '8px' }}><b>Favourite Champions</b></Typography>
            <Grid container spacing={1} >
                {sortedChampsArray.map((champ) => (
                    <Grid container direction="row" alignItems="center" item justify="space-between">
                        <Box style={{ paddingRight: '8px' }}>
                            <Avatar src={`/assets/champions/${sliceCharacterString(champ[0])}.png`} />
                        </Box>
                        <Typography><b>{capitalizeFirstLetter(sliceCharacterString(champ[0]))}</b></Typography>
                        <Typography>{champ[1]} games</Typography>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
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

            <Grid container spacing={3}>

                {/* Left Column */}
                <Grid item container direction="column" xs={3} spacing={1} style={{ maxWidth: '25%' }}>

                    <Grid item>
                        <Paper className={classes.paper}>
                            <Typography >{league[0].summonerName}</Typography>
                        </Paper>
                    </Grid>

                    <Grid item>
                        <Paper className={classes.paper}>
                            <img
                                style={{ width: '50%' }}
                                src={`/assets/rankedEmblems/Emblem_${capitalizeFirstLetter(league[0].tier.toLocaleLowerCase())}.png`}></img>
                            <Typography variant="subtitle2" color="primary">{league[0].tier} {league[0].rank}</Typography>
                        </Paper>
                    </Grid>

                    <Grid item>
                        <Paper className={classes.paper}>
                            <Typography>Season Wins: <b>{league[0].wins}</b></Typography>
                        </Paper>
                    </Grid>

                    <Grid item>
                        <Paper className={classes.paper}>
                            {placementDistributionHandler(matchDetailsArray, profile)}
                        </Paper>
                    </Grid>

                    <Grid item>
                        <Paper className={classes.paper}>
                            {sortedChampsCalculator(matchDetailsArray, profile)}
                        </Paper>
                    </Grid>

                </Grid>

                {/* Right Column */}
                <Grid container item xs={9} direction="column" spacing={2}>

                    {/* Map matches into A paper element */}
                    {matchDetailsArray.map((match, key) => (
                        <Grid item>
                            <Paper key={key} style={{ display: 'flex', flexDirection: 'row', padding: '8px', justifyContent: 'center' }}>

                                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto', }}>
                                    <Typography variant="subtitle2"></Typography>
                                </Box>
                                {/* <Grid className={classes.champRow}> */}
                                {/* //Map units into row of avatars */}
                                {match.info.participants[getParticipantsIndex(match, profile.puuid)].units.map((unit, key) => (
                                    <Grid key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto', }}>
                                        <Avatar src={`/assets/champions/${sliceCharacterString(unit.character_id)}.png`} />

                                        <Box style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                            <Avatar src={`/assets/champions/${sliceCharacterString(unit.character_id)}.png`} style={{ width: '15%', height: '15%' }} />
                                            <Avatar src={`/assets/champions/${sliceCharacterString(unit.character_id)}.png`} style={{ width: '15%', height: '15%' }} />
                                            <Avatar src={`/assets/champions/${sliceCharacterString(unit.character_id)}.png`} style={{ width: '15%', height: '15%' }} />
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
    for (let i = 0; i < 20; i++) {
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
    const league = await resLeague.json();
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

function getParticipantsIndex(match, puuid) {
    for (let i = 0; i < match.info.participants.length; i++) {
        if (match.info.participants[i].puuid == puuid) {
            return i;
        }
    }
}

function average(nums) {
    return nums.reduce((a, b) => (a + b)) / nums.length;
}

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
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

function sliceCharacterString(string) {
    return string.substr(5).toLowerCase()
}

export default Summoner