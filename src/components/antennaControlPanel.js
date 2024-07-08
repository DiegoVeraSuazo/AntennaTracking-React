import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Paper, Slider, Typography } from '@mui/material';

const AntennaControlPanel = () => {
  const [limits, setLimits] = useState(null);
  const [pulses, setPulses] = useState(null);
  const [powerMotor1, setPowerMotor1] = useState(50);
  const [powerMotor2, setPowerMotor2] = useState(50);

  useEffect(() => {
    fetchAntennaData();
  }, []);

  const fetchAntennaData = async () => {
    try {
      const limitsResponse = await axios.get('http://192.168.1.18:5019/limits');
      setLimits(limitsResponse.data);
      console.log('Antenna limits:', limitsResponse);
      const pulsesResponse = await axios.get('http://192.168.1.18:5019/pulses');
      setPulses(pulsesResponse.data);
      console.log('Antenna pulses:', pulsesResponse);
    } catch (error) {
      console.error('Error fetching antenna data:', error);
    }
  };

  const stopRotor = async () => {
    try {
      await axios.get('http://192.168.1.18:5019/stop');
      console.log('Rotor stopped');
    } catch (error) {
      console.error('Error stopping the rotor:', error);
    }
  };

  const setPowerMotor = async (power1, power2) => {
    try {
      await axios.get('http://192.168.1.18:5019/setPowerMotor', {
        params: {
          PowerInput1: power1,
          PowerInput2: power2,
        },
      });
      console.log('Power motor set:', power1, power2);
    } catch (error) {
      console.error('Error setting power motor:', error);
    }
  };

  const handleSetPowerMotor = () => {
    setPowerMotor(powerMotor1, powerMotor2);
  };

  const cleanAllSettings = async () => {
    try {
      await axios.get('http://192.168.1.18:5019/cleanSettings');
      console.log('All settings cleaned');
    } catch (error) {
      console.error('Error cleaning all settings:', error);
    }
  };

  return (
    <Paper
    elevation={24}
    sx={{
      width: 'auto',
      padding: 1,
      borderRadius: 2,
      bgcolor: 'white',
    }}>
        <Box padding={2} display="flex" flexDirection="column" alignItems="center">
        <h1>Control Panel de la Antena</h1>
        <Box width="100%" maxWidth="500px" mb={3}>
            <Typography variant="h5">Límites de la Antena</Typography>
            <pre>
              <Typography variant="h6" fontSize={18}>
                Min Azimuth: {limits ? limits["limite"][0] : 'Cargando...'} <br />
                Max Azimuth: {limits ? limits["limite"][1] : 'Cargando...'} <br />
                Min Elevation: {limits? limits["limite"][2] : 'Cargando...'} <br />
                Max Elevation: {limits? limits["limite"][3] : 'Cargando...'} <br />
              </Typography>
            </pre>
        </Box>
        <Box width="100%" maxWidth="500px" mb={3}>
            <Typography variant="h5">Pulsos de la Antena</Typography>
            <pre><Typography variant="h6">{pulses ? (pulses["pulsos_por_grado"]/100) : 'Cargando...'}</Typography></pre>
        </Box>
        <Box width="100%" maxWidth="500px" mb={3}>
            <Typography variant="h5">Control de Potencia del Motor</Typography>
            <Typography>Power Motor 1: {powerMotor1}</Typography>
            <Slider
            size="medium"
            value={powerMotor1}
            onChange={(e, newValue) => setPowerMotor1(newValue)}
            aria-labelledby="power-motor-1-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={0}
            max={100}
            />
            <Typography>Power Motor 2: {powerMotor2}</Typography>
            <Slider
            size="medium"
            value={powerMotor2}
            onChange={(e, newValue) => setPowerMotor2(newValue)}
            aria-labelledby="power-motor-2-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={0}
            max={100}
            color='primary'
            />
        </Box>
        <Box mb={3}>
            <Button variant="contained" color="primary" onClick={handleSetPowerMotor}>
                Set Power Motor
            </Button>
        </Box>
        <Box mb={3}>
            <Button variant="contained" color="secondary" onClick={stopRotor}>
            Detener Rotor
            </Button>
        </Box>
        <Box mb={3}>
            <Button variant="contained" color="error" onClick={cleanAllSettings}>
            Limpiar Todos los Ajustes
            </Button>
        </Box>
        </Box>
    </Paper>
  );
};

export default AntennaControlPanel;
