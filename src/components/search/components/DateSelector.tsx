import React from 'react';
import { DatePicker, Form } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { DateSelectorProps } from '../../../types/date';

export const DateSelector: React.FC<DateSelectorProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  form
}) => {
  const screens = useBreakpoint();
  const isDesktop = screens.lg;

  if (isDesktop) {
    return (
      <DatePicker.RangePicker
        className="w-full rounded-lg"
        value={[startDate, endDate]}
        format="DD/MM/YYYY"
        disabledDate={(current) => current && current.isBefore(new Date(), 'day')}
        onChange={(dates) => {
          setStartDate(dates?.[0] || null);
          setEndDate(dates?.[1] || null);
          form.setFieldValue('dates', dates);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      <Form.Item 
        name={['dates', 'start']}
        className="w-full sm:w-1/2 mb-0"
        rules={[{ required: true, message: 'Ingrese fecha inicial' }]}
      >
        <DatePicker 
          format="DD/MM/YYYY"
          disabledDate={(current) => current && current.isBefore(new Date(), 'day')}
          onChange={(date) => {
            setStartDate(date);
            const currentEndDate = form.getFieldValue(['dates', 'end']);
            form.setFieldsValue({
              dates: {
                start: date,
                end: currentEndDate
              }
            });
          }} 
          className="w-full rounded-lg"
        />
      </Form.Item>
      <Form.Item
        name={['dates', 'end']}
        className="w-full sm:w-1/2 mb-0"
        rules={[{ required: true, message: 'Ingrese fecha final' }]}
      >
        <DatePicker 
          format="DD/MM/YYYY"
          disabledDate={(current) => {
            const startDate = form.getFieldValue(['dates', 'start']);
            return (
              (current && current.isBefore(new Date(), 'day')) ||
              (startDate && current && current.isBefore(startDate, 'day'))
            );
          }}
          onChange={(date) => {
            setEndDate(date);
            const currentStartDate = form.getFieldValue(['dates', 'start']);
            form.setFieldsValue({
              dates: {
                start: currentStartDate,
                end: date
              }
            });
          }} 
          className="w-full rounded-lg"
        />
      </Form.Item>
    </div>
  );
}; 