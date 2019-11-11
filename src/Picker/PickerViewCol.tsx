import React, { useRef } from 'react';
import styled from 'styled-components';
import { useRefProps } from '../hooks';

const PickerViewColWrapper = styled.div`
  height: 172px;
  overflow: hidden;
  flex: 1;
`;

const PickerViewColContent = styled.div`
  margin-top: 68px;
  line-height: 36px;
  flex: 1;
  font-size: 18px;
  color: #333;
  text-align: center;
`;

const PickerViewColItem = styled.div`
  height: 36px;
  overflow: hidden;
  white-space: nowrap;
`;

export type PickerViewColOption = {
  value: string | number;
  label: string;
};

export type PickerViewColProps = {
  index: number;
  value: string | number;
  onChange(value: string | number, index: number): void;
  options: PickerViewColOption[];
};

export function PickerViewCol(props: PickerViewColProps) {
  const { options } = props;
  const propsRef = useRefProps(props);
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <PickerViewColWrapper ref={rootRef}>
      <PickerViewColContent>
        {options.map(option => {
          return (
            <PickerViewColItem key={option.value}>
              {option.label}
            </PickerViewColItem>
          );
        })}
      </PickerViewColContent>
    </PickerViewColWrapper>
  );
}
