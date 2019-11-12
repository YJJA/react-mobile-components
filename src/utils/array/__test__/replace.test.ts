import { replace } from '../replace';

describe('Use Array replace Function', () => {
  test('replace 长度为 3 数组中索引为 0 的元素', () => {
    expect(replace(0, 100, [1, 2, 3])).toEqual([100, 2, 3]);
  });

  test('replace 长度为 3 数组中索引为 -1 的元素', () => {
    expect(replace(-1, 100, [1, 2, 3])).toEqual([1, 2, 3]);
  });

  test('replace 长度为 3 数组中索引为 4 的元素', () => {
    expect(replace(4, 100, [1, 2, 3])).toEqual([1, 2, 3, 100]);
  });

  test('replace 长度为 3 数组中索引为 100 的元素', () => {
    expect(replace(100, 100, [1, 2, 3])).toEqual([1, 2, 3, 100]);
  });

  test('replace 长度为 0 数组中索引为 0 的元素', () => {
    expect(replace(0, 100, [])).toEqual([100]);
  });
});
