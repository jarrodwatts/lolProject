import React from 'react';
import { Container, Typography, Box, Grid } from '@material-ui/core';
import fetch from 'isomorphic-unfetch';
import { makeStyles } from '@material-ui/core/styles';

//Import Components
import NavBar from '../../../src/components/NavBar';
import FavouriteChampions from '../../../src/components/SummonerPage/FavouriteChampions';
import Match from '../../../src/components/SummonerPage/Match';
import PlacementDistribution from '../../../src/components/SummonerPage/PlacementDistribution';
import SeasonWins from '../../../src/components/SummonerPage/SeasonWins';
import SummonerName from '../../../src/components/SummonerPage/SummonerName';
import SummonerRank from '../../../src/components/SummonerPage/SummonerRank';

import Router from 'next/router';

const RIOT_API_KEY = "RGAPI-08e60dda-161f-4138-aa61-af107b2529b8"

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

    matchHover: {
        '&:hover': {
            backgroundColor: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            cursor: 'pointer',
        }
    },

}));

function navigateToMatch(match) {
    Router.push('/match/[id]', ('/match/' + match.metadata.match_id))
}

function Summoner({ profile, matchDetailsArray, league }) {
    const classes = useStyles();
    //console.log(matchDetailsArray)

    return (
        <div>
            <NavBar />

            {/* // Main Container */}
            <Container className={classes.topSpacing}>
                <Grid container spacing={3}>

                    {/* Left Column */}
                    <Grid item container direction="column" md={3} sm={12} xs={12} spacing={1}>

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
                    <Grid container item xs={12} sm={12} md={9} direction="column" spacing={1}>

                        {matchDetailsArray.map((match, key) => (
                            <Box key={key} style={{ paddingBottom: '16px' }}>
                                <Typography variant="caption">{formatGameType(match.info)}</Typography>

                                {/* Begin individual Match Papers */}
                                <Grid item
                                    onClick={() => navigateToMatch(match)}
                                    className={classes.matchHover}
                                >
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

    //1. Get Profile
    /** Profile Schema: id, accountId, puuid, profileIconId, revisionDate, summonerLevel, */
    //console.log(context.query);

    const server = context.query.server.toUpperCase();
    const id = context.query.id;

    //console.log("FIND", server)

    const resProfile = await fetch(
        `https://${server}.api.riotgames.com/tft/summoner/v1/summoners/by-name/${id}` + '?api_key=' + RIOT_API_KEY
    );
    const profile = await resProfile.json();
    //console.log(`Fetched profile: ${profile.id}`);


    //2. Get matches, using puuid
    /** Matches Schema: Array of Match ID's */
    const puuid = profile.puuid;
    const resMatches = await fetch(
        `https://${serverGroups[server]}.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids` + '?api_key=' + RIOT_API_KEY
    );
    const matches = await resMatches.json();
    //console.log(`Fetched matches: ${matches}`);


    //3. Get match details, using match ID
    /** Match Schema:  A lot */
    let matchDetailsArray = [];

    // for (let i = 0; i < matches.length; i++) {
    for (let i = 0; i < 5; i++) {
        let resMatchDetails = await fetch(
            `https://${serverGroups[server]}.api.riotgames.com/tft/match/v1/matches/${matches[i]}` + '?api_key=' + RIOT_API_KEY
        );

        let matchDetails = await resMatchDetails.json();
        matchDetailsArray.push(matchDetails)
    }

    //4. Get Profile Details, using encryptedSummonerId
    const encryptedSummonerId = profile.id;
    const resLeague = await fetch(
        `https://${server}.api.riotgames.com/tft/league/v1/entries/by-summoner/${encryptedSummonerId}` + '?api_key=' + RIOT_API_KEY
    );
    const league = await resLeague.json();
    //console.log(`Fetched league: ${league}`);

    return {
        props: {
            profile,
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
    try {
        switch (gameInfo.game_variation) {
            case "TFT3_GameVariation_Bonanza":
                return "Treasure Trove"
            case "TFT3_GameVariation_TwoStarCarousels":
                return "Star Cluster"

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

            default: return "Normal Game"
        }
    }
    catch (err) {
        return "Normal Game"
    }
}

export default Summoner