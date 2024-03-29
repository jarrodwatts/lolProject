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
const firebase = require("firebase");

if (!firebase.apps.length) {
    // Initialize Cloud Firestore through Firebase
    firebase.initializeApp({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain:  process.env.FIREBASE_AUTH_DOMAIN,
        databaseURL:  process.env.FIREBASE_DATABASE_URL,
        projectId:  process.env.FIREBASE_PROJECT_ID,
        storageBucket:  process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId:  process.env.FIREBASE_APP_ID,
        measurementId:  process.env.FIREBASE_MEASUREMENT_ID,
    });
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
    try {
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
    }

    catch (error) {
        console.log(error)
    }

    return compString;
}

function renderChamp(unit, classes) {
    let rarityColour = "#6c757d" //default grey

    switch (unit.rarity) {
        case 1: //2*
            rarityColour = "#28a745"
            break;

        case 2: //3*
            rarityColour = "#007bff"
            break;

        case 3: //4*
            rarityColour = "#6f42c1"
            break;

        case 4: //5*
            rarityColour = "#ffc107"
            break;

    }

    //convert to rgb for shadow
    let rarityColourRgb = rarityColour.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
        , (m, r, g, b) => '#' + r + r + g + g + b + b)
        .substring(1).match(/.{2}/g)
        .map(x => parseInt(x, 16))

    return (
        <Avatar
            src={`/assets/champions/${sliceCharacterString(unit.character_id)}.png`}
            className={classes.large}
            style={{
                border: 2,
                borderStyle: 'solid',
                borderColor: rarityColour,
                boxShadow: `0 3px 5px 2px rgba(${rarityColourRgb[0]}, ${rarityColourRgb[1]}, ${rarityColourRgb[2]}, .4)`
            }}

        />
    )
}

async function fetchNewDataFromDataBase(server, rank) {
    let comps = {};
    // Get a reference to the database service
    var db = firebase.database();

    let data;

    await db.ref(`/comps/${server}/${rank}`).once('value').then(function (snapshot) {
        //console.log(snapshot.val());
        comps = snapshot.val();
        data = comps;
    })

    //filter
    for (let compObject in data) {
        //clean unmappable data
        for (let i = 0; i < data[compObject].comps.length; i++) {
            try {
                if (!data[compObject].comps[i].comp) {
                    //remove this cos we cant map it
                    data.splice(compObject, 1);
                }
                // //do the same for traits
                // if (!data[compObject].comps[i].traits) {
                //     data.splice(compObject, 1);
                // }
            }

            catch (error) {
                console.log("Error in cleaning empty comps", error)
            }
        }
    }

    return data;

}

