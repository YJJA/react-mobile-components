import { PlainObject } from './isPlainObject';

const hasOwnProperty = Object.prototype.hasOwnProperty;

export const toPlainObject = (val: any) => {
  const value = Object(val);
  let result: PlainObject = {};
  for (const key in value) {
    if (hasOwnProperty.call(value, key)) {
      result[key] = val[key];
    }
  }
  return result;
};
