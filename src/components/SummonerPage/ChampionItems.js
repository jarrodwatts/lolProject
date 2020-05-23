import React from 'react';
import { Avatar, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Error from '../Error';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
    },

    itemSize: {
        width: theme.spacing(1.65),
        height: theme.spacing(1.65),
    },
}));

export default function ChampionItems(props) {
    const classes = useStyles();

    try {
        return (
            <Grid container alignItems="center" justify="center" item>
                {/* //Check if the item exists ...if so render... if not ... render empty div */}
                {props.unit.items[0] !== undefined ?
                    <Avatar
                        src={`/assets/items/${props.unit.items[0]}.png`}
                        className={classes.itemSize} /> :

                    <div />
                }

                {props.unit.items[1] !== undefined ?
                    <Avatar
                        src={`/assets/items/${props.unit.items[1]}.png`}
                        className={classes.itemSize} /> :

                    <div />
                }

                {props.unit.items[2] !== undefined ?
                    <Avatar
                        src={`/assets/items/${props.unit.items[2]}.png`}
                        className={classes.itemSize} /> :

                    <div />
                }
            </Grid>

        )
    }
    catch (error) {
        console.log(error);
        return (
            <Error/>
        )
    }

}