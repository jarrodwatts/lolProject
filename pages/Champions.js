import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import NavBar from '../components/NavBar';
import { Container, Typography, Box, Grid, Avatar, Paper, } from '@material-ui/core';

import ChampionStats from '../public/assets/data/championStats.json';
import ChampionDetails from '../public/assets/data/championDetails.json';
import ChampionsJson from '../public/assets/champions.json';

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 205,
        minHeight: 175,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },

    topSpacing: {
        paddingTop: theme.spacing(2)
    },
    content: {
        flex: '1 0 auto',
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
}));

export default function Champions() {

    const championsArray = ChampionsJson;
    const championStats = ChampionStats.items;
    const championDetails = ChampionDetails.items

    const classes = useStyles();

    //console.log("championStats", championStats)
    //console.log("championDetails", championDetails)

    return (
        <div>
            <NavBar />
            {/* // Main Container */}
            <Container className={classes.topSpacing}>

                <Grid container spacing={3} direction="column">

                    {/* Heading and subtitle */}
                    <Grid container item direction="column" justify="center" alignItems="center">
                        <Typography variant="h2">LOLPROJECT</Typography>
                        <Typography variant="h5">Teamfight Tactics Champions</Typography>
                    </Grid>

                    {/* Filters */}
                    <Grid container item>

                    </Grid>

                    {/* Champions */}
                    <Grid container item direction="row" spacing={2} justify="center" alignItems="center">
                        {championsArray.map((champ, key) => (
                            <Grid item key={key}>
                                <Paper>
                                    {renderChampCard(champ, classes)}
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                </Grid>
            </Container>



        </div>
    )
}

function renderChampCard(champ, classes) {
    return (





        <Grid container direction="column" style={{ position: 'relative' }}>
            <img
                style={{
                    minWidth: 205,
                    minHeight: 175,
                }}
                src={`/assets/champions/${sliceCharacterString(champ.championId)}.png`}

            />

            <Grid container item direction="row" style={{ position: 'absolute', bottom: '0px', left: '0px', backgroundColor: '#374785' }} justify="space-between">
                <Typography style={{ paddingLeft: '8px', color: '#fff' }}>{champ.name}</Typography>
                <Typography style={{ paddingRight: '8px', color: '#fff' }}>{champ.cost}</Typography>
            </Grid>

            <Grid container item direction="row" style={{ position: 'absolute', bottom: '40px', left: '0px' }} justify="space-between">
                <Box>
                    {champ.traits.map((trait, key) => (
                        <Grid container item direction="row" key={key} style={{ paddingLeft: '8px' }}>
                            <Avatar
                                src={`/assets/traits/${trait.toLocaleLowerCase()}.png`}
                                className={classes.small} />
                            <Typography style={{ paddingLeft: '8px', color: '#fff' }}>{trait}</Typography>
                        </Grid>
                    ))}

                </Box>
            </Grid>

        </Grid>
    )
}


function sliceCharacterString(string) {
    return string.substr(5).toLowerCase()
}