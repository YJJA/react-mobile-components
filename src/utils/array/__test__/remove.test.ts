import { remove } from '../remove';

describe('Use Array remove Function', () => {
  test('删除 长度为 3 数组中索引为 0 的元素', () => {
    expect(remove(0, [1, 2, 3])).toEqual([2, 3]);
  });

  test('删除 长度为 3 数组中索引为 -1 的元素', () => {
    expect(remove(-1, [1, 2, 3])).toEqual([1, 2, 3]);
  });

  test('删除 长度为 3 数组中索引为 4 的元素', () => {
    expect(remove(4, [1, 2, 3])).toEqual([1, 2, 3]);
  });

  test('删除 长度为 0 数组中索引为 0 的元素', () => {
    expect(remove(0, [])).toEqual([]);
  });
});
