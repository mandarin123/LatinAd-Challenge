interface SearchDisplaysParams {
  date_from: string;
  date_to: string;
  lat_sw: number;
  lng_sw: number;
  lat_ne: number;
  lng_ne: number;
  page: number;
  per_page: number;
  location_type?: string[];
  price_min?: number;
  price_max?: number;
  size_type?: string[];
}

export interface DisplayResponse {
  id: number;
  name: string;
  resolution_width: number;
  resolution_height: number;
  latitude: number;
  longitude: number;
  administrative_area_level_1: string;
  administrative_area_level_2: string;
  formatted_address: string;
  zip_code: string;
  country: string;
  slots: number;
  slot_length: number;
  shows_per_hour: number;
  price_per_day: number;
  location_type: string;
  size_type: string;
  size_width: number;
  size_height: number;
  description: string;
  country_iso: string;
  pictures: {
    url: string;
  }[];
  is_online: boolean;
}

interface PaginatedResponse {
  data: DisplayResponse[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

export const searchDisplays = async (params: SearchDisplaysParams): Promise<PaginatedResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val, index) => {
          queryParams.append(`${key}[${index}]`, val);
        });
      } else if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${process.env.BASE_URL}?${queryParams}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Referer': 'https://latinad.com/'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Error en la llamada a la API');
    }

    const data = await response.json();
    console.log('Respuesta de la API:', data);
    return data;
  } catch (error) {
    console.error('Error al buscar displays:', error);
    throw error;
  }
} 