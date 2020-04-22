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

function isArrayEqual(arr1, arr2) {

    //Check if comps are the same length first before comparing
    if (arr1.length == arr2.length) {

        arr1 = arr1.sort(function (a, b) {
            var x = a.character_id.toLowerCase();
            var y = b.character_id.toLowerCase();
            if (x < y) { return -1; }
            if (x > y) { return 1; }
            return 0;
        });

        arr2 = arr2.sort(function (a, b) {
            var x = a.character_id.toLowerCase();
            var y = b.character_id.toLowerCase();
            if (x < y) { return -1; }
            if (x > y) { return 1; }
            return 0;
        });

        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i].character_id !== arr2[i].character_id)
                return false;
        }

        return true;
    }

    else { return false; }
}

function sliceCharacterString(string) {
    return string.substr(5).toLowerCase()
}

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

                //4. Grab the placement of this comp alongside it's units
                let tempPlacement = filteredMatches[i].info.participants[x].placement;

                let tempObj = {
                    comp: tempArr,
                    placementsArray: [tempPlacement],
                    winLoss: {
                        win: 0,
                        loss: 0
                    },
                    matches: 1,
                    placement: tempPlacement
                }

                //5. Push the units array to master array
                masterArray.push(tempObj);
            }
        }

        //6. Use masterArray to create a new reduced array with unique comps
        let uniqueArray = [];

        for (let p = 0; p < masterArray.length; p++) {

            let actionTaken = false;

            //Take a quick check to see if unique arrays length is 0 - this means there's nothing to compare and its the first iteration
            if (uniqueArray.length == 0) {
                //Thus push it to be the first item of comparison
                let tempObj = {
                    comp: masterArray[p].comp,
                    placementsArray: [masterArray[p].placement],
                    winLoss: {
                        win: 0,
                        loss: 0
                    },
                    matches: masterArray[p].matches,
                    averagePlacement: masterArray[p].placement,

                }
                //Check for this games placemnet
                masterArray[p].placement == 1 ? tempObj.winLoss.win++ : tempObj.winLoss.loss++
                uniqueArray.push(tempObj)
            }

            else {
                //Compare the current comp to each comp in uniqueArrays to see if it exists within uniqueArray.
                //debugger;
                let thisComp = masterArray[p].comp;

                for (let n = 0; n < uniqueArray.length; n++) {
                    let comparisonComp = uniqueArray[n].comp

                    //console.log("thisComp:", thisComp, "vs:", "comparisonComp:", comparisonComp)
                    if (isArrayEqual(thisComp, comparisonComp)) {

                        //Comp already exists
                        //Update that comp's win loss ratio in the unique array.
                        //If they won the game, increment win, else increment loss
                        masterArray[p].placement == 1 ? uniqueArray[n].winLoss.win++ : uniqueArray[n].winLoss.loss++
                        uniqueArray[n].matches++;
                        uniqueArray[n].placementsArray.push(masterArray[p].placement)
                        let temp4 = (uniqueArray[n].placementsArray.reduce((a, b) => a + b)) / uniqueArray[n].matches;

                        //if (temp4 == 0) { debugger; }

                        uniqueArray[n].averagePlacement = (
                            uniqueArray[n].placementsArray.reduce((a, b) => a + b) / uniqueArray[n].matches
                        )
                        //Note we've taken an action on this comp.
                        actionTaken = true;
                        //break the for loop
                        n = uniqueArray.length;
                    }

                    else {
                        //Comp has not yet been added to uniqueArrays.
                        //Add comp to unqiue array
                        //Do nothing until the for loop breaks where we add the comp to unique arrays
                    }
                }

                //At the end of the loop, check if we've taken an action on this comp.
                //If not, it means it's unique and we need to add it to uniqueArray
                if (actionTaken == false) {

                    let tempObj = {
                        comp: masterArray[p].comp,
                        placementsArray: [masterArray[p].placement],
                        winLoss: {
                            win: 0,
                            loss: 0
                        },
                        matches: 1,
                        averagePlacement: masterArray[p].placement,
                    }

                    //Check for this games placemnet
                    masterArray[p].placement == 1 ? tempObj.winLoss.win++ : tempObj.winLoss.loss++;

                    uniqueArray.push(tempObj)

                    actionTaken = true;
                }
            }

        }

        //7. Calculate a winrate for each unique comp
        for (let i = 0; i < uniqueArray.length; i++) {
            uniqueArray[i]["winRatio"] = uniqueArray[i].winLoss.win / (uniqueArray[i].winLoss.win + uniqueArray[i].winLoss.loss)
        }

        //8. Sort uniqueArray by win Rate

        //Below is sort by: 
        //Win Ratio
        //uniqueArray.sort((a, b) => parseFloat(b.winRatio) - parseFloat(a.winRatio));

        //Matches
        uniqueArray.sort((a, b) => parseFloat(b.matches) - parseFloat(a.matches));

        //averagePlacement
        //uniqueArray.sort((a, b) => parseFloat(a.averagePlacement) - parseFloat(b.averagePlacement));

        console.log(masterArray)
        console.log(uniqueArray)

        //cleaning out zeroes again
        for (var i = uniqueArray.length - 1; i >= 0; i--) {
            if (uniqueArray[i].averagePlacement == 0) {
                uniqueArray.splice(i, 1);
            }
        }

        //filter out "1-gamers"
        for (var i = uniqueArray.length - 1; i >= 0; i--) {
            if (uniqueArray[i].matches == 1) {
                uniqueArray.splice(i, 1);
            }
        }


        uniqueArray.length = 250;

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

                        {/* Compositions */}
                        <Grid container item xs={12} direction="column" spacing={1}>
                            {uniqueArray.map((composition, key) => (

                                <Box key={key} style={{ paddingBottom: '16px' }}>

                                    {/* Begin individual Composition Papers */}
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
                                                                <Typography variant="caption">Win Ratio</Typography>
                                                                <Typography><b>{composition.winRatio.toFixed(2) * 100 + "%"}</b></Typography>
                                                            </Box>
                                                        </Grid>

                                                        {/* Matches */}
                                                        <Grid item style={{ paddingLeft: '16px' }}>
                                                            <Box>
                                                                <Typography variant="caption">Matches</Typography>
                                                                <Typography><b>{composition.matches}</b></Typography>
                                                            </Box>
                                                        </Grid>

                                                        {/* Wins */}
                                                        <Grid item style={{ paddingLeft: '16px' }}>
                                                            <Box>
                                                                <Typography variant="caption">Wins</Typography>
                                                                <Typography><b>{composition.winLoss.win}</b></Typography>
                                                            </Box>
                                                        </Grid>

                                                        {/* Losses */}
                                                        <Grid item style={{ paddingLeft: '16px' }}>
                                                            <Box>
                                                                <Typography variant="caption">Losses</Typography>
                                                                <Typography><b>{composition.winLoss.loss}</b></Typography>
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
                                                                <Typography>synergies</Typography>
                                                                <Grid container direction="row">
                                                                    {match.info.participants[getParticipantsIndex(match, profile.puuid)].traits.map((trait, key) => (
                                                                        <Grid item key={key}>
                                                                            {renderSynergy(trait, classes)}
                                                                        </Grid>
                                                                    ))}
                                                                </Grid>
                                                            </Grid> */}

                                                    </Grid>
                                                </Grid>


                                                {/* Champs */}
                                                <Grid item >
                                                    <Typography variant="caption">Team Composition</Typography>
                                                    <Grid container direction="row" alignItems="center">
                                                        {composition.comp.map((unit, key) => (
                                                            <Grid item key={key}>
                                                                <Avatar
                                                                    src={`/assets/champions/${sliceCharacterString(unit.character_id)}.png`}
                                                                    className={classes.large} />
                                                            </Grid>
                                                        ))}
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