import * as React from "react";
import * as ReactDOM from "react-dom";

import { ToastContent } from "./ToastContent";
import { uid } from "../utils/uid";

export interface IToastMethodProps {
  timeout?: number;
  onClose?(): void;
  icon?: any;
  content?: any;
}

export class ToastMethod {
  visible: boolean = false;
  props: IToastMethodProps = {
    timeout: 2500,
  };
  el: HTMLElement = document.createElement("div");
  timeId: number = 0;
  isCloseed: boolean = false;

  constructor(props: IToastMethodProps) {
    this.props = { ...this.props, ...props };

    this.el.id = uid("toast");
    document.body.appendChild(this.el);

    this.render();
    this.visible = true;

    setTimeout(() => {
      this.render();
    });

    const { timeout = 2500 } = this.props;
    if (timeout) {
      this.timeId = window.setTimeout(() => {
        this.close();
      }, timeout);
    }
  }

  close = () => {
    if (this.isCloseed) {
      return;
    }
    this.isCloseed = true;
    if (this.timeId) {
      clearTimeout(this.timeId);
    }
    this.destroy(() => {
      if (this.props.onClose) {
        this.props.onClose();
      }
    });
  };

  destroy(cb: () => void) {
    this.visible = false;
    this.render();
    setTimeout(() => {
      this.remove();
      cb();
    }, 300);
  }

  remove() {
    ReactDOM.unmountComponentAtNode(this.el);
    document.body.removeChild(this.el);
  }

  render() {
    ReactDOM.render(
      <ToastContent visible={this.visible} icon={this.props.icon}>
        {this.props.content}
      </ToastContent>,
      this.el
    );
  }
}
