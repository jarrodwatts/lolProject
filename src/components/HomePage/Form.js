import React from 'react';
import { Typography, Button, TextField, Grid, FormControl, Select, MenuItem, InputLabel } from '@material-ui/core';
import Router from 'next/router';
import Error from '../Error'

export default class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            server: '',
            summonerBorderColor: '',
            summonerBorderStyle: '',
            serverBorderColor: '',
            serverBorderStyle: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleServerChange = this.handleServerChange.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleServerChange(event) {
        console.log(event.target.value)
        this.setState({ server: event.target.value });
    }

    handleSubmit(event) {
        //next.js navigation using router

        if (!this.state.server) {
            event.preventDefault();
            this.setState({ serverBorderColor: '#F76C6C' })
            this.setState({ serverBorderStyle: 'groove' })
        }

        if (!this.state.value) {
            event.preventDefault();
            this.setState({ summonerBorderColor: '#F76C6C' })
            this.setState({ summonerBorderStyle: 'groove' })
        }

        if (this.state.value && this.state.server) {
            event.preventDefault();
            Router.push('/[server]/summoner/[id]', ('/' + this.state.server.toLowerCase() + '/summoner/' + this.state.value.toLowerCase()))
            console.log('/' + this.state.server + '/summoner/' + this.state.value)
        }

    }

    render() {
        try {
            return (
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <Grid container direction="row" alignItems="center" justify="center" spacing={3}>

                            <Grid item>
                                <TextField type="text"
                                    value={this.state.value}
                                    onChange={this.handleChange}
                                    placeholder="Search Summoner"
                                    color="secondary"
                                    style={{
                                        paddingTop: '16px',
                                        height: '100%',
                                        color: '#fff',
                                        width: '100%',
                                        border: 2,
                                        borderStyle: this.state.summonerBorderStyle,
                                        borderColor: this.state.summonerBorderColor
                                    }}
                                >
                                </TextField>
                            </Grid>

                            <Grid item>
                                <FormControl style={{
                                    minWidth: 120,
                                    border: 2,
                                    borderStyle: this.state.summonerBorderStyle,
                                    borderColor: this.state.summonerBorderColor
                                }}>
                                    <InputLabel id="rank-simple-select-label">Server</InputLabel>
                                    <Select
                                        labelId="rank-simple-select-label"
                                        id="rank-simple-select"
                                        value={this.state.server}
                                        onChange={this.handleServerChange}
                                    >
                                        <MenuItem value={'BR1'}>Brazil</MenuItem>
                                        <MenuItem value={'EUN1'}>Europe & Nordic East</MenuItem>
                                        <MenuItem value={'EUW1'}>Europe West</MenuItem>
                                        <MenuItem value={'JP1'}>Japan</MenuItem>
                                        <MenuItem value={'KR'}>Korea</MenuItem>
                                        <MenuItem value={'LA1'}>Latin America North</MenuItem>
                                        <MenuItem value={'LA2'}>Latin America South</MenuItem>
                                        <MenuItem value={'NA1'}>North America</MenuItem>
                                        <MenuItem value={'OC1'}>Oceania</MenuItem>
                                        <MenuItem value={'RU'}>Russia</MenuItem>
                                        <MenuItem value={'TR1'}>Turkey</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item>
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