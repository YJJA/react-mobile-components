/**
 * use form
 */
import { useReducer, useMemo, useEffect, useCallback } from 'react';
import {
  fieldChange,
  fieldBlur,
  fieldFocus,
  fieldRegister,
  fieldUnregister,
  formInitial,
  formSubmitStart,
  formSubmitSuccessed,
  formSubmitFailed,
  formErrors,
  fieldTouch
} from './formActions';

import { formReducer } from './formReduce';
import { formFieldValueSelecter } from './formSelecters';

import { bindActionCreator } from './utils';
import { FormStateValues, FormContext } from './types';
import { useRefProps } from '../hooks';

export type UseFormProps = {
  initial?: { [key: string]: any };
  onSubmit?(values: FormStateValues): any;
  validate?(values: FormStateValues, extra?: any): any;
  extra?: { [key: string]: any };
};

/**
 * useForm
 */
export const useForm = (props: UseFormProps = {}) => {
  const [state, dispatch] = useReducer(formReducer, {});
  const propsRef = useRefProps(props);
  const stateRef = useRefProps(state);

  /** 初始化表单值 */
  useEffect(() => {
    if (props.initial) {
      dispatch(formInitial(props.initial));
    }
  }, [props.initial]);

  /** 较验值表单值 */
  useEffect(() => {
    if (propsRef.current.validate) {
      const errors = propsRef.current.validate(
        state.values || {},
        propsRef.current.extra || {}
      );

      dispatch(formErrors(errors));
    }
  }, [state.values]);

  /** events */
  const events = useMemo(() => {
    return {
      fieldChange: bindActionCreator(fieldChange, dispatch),
      fieldBlur: bindActionCreator(fieldBlur, dispatch),
      fieldFocus: bindActionCreator(fieldFocus, dispatch),
      fieldTouch: bindActionCreator(fieldTouch, dispatch),
      fieldRegister: bindActionCreator(fieldRegister, dispatch),
      fieldUnregister: bindActionCreator(fieldUnregister, dispatch)
    };
  }, []);

  /** 表单提交 */
  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const onSubmit = propsRef.current.onSubmit;
    if (!onSubmit) {
      return;
    }
    const state = stateRef.current;
    const values = state.values || {};

    dispatch(formSubmitStart());
    Promise.resolve(onSubmit(values))
      .then(() => {
        dispatch(formSubmitSuccessed());
      })
      .catch(() => {
        dispatch(formSubmitFailed());
      });
  }, []);

  /** 清除值 */
  const setFieldValue = useCallback(
    (field: string, value: any) => {
      events.fieldChange(field, value);
    },
    [events]
  );

  /** 获取值 */
  const getFieldValue = useCallback((field: string) => {
    const state = stateRef.current;
    return formFieldValueSelecter(state, field);
  }, []);

  return {
    state,
    events,
    onSubmit,
    setFieldValue,
    getFieldValue
  } as FormContext;
};
