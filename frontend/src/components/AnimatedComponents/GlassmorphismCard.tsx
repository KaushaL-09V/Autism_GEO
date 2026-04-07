/**
 * GlassmorphismCard Component
 * Premium card with frosted glass effect (glassmorphism)
 * Includes hover animations and elevation effects
 */

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { VARIANTS, ANIMATION_TIMINGS } from "../../config/motion.config";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface GlassmorphismCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  onClick?: () => void;
  interactive?: boolean; // Enable hover animations
  delay?: number;
}

/**
 * GlassmorphismCard: Premium frosted glass effect card
 * Elegant hover state with elevation and backdrop blur
 *
 * CSS classes needed (add to Tailwind config or global CSS):
 * - backdrop-blur-md: Tailwind built-in
 * - bg-opacity-10: Tailwind built-in
 *
 * @example
 * <GlassmorphismCard
 *   title="Biomarker Analysis"
 *   subtitle="Gene Expression Results"
 *   interactive={true}
 * >
 *   <div className="space-y-2">
 *     <p>Gene: CNTNAP2</p>
 *     <p>Expression Level: 2.34</p>
 *   </div>
 * </GlassmorphismCard>
 */
export function GlassmorphismCard({
  children,
  className = "",
  title,
  subtitle,
  onClick,
  interactive = false,
  delay = 0,
}: GlassmorphismCardProps) {
  const prefersReducedMotion = useReducedMotion();

  // Entry animation
  const cardVariants = prefersReducedMotion
    ? {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    }
    : VARIANTS.scaleVariants;

  // Hover animation (only if interactive)
  const hoverAnimation = prefersReducedMotion
    ? {}
    : interactive
      ? {
        y: -5,
        boxShadow:
          "0 25px 50px rgba(74, 155, 142, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)",
      }
      : {};

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={cardVariants}
      transition={{
        duration: ANIMATION_TIMINGS.standard,
        delay: delay,
      }}
      whileHover={interactive ? hoverAnimation : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/10 backdrop-blur-md
        border border-white/20
        shadow-lg shadow-teal-900/10
        transition-shadow duration-300
        ${interactive ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {/* Gradient overlay for premium effect */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-teal-50/5 to-blue-50/5 pointer-events-none"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 p-6">
        {title && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-50">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">{children}</div>
      </div>
    </motion.div>
  );
}

/**
 * GlassmorphismGrid: Wrapper for multiple glassmorphism cards
 * Provides staggered animation for multiple cards
 */
interface GlassmorphismGridProps {
  children: ReactNode;
  columns?: number;
  gap?: string;
}

export function GlassmorphismGrid({
  children,
  columns = 2,
  gap = "4",
}: GlassmorphismGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-${gap}`}>
      {children}
    </div>
  );
}

export default GlassmorphismCard;
