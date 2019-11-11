import { PlainType, Key, PlainArray, PlainObject } from './PlainTypes';
import { _getIn } from './internal/_getIn';

/** getIn */
export const getIn = <T extends PlainType, U extends PlainArray | PlainObject>(
  path: Key[],
  target: U
): T => {
  return _getIn(path, target);
};
