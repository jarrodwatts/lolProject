import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '../Link';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    burger: {
        color: '#fff'
    },
}));

function NavBar(props) {
    const classes = useStyles();

    const menuItems = ['Comps', 'Champions', 'Items', 'Traits'];

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        !isWidthDown('xs', props.width) ?
            <div className={classes.root} style={{ paddingBottom: '16px' }}>
                <AppBar position="static">
                    <Toolbar>
                        <Grid container direction="row" alignItems="center" className={classes.title}>
                            <Typography variant="h6" >
                                <Link href="/" style={{ color: '#fff' }}>
                                    TFTProject
                            </Link>
                            </Typography>

                            {
                                menuItems.map((item, key) => (
                                    <Typography key={key} variant="button" style={{ paddingLeft: '32px' }}>
                                        <Link href={"/" + item} style={{ color: '#fff' }}>
                                            {item}
                                        </Link>
                                    </Typography>
                                ))

                            }

                        </Grid>

                    </Toolbar>
                </AppBar>

            </div> :

            <div className={classes.root} style={{ paddingBottom: '16px' }}>
                <AppBar position="static">
                    <Toolbar>
                        <Grid container direction="row" alignItems="center" justify="space-between" className={classes.title}>
                            <Typography variant="h6" >
                                <Link href="/" style={{ color: '#fff', paddingLeft: '8px' }}>
                                    TFTProject
                                </Link>
                            </Typography>

                            <div>
                                <IconButton
                                    aria-label="more"
                                    aria-controls="long-menu"
                                    aria-haspopup="true"
                                    onClick={handleClick}
                                    className={classes.burger}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    {
                                        menuItems.map((item, key) => (
                                            <MenuItem key={key} onClick={handleClose}>
                                                <Link href={"/" + item}>
                                                    {item}
                                                </Link>
                                            </MenuItem>
                                        ))
                                    }
                                </Menu>
                            </div>

                        </Grid>
                    </Toolbar>
                </AppBar>

            </div>
    );
}

export default withWidth()(NavBar)