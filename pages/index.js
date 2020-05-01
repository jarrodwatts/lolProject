import React, { Component } from 'react';
import { Container, Grid } from '@material-ui/core';
import Header from '../src/components/Homepage/Header';
import BigLogo from '../src/components/Homepage/BigLogo';
import BigSearch from '../src/components/Homepage/BigSearch';
import NavBar from '../src/components/NavBar';

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
    //console.log(this.state.value);
    event.preventDefault();

  }

  render() {
    return (
      <div>
        <NavBar />

        {/* Container that Centers things pushes them into the middle of the page */}
        <Container maxWidth="sm">
          <Grid direction="row" container justify="center" alignItems="center" style={{height: '65vh'}}>

            <Grid item>
              {/* Big Logo Component */}
              <BigLogo />
              {/* Component with Search Bar, Region Selector, and Search Icon */}
              <BigSearch />
            </Grid>

          </Grid>
        </Container>

      </div>
    );
  }
}
