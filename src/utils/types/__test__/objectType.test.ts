import { objectType } from '../objectType';

describe('use objectType', () => {
  test('objectType', () => {
    expect(objectType(null)).toBe('null');

    expect(objectType(undefined)).toBe('undefined');

    expect(objectType(Symbol())).toBe('symbol');

    expect(objectType(false)).toBe('boolean');

    expect(objectType([])).toBe('array');
    expect(objectType({})).toBe('object');

    // 数字和日期对象
    expect(objectType(NaN)).toBe('number');
    expect(objectType(0)).toBe('number');
    expect(objectType(1n)).toBe('bigint');
    expect(objectType(new Date())).toBe('date');

    // 字符串
    expect(objectType('')).toBe('string');
    expect(objectType(/\b/)).toBe('regexp');

    // 错误对象
    expect(objectType(new Error(''))).toBe('error');
    expect(objectType(new EvalError(''))).toBe('error');
    expect(objectType(new TypeError(''))).toBe('error');
    expect(objectType(new SyntaxError(''))).toBe('error');
    expect(objectType(new ReferenceError(''))).toBe('error');
    expect(objectType(new URIError(''))).toBe('error');
    expect(objectType(new RangeError(''))).toBe('error');

    // 控制抽象对象
    expect(objectType(new Promise(() => {}))).toBe('promise');
    expect(objectType(async () => {})).toBe('asyncfunction');
    expect(objectType(function* test() {})).toBe('generatorfunction');

    // 集合对象
    expect(objectType(new Set())).toBe('set');
    expect(objectType(new WeakSet())).toBe('weakset');
    expect(objectType(new Map())).toBe('map');
    expect(objectType(new WeakMap())).toBe('weakmap');

    // 类型数组
    expect(objectType(new Int8Array(1))).toBe('int8array');
  });
});
