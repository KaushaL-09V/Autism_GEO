/**
 * Stagger Animation Components
 * StaggerContainer: Parent wrapper for staggered reveals
 * StaggerItem: Individual items that animate sequentially
 */

import { ReactNode } from "react";
import { motion } from "framer-motion";
// import { VARIANTS, TRANSITIONS } from "../config/motion.config";
import { VARIANTS } from "../../config/motion.config";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number; // Delay between items in ms (default: 50)
  initialDelay?: number; // Delay before animation starts
}

/**
 * StaggerContainer: Wraps a list of StaggerItems
 * Creates sequential animation timing for child elements
 *
 * @example
 * <StaggerContainer staggerDelay={50}>
 *   <StaggerItem>Item 1</StaggerItem>
 *   <StaggerItem>Item 2</StaggerItem>
 *   <StaggerItem>Item 3</StaggerItem>
 * </StaggerContainer>
 */
export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 50,
  initialDelay = 0,
}: StaggerContainerProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = prefersReducedMotion
    ? {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    }
    : VARIANTS.staggerContainerVariants;

  const staggerSettings = prefersReducedMotion
    ? {
      staggerChildren: 0,
      delayChildren: 0,
    }
    : {
      staggerChildren: staggerDelay / 1000,
      delayChildren: initialDelay / 1000,
    };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={containerVariants}
      transition={{
        ...staggerSettings,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  index?: number; // Optional: for manual control
}

/**
 * StaggerItem: Individual item in a stagger animation
 * Must be used within StaggerContainer
 *
 * @example
 * <StaggerItem>
 *   <Card title="Item 1" />
 * </StaggerItem>
 */
export function StaggerItem({
  children,
  className = "",
  index = 0,
}: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();

  const itemVariants = prefersReducedMotion
    ? {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    }
    : VARIANTS.staggerItemVariants;

  return (
    <motion.div
      variants={itemVariants}
      className={className}
      custom={index}   // 👈 REQUIRED
    >
      {children}
    </motion.div>
  );
}

export default StaggerContainer;
