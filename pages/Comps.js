import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, Box, Grid, Avatar, Paper, FormControl, Select, FormHelperText, MenuItem, InputLabel } from '@material-ui/core';
import TraitsRow from '../src/components/SummonerPage/TraitsRow';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import NavBar from '../src/components/NavBar';
import Error from '../src/components/Error';

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

    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },

}));

function sliceCharacterString(string) {
    return string.substr(5).toLowerCase()
}

function generateCompName(traitsArray) {
    //Get the most satisfied traits names
    let compString = "";
    let compsAppended = 0;

    for (let i = 0; i < traitsArray.length; i++) {
        if (traitsArray[i].tier_current == traitsArray[i].tier_total && traitsArray[i].num_units > 2 || traitsArray[i].tier_current == traitsArray[i].tier_total && traitsArray[i].name == "Sniper") {
            compsAppended++
            //then check if it starts with SET and chop it accordingly
            if (traitsArray[i].name.startsWith("Set")) {
                compString += traitsArray[i].name.substr(5) + " ";
            }
            else {
                compString += traitsArray[i].name + " ";
            }

        }
    }

    //If the comp still doesn't have a name then we gotta settle for second place
    if (compsAppended < 3) {
        for (let i = 0; i < traitsArray.length; i++) {
            if (traitsArray[i].tier_current == (traitsArray[i].tier_total - 1) && traitsArray[i].tier_current != 0) {
                compsAppended++
                //then check if it starts with SET and chop it accordingly
                if (traitsArray[i].name.startsWith("Set")) {
                    compString += traitsArray[i].name.substr(5) + " ";
                }
                else {
                    compString += traitsArray[i].name + " ";
                }
            }
        }
    }

    //If the comp still doesn't have a name then we gotta settle for second place
    if (compsAppended < 2) {
        for (let i = 0; i < traitsArray.length; i++) {
            if (compsAppended < 3) {
                if (traitsArray[i].tier_current == (traitsArray[i].tier_total - 2) && traitsArray[i].tier_current != 0) {
                    compsAppended++
                    //then check if it starts with SET and chop it accordingly
                    if (traitsArray[i].name.startsWith("Set")) {
                        compString += traitsArray[i].name.substr(5) + " ";
                    }
                    else {
                        compString += traitsArray[i].name + " ";
                    }
                }
            }
        }
    }

    return compString;

}

