import { isArray } from '../../types';
import { PlainType, PlainArray } from '../PlainTypes';

export const isPlainArray = (val: PlainType): val is PlainArray => isArray(val);
