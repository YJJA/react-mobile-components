import React from 'react';
import BScroll from 'better-scroll';
import styled from 'styled-components';
import style from 'dom-helpers/style';

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
  contentStyle?: { [key: string]: any };
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
    const { children, className, contentStyle, ...options } = this.props;
    this.scroll = new BScroll(this.ref.current!, options);
  }

  componentDidUpdate() {
    if (this.props.contentStyle) {
      style(this.contentRef.current!, this.props.contentStyle, undefined);
    }

    this.scroll!.refresh();
  }

  componentWillUnmount() {
    this.scroll!.destroy();
  }

  render() {
    const { className, contentStyle, children } = this.props;

    return (
      <ScrollWrapper className={className} ref={this.ref}>
        <ScrollContent style={contentStyle} ref={this.contentRef}>
          {children}
        </ScrollContent>
      </ScrollWrapper>
    );
  }
}
