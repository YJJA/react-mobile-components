import { useState, useCallback } from 'react';

export const useBoolean = (initialValue: boolean = false) => {
  const [state, setState] = useState(initialValue);

  const toggle = useCallback((nextValue?: any) => {
    if (typeof nextValue === 'boolean') {
      setState(nextValue);
    } else {
      setState(prevValue => !prevValue);
    }
  }, []);

  return [state, toggle] as const;
};
