import { objectType } from './objectType';
export const isWeakMap = (val: any): val is WeakMap<any, any> =>
  objectType(val) === 'WeakMap';
