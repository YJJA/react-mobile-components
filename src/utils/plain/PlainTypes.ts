export type Key = string | number;

export type PlainSigle =
  | string
  | number
  | boolean
  | symbol
  | null
  | undefined
  | (() => void)
  | Date
  | RegExp
  | Error;

export interface PlainArray extends Array<PlainType> {}

export interface PlainObject {
  [key: string]: PlainType;
}

export type PlainType = PlainSigle | PlainArray | PlainObject;
