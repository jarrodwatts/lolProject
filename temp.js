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


//NEW [ID] CODE REMOVED TO TEMP
// return (
//     <Grid style={{ minWidth: '100%' }}>

//         {matchDetailsArray.map((item, key) => (

//             <Grid key={key} container direction="row" justify="flex-start" alignItems="center" style={{ padding: '16px', backgroundColor: '#202B43', minWidth: '100%', color: '#fff' }}>

//                 {/* Image */}
//                 <Avatar alt="profile-picture" src="/assets/champions/blitzcrank.png" />

//                 {/* Place and Type */}
//                 <Box style={{ backgroundColor: '#202B43', color: '#fff', paddingLeft: '16px', paddingRight: '16px', }}>
//                     <Typography variant="subtitle2" component="p">{formatPlacement(findPlacement(item, puuid))} Place</Typography>
//                     <Typography variant="body2" component="p">Type</Typography>
//                 </Box>

//                 {/* Loop through and .map units */}
//                 {/* item.info.participants[getParticipantsIndex(item, puuid)].units.map((unit, key) => (
//                         <Box key={key} style={{ paddingRight: '8px', display: 'flex', flexWrap: 'nowrap', overflow: 'hidden' }}
//                         >
//                             <Avatar
//                                 key={key}
//                                 alt={unit.character_id}
//                                 src={`/assets/champions/${unit.character_id.substr(5).toLowerCase()}.png`}

//                             />

//                             <Grid container direction="row" justify="center" alignItems="center" style={{ width: '100%', backgroundColor: '#202B43', }}>
                                
//                             </Grid>
//                         </Box>
//                     ))

//                 } */}

//                 <div style={{
//                     display: 'flex',
//                     flexWrap: 'wrap',
//                     justifyContent: 'space-around',
//                     overflow: 'hidden',
//                     backgroundColor: '#202B43'
//                 }}>
//                     <GridList cols={9} style={{
//                         flexWrap: 'nowrap',
                        
//                         // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
//                         // transform: 'translateZ(0)',
//                     }}>

//                         {item.info.participants[getParticipantsIndex(item, puuid)].units.map((unit, key) => (
//                             <GridListTile key={key}>
//                                 <Avatar alt={unit.character_id}
//                                     src={`/assets/champions/${unit.character_id.substr(5).toLowerCase()}.png`} />
                                    
//                             </GridListTile>
//                         ))
//                         }
//                     </GridList>

//                 </div>

               

//             </Grid>

//         ))}

//     </Grid>
// )

//  //Main Background Grid
//  <Grid container style={{ minHeight: '100vh' }}
//  direction="column" alignItems="flex-start">

//  {/* Container that Centers things pushes them into the middle of the page */}
//  <Container maxWidth="lg">

//      <Grid container spacing={3} style={{ paddingTop: '16px' }}>

//          <Grid item xs={3}>
//              {/* LogoNameRank */}
//              <Grid container direction="row" alignItems="center" justify="space-around" style={{ padding: '16px', backgroundColor: '#202B43' }}>
//                  {/* <Grid container direction="row" alignItems="center" justify="space-around"> */}
//                  {/* TODO: Replace blitzcrank with profileIconId */}
//                  <Avatar alt="profile-picture" src="/assets/champions/blitzcrank.png" style={{ width: '25%', height: '25%' }} />
//                  {/* </Grid> */}

//                  <Grid container direction="column" alignItems="center" justify="center" style={{ width: '75%', backgroundColor: '#202B43' }} >
//                      <Typography variant="h6" component="h6" style={{ color: '#fff', padding: '16px' }}>{profile.name}</Typography>
//                      <Typography variant="h6" component="h6" style={{ color: '#fff', padding: '16px' }}>Rank</Typography>
//                  </Grid>
//              </Grid>

//              {/* Rank */}
//              <Grid>
//                  <Typography variant="h3" component="h3" style={{ color: '#fff', padding: '16px' }}>Teamfight Tactics</Typography>
//                  <Typography variant="h3" component="h3" style={{ color: '#fff', padding: '16px' }}>O RANK</Typography>
//              </Grid>

//              {/* Placement Distribution */}
//              <Grid>
//                  <Typography variant="h3" component="h3" style={{ color: '#fff', padding: '16px' }}>Teamfight Tactics</Typography>
//                  <Typography variant="h3" component="h3" style={{ color: '#fff', padding: '16px' }}>O RANK</Typography>
//              </Grid>

//          </Grid>

//          {/* Match History */}
//          <Grid container item xs={9} style={{ padding: '16px' }}>
//              {/* <Typography variant="h2" component="h2" style={{ color: '#fff', padding: '16px' }}>Match History</Typography>
//              <Typography variant="h2" component="h2" style={{ color: '#fff', padding: '16px' }}>Match History</Typography>
//              <Typography variant="h2" component="h2" style={{ color: '#fff', padding: '16px' }}>Match History</Typography>
//              <Typography variant="h2" component="h2" style={{ color: '#fff', padding: '16px' }}>Match History</Typography>
//              <Typography variant="h2" component="h2" style={{ color: '#fff', padding: '16px' }}>Match History</Typography>
//              <Typography variant="h2" component="h2" style={{ color: '#fff', padding: '16px' }}>Match History</Typography>
//              <Typography variant="h2" component="h2" style={{ color: '#fff', padding: '16px' }}>Match History</Typography>
//              <Typography variant="h2" component="h2" style={{ color: '#fff', padding: '16px' }}>Match History</Typography> */}

//              {matchDetailsArrayRenderHandler(matchDetailsArray, profile.puuid)}


//          </Grid>


//      </Grid>

//  </Container>
// </Grid>