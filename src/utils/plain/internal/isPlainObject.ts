import { isObject, objectType } from '../../types';
import { PlainType, PlainObject } from '../PlainTypes';

export const isPlainObject = (val: PlainType): val is PlainObject => {
  if (!isObject(val) || objectType(val) !== 'Object') {
    return false;
  }
  if (Object.getPrototypeOf(val) === null) {
    return true;
  }
  let proto = val;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(val) === proto;
};
