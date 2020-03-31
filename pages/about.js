import React from 'react';
import { Container, Typography, Box, MuiLink, Button } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Link from '../src/Link';
import theme from '../src/theme';

export default function About() {
  return (
    <MuiThemeProvider theme={theme}>
      <Button>Overrides CSS</Button>
    </MuiThemeProvider>
  );
}
