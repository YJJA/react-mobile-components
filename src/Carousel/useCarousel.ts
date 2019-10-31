import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo
} from 'react';
import { useRefProps } from '../hooks';
import { useTween } from '../Animation';

type EventType = TouchEvent | MouseEvent;

type Point = { x: number; y: number };

const isTouchEvent = (e: EventType): e is TouchEvent => {
  return typeof (e as TouchEvent).touches !== 'undefined';
};

const getPoint = (e: EventType): Point => {
  if (isTouchEvent(e)) {
    const touch = e.touches[0];
    return { x: touch.clientX, y: touch.clientY };
  }
  return { x: e.clientX, y: e.clientY };
};

enum Direction {
  Top = 'Top',
  Right = 'Right',
  Bottom = 'Bottom',
  Left = 'Left'
}

/** 获取点的方向 */
const getDirection = ({ x, y }: Point) => {
  if (Math.abs(x) < 2 && Math.abs(y) < 2) {
    return null;
  }

  let deg = -Math.atan2(y, x) / (Math.PI / 180);
  if (deg > 45 && deg < 135) {
    return Direction.Top;
  } else if (deg <= 45 && deg >= -45) {
    return Direction.Right;
  } else if (deg >= 135 || deg <= -135) {
    return Direction.Left;
  } else {
    return Direction.Bottom;
  }
};

export type UseCarouselProps = {
  /** 是否自动切换 */
  autoplay?: boolean;
  /** 自动切换时间间隔 ms 3000 */
  interval?: number;
  /** 可滚动到下一个的阈值 0.1 */
  threshold?: number;
  /** 动画时间 260 */
  duration?: number;
  /** 垂直显示 */
  vertical?: boolean;
};

type StateItem = {
  x: number;
  y: number;
  position: string;
  top: number;
  left: number;
  width?: number | string;
  height?: number | string;
  display?: string;
};

