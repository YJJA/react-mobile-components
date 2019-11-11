/**
 * 删除指定索引 index 位置的元素，返回一个新的数组
 * @param index 待删除的元素索引
 * @param arr 数组
 */
export const remove = <T = any>(index: number, arr: T[]): T[] => {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
};
