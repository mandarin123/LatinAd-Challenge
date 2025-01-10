import type { Dayjs } from 'dayjs';
import { FormInstance } from 'antd/lib';

export interface DateSelectorProps {
    isMobile: boolean;
    startDate: Dayjs | null;
    endDate: Dayjs | null;
    setStartDate: (date: Dayjs | null) => void;
    setEndDate: (date: Dayjs | null) => void;
    form: FormInstance;
  }