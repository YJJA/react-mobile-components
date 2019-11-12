import { range } from '../range';

describe('Use Array range Function', () => {
  test('生成 0 -> 0 的数组', () => {
    expect(range(0, 0)).toEqual([]);
  });

  test('生成 0 -> -1 的数组', () => {
    expect(range(0, -1)).toEqual([]);
  });

  test('生成 0 -> 3 的数组', () => {
    expect(range(0, 3)).toEqual([0, 1, 2]);
  });
});
