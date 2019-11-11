import React from 'react';
import styled from 'styled-components';

import { Carousel } from './Carousel';

export default { title: 'Carousel' };

const Wrapper = styled.div``;

const Link = styled.div`
  height: 200px;
`;

const Group = styled.div`
  padding: 20px;
`;

export const UseCarousel = () => {
  return (
    <Wrapper>
      <Group>
        <Carousel dots autoplay>
          <Link style={{ backgroundColor: 'red' }} />
          <Link style={{ backgroundColor: 'blue' }} />
          <Link style={{ backgroundColor: '#ddd' }} />
        </Carousel>
      </Group>

      <Group>
        <Carousel dots autoplay vertical>
          <Link style={{ backgroundColor: 'red' }} />
          <Link style={{ backgroundColor: 'blue' }} />
          <Link style={{ backgroundColor: '#ddd' }} />
        </Carousel>
      </Group>

      {Array(100)
        .fill(1)
        .map((t, i) => {
          return <p key={i}>test {i}</p>;
        })}
    </Wrapper>
  );
};
