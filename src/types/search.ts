export interface LocationOption {
  value: string;
  label: string;
  placeId: string;
  coordinates: {
    lat: number;
    lng: number;
    bounds?: {
      northeast: { lat: number; lng: number };
      southwest: { lat: number; lng: number };
    };
  };
}

export interface SearchFormProps {
  onSearchResults: (results: any[], mapCenter: { lat: number; lng: number }) => void;
}

export interface PriceRange {
  min?: number;
  max?: number;
}

export interface SearchDisplaysParams {
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
