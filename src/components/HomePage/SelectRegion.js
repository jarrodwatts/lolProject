import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Error from '../Error'

export default function SimpleMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    try {
        return (
            <div>
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                    Select Region
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>OCE</MenuItem>
                    <MenuItem onClick={handleClose}>NA</MenuItem>
                    <MenuItem onClick={handleClose}>EUW</MenuItem>
                    <MenuItem onClick={handleClose}>Brazil</MenuItem>
                    <MenuItem onClick={handleClose}>Europe & Nordic East</MenuItem>
                    <MenuItem onClick={handleClose}>Europe West</MenuItem>
                    <MenuItem onClick={handleClose}>Japan</MenuItem>
                    <MenuItem onClick={handleClose}>Korea</MenuItem>
                    <MenuItem onClick={handleClose}>Latin America North</MenuItem>
                    <MenuItem onClick={handleClose}>Latin America South</MenuItem>
                    <MenuItem onClick={handleClose}>North America</MenuItem>
                    <MenuItem onClick={handleClose}>Oceania</MenuItem>
                    <MenuItem onClick={handleClose}>Russia</MenuItem>
                    <MenuItem onClick={handleClose}>Turkey</MenuItem>
                </Menu>
            </div>
        );
    }
    catch (error) {
        console.log(error);
        return (
            <Error />
        )
    }
}