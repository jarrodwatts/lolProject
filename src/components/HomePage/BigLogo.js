import React from 'react';
import { Typography, } from '@material-ui/core';
import Error from '../Error'

export default function BigLogo() {

    try {
        return (
                <Typography variant="h2" component="h2" style={{ padding: '16px' }}>
                    NOPIVOT
                </Typography>
        )
    }

    catch (error) {
        console.log(error);
        return (
            <Error />
        )
    }

}