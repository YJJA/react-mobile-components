import styled, { css } from 'styled-components';
import { darken, lighten } from 'polished';

export type ButtonProps = {
  block?: boolean;
  primary?: boolean;
  danger?: boolean;
};

const primaryCss = css`
  color: #fff;
  background-color: #1890ff;
  border-color: #1890ff;

  &:active {
    background-color: ${darken(0.1, '#1890ff')};
    border-color: ${darken(0.1, '#1890ff')};
  }

  &:disabled {
    color: ${lighten(0.2, '#fff')};
    background-color: ${lighten(0.2, '#1890ff')};
    border-color: ${lighten(0.2, '#1890ff')};
  }
`;

const dangerCss = css`
  color: #fff;
  background-color: #ff5111;
  border-color: #ff5111;

  &:active {
    background-color: ${darken(0.1, '#ff5111')};
    border-color: ${darken(0.1, '#ff5111')};
  }

  &:disabled {
    color: ${lighten(0.2, '#fff')};
    background-color: ${lighten(0.2, '#ff5111')};
    border-color: ${lighten(0.2, '#ff5111')};
  }
`;

const blockCss = css`
  display: block;
  width: 100%;
`;

export const Button = styled.button<ButtonProps>`
  padding: 10px 12px;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  touch-action: manipulation;
  cursor: pointer;
  user-select: none;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fff;
  outline: none;

  &:active {
    background-color: ${darken(0.1, '#fff')};
  }

  &:disabled {
    cursor: default;
    color: #fff;
    background-color: #ddd;
    border-color: #ddd;
  }

  ${props => props.block && blockCss}
  ${props => props.primary && primaryCss}
  ${props => props.danger && dangerCss}
`;
