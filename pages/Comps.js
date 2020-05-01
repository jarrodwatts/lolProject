import NavBar from '../components/NavBar';
import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, Box, Grid, Avatar, Paper, } from '@material-ui/core';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import TraitsRow from '../components/SummonerPage/TraitsRow';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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

function produceSimilarity(a, b) {
    let matched = 0;
    let total;
    let tempA = a;
    let tempB = b;
    //Grab which ever one is longer for total

    //If A is longer, compare each item of b to a
    if (tempA.length > tempB.length) {
        total = tempA.length;
        for (let i = 0; i < tempA.length; i++) {
            if (tempA.includes(tempB[i])) {
                matched++
            }
        }
    }

    //If b is longer, compare each item of a to b
    else {
        total = tempB.length;
        for (let i = 0; i < tempB.length; i++) {

            let temp1 = tempA.map((champ => champ.character_id))
            let temp2 = tempB.map((champ => champ.character_id))


            //console.log(tempB.includes(tempA[i]))
            if (temp2.includes(temp1[i])) {
                matched++
            }
        }
    }

    return (matched / total) * 100

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

export default function Comps() {

    const classes = useStyles();
    const { data, error } = useSWR('/api/getMatches', fetcher);
    const matches = data;

    if (error) return <div>Failed to load</div>
    if (!matches) return <div>Loading...</div>

    else {

        let filteredMatches = matches.filter(x => x.metadata != undefined)
        let masterArray = [];

        //1. For each match,
        for (let i = 0; i < filteredMatches.length; i++) {

            //2. Get each player's units array
            for (let x = 0; x < filteredMatches[i].info.participants.length; x++) {

                //3. Sort the units array
                let tempArr = filteredMatches[i].info.participants[x].units.sort(function (a, b) {
                    // if (a.character_id == undefined) {
                    //     debugger;
                    // }
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
                    traits: filteredMatches[i].info.participants[x].traits,
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
        // for (let p = 0; p < 2000; p++) {

            let actionTaken = false;

            //Take a quick check to see if unique arrays length is 0 - this means there's nothing to compare and its the first iteration
            if (uniqueArray.length == 0) {
                //Thus push it to be the first item of comparison
                let tempObj = {
                    comp: masterArray[p].comp,
                    traits: masterArray[p].traits,
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
                let thisComp = masterArray[p].comp;

                for (let n = 0; n < uniqueArray.length; n++) {
                    let comparisonComp = uniqueArray[n].comp

                    //console.log("thisComp:", thisComp, "vs:", "comparisonComp:", comparisonComp)
                    if (isArrayEqual(thisComp, comparisonComp)) {
                        //Comp already exists

                        //If they won the game, increment win, else increment loss
                        masterArray[p].placement == 1 ? uniqueArray[n].winLoss.win++ : uniqueArray[n].winLoss.loss++
                        uniqueArray[n].matches++;
                        uniqueArray[n].placementsArray.push(masterArray[p].placement)

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
                        traits: masterArray[p].traits,
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

        //Workflow: Group unique comps.
        let compGroupings = [];
        let actionTaken = false;

        for (let a = 0; a < uniqueArray.length; a++) {
            actionTaken = false;
            //console.log("The comp:", uniqueArray[a])
            //debugger;
            for (let c = 0; c < compGroupings.length; c++) {
                //If compGrouping length is greater than 0
                if (compGroupings.length > 0) {
                    //Check if it's similar to an already existing comp grouping before comparing it with other comps in unique array
                    for (let d = 0; d < compGroupings[c].comps.length; d++) {
                        let percentageSimilarity = produceSimilarity(compGroupings[c].comps[d].comp, uniqueArray[a].comp);
                        if (percentageSimilarity > 75) {
                            //found a mathc in this compGrouping
                            compGroupings[c].comps.push(uniqueArray[a])
                            actionTaken = true;
                            //console.log("Action Taken: Added to ", compGroupings[c])
                            //also cut off the loop so it doesn't get added to more than one comp..
                            c = compGroupings.length;
                            break; //Break the loop

                        }
                    }
                    if (actionTaken) { break };
                }
            }

            if (!actionTaken) {
                //Compare this comp's composition with each other (remaining) composition, 
                for (let b = a + 1; b < uniqueArray.length; b++) {
                    //Assuming they're sorted...
                    //Produce a percentage of how many elements are similar between a and b
                    let percentageSimilarity = produceSimilarity(uniqueArray[a].comp, uniqueArray[b].comp);

                    //If percentage is greater than 74%
                    if (percentageSimilarity > 74) {
                        //create a new temp object and push it to compGroupings (that contains these two compositions in this temp objects .comps [])
                        let newCompGroup = {
                            name: "temp comp name",
                            comps: [
                                uniqueArray[a], uniqueArray[b]
                            ]
                        }
                        compGroupings.push(newCompGroup);
                        actionTaken = true;
                        b = uniqueArray.length//break the loop
                        //console.log("Action Taken: Created new Grouping  ", newCompGroup, "And added it to", compGroupings)

                    }

                    else {
                        //wait for the loop to finish and check if an action still hasn't been taken

                    }

                }

                if (!actionTaken) {
                    let newCompGroup = {
                        name: "temp comp name",
                        comps: [
                            uniqueArray[a]
                        ]
                    }
                    compGroupings.push(newCompGroup);
                    //console.log("Action Taken: Created new comp group with just one comp:", uniqueArray[a], "And added it to", compGroupings)
                }

            }
        }

        //8. Sort uniqueArray by win Rate

        //Below is sort by: 
        //Win Ratio
        //uniqueArray.sort((a, b) => parseFloat(b.winRatio) - parseFloat(a.winRatio));

        //Matches
        uniqueArray.sort((a, b) => parseFloat(b.matches) - parseFloat(a.matches));

        //averagePlacement
        //uniqueArray.sort((a, b) => parseFloat(a.averagePlacement) - parseFloat(b.averagePlacement));

        console.log("Master", masterArray)
        console.log("Unique", uniqueArray)
        console.log("Grouped", compGroupings);

        //cleaning out zeroes again
        for (var i = uniqueArray.length - 1; i >= 0; i--) {
            if (uniqueArray[i].averagePlacement == 0) {
                uniqueArray.splice(i, 1);
            }
        }

        //filter out "games with less than 10 matches"
        for (var i = uniqueArray.length - 1; i >= 0; i--) {
            if (uniqueArray[i].matches < 10) {
                uniqueArray.splice(i, 1);
            }
        }

        //For each compGrouping: remove each comp that only has 1
        for (var i = compGroupings.length - 1; i >= 0; i--) {
            for (var x = compGroupings[i].comps.length - 1; x >= 0; x--) {
                if (compGroupings[i].comps[x].matches < 5) {
                    compGroupings[i].comps.splice(x, 1);
                }
            }
            //if there's no more comps in the compGroup discard this comp
            if (compGroupings[i].comps.length == 0) {
                compGroupings.splice(i, 1);
            }
        }

        //Sort each compGrouping's comp by number of matches
        for (let i = 0; i < compGroupings.length; i++) {
            compGroupings[i].comps.sort((a, b) => b.matches - a.matches);
        }

        //Sort entire compGroupings array by number of comps 
        compGroupings.sort((a, b) => b.comps.length - a.comps.length);

        //uniqueArray.sort((a, b) => parseFloat(b.winRatio) - parseFloat(a.winRatio));

        //compGroupings.length = 20;

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
                            {compGroupings.map((composition, key) => (

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
                                                                    <Typography><b>{parseFloat(composition.comps[0].winRatio.toFixed(2)) * 100 + "%"}</b></Typography>
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
                                                                    <Typography><b>{composition.comps[0].averagePlacement.toFixed(2)}</b></Typography>
                                                                </Box>
                                                            </Grid>

                                                            {/* Synergies / Traits */}
                                                            <Grid item style={{ paddingLeft: '64px' }}>
                                                                <Box>
                                                                    <Typography variant="caption">Traits</Typography>
                                                                    <Grid container direction="row">
                                                                        {composition.comps[0].traits.map((trait, key) => (
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
                                                            {composition.comps[0].comp.map((unit, key) => (
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

                                                            <Grid container item xs={12} direction="column" spacing={1}>
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
                                                                                                    <Typography><b>{parseFloat(comp.winRatio.toFixed(2)) * 100 + "%"}</b></Typography>
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
                                                                                                    <Typography><b>{comp.averagePlacement.toFixed(2)}</b></Typography>
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