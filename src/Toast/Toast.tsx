import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";

import { ToastMethod, IToastMethodProps } from "./ToastMethod";
import { ToastContent } from "./ToastContent";
import { uid } from "../utils/uid";

const Loading = styled.div`
  min-width: 1.2rem;
  min-height: 1.2rem;
  line-height: 1.2rem;
  text-align: center;
`;

export interface IToastProps {
  visible: boolean;
  children: React.ReactChild;
  icon?: any;
  timeout: number;
  onClose?(): void;
}

export class Toast extends React.Component<IToastProps> {
  static open = (props: IToastMethodProps) => {
    return new ToastMethod(props);
  };

  static success = (content: any, timeout?: number, onClose?: () => void) => {
    return new ToastMethod({ content, timeout, onClose });
  };

  static fail = (content: any, timeout?: number, onClose?: () => void) => {
    return new ToastMethod({ content, timeout, onClose });
  };

  static info = (content: any, timeout?: number, onClose?: () => void) => {
    return new ToastMethod({ content, timeout, onClose });
  };

  static loading = (content: any = "加载中...", timeout: number = 0, onClose?: () => void) => {
    return new ToastMethod({
      timeout,
      onClose,
      content: <Loading>{content}</Loading>,
    });
  };

  static offline = (content: any, timeout: number, onClose?: () => void) => {
    return new ToastMethod({ content, timeout, onClose });
  };

  static defaultProps = {
    timeout: 2500,
  };

  el: HTMLElement | null = null;
  destroyTimeId: number = 0;

  componentDidMount() {
    this.el = document.createElement("div");
    document.body.appendChild(this.el);
    this.setState({ key: uid("Toast") });

    const { timeout, onClose } = this.props;
    if (timeout) {
      this.destroyTimeId = window.setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, timeout);
    }
  }

  componentWillUnmount() {
    if (this.destroyTimeId) {
      clearTimeout(this.destroyTimeId);
    }

    if (this.el) {
      document.body.removeChild(this.el);
    }
  }

  render() {
    if (!this.el) {
      return null;
    }

    const { visible, children, ...props } = this.props;

    return ReactDOM.createPortal(
      <ToastContent visible={visible}>{children}</ToastContent>,
      this.el
    );
  }
}
