import React from 'react';
import { Card, Typography, Tag, Image, Button, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { DisplayResponse } from '../../services/displays.service';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { addToCart } from '../../store/slices/cartSlice';
import { differenceInDays } from 'date-fns';

const { Text, Title } = Typography;

interface ResultCardProps {
  display: DisplayResponse;
}

const ResultCard: React.FC<ResultCardProps> = ({ display }) => {
  const dispatch = useAppDispatch();
  const { dates } = useAppSelector(state => state.search);
  
  const totalDays = dates.dateFrom && dates.dateTo ? 
    differenceInDays(new Date(dates.dateTo), new Date(dates.dateFrom)) + 1 : 0;
    
  const totalPrice = display.price_per_day * totalDays;

  const handleAddToCart = () => {
    dispatch(addToCart({
      ...display,
      selectedDays: totalDays,
      totalPrice: totalPrice
    }));
    message.success('Pantalla agregada al carrito');
  };

  return (
    <Card className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-48 h-48 md:h-32 flex-shrink-0">
          <Image
            src={display?.pictures[0]?.url}
            alt={display.name}
            className="w-full h-full object-cover rounded-md"
            fallback="/placeholder-image.jpg"
          />
        </div>
        
        <div className="flex-grow space-y-3">
          <div className="flex flex-col md:flex-row justify-between gap-2">
            <Title level={4} className="text-xl font-bold text-gray-800 m-0">
              {display.name}
            </Title>
            <div className="flex gap-2">
              <Tag color="blue">{display.location_type}</Tag>
              <Tag color="green">{display.size_type}</Tag>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Text>
              <span className="font-semibold">Dimensiones:</span> {display.size_width}x{display.size_height}m
            </Text>
            <Text>
              <span className="font-semibold">Resolución:</span> {display.resolution_width}x{display.resolution_height}px
            </Text>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-2">
            <div className="space-y-1">
              <Text className="text-lg font-bold text-blue-600 block">
                U$D {display.price_per_day.toFixed(2)} / día
              </Text>
              {totalDays > 0 && (
                <Text className="text-sm text-gray-600">
                  Total por {totalDays} días: <span className="font-bold">U$D {totalPrice.toFixed(2)}</span>
                </Text>
              )}
            </div>
            <Button 
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              className="w-full md:w-auto"
            >
              Agregar al carrito
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResultCard; 