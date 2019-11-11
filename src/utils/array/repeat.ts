/**
 * 创建一个 有 count 长度的元素为 element 的数组
 * @param element 将要放入数组中的元素
 * @param count 数组的长度
 */
export const repeat = <T>(element: T, count: number): T[] => {
  return Array(count).fill(element);
};
