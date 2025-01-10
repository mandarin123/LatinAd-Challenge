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
