import { objectType } from './objectType';

/**
 * is array
 */
export const isArray = (val: any): val is Array<any> =>
  objectType(val) === 'array';
