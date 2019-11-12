/** type if undefined / null */
export const isNil = (val: any): val is undefined | null => {
  return val === null || typeof val === 'undefined';
};
