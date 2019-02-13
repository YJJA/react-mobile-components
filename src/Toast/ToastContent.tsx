import React from "react";
import styled from "styled-components";
import posed, { PoseGroup } from "react-pose";

const Wrapper = styled.div`
  position: absolute;
  top: 1rem;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 0.2rem;
  border-radius: 0.1rem;
  left: 50%;
  max-width: 80%;
  line-height: 1.4;
  color: #fff;
`;

const WrapperPose = posed(Wrapper)({
  enter: {
    y: 0,
    x: "-50%",
    opacity: 1,
    transition: { duration: 300 },
  },
  exit: {
    y: 10,
    x: "-50%",
    opacity: 0,
    transition: { duration: 200 },
  },
});

export interface IToastContentProps {
  visible?: boolean;
  children?: any;
  icon?: any;
}

export class ToastContent extends React.Component<IToastContentProps> {
  render() {
    const { visible, children } = this.props;

    return (
      <PoseGroup>{visible ? [<WrapperPose key="wrapper">{children}</WrapperPose>] : []}</PoseGroup>
    );
  }
}
