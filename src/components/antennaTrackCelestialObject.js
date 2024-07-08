// src\components\antennaTrackCelestialObject.js
import React, { useState } from 'react';
import { Paper, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AntennaTrackCelestialObject = () => {
  const [selectedObject, setSelectedObject] = useState('');
  const [firstTimeCoordinate, setFirstTimeCoordinate] = useState('');
  const [lastTimeCoordinate, setLastTimeCoordinate] = useState('');
  const [cuerpoPredecida, setcuerpoPredecida] = useState([]);
  const navigate = useNavigate();

  const handleSelectChange = async (event) => {
    const selected = event.target.value;
    setSelectedObject(selected);
    console.log(selected);

    // Llamado a la API
    try {
      const response = await axios.post(`http://192.168.1.18:5018/pasadaCuerpoCeleste`, {selectedObject: selected});
      const dataCelestialObject = response.data['Pasada_Cuerpo'];
      console.log(dataCelestialObject);
      const pasada_cuerpo_predecida = dataCelestialObject['Pasadas_predecidas'];
      console.log(pasada_cuerpo_predecida);

      if (pasada_cuerpo_predecida.length > 0) {
        setFirstTimeCoordinate(pasada_cuerpo_predecida[0].Tiempo_Cordenada);
        setLastTimeCoordinate(pasada_cuerpo_predecida[pasada_cuerpo_predecida.length - 1].Tiempo_Cordenada);
        setcuerpoPredecida(dataCelestialObject); // Guardar la información en el estado
      }
    } catch (error) {
      console.error('Error al obtener datos del API', error);
    }
  };

  const handleSendData = () => {
    // Navegar al componente vecino pasando los datos
    console.log('Pasada Cuerpo Predecida:', cuerpoPredecida);
    console.log('Enviando datos:');
    navigate('/Antena', { state: { predictionCelestialObject: cuerpoPredecida } });
  };

  return (
    <div>
      <Paper
        elevation={24}
        sx={{
          width: 'auto',
          padding: 3,
          borderRadius: 2,
          bgcolor: 'white',
        }}
      >
        <h1>Seguimiento de Cuerpos Celestes</h1>
        <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Cuerpos Celestes
          </InputLabel>
          <Select
            onChange={handleSelectChange}
          >
            <MenuItem value={1}>Luna</MenuItem>
            <MenuItem value={2}>Sol</MenuItem>
            <MenuItem value={3}>Mercurio</MenuItem>
            <MenuItem value={4}>Venus</MenuItem>
            <MenuItem value={5}>Marte</MenuItem>
            <MenuItem value={6}>Jupiter</MenuItem>
            <MenuItem value={7}>Saturno</MenuItem>
            <MenuItem value={8}>Urano</MenuItem>
            <MenuItem value={9}>Neptuno</MenuItem>
            <MenuItem value={10}>Pluton</MenuItem>
          </Select>
        </FormControl>

        {selectedObject && (
          <div>
            <p>Primer Tiempo_Coordenada: {firstTimeCoordinate}</p>
            <p>Último Tiempo_Coordenada: {lastTimeCoordinate}</p>
            <Button variant="contained" color="primary" onClick={handleSendData}>
              Enviar Datos
            </Button>
          </div>
        )}
      </Paper>
    </div>
  );
};

export default AntennaTrackCelestialObject;
