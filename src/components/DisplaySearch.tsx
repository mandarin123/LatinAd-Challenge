import { useEffect } from 'react';
import { searchDisplays } from '../services/apiCalls';

export const DisplaySearch = () => {
  useEffect(() => {
    const fetchDisplays = async () => {
      try {
        const result = await searchDisplays({
          date_from: '2024-12-23',
          date_to: '2024-12-29',
          lat_sw: -32.98677974842527,
          lng_sw: -68.95327618007813,
          lat_ne: -32.81786357501532,
          lng_ne: -68.76376201992188,
          page: 1,
          per_page: 3,
          search: 'led',
          location_type: ['pos'],
          price_min: 2,
          price_max: 1000,
          size_type: ['small']
        });
        
        console.log('Displays encontrados:', result);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchDisplays();
  }, []);

  return <div>Buscando displays...</div>;
}; 