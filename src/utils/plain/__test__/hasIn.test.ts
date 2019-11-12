import { hasIn } from '../hasIn';

describe('Test hasIn', () => {
  test('Test hasIn', () => {
    expect(hasIn([], undefined)).toBeFalsy();
    expect(hasIn(['1'], undefined)).toBeFalsy();
    expect(hasIn([], null)).toBeFalsy();
    expect(hasIn(['1'], null)).toBeFalsy();

    expect(hasIn([], {})).toBeFalsy();
    expect(hasIn(['2'], {})).toBeFalsy();

    expect(hasIn(['a'], { a: 'a' })).toBeTruthy();
    expect(hasIn(['a'], { b: 'b' })).toBeFalsy();

    expect(hasIn(['a', 'b'], { a: 'a' })).toBeFalsy();

    expect(hasIn(['a', 0, 'b'], { a: [{ c: 'c' }, { b: 'b' }] })).toBeFalsy();
    expect(hasIn(['a', 1, 'b'], { a: [{ c: 'c' }, { b: 'b' }] })).toBeTruthy();

    expect(hasIn(['a', 1], { a: [{ c: 'c' }, { b: 'b' }] })).toBeTruthy();
  });
});
