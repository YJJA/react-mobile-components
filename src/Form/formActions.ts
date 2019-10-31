import {
  FORM_FIELD_CHANGE,
  FORM_FIELD_BLUR,
  FORM_FIELD_FOCUS,
  FORM_FIELD_TOUCH,
  FORM_FIELD_REGISTER,
  FORM_FIELD_UNREGISTER,
  FORM_INITIAL,
  FORM_SUBMIT_START,
  FORM_SUBMIT_FAILED,
  FORM_SUBMIT_SUCCESSED,
  FORM_RESET,
  FORM_ERRORS
} from './formActionType';
import { FormStateInitial } from './types';

export const fieldChange = (field: string, value: any, touch?: boolean) => {
  return {
    type: FORM_FIELD_CHANGE,
    meta: { field, touch },
    payload: value
  };
};

export const fieldBlur = (field: string, value: any, touch: boolean) => {
  return {
    type: FORM_FIELD_BLUR,
    meta: { field, touch },
    payload: value
  };
};

export const fieldFocus = (field: string) => {
  return {
    type: FORM_FIELD_FOCUS,
    meta: { field }
  };
};

export const fieldTouch = (fields: string[]) => {
  return {
    type: FORM_FIELD_TOUCH,
    meta: { fields }
  };
};

export const fieldRegister = (field: string, type?: string) => {
  return {
    type: FORM_FIELD_REGISTER,
    meta: { field, type }
  };
};

export const fieldUnregister = (field: string) => {
  return {
    type: FORM_FIELD_UNREGISTER,
    meta: { field }
  };
};

export const formInitial = (initial: FormStateInitial) => {
  return {
    type: FORM_INITIAL,
    payload: { initial }
  };
};

export const formSubmitStart = () => {
  return {
    type: FORM_SUBMIT_START
  };
};

export const formSubmitFailed = () => {
  return {
    type: FORM_SUBMIT_FAILED
  };
};

export const formSubmitSuccessed = () => {
  return {
    type: FORM_SUBMIT_SUCCESSED
  };
};

export const formReset = () => {
  return {
    type: FORM_RESET
  };
};

export const formErrors = (payload: { [key: string]: any }) => {
  return {
    type: FORM_ERRORS,
    payload
  };
};
