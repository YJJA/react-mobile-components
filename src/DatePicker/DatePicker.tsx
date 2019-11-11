import React, { useState, useCallback, useMemo } from 'react';
import { format as formatDate } from 'date-fns';
import { Picker, PickerViewOptions } from '../Picker';
import { useRefProps } from '../hooks';
import { Input } from '../Input';
import { getDefaultPickerValue, getPickerOptions } from './utils';

export type DatePickerProps = {
  value?: Date;
  placeholder?: string;
  format?: string;
  onChange(value: Date): void;
};

export const DatePicker: React.FC<DatePickerProps> = props => {
  const { value, placeholder, format = 'yyyy/MM/dd HH:mm' } = props;
  const propsRef = useRefProps(props);

  const [pickerValue, setPickerValue] = useState(() =>
    getDefaultPickerValue(value)
  );
  const [options, setOptions] = useState<PickerViewOptions<number>>(() =>
    getPickerOptions(pickerValue)
  );
  const pickerValueRef = useRefProps(pickerValue);

  console.log('pickerValue', pickerValue);

  const onChange = useCallback((value: number[]) => {
    setOptions(getPickerOptions(value));
    setPickerValue(() => value);
  }, []);

  const onOk = useCallback(() => {
    const [year, month, date, hours, minutes] = pickerValueRef.current;
    const { onChange } = propsRef.current;
    const value = new Date(year, month, date, hours, minutes);
    onChange(value);
  }, []);

  const valueText = useMemo(() => (value ? formatDate(value, format) : ''), [
    value,
    format
  ]);

  return (
    <Picker
      onOk={onOk}
      options={options}
      value={pickerValue}
      onChange={onChange}
    >
      <Input value={valueText} readOnly placeholder={placeholder} />
    </Picker>
  );
};
