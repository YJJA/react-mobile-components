import React from 'react';
import BScroll from 'better-scroll';
import styled from 'styled-components';

const ScrollWrapper = styled.div`
  flex: 1;
  overflow: hidden;
`;

const ScrollContent = styled.div`
  min-height: 101%;
  min-width: 100%;
`;

const PulldownWrapper = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all;
  height: 20px;
  line-height: 20px;
`;

const PullupWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
`;

export interface ScrollProps {
  children: React.ReactChild;
  className?: string;
  startX?: number;
  startY?: number;
  scrollX?: boolean;
  scrollY?: boolean;
  freeScroll?: boolean;
  eventPassthrough?: string;
  click?: boolean;
  dblclick?: boolean;
  tap?: boolean;
  bounceTime?: number;
  momentum?: boolean;
  probeType?: 1 | 2 | 3;
  preventDefault?: boolean;
  preventDefaultException?: object;
  observeDOM?: boolean;
  stopPropagation?: boolean;
}

export class Scroll extends React.Component<ScrollProps> {
  ref: React.RefObject<any> = React.createRef();
  contentRef: React.RefObject<any> = React.createRef();
  scroll: BScroll | null = null;

  componentDidMount() {
    const { children, className, ...options } = this.props;
    this.scroll = new BScroll(this.ref.current!, options);
  }

  componentWillUnmount() {
    this.scroll!.destroy();
  }

  render() {
    const { className, children } = this.props;

    return (
      <ScrollWrapper className={className} ref={this.ref}>
        <ScrollContent ref={this.contentRef}>{children}</ScrollContent>
      </ScrollWrapper>
    );
  }
}
