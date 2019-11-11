import { Key, PlainObject, PlainArray } from './PlainTypes';
import { _removeIn } from './internal/_removeIn';

/** removeIn */
export const removeIn = <U extends PlainArray | PlainObject>(
  path: Key[],
  target: U
): U => {
  return _removeIn(path, target);
};
