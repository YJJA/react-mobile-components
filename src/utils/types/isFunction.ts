// tslint:disable-next-line:ban-types
export const isFunction = (val: any): val is Function =>
  typeof val === 'function';
