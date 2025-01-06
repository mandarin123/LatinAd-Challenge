interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
  boundingbox: string[];
}

export const searchLocation = async (query: string): Promise<NominatimResponse> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Error en la búsqueda de ubicación');
    }

    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error('Error al buscar ubicación:', error);
    throw error;
  }
}; 