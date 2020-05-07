import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
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
}));

function NavBar(props) {
    const classes = useStyles();

    const menuItems = ['Comps', 'Champions', 'Items', 'Traits'];


    return (
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
                            isWidthDown('xs', props.width) ?

                                <div>small boi</div>
                                :
                                menuItems.map((item, key) => (
                                    <Typography key={key} variant="button" style={{ paddingLeft: '32px' }}>
                                        <Link href={"/" + item} style={{ color: '#fff' }}>
                                            {item}
                                        </Link>
                                    </Typography>


                                ))

                        }

                    </Grid>

                    <Button color="inherit">Login</Button>

                </Toolbar>
            </AppBar>

        </div>
    );
}

export default withWidth()(NavBar)