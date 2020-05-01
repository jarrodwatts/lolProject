import React from 'react';
import { Typography, Paper, Box, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
    },
}));

function getParticipantsIndex(match, puuid) {
    for (let i = 0; i < match.info.participants.length; i++) {
        if (match.info.participants[i].puuid == puuid) {
            return i;
        }
    }
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

function average(nums) {
    return nums.reduce((a, b) => (a + b)) / nums.length;
}

function placementDistributionHandler(matchDetailsArray, profile) {
    //Loop through each match and grab placement chuck into a placement array and map it
    let placements = [];

    for (let i = 0; i < matchDetailsArray.length; i++) {
        placements.push(matchDetailsArray[i].info.participants[
            getParticipantsIndex(matchDetailsArray[i], profile.puuid)
        ].placement)
    }

    return (
        <Box>
            <Typography style={{ paddingBottom: '8px' }}><b>Placement Distribution</b></Typography>
            <Typography style={{ paddingBottom: '8px' }}>Average Place: <b>{average(placements)}</b></Typography>
            <Grid container spacing={1} >
                {placements.map((placement, key) => (
                    <Grid key={key} item style={{ width: '20%', }}>
                        {placementColorHandler(placement)}
                    </Grid>
                ))}
            </Grid>
        </Box>
    )

}

export default function PlacementDistribution(props) {

    const classes = useStyles();

    return (
        <Paper className={classes.paper}>
            {placementDistributionHandler(props.matchDetailsArray, props.profile)}
        </Paper>
    )

}