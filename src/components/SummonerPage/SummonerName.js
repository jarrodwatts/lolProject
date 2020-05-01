import React from 'react';
import { Typography, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
    },
}));

export default function SummonerName(props) {
    const classes = useStyles();

    return (
        <Paper className={classes.paper}>
            <Typography >{props.name}</Typography>
        </Paper>
    )

}