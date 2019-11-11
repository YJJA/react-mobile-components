import { PlainType, PlainObject, PlainArray, Key } from './PlainTypes';
import { _setIn } from './internal/_setIn';

/** setIn */
export const setIn = <U extends PlainArray | PlainObject>(
  path: Key[],
  value: PlainType,
  target: U
): U => {
  return _setIn(path, value, target);
};
