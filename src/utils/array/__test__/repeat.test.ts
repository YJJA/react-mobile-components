import { repeat } from '../repeat';

describe('Use Array repeat Function', () => {
  test('repeat ', () => {
    expect(repeat(0, 3)).toEqual([0, 0, 0]);
  });
});
