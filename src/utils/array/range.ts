/**
 * 创建一个 从 from（包含）到 to(不包含) 的数组
 * @param from 开始的值（包含）
 * @param to 结束的值（不包含）
 */
export const range = (from: number, to: number): number[] => {
  let result: number[] = [];
  let n = from;
  while (n < to) {
    result.push(n);
    n += 1;
  }
  return result;
};
