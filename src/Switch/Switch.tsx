import React, { useCallback } from 'react';
import styled from 'styled-components';

const SwitchInputCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  border: 0 none;
  appearance: none;
`;

const SwitchCheckbox = styled.div`
  width: 51px;
  height: 31px;
  border-radius: 31px;
  background: #e5e5e5;
  z-index: 0;
  margin: 0;
  padding: 0;
  appearance: none;
  border: 0;
  transition: all 0.3s;
  box-sizing: border-box;
  position: relative;
  cursor: pointer;

  &::before,
  &::after {
    content: ' ';
    position: absolute;
    left: 1.5px;
    top: 1.5px;
    height: 28px;
    border-radius: 28px;
    background: #fff;
    transition: all 0.2s;
  }

  &::before {
    width: 48px;
    box-sizing: border-box;
    z-index: 1;
    transform: scale(1);
  }

  &::after {
    width: 28px;
    z-index: 2;
    transform: translateX(0);
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.21);
  }
`;

const SwitchWrapper = styled.div`
  display: inline-block;
  vertical-align: middle;
  align-self: center;
  box-sizing: border-box;
  position: relative;
  cursor: pointer;

  ${SwitchInputCheckbox}:checked + ${SwitchCheckbox} {
    background: #4dd865;

    &::before {
      transform: scale(0);
    }

    &::after {
      transform: translateX(20px);
    }
  }
`;

export type SwitchProps = {
  value: boolean | undefined;
  onChange(value: boolean): void;
  color?: string;
};

export const Switch: React.FC<SwitchProps> = props => {
  const { value = false, onChange, color = '#4dd865' } = props;

  const checkboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      onChange(checked);
    },
    [onChange]
  );

  return (
    <SwitchWrapper>
      <SwitchInputCheckbox checked={value} onChange={checkboxChange} />
      <SwitchCheckbox style={{ backgroundColor: color }} />
    </SwitchWrapper>
  );
};
