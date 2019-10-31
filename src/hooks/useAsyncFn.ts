import { DependencyList, useState, useCallback } from 'react';

export type AsyncState<T> =
  | {
      loading: boolean;
      error?: undefined;
      value?: T;
    }
  | {
      loading: false;
      error: Error;
      value?: undefined;
    }
  | {
      loading: false;
      error?: undefined;
      value: T;
    };

export function useAsyncFn<Result = any>(
  fn: () => Promise<Result>,
  deps?: DependencyList,
  initialState?: AsyncState<Result>
): [AsyncState<Result>, () => Promise<void>];

export function useAsyncFn<Result = any, Arg = any>(
  fn: (arg: Arg) => Promise<Result>,
  deps?: DependencyList,
  initialState?: AsyncState<Result>
): [AsyncState<Result>, (arg: Arg) => Promise<void>];

export function useAsyncFn<Result = any, Arg1 = any, Arg2 = any>(
  fn: (arg1: Arg1, arg2: Arg2) => Promise<Result>,
  deps?: DependencyList,
  initialState?: AsyncState<Result>
): [AsyncState<Result>, (arg1: Arg1, arg2: Arg2) => Promise<void>];

export function useAsyncFn<Result = any, Arg1 = any, Arg2 = any, Arg3 = any>(
  fn: (arg1: Arg1, arg2: Arg2, arg3: Arg3) => Promise<Result>,
  deps?: DependencyList,
  initialState?: AsyncState<Result>
): [AsyncState<Result>, (arg1: Arg1, arg2: Arg2, arg3: Arg3) => Promise<void>];

export function useAsyncFn(
  fn: any,
  deps: DependencyList = [],
  initialState: AsyncState<any> = { loading: false }
) {
  const [state, set] = useState<AsyncState<any>>(initialState);

  const callback = useCallback((...args: any[]) => {
    set(({ value }) => ({ loading: true, value }));
    return fn(...args).then(
      (value: any) => {
        set({ value, loading: false });
      },
      (error: any) => {
        set({ error, loading: false });
      }
    );
  }, deps);

  return [state, callback];
}
