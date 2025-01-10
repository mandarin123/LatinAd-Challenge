import React, { useMemo } from 'react';
import { Card, Typography, Tag, Image, Button, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { DisplayResponse } from '../../services/displays.service';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { addToCart } from '../../store/slices/cartSlice';
import { differenceInDays } from 'date-fns';
import moment from 'moment';
import { SIZE_OPTIONS, LOCATION_TYPE_OPTIONS } from '../../constants/search';
import { isMobile } from 'react-device-detect';

const { Text, Title } = Typography;

interface ResultCardProps {
  display: DisplayResponse;
}

const ResultCard: React.FC<ResultCardProps> = ({ display }) => {
  const dispatch = useAppDispatch();
  const { dates } = useAppSelector(state => state.search);
  const { items } = useAppSelector(state => state.cart);
  
  const isAdded = items.some(item => item.id === display.id);

  const totalDays = useMemo(() => {
    if (!dates.dateFrom || !dates.dateTo) {
      console.log('No hay fechas seleccionadas');
      return 0;
    }

    const startDate = new Date(dates.dateFrom);
    const endDate = new Date(dates.dateTo);


    const days = differenceInDays(endDate, startDate) + 1;

    return days;
  }, [dates.dateFrom, dates.dateTo]);

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
    <Card className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
      <div className="flex gap-4 flex-col md:flex-row md:items-start items-center">
        <div className="w-full md:w-40 h-40 md:h-auto flex-shrink-0 overflow-hidden rounded-md">
          <Image
            src={display?.pictures[0]?.url}
            alt={display.name}
            className="w-full h-full object-contain rounded-md"
            fallback="/placeholder-image.png"
          />
        </div>

        <div className="flex-grow space-y-2">
          <div className="flex flex-col md:flex-row justify-between gap-2">
            <Title level={4} className="text-xl font-bold text-gray-800 m-0">
              {display.name}
            </Title>
            <div className="flex gap-2 items-center">
              <Tag color="blue" className="flex items-center justify-center m-0 h-6 p-4 uppercase">
                {getDisplayLabel(display.location_type, LOCATION_TYPE_OPTIONS)}
              </Tag>
              <Tag color="green" className="flex items-center justify-center m-0 h-6 p-4 uppercase">
                {getDisplayLabel(display.size_type, SIZE_OPTIONS)}
              </Tag>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Text>
              <span className="font-semibold">Dimensiones:</span> {display.size_width}x{display.size_height}m
            </Text>
            <Text>
              <span className="font-semibold">Resolución:</span> {display.resolution_width}x{display.resolution_height}px
            </Text>
            <Text>
              <span className="font-semibold">Descripción:</span> {display.description || 'No hay descripción disponible'}
            </Text>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-2">
            <div className="space-y-1">
              <Text className="text-lg font-bold text-blue-600 block">
                U$D {display.price_per_day.toFixed(2)} / día
              </Text>
              {totalDays > 0 && (
                <Text className="text-sm text-gray-600">
                  Total por {totalDays} días ({moment(dates.dateFrom).format('DD/MM/YYYY')} - {moment(dates.dateTo).format('DD/MM/YYYY')})
                  <span className="font-bold">U$D {totalPrice.toFixed(2)}</span>
                </Text>
              )}
            </div>
            <Button
              type={isAdded ? "default" : "primary"}
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`w-full md:w-auto ${isAdded ? 'bg-red-100 text-red-600 border-red-600 hover:bg-red-100' : ''} rounded-lg`}
            >
              {isAdded ? 'Agregado al carrito' : 'Agregar al carrito'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResultCard; 