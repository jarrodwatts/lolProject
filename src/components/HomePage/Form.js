import React from 'react';
import { Typography, Button, TextField, Grid, CircularProgress } from '@material-ui/core';
import Router from 'next/router';
import Error from '../Error'

export default class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        //next.js navigation using router
        Router.push('/summoner/[id]', ('/summoner/' + this.state.value))
        event.preventDefault();
    }

    render() {
        try {
            return (
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <Grid container direction="row" alignItems="center" justify="center" spacing={3}>

                            <Grid item xs={7} md={7}>
                                <TextField type="text"
                                    value={this.state.value}
                                    onChange={this.handleChange}
                                    placeholder="Search Summoner"
                                    color="secondary"
                                    style={{
                                        paddingRight: '16px',
                                        paddingLeft: '32px',
                                        height: '100%',
                                        color: '#fff',
                                        width: '100%'
                                    }}
                                >
                                </TextField>

                            </Grid>

                            <Grid item xs={5} md={5}>
                                <Button type="submit">Search</Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            )
        }
        catch (error) {
            console.log(error);
            return (
                <Error />
            )
        };
    }
}