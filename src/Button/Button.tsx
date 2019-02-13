import * as React from "react";
import styled, { css } from "styled-components";

export interface IButtonProps {
  primary?: boolean;
  danger?: boolean;
}

export const Button = styled("button")<IButtonProps>`
  display: block;
  width: 100%;
  padding: 0.24rem 0.24rem;
  margin-bottom: 0;
  font-size: 0.28rem;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  touch-action: manipulation;
  cursor: pointer;
  user-select: none;
  background-image: none;
  border: 1px solid #c5c5c5;
  border-radius: 0.1rem;
  outline: none;

  ${props =>
    props.primary &&
    css`
      color: #fff;
      background-color: #1890ff;
      border-color: #1890ff;
    `}

  ${props =>
    props.danger &&
    css`
      color: #fff;
      background-color: #ff5111;
      border-color: #ff5111;
    `}

  &[disabled] {
    color: #fff;
    background-color: #c5c5c5;
    border-color: #c5c5c5;
  }
`;
