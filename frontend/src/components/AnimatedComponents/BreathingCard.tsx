/**
 * BreathingCard Component
 * Result card with gentle breathing animation (5% scale pulse)
 * Emphasizes result importance without stress
 */

import { ReactNode } from "react";
import { motion } from "framer-motion";
// import { VARIANTS, ANIMATION_TIMINGS, EASING } from "../../config/motion.config";
import {  ANIMATION_TIMINGS, EASING } from "../../config/motion.config";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface BreathingCardProps {
  children: ReactNode;
  className?: string;
  isActive?: boolean; // Animate when true
  delay?: number;
}

/**
 * BreathingCard: Result card with gentle scaling animation
 * Ideal for displaying prediction results
 *
 * @example
 * <BreathingCard isActive={true}>
 *   <h2>Prediction Result</h2>
 *   <p>Confidence: 87%</p>
 * </BreathingCard>
 */
export function BreathingCard({
  children,
  className = "",
  isActive = true,
  delay = 0,
}: BreathingCardProps) {
  const prefersReducedMotion = useReducedMotion();

  // Gentle breathing: scale from 1 to 1.02 and back
  const breathingVariants = prefersReducedMotion
    ? {
      initial: { opacity: 0, scale: 1 },
      animate: { opacity: 1, scale: 1 },
    }
    : {
      initial: { opacity: 0, scale: 0.95 },
      animate: {
        opacity: 1,
        scale: 1,
      },
    };

  const breathingAnimation = prefersReducedMotion
    ? {}
    : isActive
      ? {
        scale: [1, 1.02, 1],
        transition: {
          duration: ANIMATION_TIMINGS.breathing,
          ease: EASING.smooth,
          repeat: Infinity,
          repeatType: "reverse" as const,
        },
      }
      : {};

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={breathingVariants}
      transition={{
        duration: 0.4,
        delay: delay,
      }}
      className={className}
    >
      <motion.div animate={breathingAnimation}>{children}</motion.div>
    </motion.div>
  );
}

export default BreathingCard;
