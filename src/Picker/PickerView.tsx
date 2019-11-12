import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';

import { PickerViewColumn, PickerViewColumnOption } from './PickerViewColumn';
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

export type PickerViewOptions<T = any> = PickerViewColumnOption<T>[][];

export type PickerViewProps<T = any> = {
  value?: T[];
  onChange(value: T[], index: number, val: T): void;
  options: PickerViewOptions<T>;
};

export const PickerView = <T extends any>(props: PickerViewProps<T>) => {
  const { options, value } = props;
  const propsRef = useRefProps(props);

  const selected = useMemo(() => {
    const lastValue = value || [];
    return options.map((group, i) => {
      const val = lastValue[i];
      if (typeof value === 'undefined') {
        return 0;
      }
      const index = group.findIndex(item => item.value === val);
      return index === -1 ? 0 : index;
    });
  }, [value, options]);

  const selectedRef = useRefProps(selected);

  const changeHandle = useCallback(
    (selectedIndex: number, keyIndex: number = 0) => {
      const { onChange, options } = propsRef.current;
      const selected = selectedRef.current;
      const nextSelected = [
        ...selected.slice(0, keyIndex),
        selectedIndex,
        ...selected.slice(keyIndex + 1)
      ];

      const value = options.map((group, i) => {
        const index = nextSelected[i];
        return group[index] && group[index].value;
      });

      onChange(value, keyIndex, value[keyIndex]);
    },
    []
  );

  return (
    <PickerViewWrapper>
      <PickerViewContentWrapper>
        <PickerViewMaskTop />
        <PickerViewMaskBottom />
        <PickerViewContent>
          {options.map((group, index) => {
            return (
              <PickerViewColumn
                key={index}
                keyIndex={index}
                selectedIndex={selected[index]}
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
