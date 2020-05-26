import React from 'react';
import App from 'next/app';
import Router from "next/router";
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import ReactLoading from 'react-loading';

export default function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {

    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    const start = () => {
      console.log("start");
      setLoading(true);
    };

    const end = () => {
      console.log("findished");
      setLoading(false);
    };

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);

    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  return (
    <>
      {loading ?
        (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            marginTop: '-50px',
            marginLeft: '-100px',
          }}>
            <Grid container direction="column" alignItems="center" justify="center">
              <ReactLoading type={"bars"} color={"#3f51b5"} height={'20%'} width={'50%'} />

              <Typography variant="h6" color="primary">
                Loading...
              </Typography>
            </Grid>
          </div>
        )
        :
        (
          <React.Fragment>
            <Head>
              <title>NOPIVOT</title>
              <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>

            <ThemeProvider theme={theme}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              <Component {...pageProps} />
            </ThemeProvider>

          </React.Fragment>
        )
      }
    </>
  );

}