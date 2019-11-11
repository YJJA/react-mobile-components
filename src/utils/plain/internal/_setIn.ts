import { isNumber } from '../../types';
import { remove, replace } from '../../array';
import { PlainType, Key } from '../PlainTypes';
import { isPlainObject } from './isPlainObject';
import { isPlainArray } from './isPlainArray';
import { isPlainSigle } from './isPlainSigle';

export const _setIn = <U extends PlainType>(
  path: Key[],
  value: PlainType,
  target: U
): U => {
  if (path.length === 0) {
    return target;
  }

  const idx = path[0];
  if (isPlainArray(target)) {
    if (!isNumber(idx) || !Number.isInteger(idx)) {
      throw new TypeError('Path is not an index of an array');
    }
    if (path.length > 1) {
      const child = target[idx];
      value = _setIn(remove(0, path), value, child);
    }
    return replace(idx, value, target) as U;
  }

  if (isPlainObject(target)) {
    if (path.length > 1) {
      const child = target[idx];
      value = _setIn(remove(0, path), value, child);
    }
    return { ...(target as object), [idx]: value } as U;
  }

  if (isPlainSigle(target)) {
    if (path.length > 1) {
      if (isNumber(idx) && Number.isInteger(idx)) {
        value = _setIn(remove(0, path), value, []);
      } else {
        value = _setIn(remove(0, path), value, {});
      }
    }
    if (isNumber(idx) && Number.isInteger(idx)) {
      return replace(idx, value, []) as U;
    } else {
      return { [idx]: value } as U;
    }
  }
  return target;
};
