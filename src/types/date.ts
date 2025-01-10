import { Dayjs } from 'dayjs';
import { FormInstance } from 'antd';

export interface DateSelectorProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  setStartDate: (date: Dayjs | null) => void;
  setEndDate: (date: Dayjs | null) => void;
  form: FormInstance;
}