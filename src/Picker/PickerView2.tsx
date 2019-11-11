import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';

import { PickerViewCol, PickerViewColOption } from './PickerViewCol';
import { useRefProps } from '../hooks';

const PickerViewWrapper = styled.div`
  position: relative;
  padding: 20px 0;
`;

const PickerViewContentWrapper = styled.div`
  position: relative;
`;

const PickerContentMask = styled.div`
  z-index: 10;
  width: 100%;
  height: 68px;
  pointer-events: none;
  transform: translateZ(0);
`;

const PickerViewMaskTop = styled(PickerContentMask)`
  position: absolute;
  top: 0;
  background: linear-gradient(
    0deg,
    hsla(0, 0%, 100%, 0.4),
    hsla(0, 0%, 100%, 0.8)
  );
  border-bottom: 1px solid #ebebeb;
`;

const PickerViewMaskBottom = styled(PickerContentMask)`
  position: absolute;
  bottom: 0;
  background: linear-gradient(
    180deg,
    hsla(0, 0%, 100%, 0.4),
    hsla(0, 0%, 100%, 0.8)
  );
  border-top: 1px solid #ebebeb;
`;

const PickerViewContent = styled.div`
  display: flex;
  padding: 0 16px;
`;

export type PickerViewOptions = PickerViewColOption[][];

export type PickerViewProps = {
  value: (string | number)[];
  onChange(
    value: (string | number)[],
    index: number,
    val: string | number
  ): void;
  options: PickerViewOptions;
};

export const PickerView2 = (props: PickerViewProps) => {
  const { options, value } = props;
  const propsRef = useRefProps(props);

  const changeHandle = useCallback((colValue: number, index: number = 0) => {
    const { onChange, options, value } = propsRef.current;

    const nextValue = [
      ...value.slice(0, index),
      colValue,
      ...value.slice(index + 1)
    ];

    onChange(nextValue, index, colValue);
  }, []);

  return (
    <PickerViewWrapper>
      <PickerViewContentWrapper>
        <PickerViewMaskTop />
        <PickerViewMaskBottom />
        <PickerViewContent>
          {options.map((group, index) => {
            return (
              <PickerViewCol
                key={index}
                index={index}
                value={value[index]}
                onChange={changeHandle}
                options={group}
              />
            );
          })}
        </PickerViewContent>
      </PickerViewContentWrapper>
    </PickerViewWrapper>
  );
};
