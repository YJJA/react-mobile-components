import React, { useCallback, useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { PickerView } from './PickerView';
import { LayerContainer } from '../Layer/LayerContainer';
import { PickerViewColumnItem } from './PickerViewColumn';
import { LayerPlacement } from '../Layer/layer-placement';
import { useRefProps } from '../hooks';
import { uid } from '../utils/uid';

const PickerWrapper = styled.div`
  background-color: #fff;
`;

const PickerHeader = styled.header`
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PickerBtn = styled.button`
  border: none;
  height: 50px;
  width: 60px;
  background-color: #fff;
  color: #007bff;
  font-size: 14px;
`;

const PickerBtnCancel = styled(PickerBtn)`
  color: #999;
`;

const PickerTitle = styled.h3`
  text-align: center;
  font-size: 14px;
  color: #414141;
  font-weight: normal;
`;

export type PickerProps = {
  visible: boolean;
  title?: string;
  cancelText?: string;
  okText?: string;
  onOk?(value: any): void;
  onCancel?(): void;
  value?: any;
  options: PickerViewColumnItem[][];
};

export const Picker: React.FC<PickerProps> = props => {
  const {
    visible,
    value,
    options,
    cancelText = '取消',
    okText = '确认',
    title,
    onCancel
  } = props;
  const propsRef = useRefProps(props);
  const [selfValue, setSelfValue] = useState(value);
  const selfValueRef = useRefProps(selfValue);
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = document.createElement('div');
    el.id = uid('picker');
    document.body.appendChild(el);

    elRef.current = el;
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  const changeHandle = useCallback((value: any) => {
    setSelfValue(value);
  }, []);

  const onHandle = useCallback(() => {
    const { onOk } = propsRef.current;
    if (onOk) {
      onOk(selfValueRef.current);
    }
  }, []);

  if (!elRef.current) {
    return null;
  }

  return ReactDOM.createPortal(
    <LayerContainer
      visible={visible}
      onClose={onCancel}
      placement={LayerPlacement.bottom}
    >
      <PickerWrapper>
        <PickerHeader>
          <PickerBtnCancel onClick={onCancel}>{cancelText}</PickerBtnCancel>
          <PickerTitle>{title}</PickerTitle>
          <PickerBtn onClick={onHandle}>{okText}</PickerBtn>
        </PickerHeader>

        <PickerView
          options={options}
          value={selfValue}
          onChange={changeHandle}
        />
      </PickerWrapper>
    </LayerContainer>,
    elRef.current
  );
};
