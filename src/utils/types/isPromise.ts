import { objectType } from './objectType';
export const isPromise = (val: any): val is Promise<any> =>
  objectType(val) === 'Promise';
