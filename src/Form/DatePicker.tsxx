import * as React from "react";
import styled from "styled-components";
import {
  Field,
  WrappedFieldInputProps,
  WrappedFieldMetaProps,
  BaseFieldProps,
  GenericFieldHTMLAttributes,
} from "redux-form";

import { FormControl } from "./FormControl";
import { Picker } from "../Picker";

const DivControl = FormControl.withComponent("div");

const InputControl = styled(DivControl)`
  border: none;

  &.prefix {
    padding-left: 0.84rem;
  }

  .placeholder & {
    color: #999;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  border: 1px solid #ccc;
  border-radius: 0.1rem;
`;

export const InputPrefix = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 0.84rem;
  line-height: 0.84rem;
  text-align: center;
`;

export interface IFormPickerProps {
  input: WrappedFieldInputProps;
  meta: WrappedFieldMetaProps;
  children?: React.ReactNode;
  placeholder?: string;
  className?: string;
  prefix?: React.ReactNode;
}

export interface IFormPickerOption {
  label: string;
  value: any;
}

export type IFormPickerOptions = IFormPickerOption[];

export interface IFormPickerState {
  visible: boolean;
  options: IFormPickerOptions[];
}

function getYears(year?: number) {
  const fullYear = year || new Date().getFullYear();
  return Array(100)
    .fill(1)
    .map((v, i) => ({
      label: fullYear - i + "",
      value: fullYear - i,
    }));
}

function getMonths() {
  const month = 1;
  return Array(12)
    .fill(1)
    .map((v, i) => ({
      label: month + i + "",
      value: month + i,
    }));
}

function getDays(year: number, month: number = 1) {
  const days = new Date(year, month, 0).getDate();
  return Array(days)
    .fill(1)
    .map((v, i) => ({
      label: 1 + i + "",
      value: 1 + i,
    }));
}

export class FormPicker extends React.Component<IFormPickerProps, IFormPickerState> {
  date: Date = new Date();

  year: number = this.date.getFullYear();
  month: number = this.date.getMonth() + 1;
  day: number = this.date.getDate();

  state: IFormPickerState = {
    visible: false,
    options: [getYears(this.year), getMonths(), getDays(this.year, this.month)],
  };

  onShow = () => {
    this.setState({ visible: true });
  };

  onHide = () => {
    this.setState({ visible: false });
  };

  onOk = (value: any) => {
    this.setState({ visible: false });
    this.props.input.onChange(value);
  };

  onChange = (value: any) => {
    const [year, month] = value;
    const { options } = this.state;
    options[2] = getDays(year, month);
    this.setState({
      ...this.state,
      options: [...options],
    });
  };

  valueToString(value: any) {
    if (Array.isArray(value)) {
      return value.join("-");
    }
  }

  render() {
    const { placeholder, input, className, prefix } = this.props;
    const { visible, options } = this.state;

    return (
      <>
        <InputWrapper
          onClick={this.onShow}
          className={!input.value ? className + " placeholder" : className}
        >
          {prefix && <InputPrefix>{prefix}</InputPrefix>}
          <InputControl className={prefix ? "prefix" : ""}>
            {this.valueToString(input.value) || placeholder}
          </InputControl>
        </InputWrapper>
        <Picker
          options={options}
          visible={visible}
          value={input.value}
          defaultValue={[this.year, this.month, this.day]}
          onOk={this.onOk}
          onCancel={this.onHide}
          onChange={this.onChange}
          title={placeholder}
        />
      </>
    );
  }
}

export const DatePickerField = (props: BaseFieldProps & GenericFieldHTMLAttributes) => {
  return <Field {...props} component={FormPicker} />;
};
