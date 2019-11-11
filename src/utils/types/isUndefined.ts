/** 基本数据类型判断 */
export const isUndefined = (val: any): val is undefined =>
  typeof val === 'undefined';
