/**
 * 获取数组的最后一个元素
 * @param arr 数组
 */
export const last = <T>(arr: T[]): T | undefined => {
  return arr[arr.length - 1];
};
