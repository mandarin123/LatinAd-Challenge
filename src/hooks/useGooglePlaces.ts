import { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { LocationOption } from '../types/search';

const getPlaceDetails = async (
  prediction: google.maps.places.AutocompletePrediction,
  placesService: google.maps.places.PlacesService | null
): Promise<LocationOption> => {
  if (!placesService) {
    return {
      value: prediction.description,
      label: prediction.description,
      placeId: prediction.place_id,
      coordinates: { lat: 0, lng: 0 }
    };
  }

  return new Promise((resolve) => {
    placesService.getDetails(
      { placeId: prediction.place_id, fields: ['geometry'] },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          resolve({
            value: prediction.description,
            label: prediction.description,
            placeId: prediction.place_id,
            coordinates: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              bounds: place.geometry.viewport ? {
                northeast: {
                  lat: place.geometry.viewport.getNorthEast().lat(),
                  lng: place.geometry.viewport.getNorthEast().lng()
                },
                southwest: {
                  lat: place.geometry.viewport.getSouthWest().lat(),
                  lng: place.geometry.viewport.getSouthWest().lng()
                }
              } : undefined
            }
          });
        } else {
          resolve({
            value: prediction.description,
            label: prediction.description,
            placeId: prediction.place_id,
            coordinates: { lat: 0, lng: 0 }
          });
        }
      }
    );
  });
};

export const useGooglePlaces = () => {
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (window.google && !autocompleteService) {
      try {
        setAutocompleteService(new window.google.maps.places.AutocompleteService());
        const mapDiv = document.createElement('div');
        setPlacesService(new window.google.maps.places.PlacesService(mapDiv));
      } catch (error) {
        console.error('Error initializing Google Places services:', error);
      }
    }
  }, [autocompleteService]);

  const fetchSuggestions = debounce(async (searchText: string) => {
    if (!autocompleteService || searchText.length < 3) {
      setOptions([]);
      return;
    }

    setIsSearching(true);
    
    try {
      const predictions = await new Promise<google.maps.places.AutocompletePrediction[]>((resolve, reject) => {
        autocompleteService.getPlacePredictions(
          {
            input: searchText,
            types: ['geocode'],
            componentRestrictions: { country: 'AR' },
          },
          (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              resolve(results);
            } else {
              reject(status);
            }
          }
        );
      });

      const detailedPredictions = await Promise.all(
        predictions.map(prediction => getPlaceDetails(prediction, placesService))
      );

      setOptions(detailedPredictions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setOptions([]);
    } finally {
      setIsSearching(false);
    }
  }, 500);

  return {
    options,
    isSearching,
    fetchSuggestions,
    placesService
  };
}; 