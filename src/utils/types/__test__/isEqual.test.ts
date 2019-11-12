import { isEqual } from '../isEqual';

test('isEqual', () => {
  expect(isEqual(0, 0)).toBeTruthy();
  expect(isEqual(0, -0)).toBeFalsy();
  expect(isEqual(NaN, NaN)).toBeTruthy();
  expect(isEqual('Curly', 'Curly')).toBeTruthy();
  expect(isEqual({}, {})).toBeTruthy();
  expect(isEqual([1], [1])).toBeTruthy();
  expect(isEqual({ value: 1 }, { value: 1 })).toBeTruthy();
});
