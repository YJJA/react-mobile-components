import { removeIn } from '../removeIn';

describe('Test removeIn', () => {
  test('Test removeIn', () => {
    expect(removeIn([], undefined)).toBeUndefined();
    expect(removeIn(['1'], undefined)).toBeUndefined();
    expect(removeIn([], null)).toBeNull();
    expect(removeIn(['1'], null)).toBeNull();

    expect(removeIn([], {})).toEqual({});
    expect(removeIn(['2'], {})).toEqual({});

    expect(removeIn(['a'], { a: 'a' })).toEqual({});
    expect(removeIn(['a'], { b: 'b' })).toEqual({ b: 'b' });

    expect(removeIn(['a', 'b'], { a: 'a' })).toEqual({ a: 'a' });

    expect(removeIn(['a', 0, 'b'], { a: [{ c: 'c', b: 'b' }] })).toEqual({
      a: [{ c: 'c' }]
    });

    expect(removeIn(['a', 1], { a: [{ c: 'c' }, { b: 'b' }] })).toEqual({
      a: [{ c: 'c' }]
    });
  });
});
