import { nth } from '../nth';

describe('Use Array Nth Function', () => {
  test('数组不为空, 选择范围内的索引', () => {
    const arr = [{ key: '1' }, { key: '2' }];
    expect(nth(1, arr)).toEqual({ key: '2' });
  });
  test('数组不为空, 选择范围外的索引', () => {
    const arr = [{ key: '1' }, { key: '2' }];
    expect(nth(10, arr)).toBeUndefined();
  });

  test('空数据', () => {
    const arr: string[] = [];
    expect(nth(0, arr)).toBeUndefined();
  });
});
