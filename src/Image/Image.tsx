import * as React from 'react';
import styled from 'styled-components';

const Img = styled.img`
  display: block;
`;

export interface IImageProps {
  src: string;
  className: string;
}

export class Image extends React.PureComponent<IImageProps> {
  render() {
    return <Img className={this.props.className} src={this.props.src} />;
  }
}
