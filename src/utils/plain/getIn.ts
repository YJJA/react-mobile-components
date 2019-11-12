import { Path } from './types';
import { isNil } from '../types';

export const getIn = <T = any>(path: Path, object: any): T | undefined => {
  if (isNil(object)) {
    return undefined;
  }

  if (path.length === 0) {
    return undefined;
  }

  const [key, ...cpath] = path;
  const child = object[key];
  if (path.length === 1) {
    return child;
  }

  return getIn(cpath, child);
};
