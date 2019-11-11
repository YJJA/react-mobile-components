import { objectType } from './objectType';

export const isArray = (val: any): val is Array<any> =>
  objectType(val) === 'Array';
