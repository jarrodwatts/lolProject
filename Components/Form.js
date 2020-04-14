import React from 'react';
import { Typography, Button, TextField, Grid, } from '@material-ui/core';
import Router from 'next/router';

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
        console.log('A name was submitted: ' + this.state.value);
        console.log(event);
        //next.js navigation using router
        Router.push('/summoner/[id]', ('/summoner/' + this.state.value))
        event.preventDefault();
    }

    render() {
        return (
            <Grid
                style={{
                    width: '100%',
                }}>
                <form onSubmit={this.handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={9}>
                            <TextField type="text"
                                value={this.state.value}
                                onChange={this.handleChange}
                                placeholder="Search Summoner Name"
                                color="secondary"
                                style={{
                                    paddingRight: '16px',
                                    paddingLeft: '32px',
                                    height: '100%',
                                    color: '#fff',
                                    width: '100%'
                                }}
                            />

                        </Grid>
                        <Grid item xs={3}>
                            <Button type="submit">Search</Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        );
    }
}