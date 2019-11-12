import { getIn } from '../getIn';

describe('Test getIn', () => {
  test('Test getIn', () => {
    expect(getIn([], undefined)).toBeUndefined();
    expect(getIn(['1'], undefined)).toBeUndefined();

    expect(getIn([], {})).toBeUndefined();
    expect(getIn(['2'], {})).toBeUndefined();

    expect(getIn(['a'], { a: 'a' })).toBe('a');
    expect(getIn(['a', 'b'], { a: 'a' })).toBeUndefined();

    expect(getIn(['name'], function a() {})).toBe('a');
  });
});
