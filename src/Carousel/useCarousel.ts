import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo
} from 'react';
import { useRefProps } from '../hooks';
import { useTween } from '../Animation';
import raf from 'raf';

type EventType = TouchEvent | MouseEvent;

type Point = { x: number; y: number };

type Rect = { width: number; height: number };

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

export type CarouselConfig = {
  /** 是否自动切换 */
  autoplay: boolean;
  /** 自动切换时间间隔 ms 3000 */
  interval: number;
  /** 可滚动到下一个的阈值 0.1 */
  threshold: number;
  /** 动画时间 260 */
  duration: number;
  /** 垂直显示 */
  vertical: boolean;
};

export type UseCarouselProps = Partial<CarouselConfig>;

type StateItem = {
  transform: string;
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
        transform: `translate(${0}px, ${0}px)`,
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
  const propsRef = useRefProps<CarouselConfig>({
    autoplay: false,
    interval: 3600,
    threshold: 0.1,
    duration: 260,
    vertical: false,
    ...props
  });

  const startRef = useRef<Point | null>(null);
  const endRef = useRef<Point | null>(null);
  const rectRef = useRef<Rect | null>(null);
  const dirRef = useRef<Direction | null>(null);
  const timeoutRef = useRef<number | null>(null);

  /** 索引限制 */
  const limitIndex = useCallback((index: number, count: number) => {
    if (index < 0) {
      return count - 1;
    }
    if (index > count - 1) {
      return 0;
    }
    return index;
  }, []);

  /** 获取上一个索引 */
  const getPrevIndex = useCallback(
    (dir: Direction, currIndex: number, count: number) => {
      const isLeftTop = dir === Direction.Top || dir === Direction.Left;
      return limitIndex(isLeftTop ? currIndex - 1 : currIndex + 1, count);
    },
    []
  );

  /** 获取下一个索引 */
  const getNextIndex = useCallback(
    (dir: Direction, currIndex: number, count: number) => {
      const isRightBottom = dir === Direction.Right || dir === Direction.Bottom;
      return limitIndex(isRightBottom ? currIndex - 1 : currIndex + 1, count);
    },
    []
  );

  /** current to  */
  const getNextPosition = useCallback((dir: Direction, rect: Rect) => {
    let x = 0;
    let y = 0;
    if (dir === Direction.Right) {
      x = rect.width;
    } else if (dir === Direction.Left) {
      x = -rect.width;
    } else {
      x = 0;
    }

    if (dir === Direction.Bottom) {
      y = rect.height;
    } else if (dir === Direction.Top) {
      y = -rect.height;
    } else {
      y = 0;
    }
    return { x, y };
  }, []);

  /** 获取播放时间 */
  const getNextDuration = useCallback(
    (dir: Direction, distance: number, rect: Rect, duration: number) => {
      if (dir === Direction.Left || dir === Direction.Right) {
        return ((rect.width - distance) / rect.width) * duration;
      } else {
        return ((rect.height - distance) / rect.height) * duration;
      }
    },
    []
  );

  /** 播放 */
  const play = useCallback((dir: Direction, distance: number = 0) => {
    if (!rectRef.current) {
      return;
    }

    const count = countRef.current;
    const currIndex = indexRef.current;
    const rect = rectRef.current;
    const { duration } = propsRef.current;
    const prevIndex = getPrevIndex(dir, currIndex, count);
    const nextIndex = getNextIndex(dir, currIndex, count);
    const nextDuration = getNextDuration(dir, distance, rect, duration);
    const { x, y } = getNextPosition(dir, rect);

    move(dir, distance);

    raf(() => {
      set(state => ({
        ...state,
        duration: nextDuration,
        list: state.list.map((item, i) => {
          if (i === currIndex) {
            return { ...item, transform: `translate(${x}px, ${y}px)` };
          }
          if (i === nextIndex) {
            return { ...item, transform: `translate(${0}px, ${0}px)` };
          } else if (i === prevIndex) {
            return { ...item, transform: `translate(${x}px, ${y}px)` };
          }
          return item;
        })
      }));

      setIndex(nextIndex);
    });
  }, []);

  /** 移动 */
  const move = useCallback((dir: Direction, distance: number) => {
    if (!rectRef.current) {
      return;
    }

    const count = countRef.current;
    const currIndex = indexRef.current;
    const rect = rectRef.current;
    const prevIndex = getPrevIndex(dir, currIndex, count);
    const nextIndex = getNextIndex(dir, currIndex, count);

    set(state => ({
      ...state,
      duration: 0,
      list: state.list.map((item, i) => {
        if (dir === Direction.Right || dir === Direction.Left) {
          const d = dir === Direction.Right ? 1 : -1;
          if (i === currIndex) {
            return {
              ...item,
              transform: `translate(${d * distance}px, ${0}px)`
            };
          }
          if (i === nextIndex) {
            return {
              ...item,
              transform: `translate(${d * (-rect.width + distance)}px, ${0}px)`
            };
          } else if (i === prevIndex) {
            return {
              ...item,
              transform: `translate(${d * (rect.width + distance)}px, ${0}px)`
            };
          }
        } else {
          const d = dir === Direction.Bottom ? 1 : -1;
          if (i === currIndex) {
            return {
              ...item,
              transform: `translate(${0}px, ${d * distance}px)`
            };
          }
          if (i === nextIndex) {
            return {
              ...item,
              transform: `translate(${0}px, ${d * (-rect.height + distance)}px)`
            };
          } else if (i === prevIndex) {
            return {
              ...item,
              transform: `translate(${0}px, ${d * (rect.height + distance)}px)`
            };
          }
        }
        return item;
      })
    }));
  }, []);

  /** 复位 */
  const revert = useCallback((dir: Direction, distance: number) => {
    if (!rectRef.current) {
      return;
    }

    const count = countRef.current;
    const currIndex = indexRef.current;
    const rect = rectRef.current;
    const { duration } = propsRef.current;
    const prevIndex = getPrevIndex(dir, currIndex, count);
    const nextIndex = getNextIndex(dir, currIndex, count);
    const nextDuration =
      duration - getNextDuration(dir, distance, rect, duration);
    const { x, y } = getNextPosition(dir, rect);

    set(state => ({
      ...state,
      duration: nextDuration,
      list: state.list.map((item, i) => {
        if (i === currIndex) {
          return { ...item, transform: `translate(${0}px, ${0}px)` };
        }
        if (i === nextIndex) {
          return { ...item, transform: `translate(${-x}px, ${-y}px)` };
        } else if (i === prevIndex) {
          return { ...item, transform: `translate(${x}px, ${y}px)` };
        }
        return item;
      })
    }));
  }, []);

  /** start */
  const onStart = useCallback((e: EventType) => {
    const point = getPoint(e);
    startRef.current = point;
    clearAutoplay();
  }, []);

  /** move */
  const onMove = useCallback((e: EventType) => {
    if (!startRef.current || !rectRef.current) {
      return;
    }
    endRef.current = getPoint(e);
    const start = startRef.current;
    const end = endRef.current;
    const x = end.x - start.x;
    const y = end.y - start.y;
    dirRef.current = dirRef.current || getDirection({ x, y });
    const dir = dirRef.current;
    const { vertical } = propsRef.current;

    if (!vertical && (dir === Direction.Left || dir === Direction.Right)) {
      e.preventDefault();
      const distance = Math.abs(x);
      move(dir, distance);
    } else if (
      vertical &&
      (dir === Direction.Top || dir === Direction.Bottom)
    ) {
      e.preventDefault();
      const distance = Math.abs(y);
      move(dir, distance);
    }
  }, []);

  /** end */
  const onEnd = useCallback((e: EventType) => {
    if (
      !startRef.current ||
      !endRef.current ||
      !rectRef.current ||
      !dirRef.current
    ) {
      return;
    }

    const start = startRef.current;
    const end = endRef.current;
    const x = end.x - start.x;
    const y = end.y - start.y;
    const rect = rectRef.current;
    const dir = dirRef.current;
    const { vertical, threshold } = propsRef.current;

    if (!vertical && (dir === Direction.Left || dir === Direction.Right)) {
      const distance = Math.abs(x);
      const canNext = distance > rect.width * threshold;
      if (canNext) {
        play(dir, distance);
      } else {
        revert(dir, distance);
      }
    } else if (
      vertical &&
      (dir === Direction.Top || dir === Direction.Bottom)
    ) {
      const distance = Math.abs(y);
      const canNext = distance > rect.height * threshold;
      if (canNext) {
        play(dir, distance);
      } else {
        revert(dir, distance);
      }
    }

    startRef.current = null;
    endRef.current = null;
    dirRef.current = null;
    checkAutoplay();
  }, []);

  /** 清除定时器 */
  const clearAutoplay = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  /** 自动播放 */
  const checkAutoplay = useCallback(() => {
    clearAutoplay();

    const { interval, vertical, autoplay } = propsRef.current;
    if (!autoplay) {
      return;
    }
    timeoutRef.current = setTimeout(() => {
      if (vertical) {
        play(Direction.Top);
      } else {
        play(Direction.Left);
      }
      checkAutoplay();
    }, interval);
  }, []);

  useEffect(() => {
    checkAutoplay();
  }, [props.autoplay, props.interval]);

  /** 初始化 */
  const onInit = useCallback(() => {
    if (!ref.current) {
      return;
    }

    const { vertical } = propsRef.current;
    const index = indexRef.current;
    const rect = ref.current.getBoundingClientRect();
    rectRef.current = rect;
    dirRef.current = null;

    /** 设置初始化状态 */
    set(state => ({
      ...state,
      duration: 0,
      list: state.list.map((item, i) => {
        const x = i !== index && !vertical ? rect.width : 0;
        const y = i !== index && vertical ? rect.height : 0;

        return {
          ...item,
          display: '',
          transform: `translate(${x}px, ${y}px)`,
          width: i !== index ? '100%' : undefined,
          height: i !== index ? '100%' : undefined
        };
      })
    }));

    checkAutoplay();
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

    let rafId: number | undefined;
    const onResize = () => {
      rafId && raf.cancel(rafId);
      rafId = raf(onInit);
    };
    window.addEventListener('resize', onResize);

    const onVisibilitychange = () => {
      if (document.visibilityState === 'hidden') {
        clearAutoplay();
      } else if (document.visibilityState === 'visible') {
        checkAutoplay();
      }
    };
    window.addEventListener('visibilitychange', onVisibilitychange);

    return () => {
      clearAutoplay();

      if (ref.current) {
        ref.current.removeEventListener('mousedown', onStart);
        ref.current.removeEventListener('mousemove', onMove);
        ref.current.removeEventListener('touchstart', onStart);
        ref.current.removeEventListener('touchmove', onMove);
      }

      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('visibilitychange', onVisibilitychange);
    };
  }, []);

  useEffect(() => {
    onInit();
  }, [props.vertical]);

  return [ref, { list: state.list, index }] as const;
};
