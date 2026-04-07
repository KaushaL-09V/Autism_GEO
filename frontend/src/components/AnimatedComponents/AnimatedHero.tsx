/**
 * AnimatedHero Component
 * Hero section with staggered entrance animations for title, subtitle, and CTA
 */

import { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  // VARIANTS,
  // TRANSITIONS,
  ANIMATION_TIMINGS,
  EASING,
} from "../../config/motion.config";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface AnimatedHeroProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  imageUrl?: string;
  imageAlt?: string;
  cta?: {
    label: string;
    onClick?: () => void;
  };
}

/**
 * AnimatedHero: Hero section with staggered animations
 * Title enters first, subtitle with delay, CTA last
 *
 * @example
 * <AnimatedHero
 *   title="Autism Screening Tool"
 *   subtitle="Powered by genetic biomarkers"
 *   cta={{ label: "Get Started" }}
 * />
 */
export function AnimatedHero({
  title,
  subtitle,
  children,
  className = "",
  imageUrl,
  imageAlt = "Hero image",
  cta,
}: AnimatedHeroProps) {
  const prefersReducedMotion = useReducedMotion();

  // Entrance animation for title (larger, more dramatic)
  const titleVariants = prefersReducedMotion
    ? {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    }
    : {
      initial: { opacity: 0, y: 40 },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          duration: ANIMATION_TIMINGS.slow,
          ease: EASING.easeOut,
          delay: 0,
        },
      },
    };

  // Entrance animation for subtitle (slight delay)
  const subtitleVariants = prefersReducedMotion
    ? {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    }
    : {
      initial: { opacity: 0, y: 20 },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          duration: ANIMATION_TIMINGS.standard,
          ease: EASING.easeOut,
          delay: 0.1,
        },
      },
    };

  // Entrance animation for CTA (largest delay)
  const ctaVariants = prefersReducedMotion
    ? {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    }
    : {
      initial: { opacity: 0, scale: 0.9, y: 10 },
      animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          duration: ANIMATION_TIMINGS.standard,
          ease: EASING.easeOut,
          delay: 0.2,
        },
      },
    };

  // Image entrance with subtle scale (appears alongside subtitle)
  const imageVariants = prefersReducedMotion
    ? {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    }
    : {
      initial: { opacity: 0, scale: 0.95 },
      animate: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: ANIMATION_TIMINGS.slow,
          ease: EASING.easeOut,
          delay: 0.15,
        },
      },
    };

  return (
    <div className={className}>
      <motion.h1
        variants={titleVariants}
        initial="initial"
        animate="animate"
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-teal-900 dark:text-teal-50 mb-4"
      >
        {title}
      </motion.h1>

      {subtitle && (
        <motion.p
          variants={subtitleVariants}
          initial="initial"
          animate="animate"
          className="text-lg md:text-xl text-blue-700 dark:text-blue-100 mb-8"
        >
          {subtitle}
        </motion.p>
      )}

      {imageUrl && (
        <motion.img
          variants={imageVariants}
          initial="initial"
          animate="animate"
          src={imageUrl}
          alt={imageAlt}
          className="w-full max-w-2xl mx-auto rounded-lg shadow-lg mb-8"
        />
      )}

      {cta && (
        <motion.button
          variants={ctaVariants}
          initial="initial"
          animate="animate"
          onClick={cta.onClick}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
        >
          {cta.label}
        </motion.button>
      )}

      {children && (
        <motion.div
          variants={ctaVariants}
          initial="initial"
          animate="animate"
          className="mt-8"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

export default AnimatedHero;
