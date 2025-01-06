import React from 'react';
import { Card, Typography, Button, InputNumber, Empty, Image, message } from 'antd';
import { DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { removeFromCart, updateQuantity } from '../../store/slices/cartSlice';
import jsPDF from 'jspdf';
import moment from 'moment';

const { Title, Text } = Typography;

const CartPage: React.FC = () => {
  const { items, totalItems } = useAppSelector(state => state.cart);
  const dispatch = useAppDispatch();

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const totalAmount = items.reduce((total, item) => 
    total + (item.totalPrice * item.quantity), 0
  );

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Presupuesto de Alquiler', 20, 20);
    doc.setFontSize(12);
    doc.text(`Fecha: ${moment().format('DD/MM/YYYY')}`, 20, 30);
    doc.text(`Total de Items: ${totalItems}`, 20, 40);
    let yPosition = 60;
    doc.setFontSize(10);
    items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name}`, 20, yPosition);
      doc.text(`Cantidad: ${item.quantity}`, 30, yPosition + 5);
      doc.text(`Días: ${item.selectedDays}`, 80, yPosition + 5);
      doc.text(`U$D ${(item.totalPrice * item.quantity).toFixed(2)}`, 150, yPosition + 5);
      yPosition += 15;
    });
    doc.setFontSize(12);
    doc.text('Total:', 20, yPosition + 10);
    doc.text(`U$D ${totalAmount.toFixed(2)}`, 150, yPosition + 10);
    doc.save('presupuesto.pdf');
    message.success('Presupuesto exportado correctamente');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Tu carrito está vacío"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8 max-w-[1200px]">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
          <Title level={4} className="mb-6">Carrito ({totalItems})</Title>
          
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex flex-col md:flex-row gap-4 p-4 border-b border-gray-100">
                <div className="w-full md:w-1/4">
                  <Image
                    src={item.pictures[0]?.url}
                    alt={item.name}
                    className="w-full h-48 md:h-24 object-cover rounded"
                    fallback="/placeholder-image.jpg"
                  />
                </div>
                
                <div className="flex-grow space-y-2">
                  <Text strong className="block">{item.name}</Text>
                  <Text type="secondary" className="text-sm">
                    ITEM NO: {item.id}
                  </Text>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mt-4">
                    <div className="space-y-1">
                      <Text className="text-sm text-gray-500">Cantidad:</Text>
                      <InputNumber
                        min={1}
                        value={item.quantity}
                        onChange={(value) => handleQuantityChange(item.id, value || 1)}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-1 text-right">
                      <Text className="text-sm text-gray-500">
                        U$D {item.price_per_day.toFixed(2)} × {item.selectedDays} días
                      </Text>
                      <Text strong className="block text-lg">
                        U$D {(item.totalPrice * item.quantity).toFixed(2)}
                      </Text>
                    </div>
                    
                    <Button 
                      danger 
                      icon={<DeleteOutlined />}
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="w-full md:w-auto"
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:w-[400px]">
          <Card className="bg-gray-50 border-0 sticky top-24">
            <Title level={5}>RESUMEN</Title>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-500">
                  <Text>Subtotal</Text>
                  <Text>U$D {totalAmount.toFixed(2)}</Text>
                </div>
                <div className="flex justify-between font-bold">
                  <Text>Total</Text>
                  <Text className="text-lg">U$D {totalAmount.toFixed(2)}</Text>
                </div>
              </div>
              <Button type="primary" block size="large">
                CHECKOUT
              </Button>
              <Button 
                icon={<FileTextOutlined />}
                onClick={handleExportPDF}
                block
                className="mt-2"
              >
                Exportar Presupuesto
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
