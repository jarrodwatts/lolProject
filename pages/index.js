import React, { Component } from 'react';
import Link from '../src/Link';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, Box, MuiLink, Button, TextField } from '@material-ui/core';

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
      <Container maxWidth="sm" >
        <Box my={4}>

          <Typography variant="h1" component="h1" gutterBottom>
            lolProject
        </Typography>

          <Link href="/about" color="secondary">
            Go to the about page
        </Link>

          <form >
            <label>Summoner Name:</label>
            <input type="text" value={this.state.value} onChange={this.handleChange} />
            <Button variant="outlined" color="primary">
              <PostLink id={this.state.value} />
            </Button>
          </form>

        </Box>
      </Container>
    );
  }
}
