// return (


//     <MuiThemeProvider theme={theme}>

//       <Grid
//         container
//         spacing={0}
//         direction="column"
//         alignItems="center"
//         justify="center"
//         style={{ minHeight: '100vh' }}
//       >

//         <Typography variant="h1" component="h1" gutterBottom style={{ color: '#fff' }}>
//           LOLPROJECT
//         </Typography>

//         {/* <Link href="/about" color="secondary">
//           Go to the about page
//         </Link> */}

//         <Grid
//           container
//           direction="row"
//           spacing={0}

//           alignItems="center"
//           justify="space-around">

//           {/* Empty Boxes for spacing */}
//           <Box></Box><Box></Box>

//           <Box>
//             <Typography variant="h4" component="h4" gutterBottom style={{ color: '#fff' }}>
//               Search:
//               </Typography>
//             <input type="text" value={this.state.value} onChange={this.handleChange} />
//           </Box>


//           <form >
//             <Button>
//               <PostLink id={this.state.value} />
//             </Button>
//           </form>

//           <Box></Box>
//           <Box></Box>
//         </Grid>

//       </Grid>
//     </MuiThemeProvider>

// {/* Logo & Choose Game DropDown */}
// <Grid container spacing={0} direction="row" alignItems="center">
// <Typography variant="h4" component="h4" style={{ color: '#fff', paddingRight: '16px' }}>
//   LOLPROJECT
// </Typography>
// <SelectGameMenu />
// </Grid>

// </Grid>

// <Container maxWidth="md">

// </Container>

//Old uhh [id] code

// console.log("profileRenderHandler being called");

// return (
//     <Container>
//         <p><b>id:</b> {profile.id}</p>
//         <p><b>accountId:</b> {profile.accountId}</p>
//         <p><b>puuid:</b> {profile.puuid}</p>
//         <p><b>profileIconId:</b> {profile.profileIconId}</p>
//         <p><b>revisionDate:</b> {profile.revisionDate}</p>
//         <p><b>summonerLevel:</b> {profile.summonerLevel}</p>
//     </Container>
// )

// console.log("matchesRenderHandler being called");

// return (
//     <Container>
//         <h2>Matches:</h2>
//         <ul>
//             {matches.map((item, key) => (
//                 <li key={key}>{item}</li>
//             ))}
//         </ul>
//     </Container>
// )

// console.log("matcheOneRenderHandler being called");
// return (
//     <Container>
//         <h2>Match One Details:</h2>
//         <h3>MetaData:</h3>
//         <p><b>match_id: </b>{matchOne.metadata.match_id}</p>
//         <p><b>Participants:</b></p>
//         <ul>
//             {matchOne.metadata.participants.map((item, key) => (
//                 <li key={key}>{item}</li>
//             ))}
//         </ul>

//         <h3>Info:</h3>
//         <p><b>match_id: </b>{matchOne.metadata.match_id}</p>
//         <p><b>Time: </b>{formatUnixDate(matchOne.info.game_datetime)}</p>
//     </Container>
// )