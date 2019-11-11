import { PlainType, PlainSigle } from '../PlainTypes';
import { isPlainObject } from './isPlainObject';
import { isPlainArray } from './isPlainArray';

export const isPlainSigle = (val: PlainType): val is PlainSigle => {
  return !isPlainObject(val) && !isPlainArray(val);
};
