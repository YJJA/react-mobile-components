import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';

import { LayerContainer } from './LayerContainer';
import { LayerPlacement } from './layer-placement';

const LayerAlertWrapper = styled.div`
  background-color: #fff;
  border-radius: 7px;
  overflow: hidden;
  width: 270px;
`;

const LayerAlertHeader = styled.div`
  padding: 15px;
  font-size: 18px;
  text-align: center;
`;

const LayerAlertBody = styled.div`
  padding: 0 15px 15px;
  font-size: 15px;
  text-align: center;
`;

const LayerAlertButton = styled.a`
  flex: 1;
  font-size: 18px;
  height: 50px;
  line-height: 50px;
  display: block;
  text-align: center;
`;

const leftBorderCss = css`
  &:not(:first-child) {
    border-left: 1px solid #eee;
  }
`;
const topBorderCss = css`
  &:not(:first-child) {
    border-top: 1px solid #eee;
  }
`;

const LayerAlertFooter = styled.div<{ more: boolean }>`
  display: flex;
  border-top: 1px solid #eee;
  flex-direction: ${props => (props.more ? 'column' : 'row')};

  ${LayerAlertButton} {
    ${props => (props.more ? topBorderCss : leftBorderCss)}
  }
`;

export type LayerAlertAction = {
  text: string;
  onPress(): void;
  type?: 'default' | 'normal';
};

export type LayerAlertProps = {
  visible: boolean;
  title: string;
  actions: LayerAlertAction[];
  onClose(): void;
  onHideEnd?(): void;
};

export const LayerAlert: React.FC<LayerAlertProps> = props => {
  const { visible, title, onHideEnd, children, actions, onClose } = props;

  const nextActions = useMemo(
    () =>
      actions.map(item => ({
        ...item,
        onPress: () => {
          Promise.resolve(item.onPress()).then(() => {
            onClose();
          });
        }
      })),
    [onClose]
  );

  return (
    <LayerContainer
      visible={visible}
      placement={LayerPlacement.center}
      maskClosable={false}
      onHideEnd={onHideEnd}
    >
      <LayerAlertWrapper>
        <LayerAlertHeader>{title}</LayerAlertHeader>
        <LayerAlertBody>{children}</LayerAlertBody>
        <LayerAlertFooter more={nextActions.length > 2}>
          {nextActions.map(action => {
            return (
              <LayerAlertButton key={action.text} onClick={action.onPress}>
                {action.text}
              </LayerAlertButton>
            );
          })}
        </LayerAlertFooter>
      </LayerAlertWrapper>
    </LayerContainer>
  );
};
