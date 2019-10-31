import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import BScroll from 'better-scroll';
import { useRefProps } from '../hooks';

const PickerViewColumnWrapper = styled.div`
  height: 172px;
  overflow: hidden;
  flex: 1;
`;

const PickerViewColumnContent = styled.div.attrs({
  className: 'wheel-scroll'
})`
  margin-top: 68px;
  line-height: 36px;
  flex: 1;
  font-size: 18px;
  color: #333;
  text-align: center;
`;

const PickerViewColumnItem = styled.div.attrs({
  className: 'wheel-item'
})`
  height: 36px;
  overflow: hidden;
  white-space: nowrap;
`;

export type PickerViewColumnItem = {
  value: any;
  label: string;
};

export type PickerViewColumnProps = {
  keyIndex?: number;
  selectedIndex: number;
  onChange(selectedIndex: any, keyIndex?: number): void;
  options: PickerViewColumnItem[];
};

export const PickerViewColumn: React.FC<PickerViewColumnProps> = props => {
  const { options, selectedIndex } = props;
  const propsRef = useRefProps(props);
  const rootRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<BScroll | null>(null);

  const changeHandle = useCallback(() => {
    setTimeout(() => {
      if (!wheelRef.current) {
        return;
      }

      const { keyIndex, onChange, selectedIndex } = propsRef.current;
      const currentIndex = wheelRef.current.getSelectedIndex();
      if (currentIndex === selectedIndex) {
        return;
      }
      onChange(currentIndex, keyIndex);
    });
  }, []);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }
    wheelRef.current = new BScroll(rootRef.current, {
      wheel: {
        selectedIndex,
        adjustTime: 400,
        wheelWrapperClass: 'wheel-scroll',
        wheelItemClass: 'wheel-item'
      },
      probeType: 3
    });

    wheelRef.current.on('scrollEnd', changeHandle);
    return () => {
      if (wheelRef.current) {
        wheelRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!wheelRef.current) {
      return;
    }

    wheelRef.current.refresh();
    wheelRef.current.wheelTo(selectedIndex);
  }, [options, selectedIndex]);

  return (
    <PickerViewColumnWrapper ref={rootRef}>
      <PickerViewColumnContent>
        {options.map(option => {
          return (
            <PickerViewColumnItem key={option.value}>
              {option.label}
            </PickerViewColumnItem>
          );
        })}
      </PickerViewColumnContent>
    </PickerViewColumnWrapper>
  );
};
