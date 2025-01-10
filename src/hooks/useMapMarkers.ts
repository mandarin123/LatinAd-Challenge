import { useState, useCallback } from 'react';
import { DisplayResponse } from '../services/displays.service';
import { useAppSelector } from './redux';

export const useMapMarkers = () => {
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const { items } = useAppSelector(state => state.cart);

  const createMarkers = useCallback((
    map: google.maps.Map, 
    displays: DisplayResponse[],
    onMarkerClick: (display: DisplayResponse) => void
  ) => {
    markers.forEach(marker => marker.setMap(null));
    
    const newMarkers = displays.map(display => {
      const isInCart = items.some(item => item.id === display.id);
      
      const svgIcon = {
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 11 7 11s7-5.75 7-11c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z',
        fillColor: isInCart ? '#9E9E9E' : '#3996f3',
        fillOpacity: isInCart ? 0.7 : 1,
        strokeWeight: 1,
        strokeColor: '#ffffff',
        scale: 2,
        anchor: new google.maps.Point(12, 24),
      };

      const marker = new google.maps.Marker({
        map: map,
        position: {
          lat: Number(display.latitude),
          lng: Number(display.longitude),
        },
        title: display.name,
        icon: svgIcon,
        clickable: true
      });

      marker.addListener('click', () => {
        onMarkerClick(display);
      });

      return marker;
    });

    setMarkers(newMarkers);
  }, [items, markers]);

  return { markers, createMarkers };
}; 