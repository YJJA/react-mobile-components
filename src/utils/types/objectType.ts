/** 引用数据类型判断 */
export const objectType = (val: any): string => {
  return Object.prototype.toString
    .call(val)
    .slice(8, -1)
    .toLocaleLowerCase();
};
