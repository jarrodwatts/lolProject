import React from 'react';
import { Typography, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Error from '../Error';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
    },
}));

export default function SeasonWins(props) {
    const classes = useStyles();

    try {
        return (
            <Paper className={classes.paper}>
                <Typography>Season Wins: <b>{props.wins}</b></Typography>
            </Paper>
        )
    }
    catch (error) {
        console.log(error);
        return (
            <Error />
        )
    }
}