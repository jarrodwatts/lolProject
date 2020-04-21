import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import SelectGameMenu from './SelectGameMenu';

export default function Header() {

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