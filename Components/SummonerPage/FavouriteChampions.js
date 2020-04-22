import React from 'react';
import { Typography, Paper, Box, Grid, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

function sortedChampsCalculator(matchDetailsArray, profile) {
    let total = [];
    for (let i = 0; i < matchDetailsArray.length; i++) {
        //Within each match, find profile, loop through their units.
        let thisPersonsTroops = matchDetailsArray[i].info.participants[getParticipantsIndex(matchDetailsArray[i], profile.puuid)].units
        for (let x = 0; x < thisPersonsTroops.length; x++) {
            total.push(thisPersonsTroops[x].character_id)
        }
    }

    const result = {};

    for (let i = 0; i < total.length; ++i) { // loop over array

        if (!result[total[i]]) {  // if no key for that number yet
            result[total[i]] = 0;  // then make one
        }

        ++result[total[i]];     // increment the property for that number

    }

    var sortedChampsArray = [];
    for (var champ in result) {
        sortedChampsArray.push([champ, result[champ]]);
    }

    sortedChampsArray.sort(function (a, b) {
        return b[1] - a[1];
    });

    sortedChampsArray.length = 8; //reduce to top 8

    return (renderFavouriteChamps(sortedChampsArray))
}

function renderFavouriteChamps(sortedChampsArray) {
    return (
        <Box>
            <Typography style={{ paddingBottom: '8px' }}><b>Favourite Champions</b></Typography>
            <Grid container spacing={1} >
                {sortedChampsArray.map((champ, key) => (
                    <Grid key={key} container direction="row" alignItems="center" item justify="space-between">
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

function sliceCharacterString(string) {
    return string.substr(5).toLowerCase()
}

function getParticipantsIndex(match, puuid) {
    for (let i = 0; i < match.info.participants.length; i++) {
        if (match.info.participants[i].puuid == puuid) {
            return i;
        }
    }
}

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
    },
}));

export default function FavouriteChampions(props) {
    const classes = useStyles();

    return (
        <Paper className={classes.paper}>
            {sortedChampsCalculator(props.matchDetailsArray, props.profile)}
        </Paper>
    )

}