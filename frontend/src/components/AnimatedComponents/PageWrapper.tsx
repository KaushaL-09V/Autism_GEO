/**
 * PageWrapper Component
 * Handles page transition animations with accessibility-first approach
 * Wraps entire pages for consistent enter/exit animations
 */

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { VARIANTS, TRANSITIONS } from "../../config/motion.config";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * @example
 * <PageWrapper>
 *   <div className="container">
 *     <h1>My Page</h1>
 *   </div>
 * </PageWrapper>
 */
export function PageWrapper({
  children,
  className = "",
  delay = 0,
}: PageWrapperProps) {
  const prefersReducedMotion = useReducedMotion();

  const pageVariants = prefersReducedMotion
    ? {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    }
    : VARIANTS.pageVariants;

  const transition = prefersReducedMotion
    ? { duration: 0.01 }
    : { ...TRANSITIONS.pageTransition, delay };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default PageWrapper;
