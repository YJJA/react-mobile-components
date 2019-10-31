import React, { useCallback, useState, useEffect } from 'react';
import { PickerView } from './PickerView';
import { Picker } from './Picker';
import { useBoolean } from '../hooks';
import { Button } from '../Button';

export default { title: 'Picker' };

export const UsePickerView = () => {
  const options = [
    [{ label: '选择一', value: '001' }, { label: '选择二', value: '002' }],
    [{ label: '选择一1', value: '0011' }, { label: '选择二1', value: '0021' }]
  ];

  const [value, setValue] = useState<string[]>([]);
  const onChange = useCallback((value: any) => {
    console.log(value);
    setValue(value);
  }, []);

  return <PickerView options={options} value={value} onChange={onChange} />;
};

export const UsePicker = () => {
  const [visible, toggle] = useBoolean();
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
  const onOk = useCallback((value: any) => {
    console.log(value);
    setValue(value);
    toggle();
  }, []);

  return (
    <div>
      <Picker
        title="选择"
        visible={visible}
        value={value}
        options={options}
        onOk={onOk}
        onCancel={toggle}
      />
      <Button onClick={toggle}>选择</Button>
    </div>
  );
};
