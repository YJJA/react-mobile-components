import { objectType } from './objectType';

/**
 * is error
 */
export const isError = (val: any): val is Error => objectType(val) === 'Error';
