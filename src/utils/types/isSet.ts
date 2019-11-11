import { objectType } from './objectType';
export const isSet = (val: any): val is Set<any> => objectType(val) === 'Set';
