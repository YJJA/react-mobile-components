import { isNumber } from '../../types';
import { PlainType, Key } from '../PlainTypes';
import { isPlainObject } from './isPlainObject';
import { remove } from '../../array';
import { isPlainArray } from './isPlainArray';

export const _hasIn = <U extends PlainType>(
  path: Key[],
  target: U
): boolean => {
  if (isPlainArray(target)) {
    const prop = path[0];
    if (!isNumber(prop) || !Number.isInteger(prop)) {
      return false;
    }
    if (path.length === 1) {
      return target.hasOwnProperty(prop);
    }
    return _hasIn(remove(0, path), target[prop]);
  }
  if (isPlainObject(target)) {
    const prop = path[0];
    if (path.length === 1) {
      return target.hasOwnProperty(prop);
    }
    return _hasIn(remove(0, path), target[prop]);
  }
  return false;
};
