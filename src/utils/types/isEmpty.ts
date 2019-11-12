import { isNil } from './isNil';
import { isString } from './isString';
import { isArray } from './isArray';
import { isSet } from './isSet';
import { isMap } from './isMap';
import { isEmptyObject } from './internal/isEmptyObject';
import { isEmptyArray } from './internal/isEmptyArray';
import { isObjectLike } from './isObjectLike';
/**
 * 判断一个值是否为空
 * 未定义(undefined) / null / 空字符串('') / 空数组([]) / 空 Set/Map / 空对象({})
 */
export const isEmpty = (val: any): boolean => {
  if (isNil(val)) {
    return true;
  }
  if (isString(val)) {
    return val.length === 0;
  }
  if (isArray(val)) {
    return isEmptyArray(val);
  }
  if (isSet(val) || isMap(val)) {
    return val.size === 0;
  }
  if (isObjectLike(val)) {
    return isEmptyObject(val);
  }
  return false;
};
