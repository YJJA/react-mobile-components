export const isObjectLike = (val: any): val is object => {
  return val !== null && typeof val === 'object';
};
