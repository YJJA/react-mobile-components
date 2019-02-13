import * as React from "react";
import BScroll from "better-scroll";
import height from "dom-helpers/query/height";
import _isEqual from "lodash/isEqual";

import { ViewWrapper, ViewContent } from "./ViewComponents";
import { TabViewItem } from "./TabViewItem";

export interface ITabViewProps {
  className?: string;
  children: React.ReactElement<any>[];
  current: string;
  onChange(key?: string): void;
}

export class TabView extends React.Component<ITabViewProps> {
  static Item = TabViewItem;

  ref: React.RefObject<any> = React.createRef();
  contentRef: React.RefObject<any> = React.createRef();
  tabview?: BScroll;

  componentDidMount() {
    this.setContentStyle();
    this.initialScroll();

    setTimeout(() => {
      this.touchChild(this.props.current);
    });

    window.addEventListener("resize", this.onResize);
  }

  componentDidUpdate(prevProps: ITabViewProps) {
    if (prevProps.current !== this.props.current) {
      this.touchChild(this.props.current);
    }
  }

  componentWillUnmount() {
    if (this.tabview) {
      this.tabview.destroy();
    }

    window.removeEventListener("resize", this.onResize);
  }

  initialScroll() {
    const options = {
      scrollX: true,
      scrollY: false,
      momentum: false,
      snap: {
        threshold: 0.2,
        speed: 400,
      },
      bounce: false,
    };
    this.tabview = new BScroll(this.ref.current, options);
    this.tabview.on("scrollEnd", this.onScrollEnd);
  }

  refresh() {
    if (this.tabview) {
      this.tabview.refresh();
    }
  }

  setContentStyle = () => {
    this.contentRef.current.style.height = height(this.ref.current) + "px";
  };

  onResize = () => {
    this.setContentStyle();
    this.refresh();
  };

  onScrollEnd = () => {
    if (this.tabview) {
      let index = this.tabview.getCurrentPage().pageX;
      let key = this.props.children[index].key + "";
      this.props.onChange(key);
    }
  };

  childRef: { [key: string]: React.RefObject<any> } = {};

  touchChild(key: any) {
    this.props.children.map((child, index) => {
      const childKey = child.key + "";
      const childRef = this.childRef[childKey];
      if (child.key === key) {
        if (this.tabview) {
          this.tabview.goToPage(index, 0, 0);
        }

        if (childRef.current) {
          if (childRef.current.enable) {
            childRef.current.enable();
          }

          if (childRef.current.refresh) {
            childRef.current.refresh();
          }

          if (childRef.current.pullDownRefresh) {
            childRef.current.pullDownRefresh();
          }
        }
      } else {
        if (childRef.current) {
          if (childRef.current.disable) {
            childRef.current.disable();
          }
        }
      }
    });
  }

  getChildRef(key: string) {
    if (!this.childRef[key]) {
      this.childRef[key] = React.createRef();
    }
    return this.childRef[key];
  }

  render() {
    const { className, children } = this.props;

    return (
      <ViewWrapper className={className} ref={this.ref}>
        <ViewContent ref={this.contentRef} style={{ width: `${children.length * 100}%` }}>
          {this.props.children.map(child => {
            return React.cloneElement(child, {
              ...child.props,
              viewKey: child.key,
              style: { width: `${100 / children.length}%` },
              innerRef: this.getChildRef(child.key + ""),
            });
          })}
        </ViewContent>
      </ViewWrapper>
    );
  }
}
