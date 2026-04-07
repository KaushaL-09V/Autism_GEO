/**
 * Global Framer Motion Configuration
 * Healthcare-optimized animation presets with accessibility-first approach
 */

import { Variants, Transition } from "framer-motion";

// ============================================================
// TIMING PRESETS (Healthcare-appropriate durations)
// ============================================================

export const ANIMATION_TIMINGS = {
  // Micro-interactions (quick feedback)
  instant: 0.15,
  quick: 0.25,

  // Standard transitions (most common use)
  standard: 0.3,
  slow: 0.4,

  // Extended animations (breathing, loading states)
  extended: 0.5,
  breathing: 3,
  loading: 2,
} as const;

// ============================================================
// EASING FUNCTIONS (Smooth, clinical feel)
// ============================================================

export const EASING = {
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  easeInQuad: [0.55, 0.085, 0.68, 0.53],
  easeOutQuad: [0.25, 0.46, 0.45, 0.94],
  easeOutCubic: [0.215, 0.61, 0.355, 1],
  smooth: [0.4, 0, 0.2, 1],
  gentle: [0.25, 0.25, 0.75, 0.75],
} as const;

// ============================================================
// STANDARD TRANSITIONS
// ============================================================

export const TRANSITIONS = {
  // Page transitions
  pageTransition: {
    duration: ANIMATION_TIMINGS.slow,
    ease: EASING.easeInOut,
  } as Transition,

  // Stagger transitions for lists
  staggerContainer: {
    staggerChildren: 0.05,
    delayChildren: 0.1,
  },

  // Smooth spring physics
  spring: {
    type: "spring",
    damping: 20,
    stiffness: 300,
  },

  // Gentle spring for micro-interactions
  gentleSpring: {
    type: "spring",
    damping: 25,
    stiffness: 200,
  },

  // Breathing/pulse animation (smooth, non-jarring)
  breathing: {
    duration: ANIMATION_TIMINGS.breathing,
    ease: EASING.smooth,
    repeat: Infinity,
    repeatType: "reverse" as const,
  },

  // Loading spinner rotation
  loadingSpinner: {
    duration: ANIMATION_TIMINGS.loading,
    ease: "linear",
    repeat: Infinity,
  },
} as const;

// ============================================================
// VARIANT PRESETS (Reusable animation patterns)
// ============================================================

export const VARIANTS = {
  // Page entrance/exit
  pageVariants: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: TRANSITIONS.pageTransition,
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: TRANSITIONS.pageTransition,
    },
  } as Variants,

  // Fade in/out
  fadeVariants: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  } as Variants,

  // Slide up
  slideUpVariants: {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: ANIMATION_TIMINGS.standard, ease: EASING.easeOut },
    },
    exit: { opacity: 0, y: 30 },
  } as Variants,

  // Scale in
  scaleVariants: {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: ANIMATION_TIMINGS.standard, ease: EASING.easeOut },
    },
    exit: { opacity: 0, scale: 0.95 },
  } as Variants,

  // Breathing pulse (for result cards)
  breathingVariants: {
    animate: {
      scale: [1, 1.02, 1],
      transition: TRANSITIONS.breathing,
    },
  } as Variants,

  // Stagger container
  staggerContainerVariants: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: TRANSITIONS.staggerContainer,
    },
    exit: { opacity: 0 },
  } as Variants,

  // Individual stagger item
  staggerItemVariants: {
  initial: { opacity: 0, y: 10 },

  animate: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_TIMINGS.standard,
      ease: EASING.easeOut,
      delay: index * 0.05, // 👈 THIS enables stagger control
    },
  }),

  exit: { opacity: 0, y: -10 },
}as Variants,

  // Hero section entrance
  heroVariants: {
    initial: { opacity: 0, y: 40 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: ANIMATION_TIMINGS.slow,
        ease: EASING.easeOut,
      },
    },
  } as Variants,

  // Button hover/tap
  buttonVariants: {
    initial: { scale: 1 },
    hover: {
      scale: 1.03,
      transition: { duration: ANIMATION_TIMINGS.quick },
    },
    tap: { scale: 0.97 },
  } as Variants,

  // Input focus glow
  inputVariants: {
    initial: { boxShadow: "0 0 0 0px rgba(74, 155, 142, 0)" },
    focus: {
      boxShadow: "0 0 0 3px rgba(74, 155, 142, 0.1)",
      transition: { duration: ANIMATION_TIMINGS.quick },
    },
  } as Variants,

  // Modal backdrop
  backdropVariants: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  } as Variants,

  // Modal panel
  modalVariants: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: ANIMATION_TIMINGS.standard, ease: EASING.easeOut },
    },
    exit: { opacity: 0, scale: 0.9, y: 20 },
  } as Variants,

  // Loading dot pulse (for loading spinners)
  dotPulseVariants: {
    animate: {
      y: ["0px", "-8px", "0px"],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatDelay: 0.2,
      },
    },
  } as Variants,

  // Rotation (for loaders)
  rotateVariants: {
    animate: {
      rotate: 360,
      transition: TRANSITIONS.loadingSpinner,
    },
  } as Variants,

  // Glassmorphism card hover
  glassCardVariants: {
    initial: { opacity: 0.8, y: 10 },
    hover: {
      opacity: 1,
      y: 0,
      transition: { duration: ANIMATION_TIMINGS.quick },
    },
    tap: { scale: 0.98 },
  } as Variants,
} as const;

// ============================================================
// ACCESSIBILITY HELPER
// ============================================================

/**
 * Check if user prefers reduced motion
 * Used by hooks/useReducedMotion.ts
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Safely apply animations respecting user preferences
 * If user prefers reduced motion, returns instant variants
 */
export const safeTransition = (
  transition: Transition | undefined,
  reduceMotion: boolean
): Transition | undefined => {
  if (reduceMotion) {
    return { duration: 0.01 };
  }
  return transition;
};

/**
 * Disable animations for a variant if user prefers reduced motion
 */
export const safeVariant = (
  variants: Variants,
  reduceMotion: boolean
): Variants => {
  if (!reduceMotion) return variants;

  // Return instant variants for accessibility
  return {
    initial: variants.initial || {},
    animate: variants.animate || {},
    exit: variants.exit || {},
  };
};

// ============================================================
// COLOR ANIMATION PRESETS (Healthcare palette)
// ============================================================

export const COLOR_ANIMATIONS = {
  // Success indicator
  successPulse: {
    backgroundColor: ["#6B8E23", "#7BA98E", "#6B8E23"],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },

  // Alert indicator
  alertPulse: {
    backgroundColor: ["#C9844E", "#D4956B", "#C9844E"],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },

  // Info glow
  infoGlow: {
    boxShadow: [
      "0 0 10px rgba(91, 141, 190, 0.3)",
      "0 0 20px rgba(91, 141, 190, 0.5)",
      "0 0 10px rgba(91, 141, 190, 0.3)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
} as const;

// ============================================================
// EXPORT TypeScript HELPERS
// ============================================================

export type AnimationTiming = typeof ANIMATION_TIMINGS[keyof typeof ANIMATION_TIMINGS];
export type EasingFunction = typeof EASING[keyof typeof EASING];
export type VariantSet = typeof VARIANTS[keyof typeof VARIANTS];
