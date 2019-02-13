import * as React from "react";
import styled from "styled-components";

import { ThreeBounce } from "../Loading";

export const ViewWrapper = styled.div`
  position: relative;
  flex: 1;
  overflow: hidden;
`;

export const ViewContent = styled.div`
  min-height: 100.02%;
`;

const PulldownWrapper = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all;
  height: 40px;
  line-height: 20px;
  color: #999;
`;

export interface IPulldownProps {
  first?: boolean;
  canPullDown?: boolean;
  loadingComponent?: React.ComponentType<any>;
  before?: boolean;
  style?: React.CSSProperties;
  status?: string;
}

export function Pulldown({
  first,
  canPullDown,
  style,
  before,
  status,
  loadingComponent: LoadingComponent = ThreeBounce,
}: IPulldownProps) {
  return (
    <PulldownWrapper style={style}>
      {(() => {
        const loading = <LoadingComponent key="loading" />;
        if (before && first) {
          return loading;
        } else {
          if (before) {
            if (canPullDown) {
              return <span>释放刷新</span>;
            } else {
              return <span>下拉刷新</span>;
            }
          } else {
            const text = first ? "加载" : "刷新";
            if (status === "loaded") {
              return (
                <span>
                  {text}
                  成功
                </span>
              );
            } else if (status === "error") {
              return (
                <span>
                  {text}
                  失败, 请重试
                </span>
              );
            } else if (status === "loading") {
              console.log("status loading...");
              return loading;
            }
          }
        }
      })()}
    </PulldownWrapper>
  );
}

export const ViewStatus = styled.div`
  /* padding-top: 20%; */
  text-align: center;
  color: #999;
`;

const PullupWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  color: #999;
`;

export interface IPullupProps {
  loadingComponent?: React.ComponentType<any>;
  status?: string;
  more?: boolean;
}

export function Pullup({
  status,
  more,
  loadingComponent: LoadingComponent = ThreeBounce,
}: IPullupProps) {
  return (
    <PullupWrapper>
      {(() => {
        if (more) {
          if (status === "loading") {
            return <LoadingComponent />;
          } else {
            return <span>上拉加载</span>;
          }
        } else {
          return <span>没有更多数据了</span>;
        }
      })()}
    </PullupWrapper>
  );
}

export function EmptyComponent() {
  return <span>暂无数据</span>;
}

export function LoadingComponent() {
  return <ThreeBounce />;
}

export function ErrorComponent() {
  return <span>数据加载出错了...</span>;
}
