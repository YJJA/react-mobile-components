import * as React from "react";
import styled from "styled-components";

export const ViewPageWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
`;

export interface IViewPageProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export function ViewPage({ title, className, children }: IViewPageProps) {
  return <ViewPageWrapper className={className}>{children}</ViewPageWrapper>;
}
