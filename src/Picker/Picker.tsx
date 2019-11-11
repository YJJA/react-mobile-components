import React, { useEffect, useCallback, useState } from 'react';
import ReactDOM from 'react-dom';

import { PickerViewOptions } from './PickerView';
import { LayerContainer } from '../Layer/LayerContainer';
import { LayerPlacement } from '../Layer/layer-placement';
import { useBoolean } from '../hooks';
import { uid } from '../utils/uid';
import { PickerPanel } from './PickerPanel';

export type PickerProps<T = any> = {
  title?: string;
  cancelText?: string;
  okText?: string;
  options: PickerViewOptions<T>;
  value?: T[];
  onOk?(): void;
  onCancel?(): void;
  onChange(value: T[], index: number, val: T): void;
  children: React.ReactNode;
};

export const Picker = <T extends any>(props: PickerProps<T>) => {
  const {
    value,
    options,
    cancelText = '取消',
    okText = '确认',
    title,
    onCancel,
    onOk,
    onChange,
    children
  } = props;

  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const [visible, toggle] = useBoolean();

  const onShow = useCallback(() => {
    toggle(true);
  }, []);

  const okListener = useCallback(() => {
    toggle(false);
    onOk && onOk();
  }, []);

  const cancelListener = useCallback(() => {
    toggle(false);
    onCancel && onCancel();
  }, []);

  useEffect(() => {
    const el = document.createElement('div');
    el.id = uid('picker');
    document.body.appendChild(el);
    setEl(el);

    return () => {
      document.body.removeChild(el);
    };
  }, []);

  let portal: React.ReactPortal | null = null;
  if (el) {
    portal = ReactDOM.createPortal(
      <LayerContainer
        visible={visible}
        onClose={cancelListener}
        placement={LayerPlacement.bottom}
      >
        <PickerPanel
          onChange={onChange}
          cancelText={cancelText}
          okText={okText}
          title={title}
          value={value}
          options={options}
          onCancel={cancelListener}
          onOk={okListener}
        />
      </LayerContainer>,
      el
    );
  }

  return (
    <>
      <div onClick={onShow}>{children}</div>
      {portal}
    </>
  );
};
