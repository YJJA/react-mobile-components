import * as React from 'react';
import styled, { keyframes } from 'styled-components';

const threeBounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }

  40% {
    transform: scale(1);
  }
`;

const ThreeBounceWrapper = styled.div`
  width: 1.4rem;
  height: 0.3rem;
  margin: 0 auto;
  text-align: center;
`;

const ThreeBounceChild = styled.div`
  width: 0.3rem;
  height: 0.3rem;
  background-color: #999;
  border-radius: 100%;
  display: inline-block;
  animation: ${threeBounce} 1.4s ease-in-out 0s infinite both;
`;

const ThreeBounceChild1 = styled(ThreeBounceChild)`
  animation-delay: -0.32s;
`;

const ThreeBounceChild2 = styled(ThreeBounceChild)`
  animation-delay: -0.16s;
`;

const ThreeBounceChild3 = ThreeBounceChild;

export const ThreeBounce = () => {
  return (
    <ThreeBounceWrapper>
      <ThreeBounceChild1 />
      <ThreeBounceChild2 />
      <ThreeBounceChild3 />
    </ThreeBounceWrapper>
  );
};

export default ThreeBounce;
