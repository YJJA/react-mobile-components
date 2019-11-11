import { objectType } from './objectType';
export const isDate = (val: any): val is Date => objectType(val) === 'Date';
