import * as React from 'react';
import { connect } from 'react-redux';
import { FormName, getFormSyncErrors, getFormMeta } from 'redux-form';

export interface IFormErrorRenderProps {
  errors: IObjectMap;
  metas: IObjectMap;
}

interface IStateProps {
  fields?: string[];
  form: string;
  render(props: IFormErrorRenderProps): React.ReactNode;
}

interface IObjectMap {
  [key: string]: any;
}

const mapStateToProps = (state: any, props: IStateProps) => {
  console.log(getFormMeta(props.form)(state));
  const originalErrors: IObjectMap = getFormSyncErrors(props.form)(state);
  const originalMetas: IObjectMap = getFormMeta(props.form)(state);

  let errors: IObjectMap = {};
  let metas: IObjectMap = {};

  if (props.fields) {
    props.fields.forEach(field => {
      if (originalErrors[field]) {
        errors[field] = originalErrors[field];
      }
      if (originalMetas[field]) {
        metas[field] = originalMetas[field];
      }
    });
  } else {
    errors = originalErrors;
    metas = originalMetas;
  }

  return { errors, metas };
};

const FormErrorRender = ({ render, ...props }: any) => {
  return render(props);
};

const FormErrorRedux = connect(mapStateToProps)(FormErrorRender);

export interface IFormErrorProps {
  fields?: string[];
  render(props: IFormErrorRenderProps): React.ReactNode;
}

export const FormError = (props: IFormErrorProps) => {
  return (
    <FormName>
      {({ form }) => {
        return <FormErrorRedux {...props} form={form} />;
      }}
    </FormName>
  );
};
