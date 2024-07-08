import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CardActionArea, Paper, Box, CircularProgress, IconButton, TextField } from '@mui/material';
import { Refresh as RefreshIcon, Search as SearchIcon, Update as UpdateIcon } from '@mui/icons-material';
import axios from 'axios';

const SatelliteList = ({ onSatelliteSelect }) => {
  const [satellites, setSatellites] = useState([]);
  const [filteredSatellites, setFilteredSatellites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAscending, setSortAscending] = useState(true); // Estado para manejar el criterio de ordenación

  useEffect(() => {
    const fetchSatellites = async () => {
      try {
        const response = await axios.get('http://192.168.1.18:5018/satelliteData');
        const satellites = response.data['Satellite Data'];
        console.log('Obtenido los Satelites', satellites);
        setSatellites(satellites);
        setFilteredSatellites(satellites);
        setLoading(false);
      } catch (e) {
        console.error('Error fetching satellite data:', e);
        setError('Failed to fetch satellites');
        setLoading(false);
      }
    };

    fetchSatellites();
  }, []);

  const handleUpdateSatellites = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://192.168.1.18:5018/satelliteData');
      const satellites = response.data['Satellite Data'];
      console.log('Actualizando los Satelites', satellites);
      setSatellites(satellites);
      setFilteredSatellites(satellites);
      setLoading(false);
    } catch (e) {
      console.error('Error updating satellite data:', e);
      setError('Failed to update satellites');
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const results = satellites.filter(satellite =>
      satellite.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSatellites(results);
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSort = () => {
    const validSatellites = filteredSatellites.filter(satellite => 
      !isNaN(new Date(satellite.Tiempo_Inicio))
    );
    validSatellites.sort((a, b) => {
      const dateA = new Date(a.Tiempo_Inicio);
      const dateB = new Date(b.Tiempo_Inicio);
      return sortAscending ? dateA - dateB : dateB - dateA;
    });
    setSortAscending(!sortAscending);
    setFilteredSatellites([...validSatellites]);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Paper elevation={24} sx={{ flexWrap: 'wrap', padding: 0, margin: 3, width: 'auto', height: 'auto' }}>
        <Typography variant="h5" component="h3" align='center'>
          Satelites Disponibles
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: 1 }}>
          <TextField
            sx={{ flex: 1, marginRight: 1 }}
            label="Buscar Satélites"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchInputChange}
            onKeyDown={handleKeyPress}
          />
          <IconButton onClick={handleSearch} color="primary">
            <SearchIcon />
          </IconButton>
          <IconButton onClick={handleUpdateSatellites} color="primary">
            <RefreshIcon />
          </IconButton>
          <IconButton onClick={handleSort} color="primary" >
            <UpdateIcon />
          </IconButton>
        </Box>
      </Paper>
      <Paper elevation={24} sx={{ flexWrap: 'wrap', padding: 2, margin: 3, width: 'auto', height: 'auto' }}>
        <Box sx={{ display: 'flex', height: '75vh', overflow: 'hidden' }}>
          <Box sx={{ overflowY: 'auto', height: '100%', width: '100%', paddingRight: 2 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : (
              filteredSatellites.map((satellite) => (
                <Card 
                  key={satellite.sat_id} 
                  sx={{ marginBottom: 1, border: '1px solid #ccc' }} 
                  onClick={() => onSatelliteSelect(satellite)}
                >
                  <CardActionArea>
                    <CardContent>
                      <Typography gutterBottom variant="body1" component="div">
                        <strong>{satellite.name}</strong>
                      </Typography>
                      <Typography gutterBottom variant="body2" component="div">
                      <strong>{satellite.names}</strong>
                      </Typography>
                      <Typography gutterBottom variant="body2" component="div">
                      Proxima Observación: <strong>{satellite.Tiempo_Inicio}</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID Satelite: {satellite.sat_id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID NORAD: {satellite.norad_cat_id}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))
            )}
          </Box>
        </Box>
      </Paper>
    </div>
  );
};

export default SatelliteList;
