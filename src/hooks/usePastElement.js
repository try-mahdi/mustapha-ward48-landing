import { useEffect, useState } from 'react';

/**
 * Tracks whether the viewport has scrolled past the bottom of the given
 * element. Uses IntersectionObserver instead of a scroll listener so layout
 * is never read on every scroll tick.
 *
 * `resetKey` lets a caller force a fresh observer — a ref's `.current` can
 * change (e.g. the observed element remounts after a route change) without
 * the ref object's identity changing, so the effect wouldn't otherwise know
 * to re-attach to the new element.
 */
export function usePastElement(elementRef, resetKey) {
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) {
      setIsPast(false);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPast(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [elementRef, resetKey]);

  return isPast;
}
