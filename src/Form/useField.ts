import { useEffect, useCallback, useMemo } from 'react';

import { formFieldValueSelecter } from './formSelecters';
import { FormContext } from './types';
import { useRefProps } from '../hooks';

type IConfig = {
  onChange?(value: any): any;
};

export const useField = (
  { state, events }: FormContext,
  name: string,
  config: IConfig = {}
) => {
  const configRef = useRefProps(config);

  useEffect(() => {
    events.fieldRegister(name);
    return () => {
      events.fieldUnregister(name);
    };
  }, [name, events]);

  const onChange = useCallback(
    (e: any) => {
      const value = e.currentTarget ? e.currentTarget.value : e;

      events.fieldChange(name, value);
      if (configRef.current.onChange) {
        configRef.current.onChange(value);
      }
    },
    [name, events]
  );

  const onBlur = useCallback(
    (e: any) => {
      const value = e.currentTarget ? e.currentTarget.value : e;
      events.fieldBlur(name, value, true);
    },
    [name, events]
  );

  const onFocus = useCallback(() => {
    events.fieldFocus(name);
  }, [name, events]);

  const value = useMemo(() => formFieldValueSelecter(state, name) || '', [
    state,
    name
  ]);

  return { value, onBlur, onChange, onFocus };
};
