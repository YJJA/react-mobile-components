import { isObjectLike } from './isObjectLike';
import { objectType } from './objectType';

export type PlainObject<T = any> = {
  [key: string]: T;
};

export const isPlainObject = (val: any): val is PlainObject => {
  if (!isObjectLike(val) || objectType(val) !== 'object') {
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
