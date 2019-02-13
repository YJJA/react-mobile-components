import * as React from "react";
import * as ReactDOM from "react-dom";

import { ActionSheetContent, IActionSheetItem } from "./ActionSheetContent";
import uid from "../utils/uid";

/**
 * onSelect function
 * onCancel function
 * options Array<{label, value}>
 */

export interface IActionSheet {
  onSelect?(key: string): void;
  onCancel?(): void;
  options: IActionSheetItem[];
}

export class ActionSheet {
  static open(props: IActionSheet) {
    return new ActionSheet(props);
  }

  props: IActionSheet;
  el: HTMLElement;
  visible: boolean;
  constructor(props: IActionSheet) {
    this.props = props;
    this.el = document.createElement("div");
    this.el.id = uid("ActionSheet");
    document.body.appendChild(this.el);
    this.render();
    this.visible = true;
    setTimeout(() => {
      this.render();
    });
  }

  close() {
    ReactDOM.unmountComponentAtNode(this.el);
    document.body.removeChild(this.el);
  }

  onSelect = (key: string) => {
    this.destroy(() => {
      if (this.props.onSelect) {
        this.props.onSelect(key);
      }
    });
  };

  onCancel = () => {
    this.destroy(() => {
      if (this.props.onCancel) {
        this.props.onCancel();
      }
    });
  };

  destroy(cb: () => void) {
    this.visible = false;
    this.render();
    setTimeout(() => {
      this.close();
      cb();
    }, 300);
  }

  render() {
    ReactDOM.render(
      <ActionSheetContent
        visible={this.visible}
        options={this.props.options}
        onSelect={this.onSelect}
        onCancel={this.onCancel}
      />,
      this.el
    );
  }
}
