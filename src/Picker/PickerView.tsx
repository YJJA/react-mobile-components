import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import * as R from 'ramda';

import { PickerViewColumn, PickerViewColumnItem } from './PickerViewColumn';
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

export type PickerViewProps = {
  value: any;
  onChange(value: any): void;
  options: PickerViewColumnItem[] | PickerViewColumnItem[][];
};

export const PickerView: React.FC<PickerViewProps> = props => {
  const { options, value, onChange } = props;

  const nextOptions = useMemo(() => {
    return (options.length && Array.isArray(options[0])
      ? options
      : [options]) as PickerViewColumnItem[][];
  }, [options]);

  const selected = useMemo(() => {
    const values = Array.isArray(value) ? value : [value];
    return nextOptions.map((group, i) => {
      const val = values[i];
      if (R.type(val) === 'Undefined') {
        return 0;
      }
      const index = group.findIndex(item => item.value === val);
      return index === -1 ? 0 : index;
    });
  }, [value]);

  const propsRef = useRefProps({ nextOptions, onChange, selected });
  const changeHandle = useCallback(
    (selectedIndex: number, keyIndex: number = 0) => {
      const { onChange, nextOptions, selected } = propsRef.current;
      const nextSelected = [
        ...selected.slice(0, keyIndex),
        selectedIndex,
        ...selected.slice(keyIndex + 1)
      ];

      const value = nextOptions.map((group, i) => {
        const index = nextSelected[i];
        return group[index].value;
      });

      const vals = nextOptions.length === 1 ? value[0] : value;
      onChange(vals);
    },
    []
  );

  return (
    <PickerViewWrapper>
      <PickerViewContentWrapper>
        <PickerViewMaskTop />
        <PickerViewMaskBottom />
        <PickerViewContent>
          {nextOptions.map((group, index) => {
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
