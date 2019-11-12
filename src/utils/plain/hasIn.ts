import { Path } from './types';
import { isNil } from '../types';

const hasOwnProperty = Object.prototype.hasOwnProperty;

export const hasIn = (path: Path, object: any): boolean => {
  if (isNil(object)) {
    return false;
  }

  if (path.length === 0) {
    return false;
  }

  const [key, ...cpath] = path;
  const hasKey = hasOwnProperty.call(object, key);
  if (path.length === 1) {
    return hasKey;
  }

  if (!hasKey) {
    return false;
  }

  return hasIn(cpath, object[key]);
};