export const useCarousel = (count: number, props: UseCarouselProps) => {
  const defaultState: StateItem[] = useMemo(() => {
    return Array(count)
      .fill(1)
      .map((t, i) => ({
        x: 0,
        y: 0,
        position: i ? 'absolute' : 'relative',
        top: 0,
        left: 0,
        display: i ? 'none' : ''
      }));
  }, []);

  const ref = useRef<HTMLDivElement>(null);

  const [state, set] = useTween({ list: defaultState });
  const [index, setIndex] = useState(0);
  const indexRef = useRefProps(index);
  const countRef = useRefProps(count);
  const propsRef = useRefProps(props);

  const startRef = useRef<Point | null>(null);
  const moveRef = useRef<Point | null>(null);
  const rectRef = useRef<{ width: number; height: number } | null>(null);
  const dirRef = useRef<Direction | null>(null);

  /** 索引限制 */
  const limitIndex = useCallback((index: number) => {
    const count = countRef.current;
    if (index < 0) {
      index = count - 1;
    }
    if (index > count - 1) {
      index = 0;
    }
    return index;
  }, []);

  const onStart = useCallback((e: EventType) => {
    const point = getPoint(e);
    startRef.current = point;
  }, []);

  const onMove = useCallback((e: EventType) => {
    if (!startRef.current || !rectRef.current) {
      return;
    }
    moveRef.current = getPoint(e);
    const start = startRef.current;
    const move = moveRef.current;

    const x = move.x - start.x;
    const y = move.y - start.y;
    dirRef.current = dirRef.current || getDirection({ x, y });

    const index = indexRef.current;
    const rect = rectRef.current;
    const dir = dirRef.current;

    const { vertical } = propsRef.current;

    if (!vertical && (dir === Direction.Left || dir === Direction.Right)) {
      e.preventDefault();
      /** 左右滑动 */
      const nextIndex = limitIndex(x > 0 ? index - 1 : index + 1);
      const prevIndex = limitIndex(x > 0 ? index + 1 : index - 1);

      set(state => ({
        ...state,
        duration: 0,
        list: state.list.map((item, i) => {
          if (i === index) {
            return { ...item, x };
          }
          if (i === nextIndex) {
            return { ...item, x: x > 0 ? x - rect.width : rect.width + x };
          } else if (i === prevIndex) {
            return { ...item, x: x > 0 ? rect.width : -rect.width };
          }
          return item;
        })
      }));
    } else if (
      vertical &&
      (dir === Direction.Top || dir === Direction.Bottom)
    ) {
      e.preventDefault();
      /** 上下滑动 */
      const nextIndex = limitIndex(y > 0 ? index - 1 : index + 1);
      const prevIndex = limitIndex(y > 0 ? index + 1 : index - 1);

      set(state => ({
        ...state,
        duration: 0,
        list: state.list.map((item, i) => {
          if (i === index) {
            return { ...item, y };
          }
          if (i === nextIndex) {
            return { ...item, y: y > 0 ? y - rect.height : rect.height + y };
          } else if (i === prevIndex) {
            return { ...item, y: y > 0 ? rect.height : -rect.height };
          }
          return item;
        })
      }));
    }
  }, []);

  const onEnd = useCallback((e: EventType) => {
    if (
      !startRef.current ||
      !moveRef.current ||
      !rectRef.current ||
      !dirRef.current
    ) {
      return;
    }

    const start = startRef.current;
    const move = moveRef.current;
    const x = move.x - start.x;
    const y = move.y - start.y;
    const index = indexRef.current;
    const rect = rectRef.current;
    const dir = dirRef.current;
    const { vertical, threshold = 0.1, duration = 260 } = propsRef.current;

    if (!vertical && (dir === Direction.Left || dir === Direction.Right)) {
      /** 左右滑动 */
      const nextIndex = limitIndex(x > 0 ? index - 1 : index + 1);
      const prevIndex = limitIndex(x > 0 ? index + 1 : index - 1);

      /** 判断是否滚动到下一个 */
      const canNext = Math.abs(x) > rect.width * threshold;
      /** 可以滚动下一个的剩余时间 */
      const canNextDuration = ((rect.width - Math.abs(x)) / rect.width) * 200;

      if (canNext) {
        set(state => ({
          ...state,
          duration: canNextDuration,
          list: state.list.map((item, i) => {
            if (i === index) {
              return { ...item, x: x > 0 ? rect.width : -rect.width };
            }
            if (i === nextIndex) {
              return { ...item, x: 0 };
            } else if (i === prevIndex) {
              return { ...item, x: x > 0 ? rect.width : -rect.width };
            }
            return item;
          })
        }));
        setIndex(nextIndex);
      } else {
        /** 恢复到原有的状态 */
        set(state => ({
          ...state,
          duration: duration - canNextDuration,
          list: state.list.map((item, i) => {
            if (i === index) {
              return { ...item, x: 0 };
            }
            if (i === nextIndex) {
              return { ...item, x: x > 0 ? -rect.width : rect.width };
            } else if (i === prevIndex) {
              return { ...item, x: x > 0 ? rect.width : -rect.width };
            }
            return item;
          })
        }));
      }
    } else if (
      vertical &&
      (dir === Direction.Top || dir === Direction.Bottom)
    ) {
      /** 上下滑动 */
      const nextIndex = limitIndex(y > 0 ? index - 1 : index + 1);
      const prevIndex = limitIndex(y > 0 ? index + 1 : index - 1);

      /** 判断是否滚动到下一个 */
      const canNext = Math.abs(y) > rect.height * threshold;
      /** 可以滚动下一个的剩余时间 */
      const canNextDuration = ((rect.height - Math.abs(y)) / rect.height) * 200;

      if (canNext) {
        set(state => ({
          ...state,
          duration: canNextDuration,
          list: state.list.map((item, i) => {
            if (i === index) {
              return { ...item, y: y > 0 ? rect.height : -rect.height };
            }
            if (i === nextIndex) {
              return { ...item, y: 0 };
            } else if (i === prevIndex) {
              return { ...item, y: y > 0 ? rect.height : -rect.height };
            }
            return item;
          })
        }));

        setIndex(nextIndex);
      } else {
        /** 恢复到原有的状态 */
        set(state => ({
          ...state,
          duration: duration - canNextDuration,
          list: state.list.map((item, i) => {
            if (i === index) {
              return { ...item, y: 0 };
            }
            if (i === nextIndex) {
              return { ...item, y: y > 0 ? -rect.height : rect.height };
            } else if (i === prevIndex) {
              return { ...item, y: y > 0 ? rect.height : -rect.height };
            }
            return item;
          })
        }));
      }
    }

    startRef.current = null;
    moveRef.current = null;
    dirRef.current = null;
  }, []);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.addEventListener('mousedown', onStart);
    ref.current.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    ref.current.addEventListener('touchstart', onStart);
    ref.current.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onEnd);

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('mousedown', onStart);
        ref.current.removeEventListener('mousemove', onMove);
        ref.current.removeEventListener('touchstart', onStart);
        ref.current.removeEventListener('touchmove', onMove);
      }

      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchend', onEnd);
    };
  }, []);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    rectRef.current = rect;
    const { vertical } = propsRef.current;

    set(state => ({
      ...state,
      duration: 0,
      list: state.list.map((item, i) => {
        return {
          ...item,
          display: '',
          x: i && !vertical ? rect.width : 0,
          y: i && vertical ? rect.height : 0,
          width: i ? '100%' : undefined,
          height: i ? '100%' : undefined
        };
      })
    }));
  }, [props.vertical]);

  return [ref, { list: state.list, index }] as const;
};
