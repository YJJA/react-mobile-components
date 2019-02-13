import * as React from "react";
import BScroll from "better-scroll";
import height from "dom-helpers/query/height";
import isEqual from "lodash/isEqual";
import styled from "styled-components";

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

const ListContent = styled.div`
  overflow: hidden;
`;

export interface IListViewProps {
  className?: string;
  contentStyle?: React.CSSProperties;
  autoload?: boolean;
  viewKey: string;

  data: any[];
  error?: any;
  total: number;
  status?: string;
  renderItem(item: any): JSX.Element;

  onPullDownRefresh?(viewKey: string, args?: any): Promise<any>;
  onPullUpLoad?(viewKey: string): Promise<any>;
  onScroll?(): void;

  emptyComponent: React.ComponentType<any>;
  loadingComponent: React.ComponentType<any>;
  errorComponent: React.ComponentType<any>;

  stopPropagation: boolean;
  pullDownRefreshThreshold: number;
  pullDownRefreshStop: number;
  pullUpLoadThreshold: number;
}

export interface IListViewState {
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
  pullUpLoad?: any;
}

export class ListView extends React.Component<IListViewProps, IListViewState> {
  static defaultProps = {
    total: 0,
    autoload: false,
    viewKey: "normal",
    emptyComponent: EmptyComponent,
    loadingComponent: LoadingComponent,
    errorComponent: ErrorComponent,
    stopPropagation: false,
    pullDownRefreshThreshold: 50,
    pullDownRefreshStop: 40,
    pullUpLoadThreshold: 40,
  };

  ref: React.RefObject<any> = React.createRef();
  contentRef: React.RefObject<any> = React.createRef();

  state = {
    first: false,
    canPullDown: false,
    pullDownBefore: true,
    isRebounding: false,
    pullDownStyle: { top: -this.props.pullDownRefreshStop },
    pullUpLoading: false,
  };

  scroll?: BScroll;

  _isMounted: boolean = false;

  componentDidMount() {
    const {
      onPullDownRefresh,
      onPullUpLoad,
      onScroll,
      autoload,
      pullDownRefreshThreshold,
      pullDownRefreshStop,
      pullUpLoadThreshold,
      stopPropagation,
    } = this.props;
    const viewKey = window.location.pathname + "#" + this.props.viewKey;
    const startY = GlobalScrollToMap.get(viewKey) || 0;

    const options: IViewOptionsProps = {
      click: true,
      stopPropagation,
      startY: GlobalScrollToMap.get(viewKey) || 0,
      pullDownRefresh: onPullDownRefresh
        ? {
            threshold: pullDownRefreshThreshold,
            stop: pullDownRefreshStop,
          }
        : false,
      pullUpLoad: onPullUpLoad
        ? {
            threshold: pullUpLoadThreshold,
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

    this.scroll.on("scrollEnd", (pos: { y: number }) => {
      GlobalScrollToMap.set(viewKey, pos.y);
    });

    if (onScroll) {
      this.scroll.on("scroll", onScroll);
    }

    if (onPullDownRefresh) {
      this.initPullDownRefresh();
    }

    if (onPullUpLoad) {
      this.initPullUpLoad();
    }

    if (autoload) {
      this.pullDownRefresh();
    }
    this._isMounted = true;
  }

  shouldComponentUpdate(nextProp: IListViewProps, nextState: IListViewState) {
    return !isEqual(this.props, nextProp) || !isEqual(this.state, nextState);
  }

  componentDidUpdate(prevProps: IListViewProps) {
    if (this.props.data !== prevProps.data) {
      this.setContentStyle();
    }
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

  pullDownRefresh(force?: boolean, args?: any) {
    const { onPullDownRefresh, status } = this.props;
    if (!onPullDownRefresh) {
      return;
    }

    if (!force && status === "loaded") {
      return;
    }

    // this.setState({first: true})
    // this.scroll.scrollTo(0, 40, 100)
    // setTimeout(() => {
    //   this.scroll.scrollTo(0, 40)
    //   this.scroll.trigger('pullingDown')
    // }, 100)

    this.setState({
      first: true,
      pullDownBefore: false,
      pullDownStyle: { top: 0 },
    });
    if (this.scroll) {
      this.scroll.scrollTo(0, 40);
    }
    this.requestPullDown(args);
  }

  reboundPullDown() {
    return new Promise(resolve => {
      setTimeout(() => {
        if (!this._isMounted) {
          return;
        }
        this.setState({ isRebounding: true });
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
          top: -this.props.pullDownRefreshStop,
        },
      });
      if (this.scroll) {
        this.scroll.refresh();
      }
    }, this.scroll && this.scroll.options.bounceTime);
  }

  requestPullDown(args?: any) {
    const { onPullDownRefresh, viewKey } = this.props;
    if (onPullDownRefresh) {
      Promise.resolve(onPullDownRefresh(viewKey, args))
        .then(() => {
          return this.reboundPullDown();
        })
        .then(() => this.afterPullDown());
    }
  }

  initPullDownRefresh() {
    const { pullDownRefreshThreshold, pullDownRefreshStop } = this.props;

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

  initPullUpLoad() {
    if (!this.scroll) {
      return;
    }
    this.scroll.on("pullingUp", () => {
      const { onPullUpLoad, data, total, viewKey } = this.props;
      if (data.length >= total) {
        if (this.scroll) {
          this.scroll.finishPullUp();
        }
        return;
      }

      this.setState({ pullUpLoading: true });
      if (onPullUpLoad) {
        Promise.resolve(onPullUpLoad(viewKey)).then(() => {
          if (!this._isMounted) {
            return;
          }
          this.setState({
            pullUpLoading: false,
          });
          if (this.scroll) {
            this.scroll.finishPullUp();
            this.scroll.refresh();
          }
        });
      }
    });
  }

  render() {
    const {
      className,
      contentStyle,
      onPullDownRefresh,
      onPullUpLoad,
      data,
      error,
      total,
      status,
      renderItem,
      emptyComponent: EmptyComponent,
      loadingComponent: LoadingComponent,
      errorComponent: ErrorComponent,
    } = this.props;
    const { first, canPullDown, pullDownBefore, pullDownStyle, pullUpLoading } = this.state;
    const more = data.length < total;

    return (
      <ViewWrapper className={className} ref={this.ref}>
        <ViewContent style={contentStyle} ref={this.contentRef}>
          <ListContent>
            {(() => {
              if (!data.length && status === "loading") {
                // return <ViewStatus><LoadingComponent /></ViewStatus>
              } else if (!data.length && status === "error") {
                return (
                  <ViewStatus>
                    <ErrorComponent error={error} />
                  </ViewStatus>
                );
              } else if (!data.length && status === "loaded") {
                return (
                  <ViewStatus>
                    <EmptyComponent />
                  </ViewStatus>
                );
              } else {
                return data.map(renderItem);
              }
            })()}
          </ListContent>

          {onPullUpLoad && !!data.length && (
            <Pullup loadingComponent={LoadingComponent} status={status} more={more} />
          )}
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

export default ListView;
