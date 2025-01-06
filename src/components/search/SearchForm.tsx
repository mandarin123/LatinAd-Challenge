import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Button, Card, message, AutoComplete, Typography, Spin, Checkbox, Input, Select, InputNumber, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setDates, setLocation, setLoading, setSearchResults, clearSearchResults } from '../../store/slices/searchSlice';
import { isBefore, startOfDay } from 'date-fns';
import { searchDisplays as searchDisplaysAPI } from '../../services/apiCalls';
import debounce from 'lodash/debounce';
import ResultCard from './ResultCard';
import DisplayMap from './DisplayMap';

const { RangePicker } = DatePicker;
const { Title } = Typography;
const { Group: CheckboxGroup } = Checkbox;

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_ID;

interface LocationOption {
  value: string;
  label: string;
  coordinates: {
    lat: number;
    lng: number;
    bounds?: {
      northeast: { lat: number; lng: number };
      southwest: { lat: number; lng: number };
    };
  };
}

const SIZE_OPTIONS = [
  { label: 'Pequeña', value: 'small' },
  { label: 'Mediana', value: 'medium' },
  { label: 'Grande', value: 'big' },
  { label: 'Gigante', value: 'giant' },
];

const LOCATION_TYPE_OPTIONS = [
  { label: 'Interior', value: 'indoor' },
  { label: 'Exterior', value: 'outdoor' },
  { label: 'Punto de venta', value: 'pos' },
  { label: 'Buses', value: 'buses' },
];

