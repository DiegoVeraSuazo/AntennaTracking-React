import React from 'react';
import { Grid, Box, Paper } from '@mui/material';
import AntennaPosition from '../components/antennaPosition';
import ControlAntenna from '../components/controlAntenna';
import AntennaControlPanel from '../components/antennaControlPanel';
import AntennaTrackCelestialObject from '../components/antennaTrackCelestialObject';

function AntenaControlPage() {

  return (
    <Box padding={2} sx={{ /*bgcolor: 'primary.main',*/ minHeight: '85vh' }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={24}
            sx={{
              width: 'auto',
              height: 'auto',
              borderRadius: 4,
              bgcolor: 'primary.main',
              padding: 2
            }}
          >
            <AntennaPosition />
            <Grid item xs={12} margin={2}>
              <ControlAntenna />
            </Grid>
            <Grid item xs={12} margin={2}>
              <AntennaTrackCelestialObject />
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={24}
            sx={{
              width: 'auto',
              height: 'auto',
              borderRadius: 4,
              bgcolor: 'primary.main',
              padding: 2
            }}
          >
            <AntennaControlPanel />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AntenaControlPage;
