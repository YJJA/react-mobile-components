import { useRef, useCallback } from 'react';
import { isNull } from '../utils/types';
import { useRefProps } from '../hooks';

type TouchEventType = TouchEvent | MouseEvent;

type Point = { x: number; y: number };

const isTouchEvent = (e: TouchEventType): e is TouchEvent => {
  return typeof (e as TouchEvent).touches !== 'undefined';
};

const getPointsFromTouchEvent = (e: TouchEventType): Point => {
  if (isTouchEvent(e)) {
    const touch = e.touches[0];
    return { x: touch.clientX, y: touch.clientY };
  }
  return { x: e.clientX, y: e.clientY };
};

export type UseTouchProps = {
  onStart(): void;
  onMove(): void;
  onEnd(): void;
};

export const useTouch = (props: UseTouchProps) => {
  const propsRef = useRefProps(props);
  const startRef = useRef<Point | null>(null);
  const endRef = useRef<Point | null>(null);

  /** start */
  const onStart = useCallback((e: TouchEventType) => {
    startRef.current = getPointsFromTouchEvent(e);
  }, []);

  /** move */
  const onMove = useCallback((e: TouchEventType) => {
    if (isNull(startRef.current)) {
      return;
    }
    endRef.current = getPointsFromTouchEvent(e);
    const start = startRef.current;
    const end = endRef.current;
    const x = end.x - start.x;
    const y = end.y - start.y;
    const props = propsRef.current;
    props.onMove();
  }, []);

  /** end */
  const onEnd = useCallback((e: TouchEventType) => {
    if (isNull(startRef.current) || isNull(endRef.current)) {
      return;
    }

    const start = startRef.current;
    const end = endRef.current;
    const x = end.x - start.x;
    const y = end.y - start.y;

    startRef.current = null;
    endRef.current = null;
  }, []);

  return {
    onStart,
    onMove,
    onEnd
  };
};
