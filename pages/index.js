import React, { Component } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Link from '../src/Link';
import theme from '../src/theme';
import { Container, Typography, Box, MuiLink, Button, TextField, Grid, Icon, Paper } from '@material-ui/core';
import Header from '../components/Header';
import BigLogo from '../components/BigLogo';
import BigSearch from '../components/BigSearch';
import NavBar from '../components/NavBar';

export default class Index extends React.Component {

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
    console.log(this.state.value);
    event.preventDefault();

  }

  render() {
    return (
      <div>
        <NavBar />
        {/* //Main Background Grid */}
        <Grid container style={{ minHeight: '100vh' }}
          direction="column" alignItems="flex-start">

          {/* Header Component Here */}
          <Header />
          {/* Container that Centers things pushes them into the middle of the page */}
          <Container maxWidth="sm">

            {/* Big Logo Component Here */}
            <BigLogo />

            {/* Component with Search Bar, Region Selector, and Search Icon Here */}
            <BigSearch />

            {/* Component with the Four Game Cards Here */}

          </Container>
        </Grid>
      </div>
    );
  }
}
