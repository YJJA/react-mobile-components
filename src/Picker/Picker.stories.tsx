import React, { useCallback, useState } from 'react';
import { PickerView, PickerViewOptions } from './PickerView';
import { Picker } from './Picker';
import { useRefProps } from '../hooks';
import { Button } from '../Button';
import { getDaysInMonth } from 'date-fns';
import { PickerView2 } from './PickerView2';

export default { title: 'Picker' };

export const UsePickerView = () => {
  const [value, setValue] = useState(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDay();
    return [year, month, day];
  });

  const [options, setOptions] = useState<PickerViewOptions<number>>(() => {
    const [year, month] = value;
    const years = Array(180)
      .fill(0)
      .map((_, i) => ({
        label: `${1900 + i}年`,
        value: 1900 + i
      }));

    const months = Array(12)
      .fill(0)
      .map((_, i) => ({
        label: `${i + 1}月`,
        value: i
      }));

    const daysCount = getDaysInMonth(new Date(year, month));
    const days = Array(daysCount)
      .fill(0)
      .map((_, i) => ({
        label: `${i + 1}日`,
        value: i + 1
      }));

    return [years, months, days];
  });
  const optionsRef = useRefProps(options);

  const onChange = useCallback(
    (value: number[], index: number, val: number) => {
      /** 年份/月份变更事件 */
      if (index === 0 || index === 1) {
        let [year, month, day] = value;
        const daysCount = getDaysInMonth(new Date(year, month));
        const days = Array(daysCount)
          .fill(0)
          .map((_, i) => ({
            label: `${i + 1}日`,
            value: i + 1
          }));

        const [years, months] = optionsRef.current;

        if (day > daysCount) {
          day = daysCount;
        }
        setOptions([years, months, days]);
        setValue([year, month, day]);
        return;
      }

      setValue(value);
    },
    []
  );

  console.log('UsePickerView', value);

  return <PickerView options={options} value={value} onChange={onChange} />;
};

export const UsePickerView2 = () => {
  const [value, setValue] = useState<string[]>([]);

  const options = [
    [
      { label: '选择一', value: '001' },
      { label: '选择二', value: '002' },
      { label: '选择二', value: '003' },
      { label: '选择二', value: '004' },
      { label: '选择二', value: '005' },
      { label: '选择二', value: '006' },
      { label: '选择二', value: '007' }
    ],
    [{ label: '选择一1', value: '0011' }, { label: '选择二1', value: '0021' }]
  ];

  const onChange = useCallback(
    (value: string[], colindex: number, colvalue: string) => {
      setValue(value);
    },
    []
  );

  console.log('UsePickerView2', value);

  return <PickerView2 options={options} value={value} onChange={onChange} />;
};

export const UsePicker = () => {
  const options = [
    [
      { label: '选择一', value: '001' },
      { label: '选择二', value: '002' },
      { label: '选择二', value: '003' },
      { label: '选择二', value: '004' },
      { label: '选择二', value: '005' },
      { label: '选择二', value: '006' },
      { label: '选择二', value: '007' }
    ],
    [{ label: '选择一1', value: '0011' }, { label: '选择二1', value: '0021' }]
  ];

  const [value, setValue] = useState<string[]>([]);

  const onChange = useCallback((value: string[]) => {
    setValue(value);
  }, []);

  console.log('UsePicker', value);

  return (
    <div>
      <Picker title="选择" value={value} options={options} onChange={onChange}>
        <Button>选择{value}</Button>
      </Picker>
    </div>
  );
};
