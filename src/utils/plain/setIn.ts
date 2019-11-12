import { Path } from './types';
import { isObject, isNumber, isArray } from '../types';
import { replace } from '../array';

export const setIn = <U extends any>(path: Path, value: any, object: U): U => {
  if (!isObject(object)) {
    return object;
  }

  if (path.length === 0) {
    return object;
  }

  const [key, ...cpath] = path;
  if (path.length > 1) {
    let child = object[key];
    if (!isObject(child)) {
      const ckey = cpath[0];
      child = isNumber(ckey) && Number.isInteger(ckey) ? [] : {};
    }
    value = setIn(cpath, value, child);
  }

  if (isNumber(key) && Number.isInteger(key) && isArray(object)) {
    return replace(key, value, object) as any;
  }

  return { ...object, [key]: value };
};
