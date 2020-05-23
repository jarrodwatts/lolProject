import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        height: 140,
        width: 100,
    },
    control: {
        padding: theme.spacing(2),
    },
}));

export default function Error() {
    const classes = useStyles();

    return (
        <Grid container className={classes.root} spacing={2} justify="center" alignItems="center">

            <Grid item>
                <ErrorIcon />
            </Grid>

            <Grid item>
                <Typography>Something went wrong...</Typography>
            </Grid>
            
            <Grid item>
                <SentimentVeryDissatisfiedIcon />
            </Grid>

        </Grid>
    )
}
