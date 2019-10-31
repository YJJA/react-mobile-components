import React, { useCallback } from 'react';
import styled from 'styled-components';

import { useTween } from './useTween';
import { useBoolean } from '../hooks/useBoolean';
import { useTransition } from './useTransition';

const Box = styled.div`
  width: 100px;
  height: 100px;
  background-color: red;
`;

export default { title: 'Animation' };

export const UseTween = () => {
  const [state, set, stop] = useTween({
    value: 0,
    color: 'red',
    duration: 5000
  });

  const onClick = useCallback(() => {
    set({ value: 100, color: 'blue', duration: 2000 });
  }, []);

  console.log(state);

  return (
    <div>
      <div style={{ height: '100px', backgroundColor: state.color }}>
        {state.value}
      </div>
      <button onClick={onClick}>开始</button>
      <button onClick={stop}>停止</button>
    </div>
  );
};

export const UseTransition = () => {
  const [visible, toggle] = useBoolean();
  const [show, state] = useTransition(visible, {
    from: { value: 0, edf: 0, duration: 2000 },
    enter: { value: 1 }
  });

  return (
    <div>
      {show && <Box style={{ opacity: state.value }}>content</Box>}
      <button onClick={() => toggle(true)}>显示</button>
      <button onClick={() => toggle(false)}>隐藏</button>
    </div>
  );
};
