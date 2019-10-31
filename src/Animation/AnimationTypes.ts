import { easings } from './easings';

export type EasingType = keyof typeof easings | ((t: number) => number);

export type AnimationSignleValue = number | string;

export type AnimationObjectValue = {
  [key: string]: AnimationValueType | undefined;
};

export type AnimationValueType =
  | AnimationSignleValue
  | AnimationSignleValue[]
  | AnimationObjectValue
  | AnimationObjectValue[];

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
