import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { LayerContent } from './LayerContent';
import { LayerBox } from './LayerBox';
import { ThreeBounce } from '../Loading/ThreeBounce';
import uid from '../utils/uid';

export interface ILayerMethodProps {
  onOk?(): void;
  onCancel?(): void;
  content?: any;
  okText?: string;
  cancelText?: string;
  cancel?: boolean;
  loading?: boolean;
  timeout?: number;
  boxComponent?: React.ComponentType<any>;
  loadComponent?: React.ComponentType<any>;
}

export interface ILayerMethodState {
  visible: boolean;
}

export class LayerMethod {
  static defaultProps = {
    loading: false,
    timeout: 0,
    boxComponent: LayerBox,
    loadComponent: ThreeBounce,
  };

  state: ILayerMethodState = {
    visible: false,
  };

  props: ILayerMethodProps;

  el: HTMLDivElement;
  destroyTimeId: number = 0;
  timeId: number = 0;

  constructor(props: ILayerMethodProps) {
    this.props = { ...LayerMethod.defaultProps, ...props };

    this.el = document.createElement('div');
    this.el.id = uid('LayerMethod');
    document.body.appendChild(this.el);

    if (this.props.timeout) {
      this.destroyTimeId = window.setTimeout(() => {
        this.close();
      }, this.props.timeout);
    }

    this.render();
    this.setState({
      visible: true,
    });
  }

  setState(state: ILayerMethodState) {
    this.state = { ...this.state, ...state };

    if (this.timeId) {
      clearTimeout(this.timeId);
    }

    this.timeId = setTimeout(() => {
      this.render();
    });
  }

  onOk = () => {
    this.close(this.props.onOk);
  };

  onCancel = () => {
    this.close(this.props.onCancel);
  };

  close(cb?: () => void) {
    this.setState({ visible: false });

    if (this.destroyTimeId) {
      clearTimeout(this.destroyTimeId);
    }

    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(this.el);
      document.body.removeChild(this.el);
      if (cb) {
        cb();
      }
    }, 300);
  }

  render() {
    const { visible } = this.state;
    const {
      loadComponent: LoadComponent = ThreeBounce,
      boxComponent: BoxComponent = LayerBox,
      timeout,
      loading,
      ...props
    } = this.props;

    ReactDOM.render(
      <LayerContent visible={visible}>
        {loading ? (
          <LoadComponent />
        ) : (
          <BoxComponent {...props} onOk={this.onOk} onCancel={this.onCancel} />
        )}
      </LayerContent>,
      this.el
    );
  }
}
