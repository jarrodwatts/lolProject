import React from 'react';
import { Box, Grid, Avatar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Error from '../Error';

function renderSynergy(trait, classes) {
    switch (trait.style) {

        case 1:
            if (trait.name.startsWith("Set")) {
                return (
                    <Box>
                        <Avatar
                            src={`/assets/traits/${trait.name.toLocaleLowerCase().substr(5)}.png`}
                            className={classes.small}

                        />
                        <Typography variant="caption">{trait.num_units}</Typography>
                    </Box>
                )
            }
            else {
                return (
                    <Box>
                        <Avatar
                            src={`/assets/traits/${trait.name.toLocaleLowerCase()}.png`}
                            className={classes.small}

                        />
                        <Typography variant="caption">{trait.num_units}</Typography>
                    </Box>
                )
            }

        case 2:
            if (trait.name.startsWith("Set")) {
                return (
                    <Box>
                        <Avatar
                            src={`/assets/traits/${trait.name.toLocaleLowerCase().substr(5)}.png`}
                            className={classes.small}

                        />
                        <Typography variant="caption">{trait.num_units}</Typography>
                    </Box>
                )
            }
            else {
                return (
                    <Box>
                        <Avatar
                            src={`/assets/traits/${trait.name.toLocaleLowerCase()}.png`}
                            className={classes.small}

                        />
                        <Typography variant="caption">{trait.num_units}</Typography>
                    </Box>
                )
            }

        case 3:
            if (trait.name.startsWith("Set")) {
                return (
                    <Box>
                        <Avatar
                            src={`/assets/traits/${trait.name.toLocaleLowerCase().substr(5)}.png`}
                            className={classes.small}

                        />
                        <Typography variant="caption">{trait.num_units}</Typography>
                    </Box>
                )
            }
            else {
                return (
                    <Box>
                        <Avatar
                            src={`/assets/traits/${trait.name.toLocaleLowerCase()}.png`}
                            className={classes.small}

                        />
                        <Typography variant="caption">{trait.num_units}</Typography>
                    </Box>
                )
            }

        case 4:
            if (trait.name.startsWith("Set")) {
                return (
                    <Box>
                        <Avatar
                            src={`/assets/traits/${trait.name.toLocaleLowerCase().substr(5)}.png`}
                            className={classes.small}

                        />
                        <Typography variant="caption">{trait.num_units}</Typography>
                    </Box>
                )
            }
            else {
                return (
                    <Box>
                        <Avatar
                            src={`/assets/traits/${trait.name.toLocaleLowerCase()}.png`}
                            className={classes.small}

                        />
                        <Typography variant="caption">{trait.num_units}</Typography>
                    </Box>
                )
            }
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

    try {
        return (
            <div>
                {renderSynergy(props.trait, classes)}
            </div>
        )
    }
    catch (error) {
        console.log(error);
        return (
            <Error />
        )
    }

}