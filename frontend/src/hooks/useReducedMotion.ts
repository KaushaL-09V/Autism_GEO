/**
 * Accessibility Hook: useReducedMotion
 * Respects system preferences for reduced motion and provides safe animation control
 */

import { useEffect, useState } from "react";

/**
 * Hook to detect and respect user's reduced motion preferences
 * Returns true if user has enabled "prefers-reduced-motion: reduce"
 *
 * @example
 * const shouldReduceMotion = useReducedMotion();
 * return (
 *   <motion.div
 *     variants={shouldReduceMotion ? instantVariants : normalVariants}
 *   />
 * );
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);
    setIsInitialized(true);

    // Listen for changes (e.g., user toggles accessibility settings)
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    // Modern browsers prefer addEventListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }
    // Fallback for older browsers
    else {
      mediaQuery.addListener(handleChange);
      return () => {
        mediaQuery.removeListener(handleChange);
      };
    }
  }, []);

  // Return false during SSR/hydration to avoid flashing
  return isInitialized ? prefersReducedMotion : false;
}

/**
 * Hook to get safe animation configuration respecting motion preferences
 * Returns a transition object that's instant if motion is reduced
 *
 * @example
 * const transition = useSafeTransition({ duration: 0.3 });
 * return <motion.div animate={{ x: 100 }} transition={transition} />;
 */
export function useSafeTransition(
  normalTransition: {
    duration?: number;
    delay?: number;
    ease?: string | number[];
  }
) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return {
      duration: 0.01, // Near-instant
      delay: 0,
    };
  }

  return normalTransition;
}

/**
 * Hook to conditionally apply animation variants
 * Returns safe variants if motion should be reduced
 *
 * @example
 * const variants = useSafeVariants(animatedVariants);
 * return <motion.div variants={variants} initial="initial" animate="animate" />;
 */
export function useSafeVariants<T extends Record<string, any>>(variants: T): T {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    // Return variants with no animation (immediate)
    const safeVariants: any = {};
    for (const key in variants) {
      safeVariants[key] = {};
    }
    return safeVariants;
  }

  return variants;
}
