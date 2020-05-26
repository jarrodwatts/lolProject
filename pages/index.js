import React, { Component } from 'react';
import { Container, Grid } from '@material-ui/core';
import dynamic from 'next/dynamic'
import { makeStyles } from '@material-ui/core/styles';

const BigLogo = dynamic(
  () => import('../src/components/HomePage/BigLogo'),
  { ssr: false }
)

const BigSearch = dynamic(
  () => import('../src/components/HomePage/BigSearch'),
  { ssr: false }
)

const NavBar = dynamic(
  () => import('../src/components/NavBar'),
  { ssr: false }
)

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

        <Grid container direction="column" spacing={3} justify="center" alignItems="center" style={{ height: '65vh', }}>

          {/* Big Logo Component */}
          <BigLogo />
          {/* Component with Search Bar, Region Selector, and Search Icon */}
          <BigSearch />

        </Grid>
      </div>
    );
  }
}
