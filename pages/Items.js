import { makeStyles } from '@material-ui/core/styles';
import NavBar from '../src/components/NavBar';
import { Container, Typography, Box, Grid, Avatar, Paper, } from '@material-ui/core';
import Error from '../src/components/Error';

// import ChampionStats from '../public/assets/data/championStats.json';
// import ChampionDetails from '../public/assets/data/championDetails.json';
import ItemsJson from '../public/assets/data/itemDetails.json';

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 205,
        minHeight: 175,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },

    topSpacing: {
        paddingTop: theme.spacing(2)
    },
    content: {
        flex: '1 0 auto',
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
}));

export default function Items() {

    const itemsArray = ItemsJson.items;

    const classes = useStyles();


    return (
        <div>
            <NavBar />
        </div>
    )

}