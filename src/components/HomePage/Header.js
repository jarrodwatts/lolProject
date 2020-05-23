import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import SelectGameMenu from './SelectGameMenu';
import Error from '../Error'

export default function Header() {

    try {
        return (
            <div>
                {/* Logo & Choose Game DropDown */}
                <Grid container spacing={0} direction="row" alignItems="center" justify="flex-start">
                    <Typography variant="h4" component="h4" style={{ color: '#fff', padding: '16px' }}>
                        LOLPROJECT
                    </Typography>
                    <SelectGameMenu />
                </Grid>
            </div>
        )
    }
    catch (error) {
        console.log(error);
        return(
            <Error/>
        )
    }

}