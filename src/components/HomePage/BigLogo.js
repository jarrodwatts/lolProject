import React from 'react';
import { Typography, } from '@material-ui/core';
import Error from '../Error'

export default function BigLogo() {

    try {
        return (
            <div>
                {/* TODO: Temp Text replace with logo */}
                <Typography variant="h2" component="h2" style={{ padding: '16px' }}>
                    TFTPROJECT
            </Typography>
            </div>
        )
    }
    
    catch (error) {
        return (
            <Error />
        )
    }

}