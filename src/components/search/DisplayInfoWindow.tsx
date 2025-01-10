import React from 'react';
import { InfoWindow } from '@react-google-maps/api';
import { Card, Typography, Tag, Button, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { DisplayResponse } from '../../services/displays.service';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { addToCart } from '../../store/slices/cartSlice';
import { differenceInDays } from 'date-fns';
import { SIZE_OPTIONS, LOCATION_TYPE_OPTIONS } from '../../constants/search';

const { Title, Text } = Typography;

interface DisplayInfoWindowProps {
  display: DisplayResponse;
  onClose: () => void;
}

export const DisplayInfoWindow: React.FC<DisplayInfoWindowProps> = React.memo(({ display, onClose }) => {
  const dispatch = useAppDispatch();
  const { dates } = useAppSelector(state => state.search);
  const { items } = useAppSelector(state => state.cart);
  
  const isAdded = items.some(item => item.id === display.id);

  const totalDays = dates.dateFrom && dates.dateTo
    ? differenceInDays(new Date(dates.dateTo), new Date(dates.dateFrom)) + 1
    : 0;

  const totalPrice = display.price_per_day * totalDays;

  const handleAddToCart = () => {
    if (isAdded) return;
    
    dispatch(addToCart({
      ...display,
      selectedDays: totalDays,
      totalPrice: totalPrice,
      dateFrom: dates.dateFrom || '',
      dateTo: dates.dateTo || ''
    }));
    message.success('Pantalla agregada al carrito');
  };

  const getDisplayLabel = (value: string, options: Array<{ label: string, value: string }>) => {
    const option = options.find(opt => opt.value === value);
    return option?.label || value;
  };

  return (
    <InfoWindow
      position={{
        lat: Number(display.latitude),
        lng: Number(display.longitude),
      }}
      options={{ 
        disableAutoPan: false,
        pixelOffset: new google.maps.Size(0, -30),
        maxWidth: 320
      }}
      onCloseClick={onClose}
    >
      <Card 
        className="max-w-sm border-0 shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        <Title level={5} className="m-0 mb-2">
          {display.name}
        </Title>
        <p>{display.formatted_address}</p>
        
        <div className="flex gap-2 mb-2">
          <Tag color="blue">{getDisplayLabel(display.location_type, LOCATION_TYPE_OPTIONS)}</Tag>
          <Tag color="green">{getDisplayLabel(display.size_type, SIZE_OPTIONS)}</Tag>
        </div>

        <div className="space-y-2">
          <Text className="text-lg font-bold text-blue-600 block">
            U$D {display.price_per_day.toFixed(2)} / día
          </Text>
          {totalDays > 0 && (
            <Text className="text-sm text-gray-600 block">
              Total por {totalDays} días: <span className="font-bold">U$D {totalPrice.toFixed(2)}</span>
            </Text>
          )}
          <Button
            type={isAdded ? "default" : "primary"}
            icon={<ShoppingCartOutlined />}
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-full ${isAdded ? 'bg-red-100 text-red-600 border-red-600 hover:bg-red-100' : ''} rounded-lg`}
            size="small"
          >
            {isAdded ? 'Agregado' : 'Agregar al carrito'}
          </Button>
        </div>
      </Card>
    </InfoWindow>
  );
});

DisplayInfoWindow.displayName = 'DisplayInfoWindow'; 