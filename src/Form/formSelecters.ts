import { FormState, FormFieldState } from './types';
import { getIn } from '../utils/plain';

/** selecter */
export const formFieldValueSelecter = (state: FormState, field: string) => {
  return getIn(['values', field], state);
};

export const formFieldErrorSelecter = (state: FormState, field: string) => {
  return getIn(['errors', field], state);
};

export const formFieldMetaSelecter = (state: FormState, field: string) => {
  return getIn<FormFieldState>(['fields', field], state) || {};
};
