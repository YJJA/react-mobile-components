import { head } from '../head';

describe('Use Array Head Function', () => {
  test('数组不为空', () => {
    const arr = [{ key: '1' }, { key: '2' }];
    expect(head(arr)).toEqual({ key: '1' });
  });

  test('空数据', () => {
    const arr: string[] = [];
    expect(head(arr)).toBeUndefined();
  });
});
