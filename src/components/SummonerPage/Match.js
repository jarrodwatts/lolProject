import React from 'react';
import { Typography, Paper, Box, Grid, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
    },
    large: {
        width: theme.spacing(4.5),
        height: theme.spacing(4.5),
    },

}));

export default function Match(props) {

    const classes = useStyles();

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
                                        <Avatar
                                            src={`/assets/champions/${sliceCharacterString(unit.character_id)}.png`}
                                            className={classes.large} />

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



