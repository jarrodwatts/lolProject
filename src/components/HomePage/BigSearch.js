import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import Form from './Form';
import Error from '../Error'

export default function BigSearch() {

    try {
        return (
            <Form />
        )
    }
    catch (error) {
        console.log(error);
        return (
            <Error />
        )
    }
}