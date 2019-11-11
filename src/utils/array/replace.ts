/**
 * 使用 element 替换 index 位置的元素， 返回一个新的数组
 * @param index 待替换的元素的位置
 * @param element 元素
 * @param arr 数组
 */
export const replace = <T>(index: number, element: T, arr: T[]) => {
  return [...arr.slice(0, index), element, ...arr.slice(index + 1)];
};
