import { objectType } from './objectType';

const reTypedTag = /^\(?:float(?:32|64)|(?:int|uint)(?:8|16|32)|uint8clamped)array$/;

export const isTypedArray = (val: any) => {
  const type = objectType(val);
  return reTypedTag.test(type);
};
