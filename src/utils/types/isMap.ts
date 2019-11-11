import { objectType } from './objectType';
export const isMap = (val: any): val is Map<any, any> =>
  objectType(val) === 'Map';
