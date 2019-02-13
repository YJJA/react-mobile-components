import * as React from "react";
import * as ReactDOM from "react-dom";

import { LayerContent } from "./LayerContent";
import { LayerBox } from "./LayerBox";
import { ThreeBounce } from "../Loading";

import { LayerMethod } from "./LayerMethod";
import { uid } from "../utils/uid";

export interface ILayerProps {
  onOk?(): void;
  onCancel?(): void;
  okText?: string;
  cancelText?: string;
  cancel?: boolean;
  loading?: boolean;
  timeout?: number;
  boxComponent?: React.ComponentType<any>;
  loadComponent?: React.ComponentType<any>;
  children?: React.ReactChild;
  visible: boolean;
  footer?: boolean;
  title?: string;
}

export class Layer extends React.Component<ILayerProps> {
  // open
  static open = (props: ILayerProps) => {
    return new LayerMethod(props);
  };

  // alert
  static alert = (message: string, onOk: () => void) => {
    return new LayerMethod({
      onOk,
      content: message,
      cancel: false,
    });
  };

  // prompt
  static prompt = (message: string, onOk: () => void, onCancel: () => void) => {
    return new LayerMethod({
      onOk,
      onCancel,
      content: message,
    });
  };

  // loading
  static loading = (timeout: number) => {
    return new LayerMethod({ timeout });
  };

  // defaultProps
  static defaultProps = {
    loading: false,
    visible: false,
    timeout: 0,
    boxComponent: LayerBox,
    loadComponent: ThreeBounce,
  };

  el: HTMLDivElement | null = null;
  destroyTimeId: number = 0;

  componentDidMount() {
    this.el = document.createElement("div");
    document.body.appendChild(this.el);
    this.setState({ key: uid("Layer") });

    if (this.props.timeout) {
      this.destroyTimeId = window.setTimeout(() => {
        if (this.props.onCancel) {
          this.props.onCancel();
        }
      }, this.props.timeout);
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

    const {
      loadComponent: LoadComponent = ThreeBounce,
      boxComponent: BoxComponent = LayerBox,
      timeout,
      loading,
      visible,
      children,
      ...props
    } = this.props;

    let content = null;
    if (loading) {
      content = <LoadComponent />;
    } else {
      content = <BoxComponent {...props} content={children} />;
    }

    return ReactDOM.createPortal(<LayerContent visible={visible}>{content}</LayerContent>, this.el);
  }
}
