import React from 'react';
import { Box, Grid, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

function renderSynergy(trait, classes) {
    switch (trait.style) {

        case 1:
            return (
                <Box>
                    <Avatar
                        src={`/assets/traits/${trait.name.toLocaleLowerCase()}.png`}
                        className={classes.small} />
                </Box>
            )

        case 2:
            return (
                <Box>
                    <Avatar
                        src={`/assets/traits/${trait.name.toLocaleLowerCase()}.png`}
                        className={classes.small} />
                </Box>
            )

        case 3:
            return (
                <Box>
                    <Avatar
                        src={`/assets/traits/${trait.name.toLocaleLowerCase()}.png`}
                        className={classes.small} />
                </Box>
            )
    }
}

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },

}));

export default function TraitsRow(props) {
    const classes = useStyles();

    return (
        <div>
            {renderSynergy(props.trait, classes)}
        </div>
    )

}