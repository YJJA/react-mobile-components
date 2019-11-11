import {
  AnimationValueType,
  AnimationObjectValue,
  AnimationArrayValue
} from './AnimationTypes';
import {
  isArray,
  isObject,
  isString,
  isNumber,
  isUndefined
} from '../utils/types';
import { parseString } from './parseString';

/** Calculate Number */
function calculateNumber<T extends number>(
  from: T,
  to: T,
  progress: number
): T {
  return (from + (to - from) * progress) as T;
}

const isAnimationObjectValue = (
  val: AnimationValueType
): val is AnimationObjectValue => isObject(val);

const isAnimationArrayValue = (
  val: AnimationValueType
): val is AnimationArrayValue => isArray(val);

/** Calculate String */
function calculateString<T extends string>(
  from: T,
  to: T,
  progress: number
): T {
  const res = parseString(from, to);
  if (res.type === 'match') {
    const value = calculate(res.fromValue, res.toValue, progress);
    return res.render(value) as T;
  }
  return from;
}

/** calculate */
export function calculate<T extends AnimationValueType>(
  from: T,
  to: T | undefined,
  progress: number
): T {
  if (from === to || progress === 0) {
    return from;
  }

  if (isUndefined(to)) {
    return from;
  }

  if (isAnimationArrayValue(from) && isAnimationArrayValue(to)) {
    return from.map((f, k) => {
      const t = to[k] as T;
      return calculate(f, t, progress);
    }) as T;
  }

  if (isNumber(from) && isNumber(to)) {
    return calculateNumber(from, to, progress) as T;
  }

  if (isString(from) && isString(to)) {
    return calculateString(from, to, progress) as T;
  }

  if (isAnimationObjectValue(from) && isAnimationObjectValue(to)) {
    return Object.keys(from).reduce<{ [key: string]: AnimationValueType }>(
      (result, k) => {
        const f = from[k];
        const t = to[k];
        const val = calculate(f, t, progress);

        result[k] = val;
        return result;
      },
      {}
    ) as T;
  }

  throw new TypeError('Unknown AnimationValueType!');
}
