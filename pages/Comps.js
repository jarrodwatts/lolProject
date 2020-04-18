import NavBar from '../components/NavBar';
import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, Box, Grid, Avatar, Paper, } from '@material-ui/core';
import { useRouter } from 'next/router';
import useSWR from 'swr';

function fetcher(url) {
    return fetch(url).then(r => r.json());
}

export default function Comps() {

    const { data, error } = useSWR('/api/getMatches', fetcher);
    const matches = data;

    console.log(error)

    console.log(matches)

    if (!error) {
        return (
            <div>
                <NavBar />
                <Typography>{matches == undefined ?
                    "Loading..." :
                    matches[0].matchName}</Typography>
            </div>
        )
    }

    else {
        return (
            <div>
                <NavBar />
                <div>oof ouchie my API broke</div>
            </div>
        )
    }
}