import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

import { PickerView, PickerViewOptions } from './PickerView';
import { useRefProps } from '../hooks';

const PickerPanelWrapper = styled.div`
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

export type PickerProps<T = any> = {
  title?: string;
  cancelText?: string;
  okText?: string;
  options: PickerViewOptions<T>;
  value?: T[];
  onOk?(): void;
  onCancel?(): void;
  onChange(value: T[], index: number, val: T): void;
};

export const PickerPanel = <T extends any>(props: PickerProps<T>) => {
  const {
    value,
    options,
    cancelText = '取消',
    okText = '确认',
    title,
    onCancel,
    onOk,
    onChange
  } = props;

  return (
    <PickerPanelWrapper>
      <PickerHeader>
        <PickerBtnCancel onClick={onCancel}>{cancelText}</PickerBtnCancel>
        <PickerTitle>{title}</PickerTitle>
        <PickerBtn onClick={onOk}>{okText}</PickerBtn>
      </PickerHeader>

      <PickerView options={options} value={value} onChange={onChange} />
    </PickerPanelWrapper>
  );
};