export default function Comps({ data }) {

    const classes = useStyles();
    const [rank, setRank] = React.useState('ALL_RANKS');
    const [server, setServer] = React.useState('ALL_SERVERS')

    const [currentServerRankCompData, setCurrentServerRankCompData] = React.useState(data);

    async function handleRankChange(event) {
        await setRank(event.target.value);
        //console.log("calling fetchnewdatafromdb within handlerankchange", server, event.target.value)
        let newData = await fetchNewDataFromDataBase(server, event.target.value)
        setCurrentServerRankCompData(newData);
    };

    async function handleServerhange(event) {
        setServer(event.target.value);
        let newData = await fetchNewDataFromDataBase(event.target.value, rank)
        setCurrentServerRankCompData(newData);
    };

    let compGroupings = currentServerRankCompData;

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
                            <Typography variant="h2">NOPIVOT</Typography>
                            <Typography variant="h6">Teamfight Tactics Compositions</Typography>
                        </Grid>

                        {/* Filters */}
                        <Grid container direction="column" item>

                            <Box>
                                <Typography color="primary"><b>Filters</b></Typography>
                            </Box>
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
                                        <MenuItem value={'IRON'}>Iron</MenuItem>
                                        <MenuItem value={'BRONZE'}>Bronze</MenuItem>
                                        <MenuItem value={'SILVER'}>Silver</MenuItem>
                                        <MenuItem value={'GOLD'}>Gold</MenuItem>
                                        <MenuItem value={'PLATINUM'}>Platinum</MenuItem>
                                        <MenuItem value={'DIAMOND'}>Diamond</MenuItem>
                                        <MenuItem value={'MASTER'}>Master</MenuItem>
                                        <MenuItem value={'GRANDMASTER'}>Grandmaster</MenuItem>
                                        <MenuItem value={'CHALLENGER'}>Challenger</MenuItem>


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
                            {compGroupings.map((composition, key) => (

                                <Box key={key} style={{ paddingBottom: '16px' }}>

                                    {/* Begin individual Composition Papers */}
                                    <Grid item>
                                        <Paper className={classes.paper}>

                                            {/* <Grid container direction="row" item justify="flex-start">
                                                <Typography color="primary">{generateCompName(composition.comps[0].traits)}</Typography>
                                            </Grid> */}

                                            <Grid container direction="column" spacing={2}>
                                                <Grid container item direction="row" alignItems="center" justify="space-between" spacing={3}>

                                                    <Grid item>
                                                        <Grid container direction="row" alignItems="center">

                                                            {/* Matches */}
                                                            <Grid item>
                                                                <Box>
                                                                    <Typography variant="caption">Matches</Typography>
                                                                    <Typography><b>{composition.totalMatches}</b></Typography>
                                                                </Box>
                                                            </Grid>

                                                            {/* Placement and Type */}
                                                            <Grid item style={{ paddingLeft: '16px' }}>
                                                                <Box>
                                                                    <Typography variant="caption">Win Rate</Typography>
                                                                    <Typography><b>{parseFloat(composition.winRate) + "%"}</b></Typography>
                                                                </Box>
                                                            </Grid>

                                                            {/* Wins */}
                                                            <Grid item style={{ paddingLeft: '16px' }}>
                                                                <Box>
                                                                    <Typography variant="caption">Top 4 Rate</Typography>
                                                                    <Typography><b>{composition.topFourRate + "%"}</b></Typography>
                                                                </Box>
                                                            </Grid>

                                                            {/* Losses */}
                                                            <Grid item style={{ paddingLeft: '16px' }}>
                                                                <Box>
                                                                    <Typography variant="caption">Average Placement</Typography>
                                                                    <Typography><b>{composition.averagePlacement}</b></Typography>
                                                                </Box>
                                                            </Grid>

                                                            {/* Synergies / Traits */}
                                                            {/* <Grid item style={{ paddingLeft: '64px' }}>
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
                                                            </Grid> */}

                                                        </Grid>
                                                    </Grid>


                                                    {/* Champs */}
                                                    <Grid item>
                                                        <Typography variant="caption">Team Composition</Typography>
                                                        <Grid container direction="row" alignItems="center" justify="center">
                                                            {composition['comps'][0].comp.map((unit, key) => (
                                                                <Grid item key={key}>
                                                                    {renderChamp(unit, classes)}
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
                                                                                            
                                                                                            {/* Matches */}
                                                                                            <Grid item style={{ paddingLeft: '16px' }}>
                                                                                                <Box>
                                                                                                    <Typography variant="caption">Matches</Typography>
                                                                                                    <Typography><b>{comp.matches}</b></Typography>
                                                                                                </Box>
                                                                                            </Grid>

                                                                                            {/* Win Rate */}
                                                                                            <Grid item style={{ paddingLeft: '16px' }}>
                                                                                                <Box>
                                                                                                    <Typography variant="caption">Win Ratio</Typography>
                                                                                                    <Typography><b>{parseFloat(Math.round(comp.winRate)) + "%"}</b></Typography>
                                                                                                </Box>
                                                                                            </Grid>

                                                                                            {/* TopFour Rate */}
                                                                                            <Grid item style={{ paddingLeft: '16px' }}>
                                                                                                <Box>
                                                                                                    <Typography variant="caption">Top Four Ratio</Typography>
                                                                                                    <Typography><b>{parseFloat(Math.round(comp.topFourRate)) + "%"}</b></Typography>
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
                                                                                                    {/* <Grid container direction="row">
                                                                                                        {comp.traits.map((trait, key) => (
                                                                                                            <Grid item key={key}>
                                                                                                                <TraitsRow trait={trait} />
                                                                                                            </Grid>
                                                                                                        ))}
                                                                                                    </Grid> */}
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
                                                                                                    {renderChamp(unit, classes)}
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
    // Call an external API endpoint to get posts.
    if (!firebase.apps.length) {
        // Initialize Cloud Firestore through Firebase
        firebase.initializeApp({
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain:  process.env.FIREBASE_AUTH_DOMAIN,
            databaseURL:  process.env.FIREBASE_DATABASE_URL,
            projectId:  process.env.FIREBASE_PROJECT_ID,
            storageBucket:  process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId:  process.env.FIREBASE_APP_ID,
            measurementId:  process.env.FIREBASE_MEASUREMENT_ID,
        });
    }

    let comps = {};
    // Get a reference to the database service
    var db = firebase.database();

    let data;
    await db.ref('/comps/ALL_SERVERS/ALL_RANKS').once('value').then(function (snapshot) {
        //console.log(snapshot.val());
        comps = snapshot.val();
        data = comps;

    });

    //filter
    for (let compObject in data) {
        //clean unmappable data
        for (let i = 0; i < data[compObject].comps.length; i++) {
            try {
                if (!data[compObject].comps[i].comp) {
                    //remove this cos we cant map it
                    data.splice(compObject, 1);
                }

                //do the same for traits
                // if (!data[compObject].comps[i].traits) {
                //     data.splice(compObject, 1);
                // }

            }

            catch (error) {
                console.log("Error in cleaning empty comps", error)
            }
        }
    }

    return {
        props: {
            data,
        },
    }

}
