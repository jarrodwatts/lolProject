import React from 'react';
import { Container, Typography, Box, Grid } from '@material-ui/core';
import fetch from 'isomorphic-unfetch';
import { makeStyles } from '@material-ui/core/styles';
import { Chart } from "react-google-charts";
import theme from '../../src/theme';

//Import Components
import NavBar from '../../src/components/NavBar';

const RIOT_API_KEY = "RGAPI-b5b58085-c08a-4c23-a2eb-76745c38d339"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },

    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
    },
    topSpacing: {
        paddingTop: theme.spacing(2)
    },
}));

export default function Match({ match }) {
    const classes = useStyles()
    console.log(match)

    //Gather Graph info
    let timeElimDic = [];
    for (var i = 0; i < match.info.participants.length; i++) {
        timeElimDic.push({
            'puuid': match.info.participants[i].puuid,
            'timeElimd': match.info.participants[i].time_eliminated,
        })
    }

    timeElimDic.sort(function (a, b) {
        return a.timeElimd - b.timeElimd;
    });

    return (
        <div>
            <NavBar />
            <Container className={classes.topSpacing}>
                <Grid container justify="center" alignItems="center" direction="column">
                    <Grid item>
                        <Typography variant="h1">FUCK U BISMARK10</Typography>
                    </Grid>

                    <Chart
                        width={'100%'}
                        height={'500px'}
                        chartType="BarChart"
                        loader={<div>Loading Chart</div>}
                        data={[
                            [
                                { type: 'string', label: 'Summoner Name' },
                                { type: 'number', },
                                { type: 'number', label: 'Time Eliminated' },
                                { role: 'style' },
                                { role: 'annotation' },
                            ],
                            [timeElimDic[0].puuid, 0, (timeElimDic[0].timeElimd / 60).toFixed(2), 'opacity: 0.2; color: #3f51b5', '8th'],
                            [timeElimDic[1].puuid, 0, (timeElimDic[1].timeElimd / 60).toFixed(2), 'opacity: 0.4; color: #3f51b5', '7th'],
                            [timeElimDic[2].puuid, 0, (timeElimDic[2].timeElimd / 60).toFixed(2), 'opacity: 0.5; color: #3f51b5', '6th'],
                            [timeElimDic[3].puuid, 0, (timeElimDic[3].timeElimd / 60).toFixed(2), 'opacity: 0.6; color: #3f51b5', '5th'],
                            [timeElimDic[4].puuid, 0, (timeElimDic[4].timeElimd / 60).toFixed(2), 'opacity: 0.7; color: #3f51b5', '4th'],
                            [timeElimDic[5].puuid, 0, (timeElimDic[5].timeElimd / 60).toFixed(2), 'color: #b87333', '3rd'],
                            [timeElimDic[6].puuid, 0, (timeElimDic[6].timeElimd / 60).toFixed(2), 'silver', '2nd'],
                            [timeElimDic[7].puuid, 0, (timeElimDic[7].timeElimd / 60).toFixed(2), 'gold', '1st'],
                        ]}
                        options={{
                            title: 'Time Eliminated Of Each Player',
                            hAxis: {
                                title: 'Time Eliminated (Minutes)',
                            },
                            vAxis: {
                                title: 'Player',
                            },
                            bar: {
                                groupWidth: '95%',
                            },
                            legend: { position: 'none' },
                        }}
                    />
                </Grid>

            </Container>
        </div>
    )
}


export async function getServerSideProps(context) {
    //Fetch data from external API
    const { id } = context.query;
    //Ask match API for this specific match
    const res = await fetch(
        encodeURI(`https://americas.api.riotgames.com/tft/match/v1/matches/${id}` + '?api_key=' + RIOT_API_KEY)
    );
    const match = await res.json();
    //console.log(`Fetched profile: ${profile.id}`);
    return {
        props: {
            match
        }
    };


}