import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Paper, TextField } from '@mui/material';
import { useLocation } from 'react-router-dom';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { io } from 'socket.io-client';

const AntennaPosition = () => {
  const location = useLocation();
  const prediction = location.state?.predictionData;
  const predictionCelestial = location.state?.predictionCelestialObject;

  const [azimuth, setAzimuth] = useState(0);
  const [elevation, setElevation] = useState(0);
  const [inputAzimuth, setInputAzimuth] = useState(0);
  const [inputElevation, setInputElevation] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());


  // Function to fetch antenna rotor status
  // const fetchAntennaStatus = async () => {
  //   try {
  //     const response = await axios.get('http://192.168.1.18:5019/status');
  //     const { azimuth, elevation } = response.data;
  //     setAzimuth(azimuth);
  //     setElevation(elevation);
  //     console.log('Azimuth:', azimuth);
  //     console.log('Elevation:', elevation);
  //   } catch (error) {
  //     console.error('Error fetching antenna status:', error);
  //   }
  // };

  // Function to move antenna rotor to position
  const moveAntennaToPosition = async (moveAzimuth, moveElevation) => {
    var json_data = {azimuth: moveAzimuth, elevation: moveElevation};
    console.log('Enviado: ', json_data);
    try {
      await axios.post('http://192.168.1.18:5019/moveToPosition', { data: json_data });
    } catch (error) {
      console.error('Error moving antenna to position:', error);
    }
  };

  // Function to track prediction
  const handleTrackPrediction = async () => {
    try {
      const postDataPred = prediction.Predicción[0];
      console.log('Enviado: ', postDataPred); 
      await axios.post('http://192.168.1.18:5019/trackPrediction', { postDataPred });
      console.log('Haciendo envío de la predicción a la API.');
      alert('Predicción enviada exitosamente a la API de seguimiento');
    } catch (error) {
      console.error('Error enviando la predicción a la API:', error);
      alert('Error enviando la predicción a la API');
    }
  };

  // Function to track celestial object
  const handleTrackCelestial = async () => {
    try {
      console.log('Enviado: ', predictionCelestial['Pasadas_predecidas']);
      var trackPredictionCelestial = predictionCelestial['Pasadas_predecidas'];
      await axios.post('http://192.168.1.18:5019/trackCelestialObject', { trackPredictionCelestial });
      console.log('Haciendo envío del seguimiento del cuerpo celeste a la API.');
      alert('Seguimiento del cuerpo celeste iniciado correctamente');
    } catch (error) {
      console.error('Error enviando el seguimiento del cuerpo celeste a la API:', error);
      alert('Error al iniciar el seguimiento del cuerpo celeste');
    }
  };

  // Function to stop tracking
  const handleStopTracking = async () => {
    try {
      await axios.get('http://192.168.1.18:5019/stopTracking');
      console.log('Enviando señal de detención');
      alert('Seguimiento detenido exitosamente');
    } catch (error) {
      console.error('Error deteniendo el seguimiento:', error);
      alert('Error deteniendo el seguimiento');
    }
  };

  // // Fetch antenna status on component mount and set up interval to fetch status regularly
  // useEffect(() => {
  //   fetchAntennaStatus(); // Fetch initial status
  //   const interval = setInterval(fetchAntennaStatus, 100); // Fetch status every second
  //   return () => clearInterval(interval); // Clean up interval on component unmount
  // }, []);

  useEffect(() => {
    const socket = io('http://192.168.1.18:5019');

    socket.on('estado_actual', (data) => {
      const { azimuth, elevation } = data;
      setAzimuth(azimuth);
      setElevation(elevation);
      console.log('Azimuth:', azimuth);
      console.log('Elevation:', elevation);
    });

    socket.emit('get_status');

    return () => {
      socket.emit('stop_status');
      socket.disconnect();
    };
  }, []);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Function to format date to HH:mm:ss
  const formatTime = (date) => {
    return date.toLocaleTimeString();
  };

  // Function to convert azimuth and elevation to SVG coordinates
  const convertToSVGCoordinates = (azimuth, elevation) => {
    const radius = 120; // Radius of the circle
    const centerX = 150; // Center X of the circle
    const centerY = 150; // Center Y of the circle

    // Calculate distance from center based on elevation
    const distanceFromCenter = ((90 - elevation) / 90) * radius;
    const x = centerX + distanceFromCenter * Math.cos((azimuth - 90) * (Math.PI / 180));
    const y = centerY + distanceFromCenter * Math.sin((azimuth - 90) * (Math.PI / 180));

    return { x, y };
  };

  // Function to generate SVG path for satellite trajectory
  const generateSatellitePath = () => {
    if (!prediction || !prediction.Predicción || !prediction.Predicción[0].Pasadas_predecidas) return '';

    const pasadas = prediction.Predicción[0].Pasadas_predecidas;
    if (pasadas.length === 0) return '';

    // Start with the first position
    let path = `M ${convertToSVGCoordinates(pasadas[0].az, pasadas[0].el).x} ${convertToSVGCoordinates(pasadas[0].az, pasadas[0].el).y}`;

    // Generate path segments
    for (let i = 1; i < pasadas.length; i++) {
      const { x, y } = convertToSVGCoordinates(pasadas[i].az, pasadas[i].el);
      path += ` L ${x} ${y}`;
    }

    return path;
  };

  // Function to generate SVG path for celestial object trajectory
  const generateCelestialObjectPath = () => {
    if (!predictionCelestial || predictionCelestial.length === 0) return '';

    // Start with the first position
    let path = `M ${convertToSVGCoordinates(predictionCelestial['Pasadas_predecidas'][0].az, predictionCelestial['Pasadas_predecidas'][0].el).x} ${convertToSVGCoordinates(predictionCelestial['Pasadas_predecidas'][0].az, predictionCelestial['Pasadas_predecidas'][0].el).y}`;

    // Generate path segments
    for (let i = 1; i < predictionCelestial['Pasadas_predecidas'].length; i++) {
      const { x, y } = convertToSVGCoordinates(predictionCelestial['Pasadas_predecidas'][i].az, predictionCelestial['Pasadas_predecidas'][i].el);
      path += ` L ${x} ${y}`;
    }

    return path;
  };

  // Convert angles to cartesian coordinates
  const radius = 120; // Increased radius of the circle
  const centerX = 150; // Increased center X of the circle
  const centerY = 150; // Increased center Y of the circle

  // Calculate distance from center based on elevation
  const distanceFromCenter = ((90 - elevation) / 90) * radius;
  const x = centerX + distanceFromCenter * Math.cos((azimuth - 90) * (Math.PI / 180));
  const y = centerY + distanceFromCenter * Math.sin((azimuth - 90) * (Math.PI / 180));

  // Function to generate elevation circles and cross lines
  const generateElevationCirclesAndLines = () => {
    const elements = [];

    // Main circle
    elements.push(
      <circle key="circle-main" cx={centerX} cy={centerY} r={radius} stroke="black" strokeWidth="2" fill="none" />
    );

    // Circles for each third of the radius
    elements.push(
      <circle key="circle-30" cx={centerX} cy={centerY} r={radius / 3} stroke="gray" strokeWidth="1" fill="none" />
    );
    elements.push(
      <circle key="circle-60" cx={centerX} cy={centerY} r={(2 * radius) / 3} stroke="gray" strokeWidth="1" fill="none" />
    );

    // Cross lines through the center of the circle
    elements.push(
      <line key="line-vertical" x1={centerX} y1={centerY - radius} x2={centerX} y2={centerY + radius} stroke="gray" strokeWidth="1" />
    );
    elements.push(
      <line key="line-horizontal" x1={centerX - radius} y1={centerY} x2={centerX + radius} y2={centerY} stroke="gray" strokeWidth="1" />
    );

    return elements;
  };

  return (
    <Paper
      elevation={24}
      sx={{
        width: 'auto',
        padding: 3,
        borderRadius: 2,
        bgcolor: 'white',
      }}
    >
      <Box padding={2} display="flex" flexDirection="row" alignItems="center">
        <Box flexDirection="column" alignItems="center">
          {prediction && prediction.Predicción && prediction.Predicción[0].Pasadas_predecidas && (
              <Box display="flex" justifyContent="center" width="100%">
                  <Typography align='center' variant="body1">
                      Seguimiento de <strong>{prediction.Satelite}</strong>
                  </Typography>
              </Box>
          )}
          {predictionCelestial && predictionCelestial['Pasadas_predecidas'] && predictionCelestial['Pasadas_predecidas'].length > 0 && (
              <Box display="flex" justifyContent="center" width="100%">
                  <Typography align='center' variant="body1">
                      Seguimiento de <strong>{predictionCelestial.Cuerpo_Celeste}</strong>
                  </Typography>
              </Box>
          )}

          <svg width="300" height="300">
            {/* Generate elevation circles and lines */}
            {generateElevationCirclesAndLines()}

            {/* Draw satellite path */}
            <path d={generateSatellitePath()} stroke="red" strokeWidth="2" fill="none" />

            {/* Draw celestial object path */}
            <path d={generateCelestialObjectPath()} stroke="blue" strokeWidth="2" fill="none" />

            {/* Point indicating antenna position */}
            <circle cx={x} cy={y} r="6" fill="red" />

            {/* Cardinal point labels */}
            <text x={centerX} y={centerY - radius - 10} textAnchor="middle" fill="black">N</text>
            <text x={centerX + radius + 10} y={centerY} textAnchor="middle" fill="black">E</text>
            <text x={centerX} y={centerY + radius + 20} textAnchor="middle" fill="black">S</text>
            <text x={centerX - radius - 10} y={centerY} textAnchor="middle" fill="black">O</text>
          </svg>
          {prediction && prediction.Predicción && prediction.Predicción[0].Pasadas_predecidas && (
            <Box mt={2} display="flex" flexDirection="column" alignItems="center">
              <Typography variant="subtitle1">
                Tiempo Inicio: {prediction.Predicción[0].Pasadas_predecidas[0].Tiempo_Cordenada}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <Button variant="contained" color="secondary" onClick={handleTrackPrediction}>
                  Empezar Seguimiento
                </Button>
                <StopCircleIcon onClick={handleStopTracking} fontSize='large' style={{ marginLeft: 8, cursor: 'pointer' }} />
              </Box>
            </Box>
          )}
          {predictionCelestial && predictionCelestial['Pasadas_predecidas'] && predictionCelestial['Pasadas_predecidas'].length > 0 && (
            <Box mt={2} display="flex" flexDirection="column" alignItems="center">
              <Typography variant="subtitle1">
                Tiempo Inicio: {predictionCelestial['Pasadas_predecidas'][0].Tiempo_Cordenada}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <Button variant="contained" color="secondary" onClick={handleTrackCelestial}>
                  Iniciar Seguimiento Cuerpo Celeste
                </Button>
                <StopCircleIcon onClick={handleStopTracking} fontSize='large' style={{ marginLeft: 8, cursor: 'pointer' }} />
              </Box>
            </Box>
          )}
        </Box>
        <Box 
          padding={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center" // Center vertically
          textAlign="center" // Align text horizontally to the center
        >
          <Typography variant="h4"><strong>Posición de la Antena</strong></Typography>
          <div>
            <Typography margin={'10px'} variant="body1">Azimut:</Typography>
            <TextField
              label="(0-360):"
              variant='outlined'
              size='small'
              color='warning'
              type="number"
              InputProps={{ inputProps: { min: 0, max: 360, step: 0.1 } }}
              onChange={(e) => setInputAzimuth(Number(e.target.value))} 
              value={inputAzimuth}
            />
          </div>
          <div> 
            <Typography margin={'10px'} variant="body1">Elevación:</Typography>
            <TextField
              label="(0-180):"
              variant='outlined'
              size='small'
              color='warning'
              type="number"
              InputProps={{ inputProps: { min: 0, max: 180, step: 0.1 } }}
              onChange={(e) => setInputElevation(Number(e.target.value))} 
              value={inputElevation}
            />
          </div>
          <br/>
          <Button variant="contained" color="primary" onClick={() => moveAntennaToPosition(inputAzimuth, inputElevation)}>
            Mover Antena
          </Button>
          <Box mt={2}>
            <Typography variant="h6"><strong>Posición Actual</strong></Typography>
            <Typography>Azimut: {azimuth}°</Typography>
            <Typography>Elevación: {elevation}°</Typography>
            <Typography variant="body1">Hora actual: {formatTime(currentTime)}</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default AntennaPosition;
