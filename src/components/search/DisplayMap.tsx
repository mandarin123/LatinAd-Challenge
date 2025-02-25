import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Typography, Spin } from 'antd';
import { DisplayResponse } from '../../services/displays.service';
import { useMapMarkers } from '../../hooks/useMapMarkers';
import { DisplayInfoWindow } from './DisplayInfoWindow';
import { DisplayMapProps } from '../../types/map';
import { mapContainerStyle, mapOptions } from '../../constants/map';

const libraries: ("places" | "marker")[] = ["places", "marker"];

export const DisplayMap: React.FC<DisplayMapProps> = ({ displays, center }) => {
  const [selectedDisplay, setSelectedDisplay] = useState<DisplayResponse | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const { createMarkers } = useMapMarkers();

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDXATZeJNq59FfgyE3CiSKuvcCjHLp2joc',
    libraries
  });

  const handleMarkerClick = useCallback((display: DisplayResponse) => {
    setSelectedDisplay(display);
  }, []);

  useEffect(() => {
    if (mapRef.current && displays.length > 0) {
      createMarkers(mapRef.current, displays, handleMarkerClick);
    }
  }, [selectedDisplay]);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    if (displays.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      displays.forEach(display => {
        bounds.extend({
          lat: Number(display.latitude),
          lng: Number(display.longitude)
        });
      });
      map.fitBounds(bounds);
      createMarkers(map, displays, handleMarkerClick);
    }
  }, [displays, createMarkers, handleMarkerClick]);

  if (!displays?.length) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Typography.Text className="text-white font-bold">
          Ingrese una ubicación para ver las pantallas disponibles
        </Typography.Text>
      </div>
    );
  }

  if (loadError) {
    return <div>Error al cargar el mapa: {loadError.message}</div>;
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[500px] rounded-lg">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        options={mapOptions}
        onLoad={handleMapLoad}
        onClick={() => setSelectedDisplay(null)}
      >
        {selectedDisplay && (
          <DisplayInfoWindow 
            display={selectedDisplay}
            onClose={() => setSelectedDisplay(null)}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default React.memo(DisplayMap);
