import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import raf from 'raf';
import now from 'performance-now';

import { AnimationConfig, AnimationValue } from './AnimationTypes';
import { easings } from './easings';
import { calculate } from './calculate';
import { isFunction, isUndefined } from '../utils/helpers';

type SetAnimationConfig<T extends AnimationValue> =
  | (Partial<T> & AnimationConfig)
  | ((from: UseTweenState<T>) => Partial<T> & AnimationConfig);

type UseTweenState<T extends AnimationValue> = Pick<
  T & AnimationConfig,
  Exclude<keyof T, 'duration' | 'delay' | 'easing' | 'onEnd' | 'onStart'>
>;

const getStateForConfig = <T extends AnimationValue>(
  state: T & AnimationConfig
) => {
  const { duration, delay, easing, onEnd, onStart, ...props } = state;
  let config: AnimationConfig = {};
  if (!isUndefined(duration)) {
    config.duration = duration;
  }
  if (!isUndefined(delay)) {
    config.delay = delay;
  }
  if (!isUndefined(easing)) {
    config.easing = easing;
  }
  if (!isUndefined(onEnd)) {
    config.onEnd = onEnd;
  }
  if (!isUndefined(onStart)) {
    config.onStart = onStart;
  }

  return [props, config] as const;
};

/**
 * 补间动画，支付的属性有
 * 数值： 0 ... 10000
 * 带单位的数值： 2px / 10em (单位不会转换)
 * 颜色： rgb(100, 100, 100) / rgba(100, 100, 100, 1)
 */
export const useTween = <T extends AnimationValue>(
  initialState: (T & AnimationConfig) | (() => T & AnimationConfig)
) => {
  const [props, config] = useMemo(() => {
    const state =
      typeof initialState === 'function' ? initialState() : initialState;
    return getStateForConfig(state);
  }, []);

  const configRef = useRef(config);
  const propsRef = useRef([props]);

  const progressTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [state, setState] = useState(props);

  const play = useCallback(() => {
    if (propsRef.current.length < 2) {
      return;
    }

    const [fromState, toState] = propsRef.current;
    const {
      duration = 200,
      easing = 'linear',
      delay = 0,
      onEnd,
      onStart
    } = configRef.current;

    const startTime = now() - progressTimeRef.current;
    const easingfun = typeof easing === 'string' ? easings[easing] : easing;

    const tick = () => {
      const currentTime = now();
      progressTimeRef.current = currentTime - startTime;

      if (progressTimeRef.current < delay) {
        rafRef.current = raf(tick);
        return;
      }

      if (!rafRef.current) {
        return;
      }

      const realProgressTime = progressTimeRef.current - delay;
      const t = Math.min(realProgressTime / duration, 1);
      const progress = easingfun(t);

      const current = calculate(fromState, toState, progress);
      setState(current);

      if (t !== 1) {
        rafRef.current = raf(tick);
      } else {
        rafRef.current = null;
        progressTimeRef.current = 0;
        onEnd && onEnd();
      }
    };

    onStart && onStart();
    rafRef.current = raf(tick);
  }, []);

  const set = useCallback((state: SetAnimationConfig<T>) => {
    const lastIndex = propsRef.current.length - 1;
    const from = propsRef.current[lastIndex];
    const temp = isFunction(state) ? state(from) : state;

    const [tempState, tempConfig] = getStateForConfig(temp);
    const to = { ...from, ...tempState } as UseTweenState<T>;

    configRef.current = { ...configRef.current, ...tempConfig };
    propsRef.current = [from, to];

    /** duration == 0 */
    if (tempConfig.duration === 0) {
      propsRef.current = [to];
      setState(to);
      return;
    }

    play();
  }, []);

  const stop = useCallback(() => {
    if (!rafRef.current) {
      return;
    }
    raf.cancel(rafRef.current);
    rafRef.current = null;
  }, []);

  useEffect(() => stop, []);

  return [state, set, stop] as const;
};
