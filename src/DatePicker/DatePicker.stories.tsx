import React, { useCallback, useState } from 'react';
import { DatePicker } from './DatePicker';

export default { title: 'DatePicker' };

export const UseDatePicker = () => {
  const [value, setValue] = useState<Date | undefined>(undefined);
  const onChange = useCallback((value: Date) => {
    console.log(value);
    setValue(value);
  }, []);

  return (
    <div>
      <DatePicker value={value} onChange={onChange} placeholder="请选择时间" />
    </div>
  );
};
