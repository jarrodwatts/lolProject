import React from 'react';
import { Typography, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
    },
}));

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}

export default function SummonerRank(props) {

    const classes = useStyles();

    return (
        <Paper className={classes.paper}>
            <img
                style={{ width: '50%' }}
                src={`/assets/rankedEmblems/Emblem_${capitalizeFirstLetter(props.tier.toLocaleLowerCase())}.png`}></img>
            <Typography variant="subtitle2" color="primary">{props.tier} {props.rank}</Typography>
        </Paper>
    )

}