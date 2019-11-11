import { PlainArray, PlainObject, Key } from './PlainTypes';
import { _hasIn } from './internal/_hasIn';

/** hasIn */
export const hasIn = <U extends PlainArray | PlainObject>(
  path: Key[],
  target: U
): boolean => {
  return _hasIn(path, target);
};
