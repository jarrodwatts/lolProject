import NavBar from '../components/NavBar';
import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, Box, Grid, Avatar, Paper, } from '@material-ui/core';
import { useRouter } from 'next/router';
import useSWR from 'swr';

function fetcher(url) {
    return fetch(url).then(r => r.json());
}

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 205,
        minHeight: 175,
    },

    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
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

export default function Comps() {

    const classes = useStyles();
    const { data, error } = useSWR('/api/getMatches', fetcher);
    const matches = data;

    if (error) return <div>failed to load</div>
    if (!matches) return <div>loading...</div>

    else {

        let filteredMatches = matches.filter(x => x.metadata != undefined)
        let masterArray = [];

        //1. For each match,
        for (let i = 0; i < filteredMatches.length; i++) {
            //2. Get each player's units array
            for (let x = 0; x < filteredMatches[i].info.participants.length; x++) {
                //3. Sort the units array

                let tempArr = filteredMatches[i].info.participants[x].units.sort(function (a, b) {
                    var x = a.character_id.toLowerCase();
                    var y = b.character_id.toLowerCase();
                    if (x < y) { return -1; }
                    if (x > y) { return 1; }
                    return 0;
                });

                //let tempArr = filteredMatches[i].info.participants[x].units.sort(function (a, b) { return a.character_id - b.character_id });

                //4. Push the units array to master array
                masterArray.push(tempArr);
            }
        }

        console.log(masterArray);

        return (
            <div>
                <NavBar />
                {/* Main Container */}
                <Container className={classes.topSpacing}>

                    <Grid container spacing={3} direction="column" >
                        {/* Heading and subtitle */}
                        <Grid container item direction="column" justify="center" alignItems="center">
                            <Typography variant="h2">LOLPROJECT</Typography>
                            <Typography variant="h5">Teamfight Tactics Compositions</Typography>
                        </Grid>

                        {/* Filters */}
                        <Grid container item>

                        </Grid>

                        {/* Champions */}
                        <Grid container item xs={12} direction="column" spacing={1}>
                            {filteredMatches.map((match, key) => (

                                <Box key={key} style={{ paddingBottom: '16px' }}>

                                    {/* Begin individual Match Papers */}
                                    <Grid item>
                                        <Paper className={classes.paper}>
                                            <Grid container item direction="row" alignItems="center" justify="space-between" spacing={3}>

                                                <Grid item>
                                                    <Grid container direction="row" alignItems="center">

                                                        {/* Companion image */}
                                                        <Grid item style={{ paddingLeft: '8px' }}>
                                                            {/* temp blitz: TODO: replace with companion icon */}
                                                            <Avatar src={`/assets/champions/blitzcrank.png`} />
                                                        </Grid>

                                                        {/* Placement and Type */}
                                                        <Grid item style={{ paddingLeft: '16px' }}>
                                                            <Box>
                                                                <Typography><b>placement</b></Typography>
                                                            </Box>
                                                        </Grid>

                                                        {/* Synergies / Traits */}
                                                        <Grid item style={{ paddingLeft: '64px' }}>
                                                            <Typography>synergies</Typography>
                                                            {/* <Grid container direction="row">
                                                                {match.info.participants[getParticipantsIndex(match, profile.puuid)].traits.map((trait, key) => (
                                                                    <Grid item key={key}>
                                                                        {renderSynergy(trait, classes)}
                                                                    </Grid>
                                                                ))}
                                                            </Grid> */}
                                                        </Grid>

                                                    </Grid>
                                                </Grid>


                                                {/* Champs */}
                                                <Grid item >
                                                    <Grid container direction="row" alignItems="center">
                                                        <Typography>Champs</Typography>
                                                        {/* {match.info.participants[getParticipantsIndex(match, profile.puuid)].units.map((unit, key) => (
                                                            <Grid item key={key}>
                                                                <Avatar
                                                                    src={`/assets/champions/${sliceCharacterString(unit.character_id)}.png`}
                                                                    className={classes.large} />
                                                            </Grid>
                                                        ))} */}
                                                    </Grid>
                                                </Grid>

                                            </Grid>

                                        </Paper>
                                    </Grid>
                                </Box>
                            ))}

                        </Grid>



                    </Grid>
                </Container>
            </div>
        )
    }

}