import React from 'react';
import { Typography, Paper, Grid, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Error from '../Error';


function renderStars(unit, classes) {
    switch (unit.tier) {
        case 1:
            return (
                <Grid container direction="row">
                    <Avatar src={`/assets/stars/2.jpg`} className={classes.starSize} />
                </Grid>
            )
        case 2:
            return (
                <Grid container direction="row">
                    <Avatar src={`/assets/stars/2.jpg`} className={classes.starSize} />
                    <Avatar src={`/assets/stars/2.jpg`} className={classes.starSize} />
                </Grid>
            )
        case 3:
            return (
                <Grid container direction="row">
                    <Avatar src={`/assets/stars/3.jpg`} className={classes.starSize} />
                    <Avatar src={`/assets/stars/3.jpg`} className={classes.starSize} />
                    <Avatar src={`/assets/stars/3.jpg`} className={classes.starSize} />
                </Grid>
            )
    }
}

const useStyles = makeStyles((theme) => ({
    starSize: {
        width: theme.spacing(1),
        height: theme.spacing(1),
    },
}));

export default function ChampionTierStars(props) {
    const classes = useStyles();
    try {
        return (
            <Grid item>
                {renderStars(props.unit, classes)}
            </Grid>
        )
    }
    catch (error) {
        console.log(error);
        return (
            <Error />
        )
    }

}