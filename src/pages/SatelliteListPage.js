import React, { useState } from 'react';
import { Box, Paper } from '@mui/material';
import SatelliteList from '../components/satelliteList';
import SatelliteDetails from '../components/satelliteDetails';


function SatelliteListPage() {

  const [selectedSatellite, setSelectedSatellite] = useState(null);

  const handleSatelliteSelect = (satellite) => {
    setSelectedSatellite(satellite);
  };

  return (
    <div >
        <Box>
          <Box display="flex"  >
            <Paper
              elevation={24}
              sx={{
                width: '40%',
                height: '100%',
                borderRadius: 1,
                bgcolor: 'primary.main',
              }}
            >
              <SatelliteList onSatelliteSelect={handleSatelliteSelect} align = 'center'/> {/* Usar el componente de lista de satélites */}
            </Paper>
              <Paper
              elevation={24}
                sx={{
                  marginLeft: 5,
                  padding: '10px',
                  width: 'auto',
                  height: 'auto',
                  borderRadius: 1,
                  bgcolor: 'primary.main',
                }}
              >
                {selectedSatellite && (
                    <SatelliteDetails selectedSatellite={selectedSatellite} />
                )}
              </Paper>
            </Box>
          </Box>
    </div>
  );
}

export default SatelliteListPage