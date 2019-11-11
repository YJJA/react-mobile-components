import { objectType } from './objectType';
export const isError = (val: any): val is Error => objectType(val) === 'Error';
