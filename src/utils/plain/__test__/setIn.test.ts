import { setIn } from '../setIn';

describe('Test setIn', () => {
  test('Test setIn', () => {
    expect(setIn([], 'value', undefined)).toBeUndefined();
    expect(setIn(['a'], 'value', undefined)).toBeUndefined();

    expect(setIn([], 'value', null)).toBeNull();
    expect(setIn(['a'], 'value', null)).toBeNull();

    expect(setIn([], 'value', {})).toEqual({});
    expect(setIn(['a'], 'value', {})).toEqual({ a: 'value' });

    expect(setIn(['a'], 'value', { a: 'a' })).toEqual({ a: 'value' });
    expect(setIn(['a', 'b'], 'value', {})).toEqual({ a: { b: 'value' } });
    expect(setIn(['a', 0, 'b'], 'value', {})).toEqual({ a: [{ b: 'value' }] });

    expect(setIn(['a', 'b'], 'value', { a: 'a' })).toEqual({
      a: { b: 'value' }
    });

    expect(setIn(['a', 'b', 0], 'value', { a: 'a' })).toEqual({
      a: { b: ['value'] }
    });
  });
});
