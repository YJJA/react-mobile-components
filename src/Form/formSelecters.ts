import * as R from 'ramda';

import { FormState, FormFieldState } from './types';

/** selecter */
export const formFieldValueSelecter = (state: FormState, field: string) => {
  return R.path<any>(['values', field], state);
};

export const formFieldErrorSelecter = (state: FormState, field: string) => {
  return R.path<any>(['errors', field], state);
};

export const formFieldMetaSelecter = (state: FormState, field: string) => {
  return R.path<FormFieldState>(['fields', field], state) || {};
};
