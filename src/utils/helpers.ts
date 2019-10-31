/** x is undefined */
export const isUndefined = (x: any): x is boolean => typeof x === 'undefined';

/** x is function */
export const isFunction = (x: any): x is (...args: any[]) => any =>
  typeof x === 'function';

/** x is number */
export const isNumber = (x: any): x is number => typeof x === 'number';

/** x is string */
export const isString = (x: any): x is string => typeof x === 'string';

/** x is array */
export const isArray = (x: any): x is any[] => Array.isArray(x);

/** x is object */
export const isObject = <T = any>(x: any): x is { [key: string]: T } => {
  const type = typeof x;
  return x != null && type === 'object';
};

/** last */
export const last = <T>(arr: T[]) => {
  return arr[arr.length - 1];
};
