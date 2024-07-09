import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Box } from '@mui/material';

// Solucionar problema de iconos faltantes de Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

let startIcon = L.icon({
  iconUrl: '/StartFlag.svg', // Ruta a tu imagen start.svg
  iconSize: [30, 30], // Tamaño de la imagen
  iconAnchor: [5, 30] // Punto de la imagen que se ubicará en la posición del marcador
})

let endIcon = L.icon({
  iconUrl: '/EndFlag.svg', // Ruta a tu imagen start.svg
  iconSize: [30, 30], // Tamaño de la imagen
  iconAnchor: [5, 30] // Punto de la imagen que se ubicará en la posición del marcador
})

const satelliteIcon = L.icon({
  iconUrl: '/iss.svg', // Ruta a tu imagen iss.svg
  iconSize: [30, 30], // Tamaño de la imagen
  iconAnchor: [15, 15] // Punto de la imagen que se ubicará en la posición del marcador
});

const replicateMarkers = (position, numReplicas = 3) => {
  const markers = [];
  const lngOffset = 360; // Distancia en grados para replicar el marcador
  for (let i = -numReplicas; i <= numReplicas; i++) {
    const newLng = position[1] + i * lngOffset;
    markers.push([position[0], newLng]);
  }
  return markers;
};

const MapComponent = ({ prediction, route }) => {
  const center = [51.505, -0.09];
  const bounds = [
    [-180, -360],
    [180, 360]
  ];

  const [satellitePosition, setSatellitePosition] = useState(null);
  const [satelliteIndex, setSatelliteIndex] = useState(0);

  useEffect(() => {
    if (route && route.Ruta_predecida && route.Ruta_predecida.length > 0) {
      const findInitialIndex = () => {
        const now = new Date();
        for (let i = 0; i < route.Ruta_predecida.length; i++) {
          const time = new Date(route.Ruta_predecida[i].Tiempo_Cordenada);
          if (time >= now) {
            return i;
          }
        }
        return 0; // En caso de que no se encuentre una coincidencia, comenzar desde el inicio.
      };

      const initialIndex = findInitialIndex();
      setSatelliteIndex(initialIndex);
      setSatellitePosition([route.Ruta_predecida[initialIndex].lat, route.Ruta_predecida[initialIndex].long]);

      const updateSatellitePosition = () => {
        setSatellitePosition([route.Ruta_predecida[satelliteIndex].lat, route.Ruta_predecida[satelliteIndex].long]);
        setSatelliteIndex((prevIndex) => (prevIndex + 1) % route.Ruta_predecida.length);
      };

      const intervalId = setInterval(updateSatellitePosition, 1000);

      return () => clearInterval(intervalId);
    }
  }, [route, satelliteIndex]);

  const renderPredictionMarkers = () => {
    if (!prediction || !prediction.Predicción || prediction.Predicción.length === 0 || !prediction.Predicción[0].Pasadas_predecidas) return null;

    const positions = prediction.Predicción[0].Pasadas_predecidas;
    const totalPositions = positions.length;
    const indices = [0, Math.floor(totalPositions * 0.2), Math.floor(totalPositions * 0.4), Math.floor(totalPositions * 0.6), totalPositions - 1];

    return indices.map((index, idx) => {
      const pass = positions[index];
      const position = [pass.lat, pass.long];
      const replicatedMarkers = replicateMarkers(position);

      return replicatedMarkers.map((pos, subIdx) => (
        <Marker key={`prediction-${idx}-${subIdx}`} position={pos}>
          <Popup>
            Tiempo: {pass.Tiempo_Cordenada} <br />
            Latitud: {pos[0]} <br />
            Longitud: {pos[1]} <br />
            Elevación: {pass.elev}
          </Popup>
        </Marker>
      ));
    });
  };

  const renderRouteLine = () => {
    if (!route || !route.Ruta_predecida || route.Ruta_predecida.length === 0) return null;

    const positions = route.Ruta_predecida.map((point) => [point.lat, point.long]);
    const firstPosition = [positions[0][0], positions[0][1]];
    const lastPosition = [positions[positions.length - 1][0], positions[positions.length - 1][1]];

    return (
      <>
        <Polyline positions={positions} color="blue" />
        {/* Marcador más grande para la primera posición */}
        <Marker position={firstPosition} icon={startIcon}>
          <Popup>
            Inicio Ruta <br />
            Tiempo: {route.Ruta_predecida[0].Tiempo_Cordenada} <br />
            Latitud: {firstPosition[0]} <br />
            Longitud: {firstPosition[1]} <br />
            Elevación: {route.Ruta_predecida[0].elev}
          </Popup>
        </Marker>
        {/* Marcador más grande para la última posición */}
        <Marker position={lastPosition} icon={endIcon}>
          <Popup>
            Fin Ruta <br />
            Tiempo: {route.Ruta_predecida[route.Ruta_predecida.length - 1].Tiempo_Cordenada} <br />
            Latitud: {lastPosition[0]} <br />
            Longitud: {lastPosition[1]} <br />
            Elevación: {route.Ruta_predecida[route.Ruta_predecida.length - 1].elev}
          </Popup>
        </Marker>
      </>
    );
  };

  const renderPredictionLine = () => {
    if (!prediction || !prediction.Predicción || prediction.Predicción.length === 0 || !prediction.Predicción[0].Pasadas_predecidas) return null;

    const positions = prediction.Predicción[0].Pasadas_predecidas.map((pass) => [pass.lat, pass.long]);
    return <Polyline positions={positions} color="red" />;
  };

  return (
    <Box border={'1px solid black'}>
      <MapContainer
        center={center}
        zoom={1}
        style={{ height: '500px', width: '800px' }}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {renderRouteLine()}
        {renderPredictionMarkers()}
        {renderPredictionLine()}
        {satellitePosition && (
          <Marker position={satellitePosition} icon={satelliteIcon}>
            <Popup>
              Tiempo: {route && route.Ruta_predecida[satelliteIndex] && route.Ruta_predecida[satelliteIndex].Tiempo_Cordenada} <br />
              Latitud: {satellitePosition[0]} <br />
              Longitud: {satellitePosition[1]} <br />
              Elevación: {route && route.Ruta_predecida[satelliteIndex] && route.Ruta_predecida[satelliteIndex].elev}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </Box>
  );
};

export default MapComponent;
