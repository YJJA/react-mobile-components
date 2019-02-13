import * as React from 'react';
import styled from 'styled-components';
import {
  Field,
  WrappedFieldInputProps,
  WrappedFieldMetaProps,
  BaseFieldProps,
  GenericFieldHTMLAttributes,
} from 'redux-form';

import { FormControl } from './FormControl';
import Picker from '../Picker';
import uid from '../utils/uid';

const DivControl = FormControl.withComponent('div');

const FormControlWithDiv = styled(DivControl)`
  &.placeholder {
    color: #999;
  }
`;

export interface IFormPickerProps {
  input: WrappedFieldInputProps;
  meta: WrappedFieldMetaProps;
  children?: React.ReactNode;
  placeholder?: string;
}

export interface IFormPickerState {
  uid: string;
  visible: boolean;
}

export class FormPicker extends React.Component<
  IFormPickerProps,
  IFormPickerState
> {
  state = {
    uid: uid('picker'),
    visible: false,
  };

  onShow = () => {
    this.setState({ visible: true });
  };

  onHide = () => {
    this.setState({ visible: false });
  };

  onOk = () => {
    this.setState({ visible: false });
  };

  onChange = (value: any) => {
    this.props.input.onChange(value);
  };

  render() {
    const { placeholder, input } = this.props;
    const { visible, uid } = this.state;

    return (
      <>
        <FormControlWithDiv
          onClick={this.onShow}
          className={input.value ? 'placeholder' : ''}
        >
          {input.value || placeholder}
        </FormControlWithDiv>
        <Picker
          options={[[{ value: 1, label: '调整' }]]}
          visible={visible}
          value={input.value}
          onOk={this.onOk}
          onCancel={this.onHide}
          onChange={this.onChange}
          title={placeholder}
        />
      </>
    );
  }
}

export const PickerField = (
  props: BaseFieldProps & GenericFieldHTMLAttributes
) => {
  return <Field {...props} component={FormPicker} />;
};
