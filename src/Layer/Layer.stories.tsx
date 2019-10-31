import React, { useCallback } from 'react';
import styled from 'styled-components';

import { useBoolean } from '../hooks';

import { LayerContainer } from './LayerContainer';
import { LayerPlacement } from './layer-placement';
import { Layer } from './index';

export default { title: 'Layer' };

const LeftRightContent = styled.div`
  min-width: 200px;
  height: 100%;
  background-color: #fff;
`;

const TopBottomContent = styled.div`
  min-height: 200px;
  width: 100%;
  background-color: #fff;
`;

const CenterContent = styled.div`
  min-height: 200px;
  min-width: 200px;
  background-color: #fff;
`;

const FullContent = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
`;

export const UseLayerContainer = () => {
  const [leftVisible, leftToggle] = useBoolean();
  const [rightVisible, rightToggle] = useBoolean();
  const [topVisible, topToggle] = useBoolean();
  const [bottomVisible, bottomToggle] = useBoolean();
  const [centerVisible, centerToggle] = useBoolean();
  const [fullVisible, fullToggle] = useBoolean();

  return (
    <div>
      <button onClick={leftToggle}>Left</button>
      <LayerContainer
        placement={LayerPlacement.left}
        visible={leftVisible}
        onClose={leftToggle}
      >
        <LeftRightContent>sdfadfafa</LeftRightContent>
      </LayerContainer>

      <button onClick={rightToggle}>Right</button>
      <LayerContainer
        placement={LayerPlacement.right}
        visible={rightVisible}
        onClose={rightToggle}
      >
        <LeftRightContent>sdfadfafa</LeftRightContent>
      </LayerContainer>

      <button onClick={topToggle}>Top</button>
      <LayerContainer
        placement={LayerPlacement.top}
        visible={topVisible}
        onClose={topToggle}
      >
        <TopBottomContent>sdfadfafa</TopBottomContent>
      </LayerContainer>

      <button onClick={bottomToggle}>Bottom</button>
      <LayerContainer
        placement={LayerPlacement.bottom}
        visible={bottomVisible}
        onClose={bottomToggle}
      >
        <TopBottomContent>sdfadfafa</TopBottomContent>
      </LayerContainer>

      <button onClick={centerToggle}>Center</button>
      <LayerContainer
        placement={LayerPlacement.center}
        visible={centerVisible}
        onClose={centerToggle}
      >
        <CenterContent>sdfadfafa</CenterContent>
      </LayerContainer>

      <button onClick={fullToggle}>Full</button>
      <LayerContainer
        placement={LayerPlacement.full}
        visible={fullVisible}
        onClose={fullToggle}
      >
        <FullContent>sdfadfafa</FullContent>
      </LayerContainer>
    </div>
  );
};

export const UseAlert = () => {
  const onClickOne = useCallback(() => {
    Layer.alert('提交信息', '你确认？', [{ text: 'Ok', onPress: () => {} }]);
  }, []);

  const onClickTwo = useCallback(() => {
    Layer.alert('提交信息', '你确认？', [
      { text: 'Cancel', onPress: () => {} },
      { text: 'Ok', onPress: () => {} }
    ]);
  }, []);

  const onClickThree = useCallback(() => {
    Layer.alert('提交信息', '你确认？', [
      { text: 'Ok 1', onPress: () => {} },
      { text: 'Ok 2', onPress: () => {} },
      { text: 'Ok 3', onPress: () => {} }
    ]);
  }, []);

  return (
    <div>
      <button onClick={onClickOne}>Alert 1</button>
      <button onClick={onClickTwo}>Alert 2</button>
      <button onClick={onClickThree}>Alert 3</button>
    </div>
  );
};
