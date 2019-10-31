import { useEffect, useCallback } from 'react';
import raf from 'raf';

import { AnimationValue, AnimationConfig } from './AnimationTypes';
import { useBoolean } from '../hooks/useBoolean';
import { useRefProps } from '../hooks/useRefProps';
import { useTween } from './useTween';

export type UseTransitionProps<T extends AnimationValue> = {
  from: T & AnimationConfig;
  enter: Partial<T> & AnimationConfig;
  leave?: Partial<T> & AnimationConfig;
};

export const useTransition = <T extends AnimationValue>(
  visible: boolean,
  { from, enter, leave }: UseTransitionProps<T>
) => {
  const [show, toggle] = useBoolean();
  const visibleRef = useRefProps(visible);

  const onEnd = useCallback(() => {
    if (!visibleRef.current) {
      toggle(false);
    }
  }, []);

  const [state, set] = useTween<T>({ ...from, onEnd });

  useEffect(() => {
    if (!show && visible) {
      toggle(true);
      raf(() => {
        set(enter);
      });
    } else if (show && !visible) {
      set(leave || from);
    }
  }, [show, visible]);

  return [show, state] as const;
};
