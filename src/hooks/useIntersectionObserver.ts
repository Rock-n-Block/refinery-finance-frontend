import { useEffect, useRef, useState } from 'react';

const useIntersectionObserver = <T extends Element>(): {
  observerRef: React.RefObject<T>;
  isIntersecting: boolean;
} => {
  const observerRef = useRef<T>(null);
  const [observerIsSet, setObserverIsSet] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const checkObserverIsIntersecting = ([entry]: IntersectionObserverEntry[]) => {
      setIsIntersecting(entry.isIntersecting);
    };

    if (!observerIsSet) {
      if (observerRef.current) {
        const intersectionObserver = new IntersectionObserver(checkObserverIsIntersecting, {
          rootMargin: '0px',
          threshold: 1,
        });

        console.log('observerRef.current', observerRef.current);
        intersectionObserver.observe(observerRef.current as any);
        setObserverIsSet(true);
      }
    }
  }, [observerIsSet]);

  return { observerRef, isIntersecting };
};

export default useIntersectionObserver;
