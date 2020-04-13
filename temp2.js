{/* Map matches into A paper element */}
{matchDetailsArray.map((match, key) => (
    <Grid item>
        <Paper key={key} style={{ display: 'flex', flexDirection: 'row', padding: '8px', justifyContent: 'center' }}>

            <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto', }}>
                <Typography variant="subtitle2">Placement</Typography>
            </Box>

            <Grid item container direction="row">
                <Grid item><Avatar /></Grid>
                <Grid item><Avatar /></Grid>
                <Grid item><Avatar /></Grid>
                <Grid item><Avatar /></Grid>
                <Grid item><Avatar /></Grid>
                <Grid item><Avatar /></Grid>

            </Grid>

            {/* <Grid className={classes.champRow}> */}
            {/* //Map units into row of avatars */}
            {match.info.participants[getParticipantsIndex(match, profile.puuid)].units.map((unit, key) => (
                <Grid key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto', }}>
                    <Avatar src={`/assets/champions/${sliceCharacterString(unit.character_id)}.png`} />

                    <Box style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Avatar src={`/assets/champions/${sliceCharacterString(unit.character_id)}.png`} style={{ width: '15%', height: '15%' }} />
                        <Avatar src={`/assets/champions/${sliceCharacterString(unit.character_id)}.png`} style={{ width: '15%', height: '15%' }} />
                        <Avatar src={`/assets/champions/${sliceCharacterString(unit.character_id)}.png`} style={{ width: '15%', height: '15%' }} />
                    </Box>
                </Grid>
            ))}
            {/* </Grid> */}

        </Paper>
    </Grid>

))}