import { stringColorTransform } from './color/colorToRgba';

// Problem: https://github.com/animatedjs/animated/pull/102
// Solution: https://stackoverflow.com/questions/638565/parsing-scientific-notation-sensibly/658662
const stringShapeRegex = /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;

export type ParseStringResult =
  | {
      type: 'match';
      fromValue: number[];
      toValue: number[];
      render: (numArr: number[]) => string;
    }
  | {
      type: 'string';
    };

const cacheMap: { [key: string]: ParseStringResult } = {};

const createRender = (fromStr: string, reg: RegExp) => (numArr: number[]) => {
  return fromStr.replace(reg, () => {
    const e = numArr.shift();
    return e!.toFixed(2);
  });
};

export const parseString = (from: string, to: string): ParseStringResult => {
  const key = `${from}->${to}`;

  if (cacheMap[key]) {
    return cacheMap[key];
  }

  const fromStr = stringColorTransform(from);
  const toStr = stringColorTransform(to);
  const fromUnitResult = fromStr.match(stringShapeRegex);
  const toUnitResult = toStr.match(stringShapeRegex);

  if (fromUnitResult && toUnitResult) {
    const fromValue = fromUnitResult.map(str => Number(str));
    const toValue = toUnitResult.map(str => Number(str));
    cacheMap[key] = {
      type: 'match',
      fromValue,
      toValue,
      render: createRender(fromStr, stringShapeRegex)
    };
  } else {
    cacheMap[key] = { type: 'string' };
  }

  return cacheMap[key];
};
