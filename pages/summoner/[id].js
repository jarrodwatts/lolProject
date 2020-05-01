import React from 'react';
import { Container, Typography, Box, Grid } from '@material-ui/core';
import fetch from 'isomorphic-unfetch';
import { makeStyles } from '@material-ui/core/styles';

//Import Components
import NavBar from '../../src/components/NavBar';
import FavouriteChampions from '../../src/components/SummonerPage/FavouriteChampions';
import Match from '../../src/components/SummonerPage/Match';
import PlacementDistribution from '../../src/components/SummonerPage/PlacementDistribution';
import SeasonWins from '../../src/components/SummonerPage/SeasonWins';
import SummonerName from '../../src/components/SummonerPage/SummonerName';
import SummonerRank from '../../src/components/SummonerPage/SummonerRank';

const RIOT_API_KEY = "RGAPI-786f1e2c-956d-40b6-a794-a5434ddef448"

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

    itemSize: {
        width: theme.spacing(1.5),
        height: theme.spacing(1.5),
    },

    black: {
        backgroundColor: '#000'
    },

}));

function Summoner({ profile, matches, matchDetailsArray, league }) {
    const classes = useStyles();

    return (
        <div>
            <NavBar />

            {/* // Main Container */}
            <Container className={classes.topSpacing}>
                <Grid container spacing={3}>

                    {/* Left Column */}
                    <Grid item container direction="column" xs={3} spacing={1}>

                        {/* Summoner Name */}
                        <Grid item>
                            <SummonerName name={league[0].summonerName} />
                        </Grid>

                        {/* Summoner Rank */}
                        <Grid item>
                            <SummonerRank tier={league[0].tier} rank={league[0].rank} />
                        </Grid>

                        {/* Season Wins */}
                        <Grid item>
                            <SeasonWins wins={league[0].wins} />
                        </Grid>

                        {/* Placement Distribution */}
                        <Grid item>
                            <PlacementDistribution matchDetailsArray={matchDetailsArray} profile={profile} />
                        </Grid>

                        {/* Favourite Champions */}
                        <Grid item>
                            <FavouriteChampions matchDetailsArray={matchDetailsArray} profile={profile} />
                        </Grid>

                    </Grid>

                    {/* Right Column */}
                    <Grid container item xs={9} direction="column" spacing={1}>

                        {matchDetailsArray.map((match, key) => (
                            <Box key={key} style={{ paddingBottom: '16px' }}>
                                <Typography variant="caption">{formatGameType(match.info)}</Typography>

                                {/* Begin individual Match Papers */}
                                <Grid item>
                                    <Match match={match} profile={profile} />
                                </Grid>
                            </Box>
                        ))}

                    </Grid>
                </Grid>
            </Container>
        </div>
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
    for (let i = 0; i < 10; i++) {
        let resMatchDetails = await fetch(
            `https://americas.api.riotgames.com/tft/match/v1/matches/${matches[i]}` + '?api_key=' + RIOT_API_KEY

        );

        let matchDetails = await resMatchDetails.json();
        matchDetailsArray.push(matchDetails)
    }

    //console.log(`Fetched match details: ${matchDetailsArray}`);

    //4. Get Profile Details, using encryptedSummonerId
    //https://oc1.api.riotgames.com/tft/league/v1/entries/by-summoner/gJgBREkCeTdA6jBXWU7C5JZgBT6ZrnxYSe7vZCs2ggMp-OE
    const encryptedSummonerId = profile.id;
    const resLeague = await fetch(
        `https://oc1.api.riotgames.com/tft/league/v1/entries/by-summoner/${encryptedSummonerId}` + '?api_key=' + RIOT_API_KEY
    );
    const league = await resLeague.json();
    //console.log(`Fetched league: ${league}`);


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

function formatGameType(gameInfo) {
    switch (gameInfo.game_variation) {
        case "TFT3_GameVariation_BigLittleLegends":
            return "Medium Legends"

        case "TFT3_GameVariation_FourCostFirstCarousel":
            return "Lilac Nebula"

        case "TFT3_GameVariation_FreeNeekos":
            return "The Neekoverse"

        case "TFT3_GameVariation_FreeRerolls":
            return "Trade Sector"

        case "TFT3_GameVariation_MidGameFoN":
            return "Superdense Galaxy"

        case "TFT3_GameVariation_None":
            return "Normal Game"

        default: return "Normal Galaxy"
    }
}

export default Summoner