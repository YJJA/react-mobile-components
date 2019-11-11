import { useRef } from 'react';

export const useRefProps = <T>(props: T) => {
  const propsRef = useRef(props);
  propsRef.current = props;
  return propsRef;
};
