import * as React from 'react';
import styled from 'styled-components';

const TabViewItemWrapper = styled.div`
  float: left;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export interface ITabViewItemProps {
  children: any;
  innerRef?: any;
  style: React.CSSProperties;
  viewKey?: string;
}

export class TabViewItem extends React.PureComponent<ITabViewItemProps> {
  render() {
    const { children, innerRef, style, viewKey } = this.props;
    let content = children;

    if (typeof children === 'object') {
      content = React.cloneElement(children, {
        ...children.props,
        viewKey,
        innerRef,
      });
    }

    return <TabViewItemWrapper style={style}>{content}</TabViewItemWrapper>;
  }
}
