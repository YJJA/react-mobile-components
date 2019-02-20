import * as React from "react";
import styled from "styled-components";
import R from "ramda";
import {
  createFormState,
  formReducer,
  IFormState,
  IAnyAction,
  mapDispatch,
  fieldChange,
  fieldBlur,
  fieldFocus,
} from "./formReducer";

export interface IFormProps {
  children: React.ReactChild;
}

export interface IFormCreateProps {
  name: string;
}

export interface IFormWrappedProps {
  onSubmit(): void;
  children: React.ReactChild;
}

export interface IFormContext {
  state: IFormState;
  dispatch: React.Dispatch<IAnyAction>;
}

const StyledForm = styled.form``;

export const FormContext = React.createContext<IFormContext | null>(null);

export const Form = ({ children }: IFormProps) => {
  return <StyledForm>{children}</StyledForm>;
};

Form.create = ({ name }: IFormCreateProps) => (
  WrappedFormComponent: React.ComponentType<IFormWrappedProps>
) => {
  const FormWrapper = (props: IFormWrappedProps) => {
    const [state, dispatch] = React.useReducer(formReducer, name, createFormState);
    const formContext = React.useMemo(
      () => ({
        state,
        dispatch,
      }),
      [state, dispatch]
    );

    return (
      <FormContext.Provider value={formContext}>
        <WrappedFormComponent {...props} />
      </FormContext.Provider>
    );
  };

  return FormWrapper;
};

export interface IFieldComponentProps {
  name: string;
  active?: boolean;
  touched?: boolean;
  error?: any;
  initial?: any;
  value: any;
  dirty: boolean; // 字段值与初始值更改，则为true
  pristine: boolean; // 字段值与初始值相同，则为true
  valid: boolean;
  invalid: boolean;
  onChange: (field: string, value: any, touch?: boolean) => void;
  onBlur: (field: string, value: any, touch: boolean) => void;
  onFocus: (field: string) => void;
}

export interface IFieldProps<P = {}> {
  name: string;
  component: React.ComponentType<{ field: IFieldComponentProps } & P>;
  [key: string]: any;
}

const getComponentProps = (
  name: string,
  state: IFormState,
  dispatch: React.Dispatch<IAnyAction>
): IFieldComponentProps => {
  const active = R.path<boolean>(["fields", name, "active"], state);
  const touched = R.path<boolean>(["fields", name, "touched"], state);
  const error = R.path<any>(["errors", name], state);
  const initial = R.path<any>(["initial", name], state);
  const value = R.path<any>(["value", name], state);

  const dirty = initial !== value;
  const pristine = !dirty;
  const valid = !error;
  const invalid = !valid;

  const onChange = mapDispatch(dispatch, fieldChange);
  const onBlur = mapDispatch(dispatch, fieldBlur);
  const onFocus = mapDispatch(dispatch, fieldFocus);

  return {
    name,
    active,
    touched,
    error,
    initial,
    dirty,
    value,
    pristine,
    valid,
    invalid,

    onChange,
    onBlur,
    onFocus,
  };
};

export const Field = ({ name, component: Component, ...props }: IFieldProps) => {
  const formContext = React.useContext(FormContext);
  if (!formContext) {
    throw new Error("Form.create is not");
  }

  const { state, dispatch } = formContext;
  const field = React.useMemo(() => getComponentProps(name, state, dispatch), [
    name,
    state,
    dispatch,
  ]);
  return <Component {...props} field={field} />;
};
