import React from 'react';
import { Container, Typography, Box, Grid, Paper, Avatar } from '@material-ui/core';
import fetch from 'isomorphic-unfetch';
import { makeStyles } from '@material-ui/core/styles';
import { Chart } from "react-google-charts";
import theme from '../../src/theme';

//Import Components
import NavBar from '../../src/components/NavBar';
import TraitsRow from '../../src/components/SummonerPage/TraitsRow';
import ChampionTierStars from '../../src/components/SummonerPage/ChampionTierStars';
import ChampionsItems from '../../src/components/SummonerPage/ChampionItems';

const RIOT_API_KEY = "RGAPI-e2d6368c-15ac-4805-b428-2ba0972ff745"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },

    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
    },
    topSpacing: {
        paddingTop: theme.spacing(2)
    },
    large: {
        width: theme.spacing(5),
        height: theme.spacing(5),
    },
}));

export default function Match({ match, players }) {
    const classes = useStyles()
    console.log(match)
    console.log(players)

    //Gather Graph info
    let timeElimDic = [];
    for (var i = 0; i < match.info.participants.length; i++) {
        timeElimDic.push({
            'name': players[match.info.participants[i].puuid],
            'timeElimd': match.info.participants[i].time_eliminated,
            'placement': match.info.participants[i].placement
        })
    }

    timeElimDic.sort(function (a, b) {
        return b.placement - a.placement;
    });

    //Sort the match.info.participants array by placement
    match.info.participants.sort(function (a, b) {
        return a.placement - b.placement;
    });

    return (
        <div>
            <NavBar />
            <Container className={classes.topSpacing}>
                <Typography style={{ paddingBottom: '16px' }} color="secondary" variant="h5">Game {match.metadata.match_id}</Typography>

                <Grid container justify="center" alignItems="center" direction="column" style={{ paddingBottom: '16px' }}>
                    <Grid container direction="row" justify="space-between">
                        <Grid item >
                            <Typography variant="caption">Date</Typography>
                            <Typography variant="subtitle2">{formatDate(match.info.game_datetime)}</Typography>
                        </Grid>

                        <Grid item >
                            <Typography variant="caption">Galaxy</Typography>
                            <Typography variant="subtitle2">{formatGameType(match.info.game_variation)}</Typography>
                        </Grid>

                        <Grid item >
                            <Typography variant="caption">Game Length</Typography>
                            <Typography variant="subtitle2">{formatGameLength(match.info.game_length)}</Typography>
                        </Grid>

                        <Grid item >
                            <Typography variant="caption">Set Number</Typography>
                            <Typography variant="subtitle2">{match.info.tft_set_number}</Typography>
                        </Grid>
                    </Grid>

                    {/* Container for each player's composition */}
                    <Grid container item direction="column">
                        {match.info.participants.map((player, key) => (
                            <Box key={key} style={{ paddingBottom: '4px' }}>
                                {/* Begin individual Match Papers */}
                                <Grid item>
                                    {/* Cant import match since profile isnt relevant */}
                                    <Paper className={classes.paper}>
                                        <Grid container item direction="row" alignItems="center" justify="space-between">

                                            <Grid item>
                                                <Grid container direction="row" alignItems="center">

                                                    {/* Companion image */}
                                                    <Grid item style={{ paddingLeft: '8px' }}>
                                                        {/* temp blitz: TODO: replace with companion icon */}
                                                        <Avatar src={`/assets/champions/blitzcrank.png`} />
                                                    </Grid>

                                                    {/* Placement and Type */}
                                                    <Grid item style={{ paddingLeft: '16px' }}>
                                                        <Box>
                                                            <Typography><b>{formatPlacement(player.placement)}</b></Typography>
                                                        </Box>
                                                    </Grid>

                                                    <Grid item style={{ paddingLeft: '16px', width: '100px' }}>
                                                        <Typography color="primary"><b>{players[player.puuid]}</b></Typography>
                                                    </Grid>

                                                    <Grid item style={{ paddingLeft: '32px', width: '125px' }}>
                                                        <Typography variant="caption">Damage Dealt</Typography>
                                                        <Typography >{player.total_damage_to_players}</Typography>
                                                    </Grid>

                                                    <Grid item style={{ paddingLeft: '32px', width: '150px' }}>
                                                        <Typography variant="caption">Players Eliminated</Typography>
                                                        <Typography>{player.players_eliminated}</Typography>
                                                    </Grid>

                                                    {/* Synergies / Traits */}
                                                    <Grid item style={{ paddingLeft: '64px' }}>
                                                        <Grid container direction="row">
                                                            {player.traits.map((trait, key) => (
                                                                <Grid item key={key}>
                                                                    <TraitsRow trait={trait} />
                                                                </Grid>
                                                            ))}
                                                        </Grid>
                                                    </Grid>

                                                </Grid>
                                            </Grid>


                                            {/* Champs */}
                                            <Grid item >
                                                <Grid container direction="row" alignItems="flex-start" spacing={1}>

                                                    {player.units.map((unit, key) => (
                                                        //I dont know why but if i delete the below grid it fucking goes vertically
                                                        <Grid item key={key}>
                                                            <Grid container direction="row" item>
                                                                <Grid item>

                                                                    {/* Stars */}
                                                                    <Grid container alignItems="center" justify="center" item direction="row">
                                                                        <ChampionTierStars unit={unit} />
                                                                    </Grid>

                                                                    {/* Champ Images  */}
                                                                    {renderChamp(unit, classes)}

                                                                    {/* Items  */}
                                                                    <ChampionsItems unit={unit} />

                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Paper>

                                </Grid>
                            </Box>
                        ))}
                    </Grid>

                    <Grid container spacing={3} style={{ paddingTop: '16px' }}>

                        {/* Left Column */}
                        <Grid item container direction="column" xs={6} spacing={1}>
                            <Paper className={classes.paper}>
                                <Typography color="secondary" style={{ paddingBottom: '8px' }}><b>Player Elimination Timeline</b></Typography>
                                <Chart
                                    width={'100%'}
                                    height={'375px'}
                                    chartType="BarChart"
                                    loader={<div>Loading Chart</div>}
                                    data={[
                                        [
                                            { type: 'string', label: 'Summoner Name' },
                                            { type: 'number', },
                                            { type: 'number', label: 'Time Eliminated' },
                                            { role: 'style' },
                                            { role: 'annotation' },
                                        ],
                                        [timeElimDic[0].name, 0, (timeElimDic[0].timeElimd / 60).toFixed(2), 'opacity: 0.2; color: #3f51b5', '8th'],
                                        [timeElimDic[1].name, 0, (timeElimDic[1].timeElimd / 60).toFixed(2), 'opacity: 0.4; color: #3f51b5', '7th'],
                                        [timeElimDic[2].name, 0, (timeElimDic[2].timeElimd / 60).toFixed(2), 'opacity: 0.5; color: #3f51b5', '6th'],
                                        [timeElimDic[3].name, 0, (timeElimDic[3].timeElimd / 60).toFixed(2), 'opacity: 0.6; color: #3f51b5', '5th'],
                                        [timeElimDic[4].name, 0, (timeElimDic[4].timeElimd / 60).toFixed(2), 'opacity: 0.7; color: #3f51b5', '4th'],
                                        [timeElimDic[5].name, 0, (timeElimDic[5].timeElimd / 60).toFixed(2), 'color: #b87333', '3rd'],
                                        [timeElimDic[6].name, 0, (timeElimDic[6].timeElimd / 60).toFixed(2), 'silver', '2nd'],
                                        [timeElimDic[7].name, 0, (timeElimDic[7].timeElimd / 60).toFixed(2), 'gold', '1st'],
                                    ]}
                                    options={{
                                        hAxis: {
                                            title: 'Time Eliminated (Minutes)',
                                        },
                                        vAxis: {
                                            title: 'Player',
                                        },
                                        bar: {
                                            groupWidth: '95%',
                                        },
                                        legend: { position: 'none' },
                                    }}
                                />
                            </Paper>
                        </Grid>


                        {/* Right Column */}
                        <Grid item container direction="column" xs={6} spacing={1}>
                            <Paper className={classes.paper}>
                                {/* This is gonna be like most used traits or something... */}
                                {sortedChampsCalculator(match)}
                            </Paper>
                        </Grid>

                    </Grid>


                </Grid>

            </Container>
        </div>
    )
}

function sortedChampsCalculator(match) {
    let total = [];
    for (let i = 0; i < match.info.participants.length; i++) {
        var thisPlayersTraits = match.info.participants[i].traits;
        for (let x = 0; x < thisPlayersTraits.length; x++) {
            if (thisPlayersTraits[x].tier_current != 0) {
                total.push(thisPlayersTraits[x].name)
            }
        }
    }

    const result = {};

    for (let i = 0; i < total.length; ++i) { // loop over array

        if (!result[total[i]]) {  // if no key for that number yet
            result[total[i]] = 0;  // then make one
        }

        ++result[total[i]];     // increment the property for that number

    }

    var sortedTraitsArray = [];
    for (var trait in result) {
        if (trait.tier_current != 0) {
            sortedTraitsArray.push([trait, result[trait]]);
        }
    }

    sortedTraitsArray.sort(function (a, b) {
        return b[1] - a[1];
    });

    sortedTraitsArray.length = 8; //reduce to top 8

    return (renderFavouriteChamps(sortedTraitsArray))
}

function renderFavouriteChamps(sortedTraitsArray) {
    return (<div>
        <Typography color="secondary" style={{ paddingBottom: '8px' }}><b>Most Contested Traits This Game</b></Typography>
        <Box>
            <Grid container spacing={1} >
                {sortedTraitsArray.map((trait, key) => (
                    <Grid key={key} container direction="row" alignItems="center" item justify="space-between">
                        <Box style={{ paddingRight: '8px' }}>
                            {
                                trait[0].startsWith("Set") ? <Avatar src={`/assets/traits/${trait[0].substr(5).toLocaleLowerCase()}.png`} /> : <Avatar src={`/assets/traits/${trait[0].toLocaleLowerCase()}.png`} />
                            }
                        </Box>
                        {
                            trait[0].startsWith("Set") ? <Typography><b>{trait[0].substr(5)}</b></Typography> : <Typography><b>{trait[0]}</b></Typography>
                        }
                        <Typography>{trait[1]} players</Typography>
                    </Grid>
                ))}
            </Grid>
        </Box>
    </div>
    )
}

function formatGameLength(gameLength) {
    let x = new Date(gameLength * 1000).toISOString().substr(11, 8).toString().substr(3);
    let y = x.split(":")
    let concatString = "" + y[0] + "m" + " " + y[1] + "s";
    return concatString;
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

function formatDate(date) {
    let thisDate = new Date(date);
    return thisDate.toLocaleDateString()
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

function renderChamp(unit, classes) {
    let rarityColour = "#6c757d" //default grey

    switch (unit.rarity) {
        case 1: //2*
            rarityColour = "#28a745"
            break;

        case 2: //3*
            rarityColour = "#007bff"
            break;

        case 3: //4*
            rarityColour = "#6f42c1"
            break;

        case 4: //5*
            rarityColour = "#ffc107"
            break;

    }

    //convert to rgb for shadow
    let rarityColourRgb = rarityColour.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
        , (m, r, g, b) => '#' + r + r + g + g + b + b)
        .substring(1).match(/.{2}/g)
        .map(x => parseInt(x, 16))

    return (
        <Avatar
            src={`/assets/champions/${sliceCharacterString(unit.character_id)}.png`}
            className={classes.large}
            style={{
                border: 2,
                borderStyle: 'solid',
                borderColor: rarityColour,
                boxShadow: `0 3px 5px 2px rgba(${rarityColourRgb[0]}, ${rarityColourRgb[1]}, ${rarityColourRgb[2]}, .4)`
            }}

        />
    )
}

function sliceCharacterString(string) {
    return string.substr(5).toLowerCase()
}

export async function getServerSideProps(context) {
    //Fetch data from external API
    const { id } = context.query;
    //Ask match API for this specific match
    const res = await fetch(
        encodeURI(`https://americas.api.riotgames.com/tft/match/v1/matches/${id}` + '?api_key=' + RIOT_API_KEY)
    );
    const match = await res.json();

    //Get all the player's details

    let players = {};

    for (let i = 0; i < match.info.participants.length; i++) {
        let playerRes = await fetch(
            encodeURI(`https://oc1.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${match.info.participants[i].puuid}` + '?api_key=' + RIOT_API_KEY)
        );

        let player = await playerRes.json();

        let playerKey = player.puuid
        let playerVal = player.name;

        players[playerKey] = playerVal
    }

    return {
        props: {
            match,
            players
        }
    };


}