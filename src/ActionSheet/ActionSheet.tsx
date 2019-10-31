import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import { LayerContainer } from '../Layer/LayerContainer';
import { LayerPlacement } from '../Layer/layer-placement';
import { useRefProps } from '../hooks';

const ActionSheetBody = styled.div`
  width: 100%;
`;

const ActionSheetItem = styled.div`
  padding: 12px;
  background-color: #fff;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
  background-color: #fff;
  color: #4a4a4a;
  margin-top: 1px;

  &:first-child {
    margin-top: 0;
  }
`;

const ActionSheetCancel = styled(ActionSheetItem)`
  color: #ff4a08;
  margin-top: 10px;
`;

const ActionSheetSpan = styled.span`
  color: #999;
  font-size: 12px;
`;

export type ActionSheetOption = {
  key: string;
  text: any;
};

export type ActionSheetProps = {
  visible: boolean;
  onSelect(key: string): void | Promise<void>;
  onClose(): void;
  options: ActionSheetOption[];
  maskClosable?: boolean;
  onHideEnd?(): void;
};

export const ActionSheet: React.FC<ActionSheetProps> = props => {
  const { visible, options, maskClosable, onHideEnd } = props;
  const propsRef = useRefProps(props);

  const [selectedKey, setSelectedKey] = useState('');
  const selectedKeyRef = useRefProps(selectedKey);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (selectedKeyRef.current) {
        return;
      }
      const key = e.currentTarget.getAttribute('data-key');
      if (key) {
        setSelectedKey(key);
        Promise.resolve(propsRef.current.onSelect(key)).then(() => {
          setSelectedKey('');
          propsRef.current.onClose();
        });
      }
    },
    []
  );

  const onCancel = useCallback(() => {
    if (selectedKeyRef.current) {
      return;
    }
    propsRef.current.onClose();
  }, []);

  return (
    <LayerContainer
      visible={visible}
      placement={LayerPlacement.bottom}
      maskClosable={maskClosable}
      onClose={onCancel}
      onHideEnd={onHideEnd}
    >
      <ActionSheetBody>
        {options.map(item => {
          return (
            <ActionSheetItem
              key={item.key}
              data-key={item.key}
              onClick={onClick}
            >
              {item.text}
              {selectedKey === item.key && (
                <ActionSheetSpan>加载中...</ActionSheetSpan>
              )}
            </ActionSheetItem>
          );
        })}
        <ActionSheetCancel key="cancel" onClick={onCancel}>
          取消
        </ActionSheetCancel>
      </ActionSheetBody>
    </LayerContainer>
  );
};
