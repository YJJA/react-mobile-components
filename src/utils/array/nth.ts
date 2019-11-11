/**
 * 获取数组指定索引的值
 * @param indx 索引
 * @param arr 数组
 */
export const nth = <T>(indx: number, arr: T[]): T | undefined => {
  return arr[indx];
};
