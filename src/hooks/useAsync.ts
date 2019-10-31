import { DependencyList, useEffect } from 'react';
import { useAsyncFn, AsyncState } from './useAsyncFn';

export type AsyncStateRetry<T> = AsyncState<T> & {
  retry(): void;
};

export function useAsync<Result = any>(
  fn: () => Promise<Result>,
  deps: DependencyList = []
): AsyncStateRetry<Result> {
  const [state, callback] = useAsyncFn<Result>(fn, deps, {
    loading: true
  });

  useEffect(() => {
    callback();
  }, [callback]);

  return { ...state, retry: callback };
}
