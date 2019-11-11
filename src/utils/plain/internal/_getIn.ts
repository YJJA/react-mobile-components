import { isNumber } from '../../types';
import { remove } from '../../array';
import { PlainType, Key } from '../PlainTypes';
import { isPlainObject } from './isPlainObject';
import { isPlainArray } from './isPlainArray';

export const _getIn = <T extends PlainType, U extends PlainType>(
  path: Key[],
  target: U
): T => {
  if (path.length === 0) {
    return undefined as T;
  }
  const idx = path[0];
  if (isPlainArray(target)) {
    if (!isNumber(idx) || !Number.isInteger(idx)) {
      return undefined as T;
    }
    const child = target[idx];
    if (path.length === 1) {
      return child as T;
    } else {
      return _getIn(remove(0, path), child);
    }
  }
  if (isPlainObject(target)) {
    const child = target[idx];
    if (path.length === 1) {
      return child as T;
    } else {
      return _getIn(remove(0, path), child);
    }
  }
  return undefined as T;
};
