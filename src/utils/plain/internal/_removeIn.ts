import { isNumber } from '../../types';
import { remove } from '../../array';
import { PlainType, Key } from '../PlainTypes';
import { isPlainObject } from './isPlainObject';
import { isPlainArray } from './isPlainArray';
import { _setIn } from './_setIn';

export const _removeIn = <U extends PlainType>(path: Key[], target: U): U => {
  if (path.length === 0) {
    return target;
  }

  const idx = path[0];
  if (isPlainArray(target)) {
    if (!isNumber(idx) || !Number.isInteger(idx)) {
      return target;
    }
    if (path.length === 1) {
      return remove(idx, target) as U;
    } else {
      const child = target[idx];
      return _setIn([idx], _removeIn(remove(0, path), child), target);
    }
  }

  if (isPlainObject(target)) {
    if (path.length === 1) {
      let result = { ...(target as any) };
      delete result[idx];
      return result;
    } else {
      const child = target[idx];
      return _setIn([idx], _removeIn(remove(0, path), child), target);
    }
  }
  return target;
};
