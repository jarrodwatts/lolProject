import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

export default function Error() {

    return (
        <Grid direction="column" alignItems="center" justify="center">

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
