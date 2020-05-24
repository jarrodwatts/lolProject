
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
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
            renderPlacementStrip(props.placement)
        )
    }
    catch (error) {
        console.log(error);
        return (
            <Error />
        )
    }
}

function renderPlacementStrip(placement) {
    let backgroundColor = generateBackgroundColor(placement);

    return(<Box style={{ backgroundColor: { backgroundColor }, width: '4px', color: {backgroundColor}, height: '100%' }}>|</Box>)
}

function generateBackgroundColor(placement) {
    switch (placement) {
        case "1st":
            return "#FFDF00";

        case "2nd":
            return "#C0C0C0";


        case "3rd":
            return "#CD7F32";

        default:
            return "3f51b5";

    }
}

