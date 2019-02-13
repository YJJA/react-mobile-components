import * as React from "react";
import styled from "styled-components";
import posed, { PoseGroup } from "react-pose";

const Mask = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9;
`;

const Wrapper = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0.5rem;
  z-index: 10;
`;

const MaskPose = posed(Mask)({
  enter: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
});

const WrapperPose = posed(Wrapper)({
  enter: {
    scale: 1,
    opacity: 1,
    delay: 300,
    transition: { duration: 200, ease: "backOut" },
  },
  exit: {
    scale: 0.6,
    opacity: 0,
    transition: { duration: 200, ease: "backIn" },
  },
});

export interface ILayerContentProps {
  visible: boolean;
  children: any;
}

export class LayerContent extends React.Component<ILayerContentProps> {
  render() {
    const { children, visible } = this.props;

    return (
      <PoseGroup>
        {visible
          ? [<MaskPose key="mask" />, <WrapperPose key="wrapper">{children}</WrapperPose>]
          : []}
      </PoseGroup>
    );
  }
}
