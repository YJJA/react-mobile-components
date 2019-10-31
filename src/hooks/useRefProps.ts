import { useRef, useEffect } from 'react';

export const useRefProps = <T>(props: T) => {
  const propsRef = useRef(props);

  useEffect(() => {
    propsRef.current = props;
  }, [props]);

  return propsRef;
};
