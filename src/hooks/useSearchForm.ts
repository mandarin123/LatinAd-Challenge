import { FormInstance } from 'antd';
import { useAppDispatch } from './redux';
import { setLoading, setDates } from '../store/slices/searchSlice';
import { searchDisplays } from '../services/displays.service';
import { message } from 'antd';

export const useSearchForm = (
  form: FormInstance, 
  onSearchResults: (results: any[], mapCenter: { lat: number; lng: number }) => void
) => {
  const dispatch = useAppDispatch();

  const handleSubmit = async (values: any) => {
    try {
      dispatch(setLoading(true));
      
      let dateFrom, dateTo;
      
      if (Array.isArray(values.dates)) {
        [dateFrom, dateTo] = values.dates;
      } else {
        dateFrom = values.dates.start;
        dateTo = values.dates.end;
      }
      
      dispatch(setDates({
        dateFrom: dateFrom.format('YYYY-MM-DD'),
        dateTo: dateTo.format('YYYY-MM-DD')
      }));
      
      if (!values.location?.coordinates?.bounds) {
        message.error('Por favor seleccione una ubicación válida del listado');
        return;
      }

      const searchParams = {
        date_from: dateFrom.format('YYYY-MM-DD'),
        date_to: dateTo.format('YYYY-MM-DD'),
        lat_sw: values.location.coordinates.bounds.southwest.lat,
        lng_sw: values.location.coordinates.bounds.southwest.lng,
        lat_ne: values.location.coordinates.bounds.northeast.lat,
        lng_ne: values.location.coordinates.bounds.northeast.lng,
        page: 1,
        per_page: 20,
        location_type: values.location_types,
        price_min: values.price_min,
        price_max: values.price_max,
        size_type: values.size_types
      };

      const response = await searchDisplays(searchParams);
      
      onSearchResults(
        response.data,
        {
          lat: values.location.coordinates.lat,
          lng: values.location.coordinates.lng
        }
      );

    } catch (error) {
      console.error('Error al realizar la búsqueda:', error);
      message.error('Error al realizar la búsqueda. Por favor, intente nuevamente.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { handleSubmit };
}; 