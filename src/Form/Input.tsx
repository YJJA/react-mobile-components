import * as React from 'react';
import styled from 'styled-components';
import {
  Field,
  WrappedFieldProps,
  BaseFieldProps,
  GenericFieldHTMLAttributes,
} from 'redux-form';

import { FormControl } from './FormControl';

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  border: 1px solid #ccc;
  border-radius: 0.1rem;
`;

const InputControl = styled(FormControl)`
  border: none;

  &.prefix {
    padding-left: 0.84rem;
  }
`;

const InputAddon = styled.div``;

export interface IInputControlProps extends WrappedFieldProps {
  prefix?: boolean;
}

export const Input = ({
  input,
  meta,
  prefix,
  ...props
}: IInputControlProps) => {
  return (
    <InputControl {...input} {...props} className={prefix ? 'prefix' : ''} />
  );
};

export const InputPrefix = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 0.84rem;
  line-height: 0.84rem;
  text-align: center;
`;

export interface IInputProps {
  className?: string;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  prefix?: React.ReactNode;
}

export const InputField = ({
  className,
  prefix,
  addonBefore,
  addonAfter,
  ...props
}: IInputProps & BaseFieldProps & GenericFieldHTMLAttributes) => {
  return (
    <InputWrapper className={className}>
      {prefix && <InputPrefix>{prefix}</InputPrefix>}
      {addonBefore && <InputAddon>{addonBefore}</InputAddon>}
      <Field {...props} prefix={!!prefix} component={Input} />
      {addonAfter && <InputAddon>{addonAfter}</InputAddon>}
    </InputWrapper>
  );
};
