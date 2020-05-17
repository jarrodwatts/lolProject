import React from 'react';
import { Typography, Paper, Box, Grid, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Error from '../Error';

//Component Imports
import ChampionRow from './ChampionRow';
import TraitsRow from './TraitsRow';
import ChampionTierStars from './ChampionTierStars';
import ChampionsItems from './ChampionItems';

function getParticipantsIndex(match, puuid) {
    for (let i = 0; i < match.info.participants.length; i++) {
        if (match.info.participants[i].puuid == puuid) {
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

function sliceCharacterString(string) {
    return string.substr(5).toLowerCase()
}

function findPlacement(item, puuid) {
    for (let i = 0; i < item.info.participants.length; i++) {
        if (item.info.participants[i].puuid == puuid) {
            return item.info.participants[i].placement;
        }
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

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
    },
    large: {
        width: theme.spacing(5),
        height: theme.spacing(5),
    },

}));

export default function Match(props) {

    const classes = useStyles();

    try {
        return (
            <Paper className={classes.paper}>
                <Grid container item direction="row" alignItems="center" justify="space-between" spacing={3}>

                    <Grid item>
                        <Grid container direction="row" alignItems="center">
                            {/* Strip of Color TODO: Make these dynamic */}
                            <Grid item>
                                <Box style={{ backgroundColor: '#EBB352', width: '4px', color: '#EBB352', height: '100%' }}>|</Box>
                            </Grid>

                            {/* Companion image */}
                            <Grid item style={{ paddingLeft: '8px' }}>
                                {/* temp blitz: TODO: replace with companion icon */}
                                <Avatar src={`/assets/champions/blitzcrank.png`} />
                            </Grid>

                            {/* Placement and Type */}
                            <Grid item style={{ paddingLeft: '16px' }}>
                                <Box>
                                    <Typography><b>{formatPlacement(findPlacement(props.match, props.profile.puuid))}</b></Typography>
                                </Box>
                            </Grid>

                            {/* Synergies / Traits */}
                            <Grid item style={{ paddingLeft: '64px' }}>
                                <Grid container direction="row">
                                    {props.match.info.participants[getParticipantsIndex(props.match, props.profile.puuid)].traits.map((trait, key) => (
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

                            {props.match.info.participants[getParticipantsIndex(props.match, props.profile.puuid)].units.map((unit, key) => (
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
        )
    }
    catch (error) {
        return (
            <Error />
        )
    }
}



