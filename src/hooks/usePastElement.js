import { useEffect, useState } from 'react';

/**
 * Tracks whether the viewport has scrolled past the bottom of the given
 * element. Uses IntersectionObserver instead of a scroll listener so layout
 * is never read on every scroll tick.
 */
export function usePastElement(elementRef) {
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPast(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [elementRef]);

  return isPast;
}
