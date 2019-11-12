import { objectType } from './objectType';

/**
 * map
 */
export const isMap = (val: any): val is Map<any, any> =>
  objectType(val) === 'Map';
