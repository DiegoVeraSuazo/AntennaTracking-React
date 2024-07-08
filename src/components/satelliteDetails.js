import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Paper, Box, Button, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MapComponent from './MapComponent';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const SatelliteDetails = ({ selectedSatellite }) => {
    const [prediction, setPrediction] = useState();
    const [route, setRoute] = useState();
    const [error, setError] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSatelliteData = async () => {
            if (selectedSatellite) {
                try {
                    const predictionResponse = await axios.post(`http://192.168.1.18:5018/pasadaSatelite`, {
                        satelliteNoradCatId: selectedSatellite.norad_cat_id
                    });
                    const predictionData = predictionResponse.data['Pasada Satelite'];
                    console.log('Obtenida la predicción del Satelite', predictionData);
                    if (predictionData.Error) {
                        setError('No existen datos del satélite');
                    } else {
                        setError(null)
                        setPrediction(predictionData);
                    }

                    const routeResponse = await axios.post(`http://192.168.1.18:5018/rutaSatelite`, {
                        satelliteNoradCatId: selectedSatellite.norad_cat_id
                    });
                    const routeData = routeResponse.data['Ruta Satelite'];
                    console.log('Obtenida la ruta del Satelite', routeData);
                    if (routeData.Error) {
                        setError('No existen datos del satélite');
                    } else {
                        setError(null)
                        setRoute(routeData);
                    }
                } catch (err) {
                    console.error('Error fetching satellite data:', err);
                    setError('Failed to fetch satellite data');
                }
            }
        };

        fetchSatelliteData();
    }, [selectedSatellite]);

    const handleButtonClick = () => {
        console.log('Enviando la predicción del Satelite.', prediction)
        navigate('/Antena', { state: { predictionData: prediction } });
    };

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    if (!selectedSatellite) {
        return (
            <Paper elevation={24} sx={{ padding: 2, margin: 3, width: '500px', height: '500px'}}>
                <Typography variant="h6" component="div" align="center">
                    Selecciona un satélite para ver los detalles.
                </Typography>
            </Paper>
        );
    }

    if (error) {
        return (
            <div>
                <Grid container spacing={2} justifyContent="center">
                <Paper elevation={3} sx={{ backgroundColor:'white', padding: 2, margin: 3, width: 'auto', height: 'auto', textAlign: 'center' }}>
                    <Paper elevation={3} sx={{ backgroundColor: 'red', padding: 2, margin: 3, width: 'auto', textAlign: 'center' }}>
                        <Typography variant="h2" component="div" color="white">
                            Error: {error}
                        </Typography>
                    </Paper>
                </Paper>
                </Grid>
            </div>
        );
    }

    if (prediction && prediction.Error) {
        return (
            <Paper elevation={3} sx={{ backgroundColor: 'white', padding: 2, margin: 3, width: '100%', textAlign: 'center' }}>
                <Typography variant="h1" component="div">
                    No existen datos del satélite para mostrar.
                </Typography>
            </Paper>
        );
    }

    return (
        <Box sx={{ display: 'flex', height: 'auto', overflow: 'hidden', marginTop: 0 }}>
            <Box sx={{ overflowY: 'auto', height: '100%', width: '100%', padding: 1 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Mapa
                </Typography>
                <MapComponent prediction={prediction} route={route} />
                <Box>
                    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <Card sx={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: 1, border: '1px solid #ccc', padding: 2, width: '100%' }}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {selectedSatellite.name}
                                </Typography>
                                <Typography gutterBottom variant="subtitle1" component="div">
                                    {selectedSatellite.names}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ID Satélite: {selectedSatellite.sat_id}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ID NORAD: {selectedSatellite.norad_cat_id}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Países: {selectedSatellite.countries}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Estado: {selectedSatellite.status}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Última actualización: {selectedSatellite.Ultimo_actualizado}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Tiempo de inicio: {selectedSatellite.Tiempo_Inicio}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Tiempo de término: {selectedSatellite.Tiempo_Fin}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" onClick={handleDialogOpen}>
                                    Transmisores [{selectedSatellite.transmitters.length}]
                                    <IconButton
                                        onClick={handleDialogOpen}
                                        aria-label="show more"
                                    >
                                        <ExpandMoreIcon />
                                    </IconButton>
                                </Typography>



                                {/* 
                                {prediction && !prediction.Error && (
                                    <>
                                        <Typography variant="body2" color="text.secondary">
                                            Última actualización: {prediction.Ultima_Actulizacion}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Tiempo de inicio: {prediction['Predicción'][0]['Tiempo_Inicio']}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Tiempo de término: {prediction['Predicción'][0]['Tiempo_Termino']}
                                        </Typography>
                                    </>
                                )} 
                                */}
                            </CardContent>
                            <Box height={'50px'} alignSelf={'center'}>
                            <Button onClick={handleButtonClick} variant="contained" color="primary" height='50px'>
                                Seguir con la Antena
                            </Button>
                            </Box>
                        </Card>
                    </div>
                </Box>
            </Box>

            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Typography variant="h4" component="div">
                        <strong>Detalles de los Transmisores</strong>
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {selectedSatellite.transmitters.map((transmitter, index) => (
                        <Box key={index} sx={{ marginBottom: 2 }}>
                            <Typography variant="h5" component="div">
                                <strong>Transmisor {index + 1}</strong>
                            </Typography>
                            <Typography variant="body1" >
                                Descripción: {transmitter.description}
                            </Typography>
                            <Typography variant="body1" >
                                UUID: {transmitter.uuid}
                            </Typography>
                            <Typography variant="body1" >
                                Alive: {transmitter.alive ? 'Yes' : 'No'}
                            </Typography>
                            <Typography variant="body1" >
                                Baud: {transmitter.baud ?? 'null'}
                            </Typography>
                            <Typography variant="body1" >
                                Citation: {transmitter.citation}
                            </Typography>
                            <Typography variant="body1" >
                                Downlink Drift: {transmitter.downlink_drift ?? 'null'}
                            </Typography>
                            <Typography variant="body1" >
                                Downlink High: {transmitter.downlink_high ?? 'null'}
                            </Typography>
                            <Typography variant="body1" >
                                Downlink Low: {transmitter.downlink_low ?? 'null'}
                            </Typography>
                            <Typography variant="body1" >
                                Frequency Violation: {transmitter.frequency_violation ? 'Yes' : 'No'}
                            </Typography>
                            <Typography variant="body1" >
                                IARU Coordination: {transmitter.iaru_coordination ?? 'null'}
                            </Typography>
                            <Typography variant="body1" >
                                IARU Coordination URL: {transmitter.iaru_coordination_url ?? 'null'}
                            </Typography>
                            <Typography variant="body1" >
                                Invert: {transmitter.invert ? 'Yes' : 'No'}
                            </Typography>
                            <Typography variant="body1" >
                                ITU Notification: {transmitter.itu_notification ? transmitter.itu_notification.urls.join(', ') : 'N/A' ?? 'null'}
                            </Typography>
                            <Typography variant="body1" >
                                Mode: {transmitter.mode ?? 'null'}
                            </Typography>
                            <Typography variant="body1" >
                                Mode ID: {transmitter.mode_id ?? 'null'}
                            </Typography>
                            <Typography variant="body1" >
                                NORAD Cat ID: {transmitter.norad_cat_id}
                            </Typography>
                            <Typography variant="body1" >
                                NORAD Follow ID: {transmitter.norad_follow_id ?? 'null'}
                            </Typography>
                            <Typography variant="body1" >
                                Sat ID: {transmitter.sat_id ?? 'null'}
                            </Typography>
                            <Typography variant="body1" >
                                Service: {transmitter.service ?? 'null'}
                            </Typography>
                            <Typography variant="body1" >
                                Status: {transmitter.status ?? 'null'}
                            </Typography>
                            <Typography variant="body1" >
                                Type: {transmitter.type ?? 'null'}
                            </Typography>
                            <Typography variant="body1" >
                                Unconfirmed: {transmitter.unconfirmed ? 'Yes' : 'No' ?? 'null'}
                            </Typography>
                            <Typography variant="body1" >
                                Updated: {new Date(transmitter.updated).toLocaleString() ?? 'null'}
                            </Typography>
                            <Typography variant="body1" >
                                Uplink Drift: {transmitter.uplink_drift ?? 'null'}
                            </Typography>
                            <Typography variant="body1" >
                                Uplink High: {transmitter.uplink_high ?? 'null'}
                            </Typography>
                            <Typography variant="body1" >
                                Uplink Low: {transmitter.uplink_low ?? 'null'}
                            </Typography>
                            <Typography variant="body1" >
                                Uplink Mode: {transmitter.uplink_mode ?? 'null'}
                            </Typography>
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SatelliteDetails;