const SearchForm: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { loading, results } = useAppSelector(state => state.search);
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [mapCenter, setMapCenter] = useState({ lat: -34.6037, lng: -58.3816 });
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedLocationTypes, setSelectedLocationTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});

  const searchPlaces = debounce(async (searchText: string) => {
    if (searchText.length < 3) {
      setOptions([]);
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?` +
        `address=${encodeURIComponent(searchText)}` +
        `&key=${GOOGLE_MAPS_API_KEY}` +
        `&language=es` +
        `&region=AR`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      const data = await response.json();
      if (data.status === 'OK') {
        const formattedOptions = data.results.map((result: any) => ({
          value: result.formatted_address,
          label: result.formatted_address,
          coordinates: {
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng,
            bounds: result.geometry.viewport || result.geometry.bounds
          }
        }));
        setOptions(formattedOptions);
      } else {
        console.warn('Geocoding response status:', data.status);
        setOptions([]);
      }
    } catch (error) {
      console.error('Error en geocodificación:', error);
      message.error('Error al buscar ubicaciones');
    } finally {
      setIsSearching(false);
    }
  }, 500);

  const fetchDisplays = async (page: number) => {
    try {
      if (page === 1) {
        dispatch(setSearchResults([]));
      }

      dispatch(setLoading(true));

      if (!selectedLocation) {
        throw new Error('No hay una ubicación seleccionada');
      }

      const selectedLocationData = options.find(opt => opt.value === selectedLocation);
      if (!selectedLocationData?.coordinates) {
        throw new Error('Ubicación inválida');
      }

      console.log("selectedLocationData", selectedLocationData);

      const { lat, lng, bounds } = selectedLocationData.coordinates;
      const dates = form.getFieldValue('dates');

      const searchParams = {
        date_from: dates?.[0]?.format('YYYY-MM-DD'),
        date_to: dates?.[1]?.format('YYYY-MM-DD'),
        page,
        per_page: 20,
        lat_sw: bounds?.southwest.lat || lat - 0.1,
        lng_sw: bounds?.southwest.lng || lng - 0.1,
        lat_ne: bounds?.northeast.lat || lat + 0.1,
        lng_ne: bounds?.northeast.lng || lng + 0.1,
        search: searchText || undefined,
        location_type: selectedLocationTypes.length > 0 ? selectedLocationTypes : undefined,
        price_min: priceRange.min,
        price_max: priceRange.max,
        size_type: selectedSizes.length > 0 ? selectedSizes : undefined
      };

      const response = await searchDisplaysAPI(searchParams);
      console.log('Search response:', response);

      setTotalPages(response.last_page);
      setCurrentPage(page);

      dispatch(setSearchResults(response.data));

    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Error al buscar pantallas');
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onFinish = async (values: any) => {
    const [dateFrom, dateTo] = values.dates;

    dispatch(setDates({
      dateFrom: dateFrom.format('YYYY-MM-DD'),
      dateTo: dateTo.format('YYYY-MM-DD')
    }));
    dispatch(setLocation(values.location));

    setCurrentPage(1);
    await fetchDisplays(1);
  };

  const loadMore = async () => {
    if (currentPage < totalPages) {
      await fetchDisplays(currentPage + 1);
    }
  };

  const handleLocationSelect = (value: string) => {
    setSelectedLocation(value);
  };

  const handleSizeChange = (checkedValues: string[]) => {
    setSelectedSizes(checkedValues);
  };

  const handlePriceChange = (type: 'min' | 'max', value: number | null) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: value || undefined
    }));
  };

  useEffect(() => {
    return () => {
      dispatch(clearSearchResults());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        <Card className="mb-8 shadow-md hover:shadow-lg transition-all duration-300">
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            className="w-full"
          >
            <Form.Item
              name="dates"
              label="Período de la campaña"
              rules={[{ required: true, message: 'Por favor selecciona las fechas' }]}
              className="w-full"
            >
              <RangePicker
                className="w-full"
                format="DD/MM/YYYY"
                disabledDate={(current) => current && isBefore(current.toDate(), startOfDay(new Date()))}
              />
            </Form.Item>

            <Form.Item
              name="location"
              label="Ubicación"
              rules={[{ required: true, message: 'Por favor ingresa una ubicación' }]}
              className="w-full content-center"
            >
              <AutoComplete
                options={options}
                onSearch={searchPlaces}
                onSelect={handleLocationSelect}
                placeholder="Ej: Buenos Aires, Argentina"
                size="large"
                className="w-full"
                dropdownClassName="location-dropdown"
                notFoundContent={isSearching ? <Spin size="small" /> : 'No se encontraron resultados'}
              />
            </Form.Item>

            <Form.Item
              label="Búsqueda por nombre"
              className="w-full mb-6"
            >
              <Input
                placeholder="Buscar por nombre de pantalla"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Form.Item>

            <Form.Item
              label="Rango de precios (por día)"
              className="w-full mb-6"
            >
              <Space className="w-full flex justify-between">
                <InputNumber
                  placeholder="Precio mínimo"
                  value={priceRange.min}
                  onChange={(value) => handlePriceChange('min', value)}
                  min={0}
                  className="w-[calc(50%-8px)]"
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, ''))}
                />
                <InputNumber
                  placeholder="Precio máximo"
                  value={priceRange.max}
                  onChange={(value) => handlePriceChange('max', value)}
                  min={priceRange.min || 0}
                  className="w-[calc(50%-8px)]"
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, ''))}
                />
              </Space>
            </Form.Item>

            <Form.Item
              label="Tipo de ubicación"
              className="w-full mb-6"
            >
              <CheckboxGroup
                options={LOCATION_TYPE_OPTIONS}
                value={selectedLocationTypes}
                onChange={(values) => setSelectedLocationTypes(values as string[])}
                className="w-full grid grid-cols-2 md:grid-cols-4 gap-4"
              />
            </Form.Item>

            <Form.Item
              label="Tamaño de pantalla"
              className="w-full mb-6"
            >
              <CheckboxGroup
                options={SIZE_OPTIONS}
                value={selectedSizes}
                onChange={handleSizeChange as any}
                className="w-full grid grid-cols-2 md:grid-cols-4 gap-4"
              />
            </Form.Item>



            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
                loading={loading}
                className="w-full h-12 text-base font-medium"
                size="large"
              >
                Buscar Pantallas
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <div className="space-y-6">
          {loading && currentPage === 1 ? (
            <div className="space-y-6">
              <Card className="w-full h-[400px] flex items-center justify-center">
                <Spin size="large" tip="Cargando mapa..." />
              </Card>

              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <Card key={n} className="w-full h-[200px] flex items-center justify-center">
                    <Spin size="default" />
                  </Card>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <>
              <Title level={3} className="mb-6 text-2xl font-bold text-gray-800">
                Pantallas Disponibles ({results.length})
              </Title>

              {currentPage < totalPages && (
                <Button
                  onClick={loadMore}
                  loading={loading}
                  className="w-full mb-4"
                  size="large"
                >
                  Cargar más pantallas ({results.length} de {totalPages * 20})
                </Button>
              )}

              <div className="mb-6">
                {loading && currentPage === 1 ? (
                  <Card className="w-full h-[400px] flex items-center justify-center">
                    <Spin size="large" tip="Cargando mapa..." />
                  </Card>
                ) : (
                  <DisplayMap
                    displays={results}
                    center={mapCenter}
                  />
                )}
              </div>

              <div className="space-y-6">
                {results.map(display => (
                  <ResultCard
                    key={display.id}
                    display={display}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchForm; 