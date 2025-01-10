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
  search?: string;
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
    const validLocationTypes = ['indoor', 'outdoor', 'pos', 'buses'];
    const validSizeTypes = ['small', 'medium', 'big', 'giant'];

    const filteredLocationTypes = params.location_type?.filter(type => 
      validLocationTypes.includes(type)
    );
    const filteredSizeTypes = params.size_type?.filter(type => 
      validSizeTypes.includes(type)
    );

    const queryParams = new URLSearchParams();
    
    queryParams.append('date_from', params.date_from);
    queryParams.append('date_to', params.date_to);
    queryParams.append('lat_sw', params.lat_sw.toString());
    queryParams.append('lng_sw', params.lng_sw.toString());
    queryParams.append('lat_ne', params.lat_ne.toString());
    queryParams.append('lng_ne', params.lng_ne.toString());
    queryParams.append('page', params.page.toString());
    queryParams.append('per_page', params.per_page.toString());

    if (filteredLocationTypes?.length) {
      filteredLocationTypes.forEach(type => {
        queryParams.append('location_type[]', type);
      });
    }

    if (filteredSizeTypes?.length) {
      filteredSizeTypes.forEach(type => {
        queryParams.append('size_type[]', type);
      });
    }

    if (params.price_min) queryParams.append('price_min', params.price_min.toString());
    if (params.price_max) queryParams.append('price_max', params.price_max.toString());

    const response = await fetch(
      `https://api.dev.publinet.io/displays/searchTest?${queryParams}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'authorization': `Bearer ${process.env.NEXT_PUBLIC_LATINAD_TOKEN}`,
          'Referer': 'https://latinad.com/',
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error en la API de LatinAd: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al buscar displays:', error);
    throw error;
  }
}; 