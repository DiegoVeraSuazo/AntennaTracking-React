import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import '../App.css';

const Inicio = () => {
  return (
    <div style={{ padding: 20 }}>
      <Paper elevation={3} sx={{ backgroundColor: 'blue', color: 'white', padding: 3, marginBottom: 4 }}>
        <Paper elevation={3} sx={{ backgroundColor: 'white', padding: 4, alignItems:'center' }}>
          <Typography variant="h4" gutterBottom>
            Bienvenido al Proyecto Satélites
          </Typography>
          <Typography variant="body1">
            Este proyecto está diseñado para proporcionar información detallada sobre satélites en órbita.
            Puedes seleccionar un satélite para ver sus detalles, predicciones y rutas.
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            Utiliza el menú de navegación para explorar diferentes secciones y funcionalidades del proyecto.
          </Typography>
          <Typography variant="h5" gutterBottom>
            Antena:
          </Typography>
          <Box className="video-container">
            <video width="20%" controls >
              <source src="/Prueba Movimiento Rotor con Raspberry Pi 4-1.mp4" type="video/mp4" />
              Tu navegador no soporta el elemento de video.
            </video>
            <video width="63%" controls>
              <source src="/Prueba Antena_new.mp4" type="video/mp4" />
              Tu navegador no soporta el elemento de video.
            </video>
          </Box>
        </Paper>
      </Paper>
    </div>
  );
}

export default Inicio;