export default function Comps({ data }) {

    const classes = useStyles();
    const [rank, setRank] = React.useState('ALL_RANKS');
    const [server, setServer] = React.useState('ALL_SERVERS')

    const handleRankChange = (event) => {
        console.log(event.target.value)
        setRank(event.target.value);
    };

    const handleServerhange = (event) => {
        console.log(event.target.value)
        setServer(event.target.value);
    };

    const compGroupings = data;
    if (!compGroupings) return <div>Loading Comps...</div>

    else {
        console.log(compGroupings);
        return (
            <div>
                <NavBar />
                {/* Main Container */}
                <Container className={classes.topSpacing}>

                    <Grid container spacing={3} direction="column" >
                        {/* Heading and subtitle */}
                        <Grid container item direction="column" justify="center" alignItems="center">
                            <Typography variant="h2">TFTPROJECT</Typography>
                            <Typography variant="h5">Teamfight Tactics Compositions</Typography>
                        </Grid>

                        {/* Filters */}
                        <Grid container direction="row" item>
                            <Box>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="rank-simple-select-label">Rank</InputLabel>
                                    <Select
                                        labelId="rank-simple-select-label"
                                        id="rank-simple-select"
                                        value={rank}
                                        onChange={handleRankChange}
                                    >
                                        <MenuItem value={'ALL_RANKS'}>All Ranks</MenuItem>
                                        <MenuItem value={'IRON'}>IRON</MenuItem>
                                        <MenuItem value={'BRONZE'}>BRONZE</MenuItem>
                                        <MenuItem value={'SILVER'}>SILVER</MenuItem>
                                        <MenuItem value={'GOLD'}>GOLD</MenuItem>
                                        <MenuItem value={'PLATINUM'}>PLATINUM</MenuItem>
                                        <MenuItem value={'DIAMOND'}>DIAMOND</MenuItem>
                                        {/* <MenuItem value={'MASTER'}>MASTER</MenuItem>
                                        <MenuItem value={'GRANDMASTER'}>GRANDMASTER</MenuItem>
                                        <MenuItem value={'CHALLENGER'}>CHALLENGER</MenuItem> */}


                                    </Select>
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <InputLabel id="server-simple-select-label">Server</InputLabel>
                                    <Select
                                        labelId="server-simple-select-label"
                                        id="server-simple-select"
                                        value={server}
                                        onChange={handleServerhange}
                                    >
                                        <MenuItem value={'ALL_SERVERS'}>All Servers</MenuItem>
                                        <MenuItem value={'BR1'}>Brazil</MenuItem>
                                        <MenuItem value={'EUN1'}>Europe & Nordic East</MenuItem>
                                        <MenuItem value={'EUW1'}>Europe West</MenuItem>
                                        <MenuItem value={'JP1'}>Japan</MenuItem>
                                        <MenuItem value={'KR'}>Korea</MenuItem>
                                        <MenuItem value={'LA1'}>Latin America North</MenuItem>
                                        <MenuItem value={'LA2'}>Latin America South</MenuItem>
                                        <MenuItem value={'NA1'}>North America</MenuItem>
                                        <MenuItem value={'OC1'}>Oceania</MenuItem>
                                        <MenuItem value={'RU'}>Russia</MenuItem>
                                        <MenuItem value={'TR1'}>Turkey</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>
                        {/* Compositions */}
                        <Grid container item xs={12} direction="column" spacing={1}>
                            {compGroupings[server][rank].map((composition, key) => (

                                <Box key={key} style={{ paddingBottom: '16px' }}>

                                    {/* Begin individual Composition Papers */}
                                    <Grid item>
                                        <Paper className={classes.paper}>
                                            <Grid container direction="row" item justify="flex-start">
                                                <Typography color="primary">{generateCompName(composition.comps[0].traits)}</Typography>
                                            </Grid>
                                            <Grid container direction="column" spacing={2}>
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
                                                                    <Typography variant="caption">Win Ratio</Typography>
                                                                    <Typography><b>{parseFloat(composition.comps[0].winRatio) * 100 + "%"}</b></Typography>
                                                                </Box>
                                                            </Grid>

                                                            {/* Matches */}
                                                            <Grid item style={{ paddingLeft: '16px' }}>
                                                                <Box>
                                                                    <Typography variant="caption">Matches</Typography>
                                                                    <Typography><b>{composition.comps[0].matches}</b></Typography>
                                                                </Box>
                                                            </Grid>

                                                            {/* Wins */}
                                                            <Grid item style={{ paddingLeft: '16px' }}>
                                                                <Box>
                                                                    <Typography variant="caption">Wins</Typography>
                                                                    <Typography><b>{composition.comps[0].winLoss.win}</b></Typography>
                                                                </Box>
                                                            </Grid>

                                                            {/* Losses */}
                                                            <Grid item style={{ paddingLeft: '16px' }}>
                                                                <Box>
                                                                    <Typography variant="caption">Losses</Typography>
                                                                    <Typography><b>{composition.comps[0].winLoss.loss}</b></Typography>
                                                                </Box>
                                                            </Grid>

                                                            {/* Losses */}
                                                            <Grid item style={{ paddingLeft: '16px' }}>
                                                                <Box>
                                                                    <Typography variant="caption">Average Placement</Typography>
                                                                    <Typography><b>{Math.round(composition.comps[0].averagePlacement * 100) / 100}</b></Typography>
                                                                </Box>
                                                            </Grid>

                                                            {/* Synergies / Traits */}
                                                            <Grid item style={{ paddingLeft: '64px' }}>
                                                                <Box>
                                                                    <Typography variant="caption">Traits</Typography>
                                                                    <Grid container direction="row">
                                                                        {composition['comps'][0].traits.map((trait, key) => (
                                                                            <Grid item key={key}>
                                                                                <TraitsRow trait={trait} />
                                                                            </Grid>
                                                                        ))}
                                                                    </Grid>
                                                                </Box>
                                                            </Grid>

                                                        </Grid>
                                                    </Grid>


                                                    {/* Champs */}
                                                    <Grid item>
                                                        <Typography variant="caption">Team Composition</Typography>
                                                        <Grid container direction="row" alignItems="center" justify="center">
                                                            {composition['comps'][0].comp.map((unit, key) => (
                                                                <Grid item key={key}>
                                                                    <Avatar
                                                                        src={`/assets/champions/${sliceCharacterString(unit.character_id)}.png`}
                                                                        className={classes.large} />
                                                                </Grid>
                                                            ))}
                                                        </Grid>
                                                    </Grid>

                                                </Grid>

                                                {composition.comps.length != 1 ?
                                                    <ExpansionPanel>
                                                        <ExpansionPanelSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls="panel1a-content"
                                                            id="panel1a-header"
                                                        >
                                                            <Typography className={classes.heading}>View Team Comp <b>Variations</b></Typography>
                                                        </ExpansionPanelSummary>

                                                        <ExpansionPanelDetails>

                                                            <Grid container item direction="column" spacing={1}>
                                                                {composition.comps.map((comp, key) => (
                                                                    <Grid item key={key}>
                                                                        <Paper className={classes.paper}>
                                                                            <Grid container direction="column" spacing={2}>
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
                                                                                                    <Typography variant="caption">Win Ratio</Typography>
                                                                                                    <Typography><b>{parseFloat(comp.winRatio) * 100 + "%"}</b></Typography>
                                                                                                </Box>
                                                                                            </Grid>

                                                                                            {/* Matches */}
                                                                                            <Grid item style={{ paddingLeft: '16px' }}>
                                                                                                <Box>
                                                                                                    <Typography variant="caption">Matches</Typography>
                                                                                                    <Typography><b>{comp.matches}</b></Typography>
                                                                                                </Box>
                                                                                            </Grid>

                                                                                            {/* Wins */}
                                                                                            <Grid item style={{ paddingLeft: '16px' }}>
                                                                                                <Box>
                                                                                                    <Typography variant="caption">Wins</Typography>
                                                                                                    <Typography><b>{comp.winLoss.win}</b></Typography>
                                                                                                </Box>
                                                                                            </Grid>

                                                                                            {/* Losses */}
                                                                                            <Grid item style={{ paddingLeft: '16px' }}>
                                                                                                <Box>
                                                                                                    <Typography variant="caption">Losses</Typography>
                                                                                                    <Typography><b>{comp.winLoss.loss}</b></Typography>
                                                                                                </Box>
                                                                                            </Grid>

                                                                                            {/* Losses */}
                                                                                            <Grid item style={{ paddingLeft: '16px' }}>
                                                                                                <Box>
                                                                                                    <Typography variant="caption">Average Placement</Typography>
                                                                                                    <Typography><b>{Math.round(comp.averagePlacement * 100) / 100}</b></Typography>
                                                                                                </Box>
                                                                                            </Grid>

                                                                                            {/* Synergies / Traits */}
                                                                                            <Grid item style={{ paddingLeft: '64px' }}>
                                                                                                <Box>
                                                                                                    <Typography variant="caption">Traits</Typography>
                                                                                                    <Grid container direction="row">
                                                                                                        {comp.traits.map((trait, key) => (
                                                                                                            <Grid item key={key}>
                                                                                                                <TraitsRow trait={trait} />
                                                                                                            </Grid>
                                                                                                        ))}
                                                                                                    </Grid>
                                                                                                </Box>
                                                                                            </Grid>

                                                                                        </Grid>
                                                                                    </Grid>

                                                                                    {/* Champs */}
                                                                                    <Grid item>
                                                                                        <Typography variant="caption">Team Composition</Typography>
                                                                                        <Grid container direction="row" alignItems="center" justify="center">
                                                                                            {comp.comp.map((unit, key) => (
                                                                                                <Grid item key={key}>
                                                                                                    <Avatar
                                                                                                        src={`/assets/champions/${sliceCharacterString(unit.character_id)}.png`}
                                                                                                        className={classes.large} />
                                                                                                </Grid>
                                                                                            ))}
                                                                                        </Grid>
                                                                                    </Grid>

                                                                                </Grid>

                                                                            </Grid>
                                                                        </Paper>
                                                                    </Grid>

                                                                )
                                                                )}
                                                            </Grid>

                                                        </ExpansionPanelDetails>
                                                    </ExpansionPanel>

                                                    : <Grid></Grid>
                                                }


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

export async function getServerSideProps() {
    const firebase = require("firebase");
    // Required for side-effects
    require("firebase/database");
    // Call an external API endpoint to get posts.
    if (!firebase.apps.length) {
        // Initialize Cloud Firestore through Firebase
        firebase.initializeApp({
            apiKey: "AIzaSyDRFR4EiyUwJJ1S2Bqdihqp7XgR7H4sDRA",
            authDomain: "lolproject-6938d.firebaseapp.com",
            databaseURL: "https://lolproject-6938d.firebaseio.com",
            projectId: "lolproject-6938d",
            storageBucket: "lolproject-6938d.appspot.com",
            messagingSenderId: "681416986021",
            appId: "1:681416986021:web:33705f6e1da5b886016c4c",
            measurementId: "G-MQDG4DGTK6"
        });
    }

    let comps = [];
    debugger;
    // Get a reference to the database service
    var db = firebase.database();

    await firebase.database().ref('/').once('value').then(function (snapshot) {
        //console.log(snapshot.val());
        comps = snapshot.val().comps.compGroupings;
        // ...
    });

    let data = comps;
    return {
        props: {
            data,
        },
    }
}