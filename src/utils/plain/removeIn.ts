import { isObject, isNumber, isArray } from '../types';
import { Path } from './types';
import { setIn } from './setIn';
import { remove } from '../array';

const hasOwnProperty = Object.prototype.hasOwnProperty;

export const removeIn = <U extends any>(path: Path, object: U): U => {
  if (!isObject(object)) {
    return object;
  }

  if (path.length === 0) {
    return object;
  }

  const [key, ...cpath] = path;
  if (path.length === 1) {
    if (!hasOwnProperty.call(object, key)) {
      return object;
    }

    if (isNumber(key) && Number.isInteger(key) && isArray(object)) {
      return remove(key, object) as any;
    }

    let result = { ...object };
    delete result[key];
    return result;
  }

  return setIn([key], removeIn(cpath, object[key]), object);
};
