import React, { Component } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Link from '../src/Link';
import theme from '../src/theme';
import { Container, Typography, Box, MuiLink, Button, TextField, Grid } from '@material-ui/core';

const PostLink = props => (
  <Link href="/summoner/[id]" as={`/summoner/${props.id}`}>
    Search
  </Link>
);

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
      <MuiThemeProvider theme={theme}>

        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: '100vh' }}
        >

          <Typography variant="h1" component="h1" gutterBottom>
            lolProject
          </Typography>

          <Link href="/about" color="secondary">
            Go to the about page
          </Link>

          <Box>
            <form >
              <label>Summoner Name:</label>
              <input type="text" value={this.state.value} onChange={this.handleChange} />
              <Button>
                <PostLink id={this.state.value} />
              </Button>
            </form>
          </Box>

        </Grid>
      </MuiThemeProvider>

    );
  }
}
