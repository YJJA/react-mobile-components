import { easings } from './easings';

export type EasingType = keyof typeof easings | ((t: number) => number);

export type AnimationSignleValue = number | string | undefined;

export interface AnimationObjectValue {
  [key: string]: AnimationValueType;
}

export interface AnimationArrayValue extends Array<AnimationValueType> {}

export type AnimationValueType =
  | AnimationSignleValue
  | AnimationArrayValue
  | AnimationObjectValue;

export type AnimationValue = {
  [key: string]: AnimationValueType | undefined;
};

export type AnimationConfig = {
  duration?: number;
  easing?: EasingType;
  delay?: number;
  onStart?(): void;
  onEnd?(): void;
};

export type AnimationState = AnimationValue & AnimationConfig;
