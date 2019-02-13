import * as React from "react";
import BScroll from "better-scroll";
import height from "dom-helpers/query/height";
import isEqual from "lodash/isEqual";

import {
  ViewWrapper,
  ViewContent,
  Pulldown,
  Pullup,
  ViewStatus,
  EmptyComponent,
  LoadingComponent,
  ErrorComponent,
} from "./ViewComponents";

let GlobalScrollToMap = new Map();

export interface IViewProps {
  className?: string;
  children?: any;
  refresh?: boolean;
  autoload?: boolean;
  viewKey?: string;

  error?: any;
  status?: string;

  onPullDownRefresh?(viewKey: string): void;
  onScroll?(): void;

  loadingComponent?: any;

  stopPropagation?: boolean;
  pullDownRefreshThreshold?: number;
  pullDownRefreshStop?: number;
}

export interface IViewState {
  first: boolean;
  canPullDown: boolean;
  pullDownBefore: boolean;
  isRebounding: boolean;
  pullDownStyle: {
    top: number;
  };
  pullUpLoading: boolean;
}

export interface IViewOptionsProps {
  click?: boolean;
  startY?: number;
  stopPropagation: boolean;
  pullDownRefresh: any;
  mouseWheel?: any;
}

export class View extends React.Component<IViewProps, IViewState> {
  static defaultProps = {
    autoload: false,
    viewKey: "normal",
    loadingComponent: LoadingComponent,
    stopPropagation: false,
    pullDownRefreshThreshold: 50,
    pullDownRefreshStop: 40,
  };

  ref: React.RefObject<any> = React.createRef();
  contentRef: React.RefObject<any> = React.createRef();

  state = {
    first: false,
    canPullDown: false,
    pullDownBefore: true,
    isRebounding: false,
    pullDownStyle: {
      top: -(this.props.pullDownRefreshStop || 40),
    },
    pullUpLoading: false,
  };
  scroll?: BScroll;

  _isMounted: boolean = false;

  componentDidMount() {
    const {
      onPullDownRefresh,
      onScroll,
      autoload,
      pullDownRefreshThreshold,
      pullDownRefreshStop,
      stopPropagation = false,
    } = this.props;
    const viewKey = window.location.pathname + "#" + this.props.viewKey;
    const startY = GlobalScrollToMap.get(viewKey) || 0;

    const options: IViewOptionsProps = {
      click: true,
      startY,
      stopPropagation,
      pullDownRefresh: onPullDownRefresh
        ? {
            threshold: pullDownRefreshThreshold,
            stop: pullDownRefreshStop,
          }
        : false,
    };

    if (process.env.NODE_ENV === "development") {
      options.mouseWheel = {
        speed: 20,
        invert: false,
        easeTime: 25,
      };
    }

    this.setContentStyle();
    this.scroll = new BScroll(this.ref.current, options);

    this.scroll.on("scrollEnd", pos => {
      GlobalScrollToMap.set(viewKey, pos.y);
    });

    if (onScroll) {
      this.scroll.on("scroll", onScroll);
    }

    if (onPullDownRefresh) {
      this.initPullDownRefresh();
    }

    if (autoload) {
      this.pullDownRefresh();
    }

    this._isMounted = true;
  }

  shouldComponentUpdate(nextProp: IViewProps, nextState: IViewState) {
    return !isEqual(this.props, nextProp) || !isEqual(this.state, nextState);
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (this.scroll) {
      this.scroll.destroy();
    }
  }

  enable() {
    if (this.scroll) {
      this.scroll.enable();
    }
  }

  disable() {
    if (this.scroll) {
      this.scroll.disable();
    }
  }

  refresh() {
    if (this.scroll) {
      this.scroll.refresh();
    }
  }

  setContentStyle() {
    this.contentRef.current.style.minHeight = height(this.ref.current) + 1 + "px";
  }

  pullDownRefresh() {
    const { onPullDownRefresh, status, pullDownRefreshStop } = this.props;
    if (status === "loaded" || !onPullDownRefresh) {
      return;
    }

    // this.setState({first: true})
    // this.scroll.scrollTo(0, 40, 700)
    // setTimeout(() => {
    //   this.scroll.scrollTo(0, 40)
    //   this.scroll.trigger('pullingDown')
    // }, 700)

    this.setState({
      first: true,
      pullDownBefore: false,
      pullDownStyle: { top: 0 },
    });

    if (this.scroll) {
      this.scroll.scrollTo(0, 40);
    }

    this.requestPullDown();
  }

  reboundPullDown() {
    return new Promise(resolve => {
      setTimeout(() => {
        if (!this._isMounted) {
          return;
        }
        this.setState({
          canPullDown: false,
          isRebounding: true,
        });
        if (this.scroll) {
          this.scroll.finishPullDown();
        }
        resolve();
      }, 600);
    });
  }

  afterPullDown() {
    setTimeout(() => {
      if (!this._isMounted) {
        return;
      }

      this.setState({
        first: false,
        pullDownBefore: true,
        isRebounding: false,
        pullDownStyle: {
          top: -(this.props.pullDownRefreshStop || 40),
        },
      });
      if (this.scroll) {
        this.scroll.refresh();
      }
    }, (this.scroll && this.scroll.options.bounceTime) || 10);
  }

  requestPullDown() {
    const { onPullDownRefresh, viewKey } = this.props;
    if (onPullDownRefresh && viewKey) {
      Promise.resolve(onPullDownRefresh(viewKey))
        .then(() => {
          return this.reboundPullDown();
        })
        .then(() => this.afterPullDown());
    }
  }

  initPullDownRefresh() {
    const { pullDownRefreshThreshold = 50, pullDownRefreshStop = 40 } = this.props;

    if (this.scroll) {
      this.scroll.on("pullingDown", () => {
        this.setState({
          pullDownBefore: false,
        });

        this.requestPullDown();
      });

      this.scroll.on("scroll", (pos: { y: number }) => {
        if (this.state.pullDownBefore) {
          this.setState({
            canPullDown: pos.y > pullDownRefreshThreshold,
            pullDownStyle: {
              top: Math.min(pos.y - pullDownRefreshStop, 0),
            },
          });
        }

        if (this.state.isRebounding) {
          this.setState({
            canPullDown: pos.y > pullDownRefreshThreshold,
            pullDownStyle: {
              top: pos.y - pullDownRefreshStop,
            },
          });
        }
      });
    }
  }

  render() {
    const {
      className,
      children,
      onPullDownRefresh,
      error,
      status,
      loadingComponent: LoadingComponent,
    } = this.props;
    const { first, canPullDown, pullDownBefore, pullDownStyle, pullUpLoading } = this.state;

    return (
      <ViewWrapper ref={this.ref}>
        <ViewContent className={className} ref={this.contentRef}>
          {children}
        </ViewContent>
        {onPullDownRefresh && (
          <Pulldown
            first={first}
            canPullDown={canPullDown}
            loadingComponent={LoadingComponent}
            before={pullDownBefore}
            style={pullDownStyle}
            status={status}
          />
        )}
      </ViewWrapper>
    );
  }
}
