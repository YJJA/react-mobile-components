import React from 'react';
import styled from 'styled-components';
import { UseCarouselProps, useCarousel } from './useCarousel';

const CarouselWrapper = styled.div`
  position: relative;
  min-height: 1px;
`;

const CarouselContent = styled.div`
  position: relative;
  overflow: hidden;
  white-space: nowrap;
`;

const CarouselDotsWrapper = styled.div`
  position: absolute;
  overflow: hidden;
  bottom: 10px;
  left: 0;
  right: 0;
  width: 100%;
  white-space: nowrap;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CarouselDotsItem = styled.div<{ active?: boolean }>`
  height: 10px;
  width: ${props => (props.active ? '25px' : '10px')};
  background-color: #fff;
  border-radius: 5px;
  margin: 0 3px;
`;

const itemStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0
};

export type CarouselProps = {
  style?: React.CSSProperties;
  className?: string;
  dots?: boolean;
  children: React.ReactElement[];
} & UseCarouselProps;

export const Carousel = (props: CarouselProps) => {
  const { className, style, dots, children, ...cprops } = props;
  const [ref, { list, index }] = useCarousel(children.length, cprops);

  return (
    <CarouselWrapper className={className} style={style}>
      <CarouselContent ref={ref}>
        {React.Children.map(children, (child, i) => {
          const current = list[i];
          const style: React.CSSProperties = {
            ...child.props.style,
            ...current
          };
          return React.cloneElement(child, { style });
        })}
      </CarouselContent>

      {dots && (
        <CarouselDotsWrapper>
          {React.Children.map(children, (child, i) => {
            return <CarouselDotsItem key={i} active={i === index} />;
          })}
        </CarouselDotsWrapper>
      )}
    </CarouselWrapper>
  );
};
