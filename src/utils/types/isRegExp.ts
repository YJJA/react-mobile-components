import { objectType } from './objectType';
export const isRegExp = (val: any): val is RegExp =>
  objectType(val) === 'RegExp';
