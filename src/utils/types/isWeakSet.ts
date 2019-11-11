import { objectType } from './objectType';
export const isWeakSet = (val: any): val is WeakSet<any> =>
  objectType(val) === 'WeakSet';
