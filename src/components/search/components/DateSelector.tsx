import React, { useCallback } from 'react';
import { DatePicker, Form } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { DateSelectorProps } from '../../../types/date';
import type { Dayjs } from 'dayjs';

export const DateSelector: React.FC<DateSelectorProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  form
}) => {
  const screens = useBreakpoint();
  const isDesktop = screens.lg;

  const disabledDate = useCallback((current: Dayjs) => {
    return current && current.isBefore(new Date(), 'day');
  }, []);

  const handleRangeChange = useCallback((dates: [Dayjs | null, Dayjs | null] | null) => {
    const [start, end] = dates || [null, null];
    setStartDate(start);
    setEndDate(end);
    form.setFieldsValue({ dates: { start, end } });
  }, [form, setStartDate, setEndDate]);

  const handleStartDateChange = useCallback((date: Dayjs | null) => {
    setStartDate(date);
    form.setFieldsValue({
      dates: { start: date, end: form.getFieldValue(['dates', 'end']) }
    });
  }, [form, setStartDate]);

  const handleEndDateChange = useCallback((date: Dayjs | null) => {
    setEndDate(date);
    form.setFieldsValue({
      dates: { start: form.getFieldValue(['dates', 'start']), end: date }
    });
  }, [form, setEndDate]);

  if (isDesktop) {
    return (
      <DatePicker.RangePicker
        className="w-full rounded-lg"
        value={[startDate, endDate]}
        format="DD/MM/YYYY"
        disabledDate={disabledDate}
        onChange={handleRangeChange}
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
          disabledDate={disabledDate}
          onChange={handleStartDateChange}
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
            return disabledDate(current) || (startDate && current && current.isBefore(startDate, 'day'));
          }}
          onChange={handleEndDateChange}
          className="w-full rounded-lg"
        />
      </Form.Item>
    </div>
  );
}; 