/**
 * Utility function to combine class names
 * Similar to clsx or classnames library
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Animation variants for Framer Motion
 */
export const animationVariants = {
  // Page transitions
  containerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  },

  itemVariants: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  },

  // Card animations
  cardVariants: {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: i * 0.1,
        ease: 'easeOut',
      },
    }),
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  },

  // Button animations
  buttonVariants: {
    hover: { scale: 1.05 },
    tap: { scale: 0.97 },
  },

  // Fade in
  fadeInVariants: {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: { duration: 0.6, delay: i * 0.1 },
    }),
  },

  // Slide up
  slideUpVariants: {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.1 },
    }),
  },

  // Scale in
  scaleInVariants: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, delay: i * 0.1 },
    }),
  },
};
