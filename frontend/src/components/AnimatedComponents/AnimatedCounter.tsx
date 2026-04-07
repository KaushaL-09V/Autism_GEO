/**
 * AnimatedCounter Component
 * Animated number counter for probability/confidence scores
 * Counts from 0 to target value with smooth easing
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface AnimatedCounterProps {
  value: number; // Final value (0-100 for percentages)
  maxValue?: number; // Maximum value (default: 100)
  duration?: number; // Duration in seconds
  decimals?: number; // Decimal places (default: 0)
  suffix?: string; // Text to append (e.g., "%")
  prefix?: string; // Text to prepend (e.g., "$")
  className?: string;
  delay?: number; // Initial delay before counting starts
}

/**
 * AnimatedCounter: Displays animated counting from 0 to target value
 * Perfect for confidence scores, accuracy percentages, etc.
 *
 * @example
 * <AnimatedCounter
 *   value={87.5}
 *   suffix="%"
 *   duration={2}
 *   className="text-2xl font-bold text-teal-600"
 * />
 *
 * Output: 87.5% (animated from 0% to 87.5%)
 */
export function AnimatedCounter({
  value,
  // maxValue = 100,
  duration = 2,
  decimals = 0,
  suffix = "",
  prefix = "",
  className = "",
  delay = 0,
}: AnimatedCounterProps) {
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(
    prefersReducedMotion ? value : 0
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    // Animation frames for smooth counting
    const frameCount = Math.ceil(duration * 60); // Assume 60fps
    let frame = 0;

    const timer = setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / frameCount, 1);

      // Easing function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = value * easeOut;

      setDisplayValue(currentValue);

      if (progress === 1) {
        clearInterval(timer);
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [value, duration, prefersReducedMotion]);

  const formattedValue = displayValue.toFixed(decimals);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0.01 : 0.3,
        delay: prefersReducedMotion ? 0 : delay,
      }}
      className={className}
    >
      {prefix}
      {formattedValue}
      {suffix}
    </motion.span>
  );
}

export default AnimatedCounter;
