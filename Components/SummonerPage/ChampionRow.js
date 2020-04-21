import React from 'react';
import { Typography, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
    },
}));

export default function ChampionRow(props) {
    const classes = useStyles();

    return (
        <Paper className={classes.paper}>
            <Typography>Season Wins: <b>{props.wins}</b></Typography>
        </Paper>
    )

}