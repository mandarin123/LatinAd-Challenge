import React, { useState } from 'react';
import { Form, Button, Card, AutoComplete, Spin, Checkbox, InputNumber, Space, App } from 'antd';
import { SearchOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../hooks/redux';
import { useGooglePlaces } from '../../hooks/useGooglePlaces';
import { LocationOption, SearchFormProps } from '../../types/search';
import { useSearchForm } from '../../hooks/useSearchForm';
import { DateSelector } from './components/DateSelector';
import { Dayjs } from 'dayjs';
import { Input } from 'antd/lib';
import { useForm } from 'antd/es/form/Form';

const { Group: CheckboxGroup } = Checkbox;

const SearchForm: React.FC<SearchFormProps> = ({ onSearchResults }) => {
  const [form] = useForm();
  const { loading } = useAppSelector(state => state.search);
  const [showAdvancedOptions, setShowAdvancedOptions] = React.useState(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const {
    options,
    isSearching,
    fetchSuggestions
  } = useGooglePlaces();

  const {
    handleSubmit
  } = useSearchForm(form, onSearchResults);

  return (
    <div className="font-sans">
      <div className="max-w-7xl mx-auto px-4">
        <Card className="mb-8 shadow-md hover:shadow-lg transition-all duration-300 rounded-lg">
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            className="w-full"
          >
            <Form.Item
              name="dates"
              label="Fechas"
              rules={[{ required: true, message: 'Por favor seleccione las fechas' }]}
            >
              <DateSelector
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                form={form}
              />
            </Form.Item>

            <Form.Item
              label="Ubicación"
              required
            >
              <Form.Item
                name={['location', 'coordinates']}
                hidden
                noStyle
              >
                <Input type="hidden"/>
              </Form.Item>

              <Form.Item
                name={['location', 'description']}
                rules={[{ required: true, message: 'Por favor ingrese una ubicación' }]}
                noStyle
              >
                <AutoComplete
                  options={options.map(opt => ({
                    ...opt,
                    value: opt.label
                  }))}
                  onSearch={(text) => {
                    fetchSuggestions(text);
                  }}
                  onSelect={(value, option: LocationOption) => {
                    form.setFieldsValue({
                      location: {
                        description: value,
                        coordinates: option.coordinates
                      }
                    });
                  }}
                  placeholder="Buscar ubicación..."
                  className="w-full"
                  notFoundContent={isSearching ? <Spin size="small" /> : null}
                  allowClear
                  onClear={() => {
                    form.setFieldsValue({
                      location: {
                        description: '',
                        coordinates: null
                      }
                    });
                  }}
                />
              </Form.Item>
            </Form.Item>

            <div
              className="mb-4 cursor-pointer text-blue-600 hover:text-blue-800 flex items-center"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            >
              <span className="mr-2">Opciones avanzadas</span>
              {showAdvancedOptions ? <UpOutlined /> : <DownOutlined />}
            </div>

            {showAdvancedOptions && (
              <div className="space-y-4">
                <Form.Item 
                  name="location_type"
                  label="Tipo de ubicación"
                  initialValue={[]}
                >
                  <CheckboxGroup
                    options={[
                      { label: 'Interior', value: 'indoor' },
                      { label: 'Exterior', value: 'outdoor' },
                      { label: 'Punto de venta', value: 'pos' },
                      { label: 'Buses', value: 'buses' }
                    ]}
                    className="grid grid-cols-2 gap-2 justify-items-start w-full"
                  />
                </Form.Item>

                <Form.Item 
                  name="size_type"
                  label="Tipo de tamaño"
                  initialValue={[]}
                >
                  <CheckboxGroup
                    options={[
                      { label: 'Pequeño', value: 'small' },
                      { label: 'Mediano', value: 'medium' },
                      { label: 'Grande', value: 'big' },
                      { label: 'Gigante', value: 'giant' }
                    ]}
                    className="grid grid-cols-2 gap-2 justify-items-start w-full"
                  />
                </Form.Item>

                <Form.Item label="Rango de precio">
                  <Space className="w-full">
                    <Form.Item name="price_min" noStyle>
                      <InputNumber
                        placeholder="Mín"
                        className="w-full"
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                    <span>-</span>
                    <Form.Item name="price_max" noStyle>
                      <InputNumber
                        placeholder="Máx"
                        className="w-full"
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                  </Space>
                </Form.Item>
              </div>
            )}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
                loading={loading}
                className="w-full h-12 text-base font-medium mt-5 rounded-lg"
                size="large"
              >
                Buscar Pantallas
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default (props: SearchFormProps) => (
  <App>
    <SearchForm {...props} />
  </App>
); 