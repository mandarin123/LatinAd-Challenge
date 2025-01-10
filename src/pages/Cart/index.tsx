import React from 'react';
import { Card, Typography, Button, Empty, Image, message } from 'antd';
import { DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { removeFromCart } from '../../store/slices/cartSlice';
import jsPDF from 'jspdf';
import moment from 'moment';
import { SIZE_OPTIONS, LOCATION_TYPE_OPTIONS } from '../../constants/search';

const { Title, Text } = Typography;

const CartPage: React.FC = () => {
  const { items, totalItems } = useAppSelector(state => state.cart);
  const dispatch = useAppDispatch();

  const totalAmount = items.reduce((total, item) => 
    total + (item.totalPrice * item.quantity), 0
  );

  const handleExportPDF = async () => {
    const doc = new jsPDF();
  
    const imgData = '/latinad.png';
    
    const imgWidth = 50;
    const imgHeight = imgWidth * 0.3;
  
    doc.addImage(imgData, 'PNG', 20, 10, imgWidth, imgHeight);
  
    const startY = imgHeight + 20;
  
    doc.setFontSize(20);
    doc.text('Presupuesto de Campaña en pantallas digitales', 20, startY);
    doc.setFontSize(12);
    doc.text(`Fecha: ${moment().format('DD/MM/YYYY')}`, 20, startY + 10);
    doc.text(`Total de pantallas: ${totalItems}`, 20, startY + 20);
  
    let yPosition = startY + 40;
    doc.setFontSize(10);
    items.forEach((item, index):any => {
      doc.text(`${index + 1}. ${item.name}`, 20, yPosition);
      doc.text(`Días: ${item.selectedDays}`, 20, yPosition + 5);
      doc.text(`Fecha de inicio: ${moment(item.dateFrom).format('DD/MM/YYYY')}`, 20, yPosition + 10);
      doc.text(`Fecha de fin: ${moment(item.dateTo).format('DD/MM/YYYY')}`, 20, yPosition + 15);
      doc.text(`U$D ${(item.totalPrice * item.quantity).toFixed(2)}`, 150, yPosition + 5);
      yPosition += 25;
    });
  
    doc.setFontSize(12);
    doc.text('Total:', 20, yPosition + 10);
    doc.text(`U$D ${totalAmount.toFixed(2)}`, 150, yPosition + 10);
  
    doc.save('presupuesto.pdf');
    message.success('Presupuesto exportado correctamente');
  };

  const getDisplayLabel = (value: string, options: Array<{ label: string, value: string }>) => {
    const option = options.find(opt => opt.value === value);
    return option?.label || value;
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Tu campaña está vacía"
        />
      </div>
    );
  }

  console.log(items);
  
  return (
    <div className="container mx-auto px-4 py-4 md:py-8 max-w-[1200px]">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
          <Typography className="mb-6 text-white">Total de pantallas seleccionadas: {totalItems}</Typography>
          
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex flex-col md:flex-row gap-4 p-4 border-b border-gray-100 bg-white rounded-xl">
                <div className="w-full md:w-1/4">
                  <Image
                    src={item.pictures[0]?.url}
                    alt={item.name}
                    className="w-auto h-48 md:h-24 object-cover rounded"
                    fallback="/placeholder-image.jpg"
                  />
                </div>
                
                <div className="flex-grow space-y-2 flex flex-col">
                  <Text strong className="block">{item.name}</Text>
                  <Text type="secondary" className="text-sm">
                    Tipo de pantalla: {getDisplayLabel(item.size_type, SIZE_OPTIONS)}
                  </Text>
                  <Text type="secondary" className="text-sm">
                    Ubicación: {getDisplayLabel(item.location_type, LOCATION_TYPE_OPTIONS)}
                  </Text>
                  <Text type="secondary" className="text-sm">
                    Dirección: {item.formatted_address}
                  </Text>
                  <Text type="secondary" className="text-sm block">
                    Período: {moment(item.dateFrom).format('DD/MM/YYYY')} - {moment(item.dateTo).format('DD/MM/YYYY')}
                  </Text>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mt-4">
                    <div className="space-y-1">
                    </div>
                    
                    <div className="space-y-1 text-right">
                      <Text className="text-sm text-gray-500">
                        U$D {item.price_per_day.toFixed(2)} × {item.selectedDays} días
                      </Text>
                      <Text strong className="block text-lg">
                        U$D {(item.totalPrice * item.quantity).toFixed(2)}
                      </Text>
                    </div>
                    
                  </div>
                  <div className="grid">
                    <Button 
                      danger 
                      icon={<DeleteOutlined />}
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="w-full md:w-auto rounded-lg justify-self-end"
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
                  <Text>Cantidad de pantallas:</Text>
                  <Text> {items.length}</Text>
                </div>
                <div className="flex justify-between font-bold">
                  <Text>Total</Text>
                  <Text className="text-lg">U$D {totalAmount.toFixed(2)}</Text>
                </div>
              </div>
              <Button 
                icon={<FileTextOutlined />}
                onClick={handleExportPDF}
                block
                className="rounded-lg"
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
