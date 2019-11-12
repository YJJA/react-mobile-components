import { last } from '../last';

describe('Use Array Last Function', () => {
  test('数组不为空', () => {
    const arr = [{ key: '1' }, { key: '2' }];
    expect(last(arr)).toEqual({ key: '2' });
  });

  test('空数据', () => {
    const arr: string[] = [];
    expect(last(arr)).toBeUndefined();
  });
});
